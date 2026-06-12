import axios from "axios";
import type { VenueSectorDTO } from "@/features/admin/admin-venues/types/venue.types";
import type { EditableSector } from "@/features/admin/admin-venues/types/venueMapEditor.types";

export const DEFAULT_MAP_WIDTH = 1200;
export const DEFAULT_MAP_HEIGHT = 750;

export function parseLengthPx(value: string | null | undefined): number | null {
    if (!value) return null;
    const n = Number(String(value).replace(/px$/i, "").trim());
    return Number.isFinite(n) && n > 0 ? n : null;
}

export function parseMapSizeFromSvgDoc(doc: Document): { w: number; h: number } | null {
    const svg = doc.querySelector("svg") ?? doc.documentElement;
    if (!svg) return null;

    const viewBox = svg.getAttribute("viewBox");
    if (viewBox) {
        const parts = viewBox.trim().split(/[\s,]+/).map(Number);
        if (
            parts.length === 4 &&
            parts.every((n) => Number.isFinite(n)) &&
            parts[2] > 0 &&
            parts[3] > 0
        ) {
            return { w: parts[2], h: parts[3] };
        }
    }

    const imageEl = doc.querySelector("image");
    const iw = parseLengthPx(imageEl?.getAttribute("width") ?? undefined);
    const ih = parseLengthPx(imageEl?.getAttribute("height") ?? undefined);
    if (iw && ih) return { w: iw, h: ih };

    const sw = parseLengthPx(svg.getAttribute("width"));
    const sh = parseLengthPx(svg.getAttribute("height"));
    if (sw && sh) return { w: sw, h: sh };

    return null;
}

export const toSvgPoints = (points: number[]): string =>
    points.reduce((acc, value, index) => `${acc}${value}${index % 2 === 0 ? "," : " "}`, "").trim();

export const fromSvgPoints = (points: string): number[] =>
    points
        .trim()
        .split(/\s+/)
        .flatMap((pair) => pair.split(","))
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));

export function squaredDistancePointToSegment(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) {
        const ddx = px - x1;
        const ddy = py - y1;
        return ddx * ddx + ddy * ddy;
    }
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    const ddx = px - projX;
    const ddy = py - projY;
    return ddx * ddx + ddy * ddy;
}

export function getInsertVertexIndex(points: number[], x: number, y: number): number {
    const totalVertices = Math.floor(points.length / 2);
    if (totalVertices < 2) {
        return totalVertices;
    }

    let bestSegmentStart = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < totalVertices; i += 1) {
        const next = (i + 1) % totalVertices;
        const x1 = points[i * 2];
        const y1 = points[i * 2 + 1];
        const x2 = points[next * 2];
        const y2 = points[next * 2 + 1];
        const distance = squaredDistancePointToSegment(x, y, x1, y1, x2, y2);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestSegmentStart = i;
        }
    }

    return bestSegmentStart + 1;
}

export const randomColor = () =>
    `hsl(${Math.floor(Math.random() * 360)}, ${60 + Math.random() * 20}%, ${45 + Math.random() * 15}%)`;

export const defaultSquare = (mapW: number, mapH: number): number[] => {
    const m = Math.min(mapW, mapH);
    const side = Math.max(80, m * 0.22);
    const cx = mapW / 2;
    const cy = mapH / 2;
    const half = side / 2;
    return [
        cx - half,
        cy - half,
        cx + half,
        cy - half,
        cx + half,
        cy + half,
        cx - half,
        cy + half,
    ];
};

export function fromVenueSector(
    row: VenueSectorDTO,
    points: number[] | undefined,
    mapW: number,
    mapH: number
): EditableSector {
    return {
        localId: crypto.randomUUID(),
        sectorId: row.sectorId,
        name: row.name,
        description: row.description,
        maxCapacity: row.maxCapacity,
        mapElementId: row.mapElementId ?? `sector-${row.sectorId}`,
        points: points && points.length >= 6 ? points : defaultSquare(mapW, mapH),
        color: randomColor(),
    };
}

export function slugifySectorName(name: string): string {
    const diacritics = new RegExp("[\\u0300-\\u036f]", "g");
    return (
        name
            .toLowerCase()
            .normalize("NFD")
            .replace(diacritics, "")
            .replace(/[^a-z0-9\s]/g, " ")
            .trim()
            .replace(/\s+/g, "-") || "sector"
    );
}

export function deriveMapElementId(name: string, otherIds: string[]): string {
    const base = slugifySectorName(name);
    if (!otherIds.includes(base)) return base;
    let i = 2;
    while (otherIds.includes(`${base}-${i}`)) i++;
    return `${base}-${i}`;
}

export function getErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const errors = err.response?.data?.errors;
        if (Array.isArray(errors) && errors.length > 0) {
            return errors.join(" · ");
        }
        return err.message || fallback;
    }
    return fallback;
}
