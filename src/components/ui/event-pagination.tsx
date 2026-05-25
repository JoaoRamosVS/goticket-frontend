import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type EventPaginationProps = {
    page: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    className?: string;
};

const EventPagination = ({
    page,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
    className,
}: EventPaginationProps) => {
    if (totalPages <= 1) return null;

    const rangeStart = page * pageSize + 1;
    const rangeEnd = Math.min((page + 1) * pageSize, totalElements);
    const visiblePages = buildPageRange(page, totalPages);

    return (
        <div className={cn("flex items-center justify-end gap-3 mt-6", className)}>
            <div className="flex justify-end items-center gap-8 bg-white/55 py-3 px-6 rounded-4xl shadow-xs">
                <p className="text-sm text-[#5e6c87]/60 font-bold">
                    Mostrando {rangeStart}–{rangeEnd} de {totalElements} eventos
                </p>
                <div className="flex items-center gap-1.5">
                    <PageButton
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 0}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </PageButton>

                    {visiblePages.map((item, i) =>
                        item === "..." ? (
                            <span
                                key={`ellipsis-${i}`}
                                className="px-1 text-sm text-[#5e6c87]/50"
                            >
                                …
                            </span>
                        ) : (
                            <PageButton
                                key={item}
                                onClick={() => onPageChange(item as number)}
                                active={(item as number) === page}
                            >
                                {(item as number) + 1}
                            </PageButton>
                        )
                    )}

                    <PageButton
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages - 1}
                        aria-label="Próxima página"
                    >
                        <ChevronRight className="size-4" />
                    </PageButton>
                </div>
            </div>
        </div>
    );
};

type PageButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    "aria-label"?: string;
};

function PageButton({
    children,
    onClick,
    disabled,
    active,
    "aria-label": ariaLabel,
}: PageButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn(
                "flex size-9 cursor-pointer items-center justify-center rounded-[10px] text-sm font-medium transition-all duration-150",
                active
                    ? "text-white shadow-md"
                    : "text-[#5e6c87] hover:bg-white/60",
                disabled &&
                    "cursor-not-allowed opacity-40 hover:bg-transparent"
            )}
            style={
                active
                    ? {
                          background:
                              "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                          boxShadow: "0 4px 12px -3px rgba(42,143,212,0.4)",
                      }
                    : undefined
            }
        >
            {children}
        </button>
    );
}

function buildPageRange(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);

    const pages: (number | "...")[] = [0];

    if (current > 3) pages.push("...");

    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 4) pages.push("...");

    pages.push(total - 1);

    return pages;
}

export default EventPagination;
