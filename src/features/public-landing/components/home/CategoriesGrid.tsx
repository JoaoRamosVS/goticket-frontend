import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useEventCategories from "@/features/public-landing/hooks/useEventCategories";
import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";

const CARD_GRADIENTS = [
    "from-blue-600 via-blue-800 to-indigo-900",
    "from-purple-600 via-purple-800 to-violet-900",
    "from-rose-500 via-rose-700 to-red-900",
    "from-amber-500 via-orange-600 to-orange-900",
    "from-emerald-500 via-teal-700 to-cyan-900",
    "from-sky-500 via-blue-700 to-blue-900",
] as const;

const CategoryCard = ({
    category,
    gradient,
    onClick,
}: {
    category: EventCategoryDTO;
    gradient: string;
    onClick: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={`relative min-h-[250px] overflow-hidden rounded-[28px] shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300 bg-linear-to-br ${gradient}`}
        >
            <div className="absolute inset-0 bg-white/5" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 55%, transparent 80%)",
                }}
            />
            <div className="relative z-10 flex min-h-[250px] items-end p-5">
                <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                        {category.name}
                    </h3>
                    <ArrowRight className="size-5 text-white" strokeWidth={4} />
                </div>
            </div>
        </div>
    );
};

const CategoryCardSkeleton = () => (
    <div className="relative min-h-[250px] overflow-hidden rounded-[28px] shadow-2xl animate-pulse bg-muted" />
);

const CategoriesGrid = () => {
    const navigate = useNavigate();
    const { categories, isLoading, error } = useEventCategories();

    return (
        <section className="container mx-auto relative w-full px-2 py-16 sm:px-8 lg:px-4">
            <div className="flex justify-between items-center w-full">
                <h2 className="text-left text-3xl tracking-wide font-extrabold sm:text-3xl md:text-4xl px-2">
                    O que você busca hoje?
                </h2>
                <a
                    href="/categorias"
                    className="text-muted-foreground text-lg text-left border-b border-muted-foreground/80"
                >
                    Ver mais
                </a>
            </div>

            {error && (
                <p className="mt-8 text-center text-sm text-destructive">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 pt-8">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <CategoryCardSkeleton key={i} />
                      ))
                    : categories.map((category, index) => (
                          <CategoryCard
                              key={category.categoryId}
                              category={category}
                              gradient={
                                  CARD_GRADIENTS[index % CARD_GRADIENTS.length]
                              }
                              onClick={() =>
                                  navigate(`/categoria/${category.slug}`)
                              }
                          />
                      ))}
            </div>
        </section>
    );
};

export default CategoriesGrid;
