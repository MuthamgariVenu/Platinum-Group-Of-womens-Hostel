import fs from 'fs';
import path from 'path';
import { connectDB } from './mongodb';
import { HostelDataModel } from './models/HostelData';

export type Branch = {
  id: string;
  title: string;
  location: string;
  badge: string;
  icon: string;
  bg: string;
  href: string;
  startingPrice?: number;
};

const DATA_FILE = path.join(process.cwd(), 'data', 'hostelData.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readJsonFile(): { branches: Branch[]; branchDetails: Record<string, any> } {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const data = JSON.parse(raw);
  return { ...data, branches: normalizeBranches(data.branches) };
}

/**
 * Ensure startingPrice is always a number (or undefined).
 * Handles strings like "6000", "₹6,000", numbers like 6000, and null/undefined.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBranches(raw: any[]): Branch[] {
  return (raw || []).map((b) => {
    const sp = b.startingPrice;
    const num = sp != null
      ? Number(String(sp).replace(/[^0-9]/g, ''))
      : NaN;
    return {
      ...b,
      startingPrice: Number.isFinite(num) && num > 0 ? num : undefined,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFullHostelData(): Promise<{ branches: Branch[]; branchDetails: Record<string, any> }> {
  try {
    const conn = await connectDB();

    // DB not available — use local JSON immediately, no model calls
    if (!conn) {
      console.warn('[getData] DB offline, reading hostelData.json');
      return readJsonFile();
    }

    const doc = await HostelDataModel.findOne().lean();

    if (!doc) {
      // First run: seed DB from JSON
      const seed = readJsonFile();
      const created = await HostelDataModel.create(seed);
      return {
        branches: normalizeBranches(created.branches as Branch[]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        branchDetails: created.branchDetails as Record<string, any>,
      };
    }

    return {
      branches: normalizeBranches(doc.branches as Branch[]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      branchDetails: doc.branchDetails as Record<string, any>,
    };
  } catch {
    // Any unexpected error — fall back to JSON
    console.warn('[getData] Unexpected error, falling back to hostelData.json');
    return readJsonFile();
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
