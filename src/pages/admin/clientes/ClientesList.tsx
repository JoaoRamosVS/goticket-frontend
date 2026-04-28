import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { ClientsTable } from "@/features/admin-clients/components/ClientsTable";
import { useClients } from "@/features/admin-clients/hooks/useClients";

const ClientesList = () => {
    const navigate = useNavigate();
    const {
        clients,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        loadClients,
        filteredClients,
        normalizedSearch,
        rangeStart,
        rangeEnd,
    } = useClients();

    const handleEdit = (userID: string) => {
        navigate(`/admin/clientes/${userID}`);
    };

    return (
        <div>
            <AdminPageHeader
                icon={Users}
                title="Clientes"
                description="Gerencie contas, permissões e histórico de clientes."
            />

            <ClientsTable
                clients={clients}
                filteredClients={filteredClients}
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
                onReload={() => loadClients(page)}
                onEdit={handleEdit}
                onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
                onNextPage={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                }
            />
        </div>
    );
};

export default ClientesList;
