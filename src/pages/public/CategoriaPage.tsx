import { Link, useParams } from "react-router-dom";
import { Tag } from "lucide-react";
import EventGrid from "@/components/ui/event-grid";
import EventPagination from "@/components/ui/event-pagination";
import EventFilterCard from "@/components/shared/EventFilterCard";
import CategoryPageHeader from "@/features/category-search/components/CategoryPageHeader";
import useCategoryBySlug from "@/features/category-search/hooks/useCategoryBySlug";
import useCategoryEvents, {
    CATEGORY_PAGE_SIZE,
} from "@/features/category-search/hooks/useCategoryEvents";

const CategoriaPage = () => {
    const { slug = "" } = useParams<{ slug: string }>();
    const {
        category,
        isLoading: isResolvingCategory,
        error: categoryError,
        notFound,
    } = useCategoryBySlug(slug);

    const {
        events,
        totalPages,
        totalElements,
        page,
        sort,
        filters,
        isLoading: isLoadingEvents,
        error: eventsError,
        setFilter,
        setPage,
        setSort,
        clearFilters,
    } = useCategoryEvents(category?.categoryId ?? null);

    if (categoryError) {
        return (
            <div className="min-h-screen pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-8">
                    <ErrorState message={categoryError} />
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-8">
                    <CategoryNotFound slug={slug} />
                </div>
            </div>
        );
    }

    const isLoading = isResolvingCategory || isLoadingEvents;
    const categoryName = category?.name ?? "";

    return (
        <div className="min-h-screen pt-32 pb-16">
            <div className="container mx-auto px-4 sm:px-8">
                <CategoryPageHeader
                    categoryName={categoryName}
                    totalElements={!isLoading && !eventsError ? totalElements : null}
                />

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    <div className="w-full shrink-0 lg:sticky lg:top-28 lg:w-64 xl:w-72">
                        <EventFilterCard
                            filters={filters}
                            sort={sort}
                            onFilterChange={setFilter}
                            onSortChange={setSort}
                            onClearFilters={clearFilters}
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-8">
                        {isLoading && <ListSkeleton />}

                        {!isLoading && eventsError && (
                            <ErrorState message={eventsError} />
                        )}

                        {!isLoading && !eventsError && events.length === 0 && (
                            <EmptyState categoryName={categoryName} />
                        )}

                        {!isLoading && !eventsError && events.length > 0 && (
                            <>
                                <EventGrid events={events} />
                                <EventPagination
                                    page={page}
                                    totalPages={totalPages}
                                    totalElements={totalElements}
                                    pageSize={CATEGORY_PAGE_SIZE}
                                    onPageChange={setPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function ListSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-[48px] bg-white/25"
                    style={{
                        boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)",
                    }}
                >
                    <div className="aspect-8/6 bg-[#dce9f3]" />
                    <div className="flex flex-col gap-3 p-8">
                        <div className="h-3 w-3/4 rounded-full bg-[#dce9f3]" />
                        <div className="h-3 w-1/2 rounded-full bg-[#dce9f3]" />
                        <div className="mt-2 h-12 w-full rounded-[20px] bg-[#dce9f3]" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div
            className="flex flex-col items-center justify-center gap-3 rounded-[32px] border border-white/50 bg-white/25 p-16 text-center backdrop-blur-xl"
            style={{ boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)" }}
        >
            <p className="text-lg font-semibold text-[#002233]">
                Algo deu errado
            </p>
            <p className="text-sm text-[#5e6c87]">{message}</p>
        </div>
    );
}

function EmptyState({ categoryName }: { categoryName: string }) {
    return (
        <div
            className="flex flex-col items-center justify-center gap-3 rounded-[32px] border border-white/50 bg-white/25 p-16 text-center backdrop-blur-xl"
            style={{ boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)" }}
        >
            <Tag className="size-10 text-[#2a8fd4]/40" />
            <p className="text-lg font-semibold text-[#002233]">
                Nenhum evento nesta categoria
            </p>
            <p className="text-sm text-[#5e6c87]">
                {categoryName
                    ? `Ainda não há eventos disponíveis em "${categoryName}". Tente ajustar os filtros ou explorar outras categorias.`
                    : "Tente ajustar os filtros ou explorar outras categorias."}
            </p>
        </div>
    );
}

function CategoryNotFound({ slug }: { slug: string }) {
    return (
        <div
            className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 rounded-[32px] border border-white/50 bg-white/25 p-16 text-center backdrop-blur-xl"
            style={{ boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)" }}
        >
            <Tag className="size-10 text-[#2a8fd4]/40" />
            <p className="text-2xl font-bold text-[#002233]">
                Categoria não encontrada
            </p>
            <p className="text-sm text-[#5e6c87]">
                {slug
                    ? `Não encontramos a categoria "${decodeURIComponent(slug)}".`
                    : "Categoria inválida."}
            </p>
            <Link
                to="/categorias"
                className="mt-2 rounded-full bg-[#2a8fd4] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1c6fb5]"
            >
                Ver todas as categorias
            </Link>
        </div>
    );
}

export default CategoriaPage;
