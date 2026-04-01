export default function DashboardActions() {
  return (
    <section className="w-full px-4 pb-16">
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-4">
        <button className="rounded-2xl bg-indigo-600 text-white py-4 shadow-lg">
          📞 Call Now
        </button>
        <button className="rounded-2xl bg-rose-500 text-white py-4 shadow-lg">
          📍 Location
        </button>

        <button className="rounded-2xl bg-gray-900 text-white py-4 shadow-lg col-span-2">
          🖼️ View Gallery
        </button>
      </div>
    </section>
  );
}
