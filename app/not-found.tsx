import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0E1A] text-white px-6 text-center">
      <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-4" style={{ color: "#C9A84C" }}>
        404
      </h1>
      <p className="text-xl sm:text-2xl font-semibold mb-2">Page Not Found</p>
      <p className="text-white/50 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9A84C] text-white text-sm font-semibold hover:bg-[#b8953d] transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
