'use client';

interface TicketShellProps {
  ticketNo: string;
  station: string;
  children: React.ReactNode;
}

export function TicketShell({ ticketNo, station, children }: TicketShellProps) {
  return (
    <div className="w-full max-w-[420px]">
      {/* printer slot */}
      <div className="mx-auto flex h-3 w-[92%] items-center justify-center rounded-t-sm bg-ink-line">
        <div className="h-1 w-1 rounded-full bg-ember/70" />
      </div>

      <div className="animate-print-feed origin-top">
        <div className="ticket-edge bg-paper px-7 pb-8 pt-5 shadow-[0_24px_60px_-20px_rgba(16,24,42,0.45)]">
          <div className="mb-5 flex items-center justify-between border-b border-dashed border-paper-line pb-3 font-mono text-[11px] uppercase tracking-widest text-paper-muted">
            <span>Ticket no. {ticketNo}</span>
            <span>{station}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
