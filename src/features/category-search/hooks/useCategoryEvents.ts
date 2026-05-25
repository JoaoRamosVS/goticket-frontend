import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import categorySearchService from "../services/categorySearch.service";
import type { EventMinListDTO } from "@/features/admin/admin-events/types/event.types";
import type { SortOption } from "@/utils/eventListing";
import { sortEvents } from "@/utils/eventListing";

export const CATEGORY_PAGE_SIZE = 15;

export default function useCategoryEvents(categoryId: number | null) {
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
        if (categoryId == null) {
            // Aguardando resolução do slug — mantém loading mas não dispara request.
            setData(null);
            setIsLoading(true);
            return;
        }

        const controller = new AbortController();

        setIsLoading(true);
        setError(null);

        categorySearchService
            .fetchEventsByCategory(
                {
                    categoryId,
                    venueState: venueState || undefined,
                    venueCity: venueCity || undefined,
                    startingPrice: maxPrice ? Number(maxPrice) : undefined,
                    page,
                    pageSize: CATEGORY_PAGE_SIZE,
                },
                controller.signal
            )
            .then(setData)
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                setError("Não foi possível carregar os eventos desta categoria.");
                setData(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [categoryId, venueState, venueCity, maxPrice, page]);

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
