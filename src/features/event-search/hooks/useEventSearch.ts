import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import eventSearchService from "../services/eventSearch.service";
import type { EventMinDTO, EventMinListDTO } from "@/features/admin/admin-events/types/event.types";
import type { SortOption } from "../types/eventSearch.types";
import { getEventStartingPrice } from "@/utils/events";

export const SEARCH_PAGE_SIZE = 15;

function sortEvents(events: EventMinDTO[], sort: SortOption): EventMinDTO[] {
    const sorted = [...events];
    switch (sort) {
        case "date_desc":
            return sorted.sort((a, b) => b.startDate.localeCompare(a.startDate));
        case "price_asc":
            return sorted.sort((a, b) => {
                const pa = getEventStartingPrice(a) ?? Infinity;
                const pb = getEventStartingPrice(b) ?? Infinity;
                return pa - pb;
            });
        case "price_desc":
            return sorted.sort((a, b) => {
                const pa = getEventStartingPrice(a) ?? -Infinity;
                const pb = getEventStartingPrice(b) ?? -Infinity;
                return pb - pa;
            });
        case "title_az":
            return sorted.sort((a, b) =>
                a.title.localeCompare(b.title, "pt-BR")
            );
        default:
            return sorted.sort((a, b) =>
                a.startDate.localeCompare(b.startDate)
            );
    }
}

export default function useEventSearch() {
    const { searchTerm = "" } = useParams<{ searchTerm: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    const venueState = searchParams.get("venueState") ?? "";
    const venueCity = searchParams.get("venueCity") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    const page = Number(searchParams.get("page") ?? "0");
    const sort = (searchParams.get("sort") ?? "date_asc") as SortOption;

    const [data, setData] = useState<EventMinListDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);
        setError(null);

        eventSearchService
            .searchPublicEvents(
                {
                    title: searchTerm || undefined,
                    venueState: venueState || undefined,
                    venueCity: venueCity || undefined,
                    startingPrice: maxPrice ? Number(maxPrice) : undefined,
                    page,
                    pageSize: SEARCH_PAGE_SIZE,
                },
                controller.signal
            )
            .then(setData)
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                setError("Não foi possível carregar os resultados.");
                setData(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [searchTerm, venueState, venueCity, maxPrice, page]);

    const events = data?.eventMinDTOList ?? [];
    const sortedEvents = sortEvents(events, sort);

    const setFilter = useCallback(
        (key: string, value: string) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (value) next.set(key, value);
                else next.delete(key);
                next.set("page", "0");
                return next;
            });
        },
        [setSearchParams]
    );

    const setPage = useCallback(
        (newPage: number) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("page", String(newPage));
                return next;
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [setSearchParams]
    );

    const setSort = useCallback(
        (newSort: SortOption) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set("sort", newSort);
                return next;
            });
        },
        [setSearchParams]
    );

    const clearFilters = useCallback(() => {
        setSearchParams({ page: "0", sort: "date_asc" });
    }, [setSearchParams]);

    return {
        searchTerm,
        events: sortedEvents,
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        page,
        sort,
        filters: { venueState, venueCity, maxPrice },
        isLoading,
        error,
        setFilter,
        setPage,
        setSort,
        clearFilters,
    };
}
