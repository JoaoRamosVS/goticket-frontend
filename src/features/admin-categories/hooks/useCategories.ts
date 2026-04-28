import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import categoryService from "@/features/admin-categories/services/category.service";
import type { EventCategoryDTO } from "@/features/admin-categories/types/category.types";

const PAGE_SIZE = 10;

export const useCategories = () => {
    const [categories, setCategories] = useState<EventCategoryDTO[]>([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");

    const loadCategories = useCallback((signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);

        return categoryService
            .listEventCategories(signal)
            .then((data) => {
                setCategories(data ?? []);
            })
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.response?.status === 401
                        ? "Sessão expirada. Faça login novamente."
                        : "Não foi possível carregar as categorias.";
                setError(message);
                setCategories([]);
            })
            .finally(() => {
                if (!signal?.aborted) setIsLoading(false);
            });
    }, []);

    const handleDelete = useCallback(async (categoryId: number | string) => {
        await categoryService.deleteEventCategory(categoryId);
        await loadCategories();
    }, [loadCategories]);

    useEffect(() => {
        const controller = new AbortController();
        loadCategories(controller.signal);
        return () => controller.abort();
    }, [loadCategories]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredCategories = useMemo(() => {
        if (!normalizedSearch) return categories;
        return categories.filter((category) => {
            const idMatch = String(category.categoryId)
                .toLowerCase()
                .includes(normalizedSearch);
            const nameMatch = category.name
                ?.toLowerCase()
                .includes(normalizedSearch);
            const slugMatch = category.slug
                ?.toLowerCase()
                .includes(normalizedSearch);
            return idMatch || nameMatch || slugMatch;
        });
    }, [categories, normalizedSearch]);

    const totalElements = filteredCategories.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));

    useEffect(() => {
        if (page > totalPages - 1) {
            setPage(Math.max(0, totalPages - 1));
        }
    }, [page, totalPages]);

    const pagedCategories = useMemo(() => {
        const start = page * PAGE_SIZE;
        return filteredCategories.slice(start, start + PAGE_SIZE);
    }, [filteredCategories, page]);

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return {
        categories,
        isLoading,
        error,
        page,
        setPage,
        searchInput,
        setSearchInput,
        loadCategories,
        handleDelete,
        normalizedSearch,
        pagedCategories,
        totalPages,
        totalElements,
        rangeStart,
        rangeEnd,
    };
};
