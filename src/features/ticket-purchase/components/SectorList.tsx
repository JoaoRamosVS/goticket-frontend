import { LayoutGrid } from "lucide-react";
import SectorCard from "@/features/ticket-purchase/components/SectorCard";
import type { SectorListProps } from "@/features/ticket-purchase/types/ticket-purchase.types";

const SectorList = ({
    sectors,
    selectedSectorId,
    hoveredSectorId,
    onSelectSector,
    onHoverSector,
}: SectorListProps) => {
    if (sectors.length === 0) {
        return (
            <div className="rounded-4xl border bg-card/40 backdrop-blur-xl p-8 text-center shadow-xs">
                <p className="text-base font-semibold text-foreground">
                    Nenhum setor disponível para esta data.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tente novamente mais tarde ou escolha outra data.
                </p>
            </div>
        );
    }

    return (
        <section className="rounded-4xl border bg-card/60 backdrop-blur-xl p-6 md:p-8 shadow-xs">
            <header className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md shadow-2xl bg-linear-to-l from-primary to-[#15429c] text-primary">
                    <LayoutGrid className="size-5 text-white" />
                </span>
                <div>
                    <h2 className="text-xl font-extrabold">Setores disponíveis</h2>
                    <p className="text-sm text-muted-foreground">
                        Escolha um setor para ver as opções de ingressos.
                    </p>
                </div>
            </header>

            <div className="flex flex-col gap-3">
                {sectors.map((sector) => (
                    <SectorCard
                        key={sector.eventDateSectorId}
                        sector={sector}
                        selected={
                            selectedSectorId === sector.eventDateSectorId
                        }
                        hovered={
                            hoveredSectorId === sector.eventDateSectorId
                        }
                        onSelect={() =>
                            onSelectSector(sector.eventDateSectorId)
                        }
                        onHoverChange={(isHovered) =>
                            onHoverSector(
                                isHovered ? sector.eventDateSectorId : null
                            )
                        }
                    />
                ))}
            </div>
        </section>
    );
};

export default SectorList;
