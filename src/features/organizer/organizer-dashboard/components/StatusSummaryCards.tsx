import type { EventStatusName } from "@/features/organizer/organizer-events/types/organizerEvent.types";
import {
    ORGANIZER_STATUS_ORDER,
    getStatusVisual,
} from "@/features/organizer/organizer-events/utils/eventStatus";

type StatusSummaryCardsProps = {
    totals: Record<EventStatusName, number>;
};

export const StatusSummaryCards = ({ totals }: StatusSummaryCardsProps) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {ORGANIZER_STATUS_ORDER.map((status) => {
                const visual = getStatusVisual(status);
                const Icon = visual.icon;
                const count = totals[status] ?? 0;

                return (
                    <div
                        key={status}
                        className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/25 p-4 backdrop-blur-xl transition-all duration-500 hover:bg-white/50"
                        style={{
                            boxShadow:
                                "0 8px 24px -10px rgba(0,46,71,0.12), 0 2px 6px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                                {visual.label}
                            </span>
                            <span
                                className="flex size-8 items-center justify-center rounded-xl text-white"
                                style={{
                                    background: visual.gradient,
                                    boxShadow:
                                        "0 4px 12px -3px rgba(0,46,71,0.35), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                                }}
                            >
                                <Icon className="size-3.5" strokeWidth={2.6} />
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold tracking-tight text-[#00334d]">
                            {count}
                        </p>
                        <p className="mt-1 text-[10px] text-[#5e6c87]">
                            evento{count === 1 ? "" : "s"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
