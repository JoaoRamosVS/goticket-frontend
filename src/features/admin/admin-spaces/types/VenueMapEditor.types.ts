import type {
    VenueDetailDTO,
    VenueSectorDTO,
} from "@/features/admin/admin-spaces/types/space.types";

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

export type VenueMapEditorProps = {
    venueId: string;
    venue: VenueDetailDTO | null;
};

export type VenueSectorMapper = (
    row: VenueSectorDTO,
    points: number[] | undefined,
    mapW: number,
    mapH: number
) => EditableSector;
