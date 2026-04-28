import { UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { OrganizersTable } from "@/features/admin-organizers/components/OrganizersTable";
import { useOrganizers } from "@/features/admin-organizers/hooks/useOrganizers";

const OrganizadoresList = () => {
    const navigate = useNavigate();
    const {
        organizers,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        loadOrganizers,
        filteredOrganizers,
        normalizedSearch,
        rangeStart,
        rangeEnd,
    } = useOrganizers();

    const handleEdit = (userID: string) => {
        navigate(`/admin/organizadores/${userID}`);
    };

    return (
        <div>
            <AdminPageHeader
                icon={UserCog}
                title="Organizadores"
                description="Gerencie produtores, permissões e eventos vinculados."
            />

            <OrganizersTable
                organizers={organizers}
                filteredOrganizers={filteredOrganizers}
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
                onReload={() => loadOrganizers(page)}
                onEdit={handleEdit}
                onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
                onNextPage={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                }
            />
        </div>
    );
};

export default OrganizadoresList;
