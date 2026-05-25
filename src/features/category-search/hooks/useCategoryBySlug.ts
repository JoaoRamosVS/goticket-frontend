import { useEffect, useState } from "react";
import axios from "axios";
import categoryService from "@/features/admin/admin-categories/services/category.service";
import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";

// Cache em módulo: GET /event-categories é uma lista pequena que muda raramente.
// Evita refetch ao navegar entre páginas de categoria na mesma sessão.
let categoriesCache: EventCategoryDTO[] | null = null;
let inflight: Promise<EventCategoryDTO[]> | null = null;

// Não recebe signal: o cache de módulo não deve ser descartado pelo ciclo
// de vida de um componente individual. Em Strict Mode o primeiro effect é
// desmontado imediatamente e o signal seria abortado antes do fetch terminar,
// corrompendo o inflight e deixando o segundo mount sem dados.
function loadCategories(): Promise<EventCategoryDTO[]> {
    if (categoriesCache) return Promise.resolve(categoriesCache);
    if (inflight) return inflight;

    inflight = categoryService
        .listEventCategories()
        .then((list) => {
            categoriesCache = list;
            return list;
        })
        .finally(() => {
            inflight = null;
        });

    return inflight;
}

export interface UseCategoryBySlugResult {
    category: EventCategoryDTO | null;
    isLoading: boolean;
    error: string | null;
    notFound: boolean;
}

export default function useCategoryBySlug(slug: string): UseCategoryBySlugResult {
    const [category, setCategory] = useState<EventCategoryDTO | null>(() => {
        if (!slug || !categoriesCache) return null;
        return categoriesCache.find((c) => c.slug === slug) ?? null;
    });
    const [isLoading, setIsLoading] = useState(!categoriesCache);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(() => {
        if (!slug || !categoriesCache) return false;
        return categoriesCache.find((c) => c.slug === slug) === undefined;
    });

    useEffect(() => {
        if (!slug) {
            setCategory(null);
            setNotFound(true);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);
        setError(null);
        setNotFound(false);

        loadCategories()
            .then((list) => {
                if (controller.signal.aborted) return;
                const match = list.find((c) => c.slug === slug) ?? null;
                setCategory(match);
                setNotFound(match === null);
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                if (axios.isCancel(err)) return;
                setError("Não foi possível carregar as categorias.");
                setCategory(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [slug]);

    return { category, isLoading, error, notFound };
}
