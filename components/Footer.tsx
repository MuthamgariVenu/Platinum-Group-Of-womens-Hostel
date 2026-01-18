export default function Footer() {
  return (
    <footer className="mt-20 px-4 py-12 bg-gradient-to-b from-white to-indigo-50 border-t border-indigo-100">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm text-gray-700">
          Developed by{" "}
          <span className="font-semibold text-gray-900">
            Muthamgari Venu
          </span>
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Contact:{" "}
          <a
            href="mailto:muthamgarivenu234@gmail.com"
            className="text-indigo-600 font-medium hover:underline"
          >
            muthamgarivenu234@gmail.com
          </a>
        </p>

        <div className="mt-6 h-px w-24 mx-auto bg-indigo-200 rounded-full" />

        <p className="mt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Platinum Women’s Living. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
