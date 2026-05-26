import { Loader2 } from "lucide-react";

import type { StatusGroup } from "@/features/organizer/organizer-dashboard/hooks/useOrganizerDashboard";
import { getStatusVisual } from "@/features/organizer/organizer-events/utils/eventStatus";
import { EventStatusCard } from "@/features/organizer/organizer-dashboard/components/EventStatusCard";

type StatusBoardProps = {
    groups: StatusGroup[];
    isLoading: boolean;
    error: string | null;
    onOpenEvent: (eventId: number) => void;
};

export const StatusBoard = ({
    groups,
    isLoading,
    error,
    onOpenEvent,
}: StatusBoardProps) => {
    if (isLoading) {
        return (
            <div
                className="flex items-center justify-center rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 py-16 text-sm text-[#5e6c87]"
                style={{
                    boxShadow:
                        "inset 0 1px 0 0 rgba(255,255,255,0.7)",
                }}
            >
                <Loader2 className="mr-2 size-4 animate-spin" />
                Carregando seus eventos...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-dashed border-red-300/60 bg-red-50/60 p-8 text-center text-sm text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => {
                const visual = getStatusVisual(group.status);
                const Icon = visual.icon;

                return (
                    <div
                        key={group.status}
                        className="flex min-h-[280px] flex-col rounded-3xl border backdrop-blur-xl"
                        style={{
                            background: visual.softBackground,
                            borderColor: visual.softBorder,
                            boxShadow:
                                "0 8px 24px -12px rgba(0,46,71,0.1), inset 0 1px 0 0 rgba(255,255,255,0.7)",
                        }}
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-white/50 px-4 py-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span
                                    className="flex size-8 shrink-0 items-center justify-center rounded-xl text-white"
                                    style={{
                                        background: visual.gradient,
                                        boxShadow:
                                            "0 4px 12px -3px rgba(0,46,71,0.35), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                                    }}
                                >
                                    <Icon className="size-3.5" strokeWidth={2.6} />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-[#00334d]">
                                        {visual.label}
                                    </p>
                                    <p className="truncate text-[10px] text-[#5e6c87]">
                                        {visual.description}
                                    </p>
                                </div>
                            </div>
                            <span
                                className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full px-2 text-xs font-bold text-white"
                                style={{
                                    background: visual.gradient,
                                    boxShadow:
                                        "0 4px 10px -3px rgba(0,46,71,0.3), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                                }}
                            >
                                {group.events.length}
                            </span>
                        </div>

                        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
                            {group.events.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/60 bg-white/40 p-4 text-center text-[11px] text-[#5e6c87]">
                                    Nenhum evento neste status.
                                </div>
                            ) : (
                                group.events.map((event) => (
                                    <EventStatusCard
                                        key={event.eventId}
                                        event={event}
                                        onOpen={onOpenEvent}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
