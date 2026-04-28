import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ClientForm } from "@/features/admin-clients/components/ClientForm";
import { useClientForm } from "@/features/admin-clients/hooks/useClientForm";

const EditarCliente = () => {
    const navigate = useNavigate();
    const { clientId } = useParams<{ clientId: string }>();
    const {
        client,
        form,
        isLoading,
        isSaving,
        isTogglingStatus,
        error,
        successMessage,
        hasChanges,
        handleFieldChange,
        handleSave,
        handleReset,
        handleToggleStatus,
    } = useClientForm(clientId);

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/clientes")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para clientes
                </button>
            </div>

            <AdminPageHeader
                icon={Pencil}
                title={client ? `Editar: ${client.fullName}` : "Editar cliente"}
                description={
                    client
                        ? `ID ${client.userID} · última atualização ${new Date(
                              client.lastUpdateDate
                          ).toLocaleString("pt-BR")}`
                        : "Carregando detalhes do cliente..."
                }
            />

            <ClientForm
                client={client}
                form={form}
                isLoading={isLoading}
                isSaving={isSaving}
                isTogglingStatus={isTogglingStatus}
                error={error}
                successMessage={successMessage}
                hasChanges={hasChanges}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onReset={handleReset}
                onToggleStatus={handleToggleStatus}
            />
        </div>
    );
};

export default EditarCliente;
