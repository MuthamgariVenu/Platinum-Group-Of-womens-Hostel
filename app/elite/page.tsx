export const dynamic = 'force-dynamic';

import PgPage from "@/components/PgPage";
import { eliteData } from "@/data/elite";

export default function ElitePage() {
  return <PgPage data={eliteData} />;
}
