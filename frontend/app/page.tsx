import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4 bg-ink">
      <Link href="/login" className="rounded-sm bg-paper px-6 py-3 font-display text-ink">
        Sign in
      </Link>
      <Link href="/register" className="rounded-sm bg-ember px-6 py-3 font-display text-ink">
        New ticket
      </Link>
    </div>
  );
}