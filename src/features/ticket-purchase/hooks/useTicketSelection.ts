import { useCallback, useEffect, useMemo, useState } from "react";
import {
    computeTotals,
    emptyQuantities,
    maxQuantityFor,
} from "@/features/ticket-purchase/utils/ticket-purchase.helpers";
import type {
    EventDateSectorOption,
    SelectionTotals,
    TicketTypeName,
} from "@/features/ticket-purchase/types/ticket-purchase.types";

type UseTicketSelectionResult = {
    selectedSectorId: number | null;
    selectedSector: EventDateSectorOption | null;
    hoveredSectorId: number | null;
    quantities: Record<TicketTypeName, number>;
    totals: SelectionTotals;
    selectSector: (sectorId: number) => void;
    setHoveredSectorId: (sectorId: number | null) => void;
    setQuantity: (type: TicketTypeName, nextQuantity: number) => void;
    reset: () => void;
};

export default function useTicketSelection(
    sectors: EventDateSectorOption[]
): UseTicketSelectionResult {
    const [selectedSectorId, setSelectedSectorId] = useState<number | null>(
        null
    );
    const [hoveredSectorId, setHoveredSectorId] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<Record<TicketTypeName, number>>(
        emptyQuantities
    );

    const selectedSector = useMemo(
        () =>
            sectors.find(
                (sector) => sector.eventDateSectorId === selectedSectorId
            ) ?? null,
        [sectors, selectedSectorId]
    );

    useEffect(() => {
        if (selectedSectorId === null) return;
        const stillExists = sectors.some(
            (sector) => sector.eventDateSectorId === selectedSectorId
        );
        if (!stillExists) {
            setSelectedSectorId(null);
            setQuantities(emptyQuantities());
        }
    }, [sectors, selectedSectorId]);

    const selectSector = useCallback((sectorId: number) => {
        setSelectedSectorId((current) => {
            if (current === sectorId) return current;
            setQuantities(emptyQuantities());
            return sectorId;
        });
    }, []);

    const setQuantity = useCallback(
        (type: TicketTypeName, nextQuantity: number) => {
            if (!selectedSector) return;
            const allotment = selectedSector.currentAllotments[type];
            if (!allotment) return;
            const max = maxQuantityFor(allotment);
            const safe = Math.max(0, Math.min(max, Math.floor(nextQuantity)));
            setQuantities((current) => ({ ...current, [type]: safe }));
        },
        [selectedSector]
    );

    const reset = useCallback(() => {
        setSelectedSectorId(null);
        setHoveredSectorId(null);
        setQuantities(emptyQuantities());
    }, []);

    const totals = useMemo(
        () => computeTotals(selectedSector, quantities),
        [selectedSector, quantities]
    );

    return {
        selectedSectorId,
        selectedSector,
        hoveredSectorId,
        quantities,
        totals,
        selectSector,
        setHoveredSectorId,
        setQuantity,
        reset,
    };
}
