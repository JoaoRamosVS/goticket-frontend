import { useState } from "react";
import { ToggleLeft, ToggleRight, Loader2, CalendarDays } from "lucide-react";
import type { EventConfigureResponse } from "@/features/organizer/organizer-event-configure/types/eventConfigure.types";

type Props = {
    event: EventConfigureResponse;
    onLink: (eventDateId: number, eventSectorId: number) => Promise<void>;
    onUnlink: (
        eventDateId: number,
        eventDateSectorId: number
    ) => Promise<void>;
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const StepDateSectors = ({ event, onLink, onUnlink }: Props) => {
    const [loadingKey, setLoadingKey] = useState<string | null>(null);

    if (event.sectors.length === 0) {
        return (
            <p className="text-sm text-[#5e6c87]">
                Adicione pelo menos um setor ao evento antes de vincular às datas.
            </p>
        );
    }

    const handleToggle = async (
        dateId: number,
        sector: EventConfigureResponse["sectors"][number],
        currentDateSectorId: number | null
    ) => {
        const key = `${dateId}-${sector.sectorId}`;
        setLoadingKey(key);
        try {
            if (currentDateSectorId !== null) {
                await onUnlink(dateId, currentDateSectorId);
            } else {
                await onLink(dateId, sector.sectorId);
            }
        } finally {
            setLoadingKey(null);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {event.eventDates.map((date) => (
                <div
                    key={date.eventDateId}
                    className="rounded-2xl border border-white/70 bg-white/40 p-4 backdrop-blur-xl shadow-sm"
                >
                    <div className="mb-3 flex items-center gap-2">
                        <CalendarDays className="size-4 text-[#2a8fd4]" strokeWidth={2} />
                        <p className="text-sm font-bold text-[#00334d]">
                            {formatDate(date.startDate)} → {formatDate(date.endDate)}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        {event.sectors.map((sector) => {
                            const linkedEds = date.dateSectors.find(
                                (eds) => eds.venueSectorId === sector.venueSectorId
                            );
                            const isLinked = linkedEds !== undefined;
                            const key = `${date.eventDateId}-${sector.sectorId}`;
                            const isLoading = loadingKey === key;

                            return (
                                <button
                                    key={sector.sectorId}
                                    type="button"
                                    onClick={() =>
                                        void handleToggle(
                                            date.eventDateId,
                                            sector,
                                            linkedEds?.eventDateSectorId ?? null
                                        )
                                    }
                                    disabled={isLoading || (isLinked && (linkedEds?.soldTickets ?? 0) > 0)}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all duration-200 hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
                                        isLinked
                                            ? "border-[#2a8fd4]/40 bg-[#2a8fd4]/10"
                                            : "border-white/60 bg-white/30"
                                    }`}
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-[#00334d]">
                                            {sector.name}
                                        </p>
                                        {isLinked && linkedEds && (
                                            <p className="text-xs text-[#5e6c87]">
                                                {linkedEds.totalTickets} ingressos ·{" "}
                                                {linkedEds.batches.length} lote(s)
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {isLoading ? (
                                            <Loader2 className="size-4 animate-spin text-[#2a8fd4]" />
                                        ) : isLinked ? (
                                            <ToggleRight
                                                className="size-5 text-[#2a8fd4]"
                                                strokeWidth={2}
                                            />
                                        ) : (
                                            <ToggleLeft
                                                className="size-5 text-[#5e6c87]"
                                                strokeWidth={2}
                                            />
                                        )}
                                        <span
                                            className={`text-xs font-bold ${
                                                isLinked ? "text-[#2a8fd4]" : "text-[#5e6c87]"
                                            }`}
                                        >
                                            {isLinked ? "Vinculado" : "Vincular"}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
