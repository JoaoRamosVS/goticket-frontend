import { Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { CategoriesTable } from "@/features/admin-categories/components/CategoriesTable";
import { useCategories } from "@/features/admin-categories/hooks/useCategories";

const CategoriasList = () => {
    const navigate = useNavigate();
    const {
        categories,
        isLoading,
        error,
        page,
        setPage,
        searchInput,
        setSearchInput,
        loadCategories,
        handleDelete,
        normalizedSearch,
        pagedCategories,
        totalPages,
        totalElements,
        rangeStart,
        rangeEnd,
    } = useCategories();

    const handleEdit = (categoryId: number) => {
        navigate(`/admin/categorias/${categoryId}`);
    };

    return (
        <div>
            <AdminPageHeader
                icon={Tags}
                title="Categorias"
                description="Gerencie as categorias usadas para classificar os eventos."
            />

            <CategoriesTable
                categories={categories}
                pagedCategories={pagedCategories}
                isLoading={isLoading}
                error={error}
                normalizedSearch={normalizedSearch}
                searchInput={searchInput}
                onSearchInputChange={setSearchInput}
                onReload={() => loadCategories()}
                onEdit={handleEdit}
                onDelete={(categoryId) => {
                    void handleDelete(categoryId);
                }}
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
                onNextPage={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                }
            />
        </div>
    );
};

export default CategoriasList;
