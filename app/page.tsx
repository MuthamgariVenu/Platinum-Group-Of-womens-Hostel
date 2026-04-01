import DashboardHero from "@/components/DashboardHero";
import PlatinumCategories from "@/components/PlatinumCategories";
import Footer from "@/components/Footer";

// 👇 facilities data import
import { bloomData } from "@/data/bloom";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <DashboardHero />

      {/* ✅ FIXED: data prop pass chesam */}
      

      <PlatinumCategories />
      <Footer />
    </main>
  );
}
