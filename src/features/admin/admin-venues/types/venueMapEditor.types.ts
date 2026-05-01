import type {
    VenueDetailDTO,
    VenueSectorDTO,
} from "@/features/admin/admin-venues/types/venue.types";

export type EditableSector = {
    localId: string;
    sectorID?: number;
    name: string;
    description: string;
    maxCapacity: number;
    mapElementId: string;
    points: number[];
    color: string;
};

export type HoveredEdge = {
    sectorLocalId: string;
    segmentStart: number;
};

export type VenueMapEditorMode = "full" | "layout-only";

export type VenueMapEditorProps = {
    venueId: string;
    venue: VenueDetailDTO | null;
    /** `layout-only`: sem criar/remover setores — só imagem base e polígonos SVG. */
    mode?: VenueMapEditorMode;
    onSuccessfulSave?: () => void;
};

export type VenueSectorMapper = (
    row: VenueSectorDTO,
    points: number[] | undefined,
    mapW: number,
    mapH: number
) => EditableSector;
