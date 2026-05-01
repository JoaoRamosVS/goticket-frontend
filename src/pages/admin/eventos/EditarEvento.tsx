import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { EventForm } from "@/features/admin/admin-events/components/EventForm";
import { useEventForm } from "@/features/admin/admin-events/hooks/useEventForm";

const EditarEvento = () => {
    const navigate = useNavigate();
    const { eventId } = useParams<{ eventId: string }>();
    const {
        event,
        form,
        categories,
        isLoadingCategories,
        isSavingCategory,
        isLoading,
        isSaving,
        isTogglingVisibility,
        isUploadingImages,
        isSavingImageOrder,
        isDeleting,
        hasChanges,
        handleFieldChange,
        handleSave,
        handleReset,
        handleToggleVisibility,
        handleUploadImages,
        handleSaveImageOrder,
        handleChangeCategory,
        handleDeleteEvent,
    } = useEventForm(eventId);

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/eventos")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para eventos
                </button>
            </div>

            <AdminPageHeader
                icon={Pencil}
                title={event ? `Editar: ${event.title}` : "Editar evento"}
                description={
                    event
                        ? `ID #${event.eventID} · última atualização ${new Date(
                              event.lastUpdateDate
                          ).toLocaleString("pt-BR")}`
                        : "Carregando detalhes do evento..."
                }
            />

            <EventForm
                event={event}
                form={form}
                categories={categories}
                isLoadingCategories={isLoadingCategories}
                isSavingCategory={isSavingCategory}
                isLoading={isLoading}
                isSaving={isSaving}
                isTogglingVisibility={isTogglingVisibility}
                isUploadingImages={isUploadingImages}
                isSavingImageOrder={isSavingImageOrder}
                isDeleting={isDeleting}
                hasChanges={hasChanges}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
                onReset={handleReset}
                onToggleVisibility={handleToggleVisibility}
                onChangeCategory={handleChangeCategory}
                onDeleteEvent={() =>
                    handleDeleteEvent(() => navigate("/admin/eventos"))
                }
                onUploadImages={handleUploadImages}
                onSaveImageOrder={handleSaveImageOrder}
            />
        </div>
    );
};

export default EditarEvento;
