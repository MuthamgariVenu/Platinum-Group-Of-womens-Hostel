export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getBranchDetail } from '@/lib/getData';
import PgPage from '@/components/PgPage';

export default async function NestPage() {
  const data = await getBranchDetail('nest');
  if (!data) notFound();
  return <PgPage data={data} />;
}
