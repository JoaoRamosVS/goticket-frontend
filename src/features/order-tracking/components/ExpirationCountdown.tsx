import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface ExpirationCountdownProps {
  expiresAt: string;
}

function secondsLeft(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ExpirationCountdown({ expiresAt }: ExpirationCountdownProps) {
  const [remaining, setRemaining] = useState(secondsLeft(expiresAt));

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining(secondsLeft(expiresAt));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, remaining]);

  const isUrgent = remaining <= 60 && remaining > 0;
  const isExpired = remaining === 0;

  return (
    <div
      className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border ${
        isExpired
          ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
          : isUrgent
          ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
      }`}
    >
      <Timer className="size-4" />
      {isExpired ? "Reserva expirada" : `Expira em ${formatCountdown(remaining)}`}
    </div>
  );
}
