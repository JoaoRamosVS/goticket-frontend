import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { SpacesTable } from "@/features/admin/admin-spaces/components/SpacesTable";
import { useSpaces } from "@/features/admin/admin-spaces/hooks/useSpaces";

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
    } = useSpaces();

    const handleEdit = (venueId: number) => {
        navigate(`/admin/espacos/${venueId}`);
    };

    return (
        <div>
            <AdminPageHeader
                icon={Building2}
                title="Espaços"
                description="Cadastre e gerencie os locais onde os eventos acontecem."
            />

            <SpacesTable
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
