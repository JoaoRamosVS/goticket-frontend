import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    Pencil,
    RefreshCcw,
    Search,
    Trash2,
    X,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import eventService from "@/services/event";

import {
    formatEventDate,
    formatEventLocation,
    formatEventStartingPrice,
    getEventMainImage,
} from "@/helpers/events";

import type { EventMinDTO } from "@/types";

const PAGE_SIZE = 10;

const Eventos = () => {
    const navigate = useNavigate();

    const [events, setEvents] = useState<EventMinDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadEvents = useCallback(
        (targetPage: number, signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);

            return eventService
                .getEvents(targetPage, PAGE_SIZE, signal)
                .then((data) => {
                    setEvents(data.eventMinDTOList ?? []);
                    setTotalPages(Math.max(1, data.totalPages ?? 1));
                    setTotalElements(data.totalElements ?? 0);
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    const message =
                        axios.isAxiosError(err) && err.response?.status === 401
                            ? "Sessão expirada. Faça login novamente."
                            : "Não foi possível carregar os eventos.";
                    setError(message);
                    setEvents([]);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        loadEvents(page, controller.signal);
        return () => controller.abort();
    }, [page, loadEvents]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredEvents = useMemo(() => {
        if (!normalizedSearch) return events;
        return events.filter((event) => {
            const idMatch = String(event.eventID).includes(normalizedSearch);
            const titleMatch = event.title
                ?.toLowerCase()
                .includes(normalizedSearch);
            return idMatch || titleMatch;
        });
    }, [events, normalizedSearch]);

    const handleEdit = (eventId: number) => {
        navigate(`/admin/eventos/${eventId}`);
    };

    const handleDelete = async (event: EventMinDTO) => {
        const confirmed = window.confirm(
            `Excluir permanentemente o evento "${event.title}" (ID ${event.eventID})?`
        );
        if (!confirmed) return;

        try {
            setDeletingId(event.eventID);
            await eventService.deleteEvent(event.eventID);
            await loadEvents(page);
        } catch (err) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : "Não foi possível excluir o evento.";
            window.alert(message);
        } finally {
            setDeletingId(null);
        }
    };

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return (
        <div>
            <AdminPageHeader
                icon={CalendarDays}
                title="Eventos"
                description="Gerencie os eventos publicados na plataforma."
            />

            <div
                className="rounded-4xl border border-white/70 bg-white/25 backdrop-blur-xl"
                style={{
                    boxShadow:
                        "0 8px 28px -10px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                }}
            >
                <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary/50 z-10"
                            strokeWidth={3}
                        />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Buscar por nome ou ID"
                            className="h-10 w-full rounded-2xl border border-primary/20 bg-white/70 pl-10 pr-4 text-sm text-[#00334d] placeholder:text-[#5e6c87]/70 backdrop-blur-xl shadow-sm outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[#5e6c87]">
                            {totalElements} evento{totalElements === 1 ? "" : "s"} no total
                        </span>
                        <button
                            type="button"
                            onClick={() => loadEvents(page)}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-[#2a8fd4] text-white transition-all duration-300 hover:scale-90 shadow-xl"
                            aria-label="Recarregar"
                            title="Recarregar"
                        >
                            <RefreshCcw
                                className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                                strokeWidth={2.3}
                            />
                        </button>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm overflow-hidden">
                        <thead>
                            <tr className="border-y border-white/80 bg-linear-to-r from-[#e5f1ff]/60 to-transparent text-left">
                                <Th className="pl-6">ID</Th>
                                <Th>Evento</Th>
                                <Th>Local</Th>
                                <Th>Data</Th>
                                <Th>Preço inicial</Th>
                                <Th>Ações</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && events.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-14 text-center">
                                        <div className="inline-flex items-center gap-2 text-sm text-[#5e6c87]">
                                            <Loader2 className="size-4 animate-spin" />
                                            Carregando eventos...
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="py-14 text-center text-sm text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-14 text-center text-sm text-[#5e6c87]">
                                        {normalizedSearch
                                            ? "Nenhum evento corresponde à busca nesta página."
                                            : "Nenhum evento encontrado."}
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <EventRow
                                        key={event.eventID}
                                        event={event}
                                        isDeleting={deletingId === event.eventID}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-white/70 px-5 py-4 sm:flex-row">
                    <span className="text-xs text-[#5e6c87]">
                        Mostrando{" "}
                        <span className="font-semibold text-[#00334d]">
                            {rangeStart}–{rangeEnd}
                        </span>{" "}
                        de{" "}
                        <span className="font-semibold text-[#00334d]">
                            {totalElements}
                        </span>
                    </span>

                    <div className="flex items-center gap-2">
                        <PagerButton
                            disabled={page === 0 || isLoading}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="size-4" />
                        </PagerButton>

                        <span className="rounded-xl border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#00334d]">
                            {page + 1} / {totalPages}
                        </span>

                        <PagerButton
                            disabled={page + 1 >= totalPages || isLoading}
                            onClick={() =>
                                setPage((p) => Math.min(totalPages - 1, p + 1))
                            }
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="size-4" />
                        </PagerButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

type EventRowProps = {
    event: EventMinDTO;
    isDeleting: boolean;
    onEdit: (eventId: number) => void;
    onDelete: (event: EventMinDTO) => void;
};

const EventRow = ({ event, isDeleting, onEdit, onDelete }: EventRowProps) => {
    const imageUrl = getEventMainImage(event);
    const location = formatEventLocation(event);
    const formattedDate = formatEventDate(event.startDate);
    const formattedPrice = formatEventStartingPrice(event);

    return (
        <tr className="border-b border-white/70 hover:bg-primary/5 hover:scale-[1.02] overflow-hidden transition-all duration-200">
            <td className="py-3 pl-6 pr-2 align-middle text-xs font-semibold text-[#5e6c87]">
                #{event.eventID}
            </td>
            <td className="py-3 pr-4 align-middle">
                <div className="flex items-center gap-3">
                    <div
                        className="size-12 shrink-0 overflow-hidden rounded-md border border-white/70 bg-white/60"
                        style={{
                            boxShadow:
                                "0 4px 12px -4px rgba(0,46,71,0.18), inset 0 1px 0 0 rgba(255,255,255,0.7)",
                        }}
                    >
                        <img
                            src={imageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover"
                            draggable={false}
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#00334d]">
                            {event.title}
                        </p>
                    </div>
                </div>
            </td>
            <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
                {location ? (
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[#2a8fd4]" />
                        {location}
                    </span>
                ) : (
                    <span className="text-[#5e6c87]/60">—</span>
                )}
            </td>
            <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
                {formattedDate || <span className="text-[#5e6c87]/60">—</span>}
            </td>
            <td className="py-3 pr-4 align-middle text-sm font-semibold text-[#00334d]">
                {formattedPrice ?? <span className="text-[#5e6c87]/60">—</span>}
            </td>
            <td className="py-3 pl-2 pr-6 align-middle">
                <div className="flex items-center justify-start gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(event.eventID)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                        title="Editar evento"
                    >
                        <Pencil className="size-3.5" strokeWidth={2.6} />
                        Editar
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(event)}
                        disabled={isDeleting}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-white/60 text-red-500 transition-all duration-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Excluir evento"
                        aria-label="Excluir evento"
                    >
                        {isDeleting ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="size-3.5" strokeWidth={2.4} />
                        )}
                    </button>
                </div>
            </td>
        </tr>
    );
};

type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className = "", ...props }: ThProps) => (
    <th
        {...props}
        className={`py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87] ${className}`}
    />
);

type PagerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PagerButton = ({
    className = "",
    children,
    ...props
}: PagerButtonProps) => (
    <button
        type="button"
        {...props}
        className={`flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-white/60 text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
        {children}
    </button>
);

export default Eventos;
