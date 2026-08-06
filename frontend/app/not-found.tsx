import Link from 'next/link';
import { TriangleAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <TriangleAlert className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="mt-6 text-6xl font-bold text-ink">404</h1>

        <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-white transition hover:bg-gray-800"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}