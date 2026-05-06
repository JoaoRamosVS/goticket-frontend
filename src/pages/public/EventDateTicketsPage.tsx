import { useParams } from "react-router-dom";
import EventDateHeader from "@/features/ticket-purchase/components/EventDateHeader";
import SectorList from "@/features/ticket-purchase/components/SectorList";
import SectorMapViewer from "@/features/ticket-purchase/components/SectorMapViewer";
import TicketTypePicker from "@/features/ticket-purchase/components/TicketTypePicker";
import useEventDateTickets from "@/features/ticket-purchase/hooks/useEventDateTickets";
import useSectorMap from "@/features/ticket-purchase/hooks/useSectorMap";
import useTicketSelection from "@/features/ticket-purchase/hooks/useTicketSelection";
import { useToast } from "@/components/ui/toast";

const EventDateTicketsPage = () => {
    const { eventId, eventDateId } = useParams();
    const { data, isLoading, error } = useEventDateTickets(eventId, eventDateId);
    const sectors = data?.sectors ?? [];
    const {
        selectedSectorId,
        selectedSector,
        hoveredSectorId,
        quantities,
        totals,
        selectSector,
        setHoveredSectorId,
        setQuantity,
    } = useTicketSelection(sectors);
    const { map: sectorMap, isLoading: isMapLoading } = useSectorMap(
        data?.venueId ?? null
    );
    const { showToast } = useToast();

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 mt-24">
                <div className="animate-pulse space-y-6">
                    <div className="h-44 rounded-4xl bg-muted/40" />
                    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
                        <div className="space-y-4">
                            <div className="h-32 rounded-2xl bg-muted/40" />
                            <div className="h-32 rounded-2xl bg-muted/40" />
                            <div className="h-32 rounded-2xl bg-muted/40" />
                        </div>
                        <div className="h-[480px] rounded-4xl bg-muted/40" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 mt-32">
                <div className="rounded-4xl bg-linear-to-r from-primary to-[#2959b9] backdrop-blur-xl p-8 text-center shadow-2xl shadow-primary">
                    <p className="text-3xl font-extrabold text-primary-foreground">
                        Não foi possível carregar os ingressos.
                    </p>
                    <p className="text-primary-foreground mt-6 text-lg">
                        {error ?? "Data não encontrada para este evento."}
                    </p>
                </div>
            </div>
        );
    }

    const handleConfirm = () => {
        if (totals.totalQuantity <= 0) return;
        showToast({
            type: "info",
            title: "Em breve",
            message:
                "O fluxo de checkout ainda está sendo construído. Sua seleção foi registrada.",
        });
    };

    const hasMap = Boolean(sectorMap && sectorMap.polygons.length > 0);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 mt-24">
            <div className="flex flex-col gap-8">
                <EventDateHeader
                    eventTitle={data.eventTitle}
                    eventImage={data.eventImage}
                    startDate={data.startDate}
                    endDate={data.endDate}
                    venueName={data.venueName}
                    venueCity={data.venueCity}
                    venueState={data.venueState}
                    backTo={`/evento/${data.eventId}`}
                />

                {hasMap && sectorMap ? (
                    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-start">
                        <div className="xl:col-start-1 xl:row-start-1">
                            <SectorList
                                sectors={sectors}
                                selectedSectorId={selectedSectorId}
                                hoveredSectorId={hoveredSectorId}
                                onSelectSector={selectSector}
                                onHoverSector={setHoveredSectorId}
                            />
                        </div>

                        <div className="xl:col-start-2 xl:row-start-1 xl:row-span-2 xl:sticky xl:top-24">
                            <SectorMapViewer
                                map={sectorMap}
                                sectors={sectors}
                                selectedSectorId={selectedSectorId}
                                hoveredSectorId={hoveredSectorId}
                                onSelectSector={selectSector}
                                onHoverSector={setHoveredSectorId}
                            />
                        </div>

                        <div className="xl:col-start-1 xl:row-start-2">
                            <TicketTypePicker
                                sector={selectedSector}
                                quantities={quantities}
                                onChangeQuantity={setQuantity}
                                totals={totals}
                                onConfirm={handleConfirm}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
                        <SectorList
                            sectors={sectors}
                            selectedSectorId={selectedSectorId}
                            hoveredSectorId={hoveredSectorId}
                            onSelectSector={selectSector}
                            onHoverSector={setHoveredSectorId}
                        />
                        <TicketTypePicker
                            sector={selectedSector}
                            quantities={quantities}
                            onChangeQuantity={setQuantity}
                            totals={totals}
                            onConfirm={handleConfirm}
                        />
                    </div>
                )}

                {!hasMap && isMapLoading && (
                    <p className="text-center text-xs text-muted-foreground">
                        Carregando mapa de setores...
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventDateTicketsPage;
