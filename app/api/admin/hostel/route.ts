import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HostelDataModel } from '@/lib/models/HostelData';
import { getFullHostelData } from '@/lib/getData';

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

  try {
    await connectDB();
    const { branches, branchDetails } = await req.json();

    const doc = await HostelDataModel.findOne();

    if (doc) {
      doc.branches = branches;
      doc.branchDetails = branchDetails;
      // Required for Mongoose Mixed fields — marks them as modified
      doc.markModified('branches');
      doc.markModified('branchDetails');
      await doc.save();
    } else {
      await HostelDataModel.create({ branches, branchDetails });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PUT /api/admin/hostel]', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
