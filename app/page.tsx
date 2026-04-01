export const dynamic = 'force-dynamic';

import DashboardHero from "@/components/DashboardHero";
import PlatinumCategories from "@/components/PlatinumCategories";
import Footer from "@/components/Footer";
import { getBranches } from "@/lib/getData";

export default async function HomePage() {
  const branches = await getBranches();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <DashboardHero />
      <PlatinumCategories branches={branches} />
      <Footer />
    </main>
  );
}
