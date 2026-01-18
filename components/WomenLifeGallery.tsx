import Image from "next/image";

const gallery = [
  {
    title: "Comfortable Living Spaces",
    img: "/women/room.jpg",
  },
  {
    title: "Healthy Dining Experience",
    img: "/women/dining.jpg",
  },
  {
    title: "Relaxed Common Areas",
    img: "/women/common.jpg",
  },
  {
    title: "Safe & Hygienic Environment",
    img: "/women/security.jpg",
  },
];

export default function WomenLifeGallery() {
  return (
    <section className="w-full px-4 py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-primary mb-6">
          Life at Our Women’s PG
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gallery.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden bg-white shadow-lg"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <p className="font-medium text-secondary">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
