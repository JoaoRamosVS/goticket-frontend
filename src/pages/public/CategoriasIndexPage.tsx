import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronRight, Tag } from "lucide-react";
import categoryService from "@/features/admin/admin-categories/services/category.service";
import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";

const CategoriasIndexPage = () => {
    const [categories, setCategories] = useState<EventCategoryDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
                setError("Não foi possível carregar as categorias.");
                setCategories([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-16">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-3 mb-1">
                        <div className="p-2 rounded-md shadow-2xl bg-linear-to-l from-primary to-[#2959b9]">
                            <Tag className="size-8 text-white" strokeWidth={4} />
                        </div>
                        <h1 className="text-2xl font-extrabold sm:text-5xl">
                            Categorias
                        </h1>
                    </div>
                    <p className="mt-4 text-sm text-center text-[#5e6c87]">
                        Explore os eventos por categoria
                    </p>
                </div>

                {isLoading && <IndexSkeleton />}

                {!isLoading && error && (
                    <div
                        className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 rounded-[32px] border border-white/50 bg-white/25 p-16 text-center backdrop-blur-xl"
                        style={{ boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)" }}
                    >
                        <p className="text-lg font-semibold text-[#002233]">
                            Algo deu errado
                        </p>
                        <p className="text-sm text-[#5e6c87]">{error}</p>
                    </div>
                )}

                {!isLoading && !error && categories.length === 0 && (
                    <div
                        className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 rounded-[32px] border border-white/50 bg-white/25 p-16 text-center backdrop-blur-xl"
                        style={{ boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)" }}
                    >
                        <Tag className="size-10 text-[#2a8fd4]/40" />
                        <p className="text-lg font-semibold text-[#002233]">
                            Nenhuma categoria disponível
                        </p>
                    </div>
                )}

                {!isLoading && !error && categories.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category) => (
                            <CategoryCard key={category.categoryId} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

function CategoryCard({ category }: { category: EventCategoryDTO }) {
    return (
        <Link
            to={`/categoria/${category.slug}`}
            className="group flex items-center justify-between gap-4 rounded-4xl border border-white/50 bg-white/25 p-6 backdrop-blur-2xl transition-all duration-200 hover:-translate-y-1 hover:bg-white/40"
            style={{
                boxShadow:
                    "0 8px 32px -8px rgba(0,46,71,0.10), 0 2px 8px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.7)",
            }}
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 rounded-2xl shadow-md bg-linear-to-l from-primary to-[#2959b9] shrink-0">
                    <Tag className="size-5 text-white" strokeWidth={3} />
                </div>
                <div className="min-w-0">
                    <p className="text-lg font-bold text-[#002233] truncate">
                        {category.name}
                    </p>
                </div>
            </div>
            <ChevronRight className="size-5 text-[#5e6c87] shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#2a8fd4]" />
        </Link>
    );
}

function IndexSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="h-24 animate-pulse rounded-4xl bg-white/25"
                    style={{
                        boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)",
                    }}
                />
            ))}
        </div>
    );
}

export default CategoriasIndexPage;
