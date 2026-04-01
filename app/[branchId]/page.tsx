export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getBranchDetail, getBranches } from '@/lib/getData';
import PgPage from '@/components/PgPage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: { params: any }) {
  const { branchId } = await params;
  const branches = await getBranches();
  const branch = branches.find((b) => b.id === branchId);
  if (!branch) return { title: 'Hostel Not Found' };
  return {
    title: `${branch.title} | Platinum Group of Hostels`,
    description: `${branch.title} - ${branch.location}`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function DynamicBranchPage({ params }: { params: any }) {
  const { branchId } = await params;

  // Skip paths that have their own dedicated pages or are system routes
  const reservedPaths = ['bloom', 'elite', 'grand', 'prime', 'nest', 'admin', 'api', '_next', 'favicon.ico'];
  if (reservedPaths.includes(branchId)) {
    notFound();
  }

  const detail = await getBranchDetail(branchId);
  if (!detail) notFound();

  return <PgPage data={detail} />;
}
