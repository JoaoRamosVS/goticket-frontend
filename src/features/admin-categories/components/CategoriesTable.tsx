import {
    ChevronLeft,
    ChevronRight,
    Hash,
    Loader2,
    Pencil,
    RefreshCcw,
    Search,
    Tags,
} from "lucide-react";

import type { EventCategoryDTO } from "@/features/admin-categories/types/category.types";

type CategoriesTableProps = {
    categories: EventCategoryDTO[];
    pagedCategories: EventCategoryDTO[];
    isLoading: boolean;
    error: string | null;
    normalizedSearch: string;
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    onReload: () => void;
    onEdit: (categoryId: number) => void;
    onDelete: (categoryId: number) => void;
    page: number;
    totalPages: number;
    totalElements: number;
    rangeStart: number;
    rangeEnd: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
};

export const CategoriesTable = ({
    categories,
    pagedCategories,
    isLoading,
    error,
    normalizedSearch,
    searchInput,
    onSearchInputChange,
    onReload,
    onEdit,
    onDelete,
    page,
    totalPages,
    totalElements,
    rangeStart,
    rangeEnd,
    onPreviousPage,
    onNextPage,
}: CategoriesTableProps) => {
    return (
        <div
            className="rounded-4xl border border-white/70 bg-white/25 backdrop-blur-xl"
            style={{
                boxShadow:
                    "0 8px 28px -10px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
            }}
        >
            <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary/50 z-10"
                        strokeWidth={3}
                    />
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(e) => onSearchInputChange(e.target.value)}
                        placeholder="Buscar por nome, slug ou ID"
                        className="h-10 w-full rounded-2xl border border-primary/20 bg-white/70 pl-10 pr-4 text-sm text-[#00334d] placeholder:text-[#5e6c87]/70 backdrop-blur-xl shadow-sm outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5e6c87]">
                        {categories.length} categoria
                        {categories.length === 1 ? "" : "s"} no total
                    </span>
                    <button
                        type="button"
                        onClick={onReload}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-[#2a8fd4] text-white transition-all duration-300 hover:scale-90 shadow-xl"
                        aria-label="Recarregar"
                        title="Recarregar"
                    >
                        <RefreshCcw
                            className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                            strokeWidth={2.3}
                        />
                    </button>
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm overflow-hidden">
                    <thead>
                        <tr className="border-y border-white/80 bg-linear-to-r from-[#e5f1ff]/60 to-transparent text-left">
                            <Th className="pl-6">ID</Th>
                            <Th>Categoria</Th>
                            <Th>Slug</Th>
                            <Th>Ações</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-14 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-[#5e6c87]">
                                        <Loader2 className="size-4 animate-spin" />
                                        Carregando categorias...
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={4} className="py-14 text-center text-sm text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : pagedCategories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-14 text-center text-sm text-[#5e6c87]">
                                    {normalizedSearch
                                        ? "Nenhuma categoria corresponde à busca."
                                        : "Nenhuma categoria encontrada."}
                                </td>
                            </tr>
                        ) : (
                            pagedCategories.map((category) => (
                                <CategoryRow
                                    key={category.categoryId}
                                    category={category}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/70 px-5 py-4 sm:flex-row">
                <span className="text-xs text-[#5e6c87]">
                    Mostrando{" "}
                    <span className="font-semibold text-[#00334d]">
                        {rangeStart}–{rangeEnd}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-[#00334d]">
                        {totalElements}
                    </span>
                </span>

                <div className="flex items-center gap-2">
                    <PagerButton
                        disabled={page === 0 || isLoading}
                        onClick={onPreviousPage}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </PagerButton>

                    <span className="rounded-xl border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#00334d]">
                        {page + 1} / {totalPages}
                    </span>

                    <PagerButton
                        disabled={page + 1 >= totalPages || isLoading}
                        onClick={onNextPage}
                        aria-label="Próxima página"
                    >
                        <ChevronRight className="size-4" />
                    </PagerButton>
                </div>
            </div>
        </div>
    );
};

type CategoryRowProps = {
    category: EventCategoryDTO;
    onEdit: (categoryId: number) => void;
    onDelete: (categoryId: number) => void;
};

const CategoryRow = ({ category, onEdit, onDelete: _onDelete }: CategoryRowProps) => {
    return (
        <tr className="border-b border-white/70 hover:bg-primary/5 hover:scale-[1.02] overflow-hidden transition-all duration-200">
            <td className="py-3 pl-6 pr-2 align-middle text-xs font-semibold text-[#5e6c87]">
                #{category.categoryId}
            </td>
            <td className="py-3 pr-4 align-middle">
                <div className="flex items-center gap-3">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                    >
                        <Tags className="size-5" strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#00334d]">
                            {category.name}
                        </p>
                    </div>
                </div>
            </td>
            <td className="py-3 pr-4 align-middle">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f1ff]/70 px-2.5 py-0.5 text-[11px] font-semibold text-[#2a8fd4] font-mono">
                    <Hash className="size-3" strokeWidth={2.6} />
                    {category.slug}
                </span>
            </td>
            <td className="py-3 pl-2 pr-6 align-middle">
                <div className="flex items-center justify-start gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(category.categoryId)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                        title="Editar categoria"
                    >
                        <Pencil className="size-3.5" strokeWidth={2.6} />
                        Editar
                    </button>
                </div>
            </td>
        </tr>
    );
};

type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className = "", ...props }: ThProps) => (
    <th
        {...props}
        className={`py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87] ${className}`}
    />
);

type PagerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PagerButton = ({
    className = "",
    children,
    ...props
}: PagerButtonProps) => (
    <button
        type="button"
        {...props}
        className={`flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-white/60 text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
        {children}
    </button>
);
