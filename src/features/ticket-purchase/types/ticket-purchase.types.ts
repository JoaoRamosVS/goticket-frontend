import type {
    EventPageAllotmentDTO,
    EventPageAllotmentsByType,
    TicketTypeName,
} from "@/features/event-details/types/event-details.types";

export type { TicketTypeName };

export interface EventDateSectorOption {
    eventDateSectorId: number;
    name: string;
    description: string;
    hasNumberedSeats: boolean;
    mapElementId: string | null;
    totalTickets: number;
    availableTickets: number;
    currentAllotments: EventPageAllotmentsByType;
    startingPrice: number | null;
}

export interface EventDateTickets {
    eventId: string;
    eventTitle: string;
    eventImage: string;
    venueId: number | null;
    venueName: string;
    venueCity: string;
    venueState: string;
    eventDateId: number;
    startDate: string;
    endDate: string;
    statusId: number | null;
    sectors: EventDateSectorOption[];
}

export interface TicketTypeOption {
    type: TicketTypeName;
    label: string;
    allotment: EventPageAllotmentDTO;
}

export interface SelectedTicketLine {
    type: TicketTypeName;
    label: string;
    quantity: number;
    unitPrice: number;
    allotmentId: number;
    batchNumber: number;
}

export interface SelectionTotals {
    totalQuantity: number;
    totalAmount: number;
    lines: SelectedTicketLine[];
}

export interface SectorListProps {
    sectors: EventDateSectorOption[];
    selectedSectorId: number | null;
    hoveredSectorId: number | null;
    onSelectSector: (sectorId: number) => void;
    onHoverSector: (sectorId: number | null) => void;
}

export interface SectorCardProps {
    sector: EventDateSectorOption;
    selected: boolean;
    hovered: boolean;
    onSelect: () => void;
    onHoverChange: (hovered: boolean) => void;
}

export interface TicketTypePickerProps {
    sector: EventDateSectorOption | null;
    quantities: Record<TicketTypeName, number>;
    onChangeQuantity: (type: TicketTypeName, nextQuantity: number) => void;
    totals: SelectionTotals;
    onConfirm: () => void;
}

export interface EventDateHeaderProps {
    eventTitle: string;
    eventImage: string;
    startDate: string;
    endDate: string;
    venueName: string;
    venueCity: string;
    venueState: string;
    backTo: string;
}
