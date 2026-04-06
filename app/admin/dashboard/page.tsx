"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, LogOut, MapPin } from "lucide-react";

type Branch = {
  id: string;
  title: string;
  location: string;
  badge: string;
  icon: string;
  bg: string;
  href: string;
  startingPrice?: number | string;
};

function formatPrice(raw: string | number | undefined | null): string | null {
  if (raw == null || raw === "") return null;
  const num = typeof raw === "number"
    ? raw
    : parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
  if (isNaN(num) || num <= 0) return null;
  return "₹" + num.toLocaleString("en-IN");
}

type HostelData = {
  branches: Branch[];
  branchDetails: Record<string, unknown>;
};

const DEFAULT_DETAIL = {
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
  food: { subtitle: "", daily: "Breakfast, Lunch & Dinner", nonVeg: [], note: "" },
  rooms: { subtitle: "", prices: [], note: "" },
  gallery: [],
};

export default function AdminDashboard() {
  const router = useRouter();
  const [hostelData, setHostelData] = useState<HostelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    id: "",
    title: "",
    location: "",
    badge: "Popular",
    icon: "Building2",
    bg: "from-pink-50 to-pink-100",
    startingPrice: "",
  });

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
      const data = await res.json();
      setHostelData(data);
    } catch {
      showMessage("Failed to load data");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveData = async (data: HostelData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hostel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showMessage("✅ Saved successfully!");
      } else {
        showMessage("❌ Failed to save");
      }
    } catch {
      showMessage("❌ Error saving");
    }
    setSaving(false);
  };

  const handleDeleteBranch = async (id: string) => {
    if (!hostelData) return;
    if (!window.confirm(`Delete branch "${id}"? This cannot be undone.`)) return;

    const updated = {
      ...hostelData,
      branches: hostelData.branches.filter((b) => b.id !== id),
      branchDetails: Object.fromEntries(
        Object.entries(hostelData.branchDetails).filter(([k]) => k !== id)
      ),
    };
    setHostelData(updated);
    await saveData(updated);
  };

  const handleAddBranch = async () => {
    if (!hostelData) return;
    if (!newBranch.id || !newBranch.title || !newBranch.location) {
      showMessage("Please fill all required fields");
      return;
    }

    const slugId = newBranch.id.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (hostelData.branches.some((b) => b.id === slugId)) {
      showMessage("Branch ID already exists");
      return;
    }

    const updated: HostelData = {
      branches: [
        ...hostelData.branches,
        {
          id: slugId,
          title: newBranch.title,
          location: newBranch.location,
          badge: newBranch.badge,
          icon: newBranch.icon,
          bg: newBranch.bg,
          href: `/${slugId}`,
          startingPrice: newBranch.startingPrice || undefined,
        },
      ],
      branchDetails: {
        ...hostelData.branchDetails,
        [slugId]: {
          ...DEFAULT_DETAIL,
          hero: { ...DEFAULT_DETAIL.hero, title: newBranch.title, area: newBranch.location },
        },
      },
    };

    setHostelData(updated);
    await saveData(updated);
    setShowAddModal(false);
    setNewBranch({ id: "", title: "", location: "", badge: "Popular", icon: "Building2", bg: "from-pink-50 to-pink-100", startingPrice: "" });
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  const bgOptions = [
    { label: "Pink", value: "from-pink-50 to-pink-100" },
    { label: "Purple", value: "from-purple-50 to-purple-100" },
    { label: "Indigo", value: "from-indigo-50 to-indigo-100" },
    { label: "Emerald", value: "from-emerald-50 to-emerald-100" },
    { label: "Orange", value: "from-orange-50 to-orange-100" },
    { label: "Blue", value: "from-blue-50 to-blue-100" },
    { label: "Teal", value: "from-teal-50 to-teal-100" },
  ];

  const iconOptions = ["Sparkles", "Crown", "Building2", "Star", "Home", "MapPin", "Hotel"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-purple-700 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-purple-200 text-xs">Platinum Group of Hostels</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Toast message */}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl">
          {message}
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Branches Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Branches</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage hostel branches shown on the homepage
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Add Branch
          </button>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostelData?.branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium mb-2">
                    {branch.badge}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {branch.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {branch.location}
                  </div>
                  {formatPrice(branch.startingPrice) && (
                    <p className="text-xs text-purple-700 font-medium mt-1">
                      From {formatPrice(branch.startingPrice)}/mo
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">ID: {branch.id}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/admin/branch/${branch.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium py-2 rounded-xl transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Details
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-3 py-2 rounded-xl transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-2xl p-4 text-sm text-purple-700">
          <p className="font-semibold mb-1">📌 How changes work</p>
          <ul className="text-xs space-y-1 text-purple-600 list-disc ml-4">
            <li>Branch list changes reflect immediately on the homepage</li>
            <li>Click <strong>Edit Details</strong> to update facilities, food menu, rooms & contact</li>
            <li>New branches added here will be accessible at <strong>/[branch-id]</strong></li>
            <li>Existing branches keep their original URLs for SEO</li>
          </ul>
        </div>
      </main>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-5">Add New Branch</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  value={newBranch.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                    setNewBranch({ ...newBranch, title, id });
                  }}
                  placeholder="e.g. Platinum Bloom 2"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL Slug (auto-generated) *
                </label>
                <input
                  type="text"
                  value={newBranch.id}
                  onChange={(e) => setNewBranch({ ...newBranch, id: e.target.value })}
                  placeholder="e.g. platinum-bloom-2"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">Page will be at: /{newBranch.id}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={newBranch.location}
                  onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                  placeholder="e.g. Madhapur / Hitech City"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Starting Price — ₹ / month (optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 select-none">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newBranch.startingPrice}
                    onChange={(e) => setNewBranch({ ...newBranch, startingPrice: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="e.g. 6500"
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {newBranch.startingPrice && (
                  <p className="text-[11px] text-purple-600 mt-1">
                    Preview: Starting from ₹{Number(newBranch.startingPrice).toLocaleString("en-IN")} / month
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Badge</label>
                  <select
                    value={newBranch.badge}
                    onChange={(e) => setNewBranch({ ...newBranch, badge: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>Popular</option>
                    <option>Premium</option>
                    <option>New</option>
                    <option>Budget</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Color</label>
                  <select
                    value={newBranch.bg}
                    onChange={(e) => setNewBranch({ ...newBranch, bg: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {bgOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={newBranch.icon}
                  onChange={(e) => setNewBranch({ ...newBranch, icon: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {iconOptions.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBranch}
                disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-semibold py-2.5 rounded-xl transition"
              >
                {saving ? "Adding..." : "Add Branch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
