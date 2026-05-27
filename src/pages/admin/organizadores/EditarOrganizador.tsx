import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { OrganizerForm } from "@/features/admin/admin-organizers/components/OrganizerForm";
import { useOrganizerForm } from "@/features/admin/admin-organizers/hooks/useOrganizerForm";

const EditarOrganizador = () => {
    const navigate = useNavigate();
    const { organizerId } = useParams<{ organizerId: string }>();
    const {
        organizer,
        form,
        isLoading,
        isSaving,
        isTogglingStatus,
        isCepLoading,
        cepError,
        hasChanges,
        handleFieldChange,
        handleSave,
        handleReset,
        handleToggleStatus,
    } = useOrganizerForm(organizerId);

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/organizadores")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para organizadores
                </button>
            </div>

            <AdminPageHeader
                icon={Pencil}
                title={
                    organizer
                        ? `Editar: ${organizer.organizerName}`
                        : "Editar organizador"
                }
                description={
                    organizer
                        ? `ID ${organizer.userId} · última atualização ${new Date(
                              organizer.lastUpdateDate
                          ).toLocaleString("pt-BR")}`
                        : "Carregando detalhes do organizador..."
                }
            />

            <OrganizerForm
                organizer={organizer}
                form={form}
                isLoading={isLoading}
                isSaving={isSaving}
                isTogglingStatus={isTogglingStatus}
                isCepLoading={isCepLoading}
                cepError={cepError}
                hasChanges={hasChanges}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onReset={handleReset}
                onToggleStatus={handleToggleStatus}
            />
        </div>
    );
};

export default EditarOrganizador;
