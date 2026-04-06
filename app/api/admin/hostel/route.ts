import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { connectDB } from '@/lib/mongodb';
import { HostelDataModel } from '@/lib/models/HostelData';
import { getFullHostelData } from '@/lib/getData';

const DATA_FILE = path.join(process.cwd(), 'data', 'hostelData.json');

function saveToFile(branches: unknown, branchDetails: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ branches, branchDetails }, null, 2), 'utf-8');
  console.log('[saveToFile] Written to', DATA_FILE);
}

const SESSION_TOKEN = 'pt_admin_2024_secure';

function getSessionFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    const data = await getFullHostelData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/admin/hostel]', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (getSessionFromRequest(req) !== SESSION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let branches, branchDetails;
  try {
    const body = await req.json();
    console.log('[PUT /api/admin/hostel] payload keys:', Object.keys(body));
    console.log('[PUT /api/admin/hostel] branches sample:', JSON.stringify(body.branches?.[0]));
    branches = body.branches;
    branchDetails = body.branchDetails;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!branches || !branchDetails) {
    console.error('[PUT /api/admin/hostel] Missing branches or branchDetails', { branches: !!branches, branchDetails: !!branchDetails });
    return NextResponse.json({ error: 'Missing branches or branchDetails' }, { status: 400 });
  }

  console.log('[PUT /api/admin/hostel] Saving branches:', JSON.stringify(branches));

  // ── Try MongoDB first ────────────────────────────────────────────────────
  try {
    console.log('[PUT /api/admin/hostel] Attempting connectDB...');
    await connectDB();
    console.log('[PUT /api/admin/hostel] connectDB succeeded.');

    // findOneAndUpdate + $set bypasses Mongoose document casting so all fields
    // (including startingPrice: number) are stored as-is.
    const result = await HostelDataModel.findOneAndUpdate(
      {},
      { $set: { branches, branchDetails } },
      { upsert: true, new: true }
    );
    console.log('[PUT /api/admin/hostel] MongoDB save succeeded, id:', result?._id);

    return NextResponse.json({ success: true, branches: result?.branches });

  } catch (dbError) {
    // ── MongoDB unavailable — fall back to local JSON file ─────────────────
    const dbMsg = dbError instanceof Error ? dbError.message : String(dbError);
    console.error('[PUT /api/admin/hostel] MongoDB FAILED:', dbMsg);
    console.warn('[PUT /api/admin/hostel] Falling back to hostelData.json ...');

    try {
      saveToFile(branches, branchDetails);
      return NextResponse.json({ success: true, fallback: true, branches });
    } catch (fileError) {
      const fileMsg = fileError instanceof Error ? fileError.message : String(fileError);
      console.error('[PUT /api/admin/hostel] File fallback ALSO failed:', fileMsg);
      return NextResponse.json(
        { success: false, error: `DB: ${dbMsg} | File: ${fileMsg}` },
        { status: 500 }
      );
    }
  }
}
