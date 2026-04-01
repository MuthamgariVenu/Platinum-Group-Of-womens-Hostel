"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  LogOut,
} from "lucide-react";

type Facility = {
  title: string;
  sub: string;
  icon: string;
  bg: string;
  iconBg: string;
  badge?: string;
};

type RoomPrice = {
  type: string;
  price: string;
};

type GalleryItem = {
  src: string;
  label: string;
};

type HeroData = {
  image: string;
  rating: string;
  area: string;
  address: string;
  landmark: string;
  nearby: string[];
  mapUrl: string;
  title: string;
  subtitle: string;
  primaryPhone: string;
  secondaryPhone: string;
};

type FoodData = {
  subtitle: string;
  daily: string;
  nonVeg: string[];
  snacks: string;
  note: string;
};

type RoomsData = {
  subtitle: string;
  prices: RoomPrice[];
  note: string;
};

type ElectricityData = {
  included: boolean;
  text: string;
};

type BranchDetail = {
  hero: HeroData;
  facilities: Facility[];
  electricity: ElectricityData;
  food: FoodData;
  rooms: RoomsData;
  gallery: GalleryItem[];
};

type HostelData = {
  branches: Array<{ id: string; title: string; [key: string]: unknown }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  branchDetails: Record<string, any>;
};

const ICON_OPTIONS = [
  "security", "fingerprint", "wifi", "washing", "shoe", "geyser",
  "fridge", "water", "power", "tv", "parking", "gym", "ac", "lift",
];

const BG_OPTIONS = [
  "from-blue-50 to-blue-100",
  "from-purple-50 to-purple-100",
  "from-indigo-50 to-indigo-100",
  "from-cyan-50 to-cyan-100",
  "from-orange-50 to-orange-100",
  "from-sky-50 to-sky-100",
  "from-teal-50 to-teal-100",
  "from-green-50 to-green-100",
  "from-pink-50 to-pink-100",
  "from-emerald-50 to-emerald-100",
  "from-gray-50 to-gray-100",
  "from-violet-50 to-violet-100",
];

const ICON_BG_OPTIONS = [
  "bg-blue-200", "bg-purple-200", "bg-indigo-200", "bg-cyan-200",
  "bg-orange-200", "bg-sky-200", "bg-teal-200", "bg-green-200",
  "bg-pink-200", "bg-emerald-200", "bg-gray-200", "bg-violet-200",
];

const TABS = [
  { id: "hero", label: "Hero / Contact" },
  { id: "facilities", label: "Facilities" },
  { id: "food", label: "Food Menu" },
  { id: "rooms", label: "Rooms & Rent" },
  { id: "gallery", label: "Gallery" },
];

const DEFAULT_DETAIL: BranchDetail = {
  hero: {
    image: "/images/b1.jpg",
    rating: "4.5",
    area: "",
    address: "",
    landmark: "",
    nearby: [],
    mapUrl: "",
    title: "",
    subtitle: "",
    primaryPhone: "9701716111",
    secondaryPhone: "9985499864",
  },
  facilities: [],
  electricity: { included: false, text: "" },
  food: { subtitle: "", daily: "Breakfast, Lunch & Dinner", nonVeg: [], snacks: "", note: "" },
  rooms: { subtitle: "", prices: [], note: "" },
  gallery: [],
};

export default function BranchEditor() {
  const router = useRouter();
  const params = useParams();
  const branchId = params.id as string;

  const [hostelData, setHostelData] = useState<HostelData | null>(null);
  const [detail, setDetail] = useState<BranchDetail>(DEFAULT_DETAIL);
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/hostel");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data: HostelData = await res.json();
      setHostelData(data);
      if (data.branchDetails && data.branchDetails[branchId]) {
        const bd = data.branchDetails[branchId];
        setDetail({
          hero: { ...DEFAULT_DETAIL.hero, ...bd.hero },
          facilities: bd.facilities || [],
          electricity: { ...DEFAULT_DETAIL.electricity, ...bd.electricity },
          food: { ...DEFAULT_DETAIL.food, ...bd.food },
          rooms: { ...DEFAULT_DETAIL.rooms, ...bd.rooms },
          gallery: bd.gallery || [],
        });
      }
    } catch {
      showMessage("Failed to load data");
    }
    setLoading(false);
  }, [router, branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!hostelData) return;
    setSaving(true);
    const updated: HostelData = {
      ...hostelData,
      branchDetails: {
        ...hostelData.branchDetails,
        [branchId]: detail,
      },
    };
    try {
      const res = await fetch("/api/admin/hostel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        showMessage("✅ Saved successfully!");
        setHostelData(updated);
      } else {
        showMessage("❌ Failed to save");
      }
    } catch {
      showMessage("❌ Error saving");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  };

  // ── Hero helpers ────────────────────────────────────────────────────────
  const updateHero = (key: keyof HeroData, value: string) => {
    setDetail((d) => ({ ...d, hero: { ...d.hero, [key]: value } }));
  };

  const updateNearby = (index: number, value: string) => {
    const arr = [...detail.hero.nearby];
    arr[index] = value;
    setDetail((d) => ({ ...d, hero: { ...d.hero, nearby: arr } }));
  };

  const addNearby = () => {
    setDetail((d) => ({ ...d, hero: { ...d.hero, nearby: [...d.hero.nearby, ""] } }));
  };

  const removeNearby = (index: number) => {
    setDetail((d) => ({ ...d, hero: { ...d.hero, nearby: d.hero.nearby.filter((_, i) => i !== index) } }));
  };

  // ── Facility helpers ────────────────────────────────────────────────────
  const updateFacility = (index: number, key: keyof Facility, value: string) => {
    const arr = [...detail.facilities];
    arr[index] = { ...arr[index], [key]: value };
    setDetail((d) => ({ ...d, facilities: arr }));
  };

  const addFacility = () => {
    setDetail((d) => ({
      ...d,
      facilities: [
        ...d.facilities,
        { title: "", sub: "", icon: "security", bg: "from-blue-50 to-blue-100", iconBg: "bg-blue-200" },
      ],
    }));
  };

  const removeFacility = (index: number) => {
    setDetail((d) => ({ ...d, facilities: d.facilities.filter((_, i) => i !== index) }));
  };

  // ── Food helpers ────────────────────────────────────────────────────────
  const updateFood = (key: keyof FoodData, value: string) => {
    setDetail((d) => ({ ...d, food: { ...d.food, [key]: value } }));
  };

  const updateNonVeg = (index: number, value: string) => {
    const arr = [...(detail.food.nonVeg || [])];
    arr[index] = value;
    setDetail((d) => ({ ...d, food: { ...d.food, nonVeg: arr } }));
  };

  const addNonVeg = () => {
    setDetail((d) => ({ ...d, food: { ...d.food, nonVeg: [...(d.food.nonVeg || []), ""] } }));
  };

  const removeNonVeg = (index: number) => {
    setDetail((d) => ({ ...d, food: { ...d.food, nonVeg: (d.food.nonVeg || []).filter((_, i) => i !== index) } }));
  };

  // ── Room helpers ────────────────────────────────────────────────────────
  const updateRooms = (key: keyof RoomsData, value: string) => {
    setDetail((d) => ({ ...d, rooms: { ...d.rooms, [key]: value } }));
  };

  const updatePrice = (index: number, key: keyof RoomPrice, value: string) => {
    const arr = [...detail.rooms.prices];
    arr[index] = { ...arr[index], [key]: value };
    setDetail((d) => ({ ...d, rooms: { ...d.rooms, prices: arr } }));
  };

  const addPrice = () => {
    setDetail((d) => ({ ...d, rooms: { ...d.rooms, prices: [...d.rooms.prices, { type: "", price: "" }] } }));
  };

  const removePrice = (index: number) => {
    setDetail((d) => ({ ...d, rooms: { ...d.rooms, prices: d.rooms.prices.filter((_, i) => i !== index) } }));
  };

  // ── Gallery helpers ─────────────────────────────────────────────────────
  const updateGallery = (index: number, key: keyof GalleryItem, value: string) => {
    const arr = [...detail.gallery];
    arr[index] = { ...arr[index], [key]: value };
    setDetail((d) => ({ ...d, gallery: arr }));
  };

  const addGallery = () => {
    setDetail((d) => ({ ...d, gallery: [...d.gallery, { src: "", label: "" }] }));
  };

  const removeGallery = (index: number) => {
    setDetail((d) => ({ ...d, gallery: d.gallery.filter((_, i) => i !== index) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  const branchTitle = hostelData?.branches.find((b) => b.id === branchId)?.title || branchId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-purple-700 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-bold leading-tight">{branchTitle}</h1>
              <p className="text-purple-200 text-xs">Branch Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-white text-purple-700 font-semibold text-xs px-3 py-2 rounded-xl hover:bg-purple-50 transition disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-medium px-4 py-3.5 border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* ─── HERO / CONTACT TAB ────────────────────────────────────── */}
        {activeTab === "hero" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Hero & Contact</h2>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Branch Title *" value={detail.hero.title} onChange={(v) => updateHero("title", v)} placeholder="e.g. Platinum Bloom Women's PG" />
                <Field label="Subtitle" value={detail.hero.subtitle} onChange={(v) => updateHero("subtitle", v)} placeholder="e.g. Clean Rooms • Homely Food" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Area / Locality" value={detail.hero.area} onChange={(v) => updateHero("area", v)} placeholder="e.g. Siddiq Nagar" />
                <Field label="Rating" value={detail.hero.rating} onChange={(v) => updateHero("rating", v)} placeholder="e.g. 4.6" />
              </div>
              <Field label="Full Address" value={detail.hero.address} onChange={(v) => updateHero("address", v)} placeholder="Full address..." />
              <Field label="Landmark" value={detail.hero.landmark} onChange={(v) => updateHero("landmark", v)} placeholder="e.g. Near Sai Baba Temple" />
              <Field label="Google Maps URL" value={detail.hero.mapUrl} onChange={(v) => updateHero("mapUrl", v)} placeholder="https://maps.app.goo.gl/..." />
              <Field label="Hero Image Path" value={detail.hero.image} onChange={(v) => updateHero("image", v)} placeholder="/images/b1.jpg" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Primary Phone" value={detail.hero.primaryPhone} onChange={(v) => updateHero("primaryPhone", v)} placeholder="9701716111" />
                <Field label="Secondary Phone" value={detail.hero.secondaryPhone} onChange={(v) => updateHero("secondaryPhone", v)} placeholder="9985499864" />
              </div>

              {/* Nearby */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700">Nearby Places</label>
                  <button onClick={addNearby} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {detail.hero.nearby.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateNearby(i, e.target.value)}
                        placeholder="e.g. 10 mins to Metro"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button onClick={() => removeNearby(i)} className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── FACILITIES TAB ───────────────────────────────────────── */}
        {activeTab === "facilities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Facilities</h2>
              <button
                onClick={addFacility}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-2 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Facility
              </button>
            </div>

            <div className="space-y-3">
              {detail.facilities.map((fac, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Facility {i + 1}</span>
                    <button onClick={() => removeFacility(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Title *" value={fac.title} onChange={(v) => updateFacility(i, "title", v)} placeholder="e.g. High-Speed WiFi" />
                    <Field label="Sub-text" value={fac.sub} onChange={(v) => updateFacility(i, "sub", v)} placeholder="e.g. Fast internet" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
                      <select
                        value={fac.icon}
                        onChange={(e) => updateFacility(i, "icon", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {ICON_OPTIONS.map((ic) => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                    <Field label="Badge (optional)" value={fac.badge || ""} onChange={(v) => updateFacility(i, "badge", v)} placeholder="e.g. Secure" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Card BG Gradient</label>
                      <select
                        value={fac.bg}
                        onChange={(e) => updateFacility(i, "bg", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {BG_OPTIONS.map((bg) => (
                          <option key={bg} value={bg}>{bg.replace("from-", "").replace(" to-", " → ")}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Icon BG Color</label>
                      <select
                        value={fac.iconBg}
                        onChange={(e) => updateFacility(i, "iconBg", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {ICON_BG_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c.replace("bg-", "")}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {detail.facilities.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
                  No facilities added yet. Click &quot;Add Facility&quot; to start.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── FOOD MENU TAB ────────────────────────────────────────── */}
        {activeTab === "food" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Food Menu</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <Field label="Subtitle" value={detail.food.subtitle} onChange={(v) => updateFood("subtitle", v)} placeholder="e.g. Homely food • 3 times daily" />
              <Field label="Daily Meals" value={detail.food.daily} onChange={(v) => updateFood("daily", v)} placeholder="e.g. Breakfast, Lunch & Dinner" />
              <Field label="Snacks" value={detail.food.snacks || ""} onChange={(v) => updateFood("snacks", v)} placeholder="e.g. Weekends" />
              <Field label="Note" value={detail.food.note} onChange={(v) => updateFood("note", v)} placeholder="e.g. Menu may vary on festivals" />

              {/* Non-Veg items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700">Non-Veg Items</label>
                  <button onClick={addNonVeg} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {(detail.food.nonVeg || []).map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateNonVeg(i, e.target.value)}
                        placeholder="e.g. Chicken – 2 times/week"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button onClick={() => removeNonVeg(i)} className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── ROOMS & RENT TAB ─────────────────────────────────────── */}
        {activeTab === "rooms" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Rooms & Rent</h2>

            {/* Electricity */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <p className="text-xs font-semibold text-gray-700">Electricity</p>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setDetail((d) => ({ ...d, electricity: { ...d.electricity, included: !d.electricity.included } }))}
                  className={`relative w-10 h-5 rounded-full transition ${detail.electricity.included ? "bg-purple-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${detail.electricity.included ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-gray-700">Electricity included in rent</span>
              </label>
              <Field label="Electricity note" value={detail.electricity.text} onChange={(v) => setDetail((d) => ({ ...d, electricity: { ...d.electricity, text: v } }))} placeholder="e.g. Electricity Bill Included" />
            </div>

            {/* Room prices */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <Field label="Rooms Subtitle" value={detail.rooms.subtitle} onChange={(v) => updateRooms("subtitle", v)} placeholder="e.g. Room 2 / 3 / 4 Sharing Available" />
              <Field label="Note" value={detail.rooms.note} onChange={(v) => updateRooms("note", v)} placeholder="e.g. Advance ₹3,000 applicable" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700">Room Prices</label>
                  <button onClick={addPrice} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                <div className="space-y-2">
                  {detail.rooms.prices.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={p.type}
                        onChange={(e) => updatePrice(i, "type", e.target.value)}
                        placeholder="Type (e.g. 3 Sharing)"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="text"
                        value={p.price}
                        onChange={(e) => updatePrice(i, "price", e.target.value)}
                        placeholder="Price (e.g. ₹7,500)"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button onClick={() => removePrice(i)} className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {detail.rooms.prices.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-3">No prices added. Click &quot;Add Row&quot;.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── GALLERY TAB ──────────────────────────────────────────── */}
        {activeTab === "gallery" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Gallery</h2>
              <button
                onClick={addGallery}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-2 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Photo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detail.gallery.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Photo {i + 1}</span>
                    <button onClick={() => removeGallery(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Field label="Image path" value={item.src} onChange={(v) => updateGallery(i, "src", v)} placeholder="/images/b1.jpg" />
                  <Field label="Label" value={item.label} onChange={(v) => updateGallery(i, "label", v)} placeholder="e.g. Room, Dining" />
                  {item.src && (
                    <div className="h-20 rounded-lg overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
              {detail.gallery.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
                  No photos added yet. Click &quot;Add Photo&quot; to start.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save button bottom */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-semibold px-6 py-3 rounded-2xl transition"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}

// ── Reusable Field component ─────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>
  );
}
