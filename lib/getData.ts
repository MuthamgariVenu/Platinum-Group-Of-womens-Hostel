import fs from 'fs';
import path from 'path';
import { connectDB } from './mongodb';
import { HostelDataModel } from './models/HostelData';

type Branch = {
  id: string;
  title: string;
  location: string;
  badge: string;
  icon: string;
  bg: string;
  href: string;
  startingPrice?: string;
};

// Reads from MongoDB; falls back to hostelData.json if connection fails
export async function getFullHostelData() {
  const filePath = path.join(process.cwd(), 'data', 'hostelData.json');

  try {
    await connectDB();

    let doc = await HostelDataModel.findOne().lean();

    if (!doc) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const seed = JSON.parse(raw);
      const created = await HostelDataModel.create(seed);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { branches: created.branches, branchDetails: created.branchDetails as Record<string, any> };
    }

    return {
      branches: doc.branches as Branch[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      branchDetails: doc.branchDetails as Record<string, any>,
    };
  } catch {
    // MongoDB unavailable — fall back to local JSON
    const raw = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JSON.parse(raw) as { branches: Branch[]; branchDetails: Record<string, any> };
  }
}

export async function getBranches(): Promise<Branch[]> {
  const data = await getFullHostelData();
  return data.branches;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBranchDetail(id: string): Promise<any | null> {
  const data = await getFullHostelData();
  return data.branchDetails[id] ?? null;
}
