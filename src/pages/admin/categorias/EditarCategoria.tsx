import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { CategoryForm } from "@/features/admin/admin-categories/components/CategoryForm";
import { useCategoryForm } from "@/features/admin/admin-categories/hooks/useCategoryForm";

const EditarCategoria = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId: string }>();
    const {
        category,
        form,
        isLoading,
        isSaving,
        isDeleting,
        error,
        successMessage,
        hasChanges,
        liveSlug,
        handleFieldChange,
        handleSave,
        handleReset,
        handleDelete,
    } = useCategoryForm(categoryId);

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/categorias")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para categorias
                </button>
            </div>

            <AdminPageHeader
                icon={Pencil}
                title={category ? `Editar: ${category.name}` : "Editar categoria"}
                description={
                    category
                        ? `ID #${category.categoryId} · slug atual "${category.slug}"`
                        : "Carregando detalhes da categoria..."
                }
            />

            <CategoryForm
                category={category}
                formName={form.name}
                isLoading={isLoading}
                isSaving={isSaving}
                isDeleting={isDeleting}
                error={error}
                successMessage={successMessage}
                hasChanges={hasChanges}
                liveSlug={liveSlug}
                onNameChange={handleFieldChange("name")}
                onReset={handleReset}
                onSave={handleSave}
                onDelete={() =>
                    handleDelete(
                        () => navigate("/admin/categorias"),
                        (categoryName) =>
                            window.confirm(
                                `Excluir permanentemente a categoria "${categoryName}"?`
                            )
                    )
                }
            />
        </div>
    );
};

export default EditarCategoria;
