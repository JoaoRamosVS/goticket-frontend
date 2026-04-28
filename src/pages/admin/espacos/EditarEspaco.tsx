import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { SpaceForm } from "@/features/admin/admin-spaces/components/SpaceForm";
import { useSpaceForm } from "@/features/admin/admin-spaces/hooks/useSpaceForm";

const EditarEspaco = () => {
    const navigate = useNavigate();
    const { venueId } = useParams<{ venueId: string }>();
    const {
        venue,
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
    } = useSpaceForm(venueId);

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/espacos")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para espaços
                </button>
            </div>

            <AdminPageHeader
                icon={Pencil}
                title={venue ? `Editar: ${venue.name}` : "Editar espaço"}
                description={
                    venue
                        ? `ID ${venue.venueID} · última atualização ${new Date(
                              venue.lastUpdateDate
                          ).toLocaleString("pt-BR")}`
                        : "Carregando detalhes do espaço..."
                }
            />

            <SpaceForm
                venue={venue}
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

export default EditarEspaco;
