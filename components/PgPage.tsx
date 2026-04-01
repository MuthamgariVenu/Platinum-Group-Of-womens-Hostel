"use client";

import HeroCard from "@/components/HeroCard";
import FoodMenuCard from "@/components/FoodMenuCard";
import RoomsCard from "@/components/RoomsCard";
import GalleryCard from "@/components/GalleryCard";
import LocationCard from "@/components/LocationCard";
import CommonFacilities from "@/components/CommonFacilities";
type PgPageProps = {
  data: {
    hero: any;
    facilities: any[];
    electricity?: {
      included: boolean;
      text?: string;
    };
    food: any;
    rooms: any;
    gallery: any;
  };
};

export default function PgPage({ data }: PgPageProps) {
  return (
    <main className="max-w-md mx-auto p-3 pb-24">
      <HeroCard {...data.hero} />

      {/* ✅ Dynamic Facilities */}
      <CommonFacilities
  data={data.facilities}
  electricity={data.electricity}
/>


      <FoodMenuCard data={data.food} />
      <RoomsCard data={data.rooms} />
      <GalleryCard data={data.gallery} />

      <LocationCard
        address={data.hero.address}
        landmark={data.hero.landmark}
        nearby={data.hero.nearby}
        mapUrl={data.hero.mapUrl}
      />
    </main>
  );
}
