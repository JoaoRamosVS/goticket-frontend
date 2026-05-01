import { Building2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { VenuesTable } from "@/features/admin/admin-venues/components/VenuesTable";
import { useVenues } from "@/features/admin/admin-venues/hooks/useVenues";

const EspacosList = () => {
    const navigate = useNavigate();
    const {
        venues,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        loadVenues,
        filteredVenues,
        normalizedSearch,
        rangeStart,
        rangeEnd,
    } = useVenues();

    const handleEdit = (venueId: number) => {
        navigate(`/admin/espacos/${venueId}`);
    };

    return (
        <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <AdminPageHeader
                    className="mb-0 sm:min-w-0 sm:flex-1"
                    icon={Building2}
                    title="Espaços"
                    description="Cadastre e gerencie os locais onde os eventos acontecem."
                />
                <button
                    type="button"
                    onClick={() => navigate("/admin/new-venue")}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-2xl px-5 py-2.5 text-md font-bold text-white shadow-lg transition-all duration-200 hover:scale-[0.98] hover:shadow-xl"
                    style={{
                        background:
                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                        boxShadow:
                            "0 10px 28px -8px rgba(42,143,212,0.55), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                    }}
                >
                    <Plus className="size-4" strokeWidth={4} />
                    Novo espaço
                </button>
            </div>

            <VenuesTable
                venues={venues}
                filteredVenues={filteredVenues}
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                isLoading={isLoading}
                error={error}
                searchInput={searchInput}
                normalizedSearch={normalizedSearch}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onSearchInputChange={setSearchInput}
                onReload={() => loadVenues(page)}
                onEdit={handleEdit}
                onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
                onNextPage={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                }
            />
        </div>
    );
};

export default EspacosList;
