import { useEffect } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { VenueForm } from "@/features/admin/admin-venues/components/VenueForm";
import VenueMapEditor from "@/features/admin/admin-venues/components/VenueMapEditor";
import { useVenueForm } from "@/features/admin/admin-venues/hooks/useVenueForm";
import { useToast } from "@/components/ui/toast";

const EditarEspaco = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { venueId } = useParams<{ venueId: string }>();
    const { showToast } = useToast();
    const {
        venue,
        form,
        isLoading,
        isSaving,
        isTogglingStatus,
        hasChanges,
        handleFieldChange,
        handleSave,
        handleReset,
        handleToggleStatus,
    } = useVenueForm(venueId);

    useEffect(() => {
        const routeState = location.state as { successMessage?: string } | null;
        const successFromRoute = routeState?.successMessage;
        if (!successFromRoute) return;

        showToast({ type: "success", message: successFromRoute });
        navigate(location.pathname, { replace: true });
    }, [location.pathname, location.state, navigate, showToast]);

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

            <VenueForm
                venue={venue}
                form={form}
                isLoading={isLoading}
                isSaving={isSaving}
                isTogglingStatus={isTogglingStatus}
                hasChanges={hasChanges}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onReset={handleReset}
                onToggleStatus={handleToggleStatus}
            />

            {venueId && (
                <div className="mt-6">
                    <VenueMapEditor venueId={venueId} venue={venue} />
                </div>
            )}
        </div>
    );
};

export default EditarEspaco;
