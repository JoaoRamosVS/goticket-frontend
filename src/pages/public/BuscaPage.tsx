import { Search } from "lucide-react";
import EventGrid from "@/components/ui/event-grid";
import EventPagination from "@/components/ui/event-pagination";
import EventFilterCard from "@/features/event-search/components/EventFilterCard";
import useEventSearch, {
    SEARCH_PAGE_SIZE,
} from "@/features/event-search/hooks/useEventSearch";

const BuscaPage = () => {
    const {
        searchTerm,
        events,
        totalPages,
        totalElements,
        page,
        sort,
        filters,
        isLoading,
        error,
        setFilter,
        setPage,
        setSort,
        clearFilters,
    } = useEventSearch();

    return (
        <div className="min-h-screen pt-32 pb-16">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-3 mb-1">
                        <div className="p-2 rounded-md shadow-2xl bg-linear-to-l from-primary to-[#2959b9]">
                            <Search className="size-8 text-white" strokeWidth={4} />
                        </div>
                        <h1 className="text-2xl font-extrabold sm:text-5xl">
                            {searchTerm ? (
                                <>
                                    Resultados para{" "}
                                    <em className="not-italic text-[#2a8fd4]">
                                        "{decodeURIComponent(searchTerm)}"
                                    </em>
                                </>
                            ) : (
                                "Todos os eventos"
                            )}
                        </h1>
                    </div>
                    {!isLoading && !error && (
                        <p className="mt-4 mb-12 text-sm text-center text-[#5e6c87]">
                            {totalElements === 0
                                ? "Nenhum evento encontrado"
                                : `${totalElements} evento${totalElements !== 1 ? "s" : ""} encontrado${totalElements !== 1 ? "s" : ""}`}
                        </p>
                    )}
                </div>

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
                        {isLoading && <SearchSkeleton />}

                        {!isLoading && error && (
                            <ErrorState message={error} />
                        )}

                        {!isLoading && !error && events.length === 0 && (
                            <EmptyState searchTerm={searchTerm} />
                        )}

                        {!isLoading && !error && events.length > 0 && (
                            <>
                                <EventGrid events={events} />
                                <EventPagination
                                    page={page}
                                    totalPages={totalPages}
                                    totalElements={totalElements}
                                    pageSize={SEARCH_PAGE_SIZE}
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

function SearchSkeleton() {
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

function EmptyState({ searchTerm }: { searchTerm: string }) {
    return (
        <div
            className="flex flex-col items-center justify-center gap-3 rounded-[32px] border border-white/50 bg-white/25 p-16 text-center backdrop-blur-xl"
            style={{ boxShadow: "0 8px 32px -8px rgba(0,46,71,0.10)" }}
        >
            <Search className="size-10 text-[#2a8fd4]/40" />
            <p className="text-lg font-semibold text-[#002233]">
                Nenhum evento encontrado
            </p>
            <p className="text-sm text-[#5e6c87]">
                {searchTerm
                    ? `Não encontramos eventos para "${decodeURIComponent(searchTerm)}". Tente outros termos ou ajuste os filtros.`
                    : "Não há eventos disponíveis no momento."}
            </p>
        </div>
    );
}

export default BuscaPage;
