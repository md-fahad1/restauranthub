export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-ink lg:flex-row">
      <div className="relative flex flex-col justify-between overflow-hidden px-8 py-10 lg:w-[46%] lg:px-14 lg:py-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember">Order up</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-paper lg:text-5xl">
            Run the whole
            <br />
            counter from
            <br />
            one ticket.
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-paper/60">
            Orders, kitchen, staff, and inventory — RestaurantHub keeps every
            station reading from the same rail.
          </p>
        </div>

        <div aria-hidden className="relative mt-16 hidden h-64 lg:block">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute h-36 w-48 rounded-sm border border-paper/10 bg-ink-soft"
              style={{
                top: i * 22,
                left: i * 28,
                transform: `rotate(${(i - 1) * 4}deg)`,
                zIndex: 3 - i,
              }}
            >
              <div className="mx-4 mt-4 h-1.5 w-16 rounded-full bg-paper/10" />
              <div className="mx-4 mt-3 h-1.5 w-24 rounded-full bg-paper/10" />
              <div className="mx-4 mt-3 h-1.5 w-10 rounded-full bg-ember/30" />
            </div>
          ))}
        </div>

        <p className="relative font-mono text-[11px] text-paper/30">RestaurantHub — 2026</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-ink px-6 py-14 lg:bg-ink-soft">
        {children}
      </div>
    </div>
  );
}
