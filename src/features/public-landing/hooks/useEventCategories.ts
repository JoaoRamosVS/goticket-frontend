import { useEffect, useState } from "react";
import axios from "axios";
import categoryService from "@/features/admin/admin-categories/services/category.service";
import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";

type UseEventCategoriesResult = {
    categories: EventCategoryDTO[];
    isLoading: boolean;
    error: string | null;
};

export default function useEventCategories(): UseEventCategoriesResult {
    const [categories, setCategories] = useState<EventCategoryDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);
        setError(null);

        categoryService
            .listEventCategories(controller.signal)
            .then(setCategories)
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.message
                        ? err.message
                        : "Não foi possível carregar as categorias.";
                setError(message);
                setCategories([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    return { categories, isLoading, error };
}
