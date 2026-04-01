import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { connectDB } from '@/lib/mongodb';
import { HostelDataModel } from '@/lib/models/HostelData';
import { getFullHostelData } from '@/lib/getData';

const SESSION_TOKEN = 'pt_admin_2024_secure';
const DATA_FILE = path.join(process.cwd(), 'data', 'hostelData.json');

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
    branches = body.branches;
    branchDetails = body.branchDetails;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!branches || !branchDetails) {
    return NextResponse.json({ error: 'Missing branches or branchDetails' }, { status: 400 });
  }

  // 1. Always write to local JSON file as immediate fallback
  let fileSaved = false;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ branches, branchDetails }, null, 2), 'utf-8');
    fileSaved = true;
  } catch (fileErr) {
    console.error('[PUT /api/admin/hostel] Failed to write JSON file:', fileErr);
  }

  // 2. Try to persist to MongoDB
  try {
    await connectDB();

    const doc = await HostelDataModel.findOne();
    if (doc) {
      doc.branches = branches;
      doc.branchDetails = branchDetails;
      doc.markModified('branches');
      doc.markModified('branchDetails');
      await doc.save();
    } else {
      await HostelDataModel.create({ branches, branchDetails });
    }

    return NextResponse.json({ success: true, storage: 'mongodb' });
  } catch (dbErr) {
    const message = dbErr instanceof Error ? dbErr.message : String(dbErr);
    console.error('[PUT /api/admin/hostel] MongoDB error:', message);

    // If file was saved, treat as partial success
    if (fileSaved) {
      return NextResponse.json({
        success: true,
        storage: 'file',
        warning: 'MongoDB unavailable — data saved to local file',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save: ' + message },
      { status: 500 }
    );
  }
}
