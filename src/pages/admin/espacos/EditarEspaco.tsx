import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Pencil } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { VenueForm } from "@/features/admin/admin-venues/components/VenueForm";
import VenueMapEditor from "@/features/admin/admin-venues/components/VenueMapEditor";
import { useVenueForm } from "@/features/admin/admin-venues/hooks/useVenueForm";

const EditarEspaco = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { venueId } = useParams<{ venueId: string }>();
    const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
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
    } = useVenueForm(venueId);

    useEffect(() => {
        const routeState = location.state as { successMessage?: string } | null;
        const successFromRoute = routeState?.successMessage;
        if (!successFromRoute) return;

        setFlashSuccess(successFromRoute);
        navigate(location.pathname, { replace: true });
    }, [location.pathname, location.state, navigate]);

    return (
        <div>
            {flashSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm font-semibold text-emerald-700 backdrop-blur-xl">
                    <CheckCircle2 className="size-4 shrink-0" />
                    {flashSuccess}
                </div>
            )}
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
                error={error}
                successMessage={successMessage}
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
