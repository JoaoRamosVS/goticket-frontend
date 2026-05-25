import { Tag } from "lucide-react";

type CategoryPageHeaderProps = {
    categoryName: string;
    totalElements: number | null;
};

const CategoryPageHeader = ({
    categoryName,
    totalElements,
}: CategoryPageHeaderProps) => {
    return (
        <div className="mb-12 flex items-end justify-between gap-3">
            <div className="flex items-center justify-center gap-3 mb-1">
                <div className="p-4 rounded-md shadow-2xl bg-linear-to-l from-primary to-[#2959b9]">
                    <Tag className="size-8 text-white" strokeWidth={4} />
                </div>
                <h1 className="text-2xl font-extrabold sm:text-5xl">
                    Categoria{" "}
                    <em className="italic text-[#2a8fd4]">
                        {categoryName}
                    </em>
                </h1>
            </div>
            {totalElements !== null && (
                <p className="text-sm text-center text-[#5e6c87]">
                    {totalElements === 0
                        ? "Nenhum evento encontrado nesta categoria"
                        : `${totalElements} evento${totalElements !== 1 ? "s" : ""} nesta categoria`}
                </p>
            )}
        </div>
    );
};

export default CategoryPageHeader;
