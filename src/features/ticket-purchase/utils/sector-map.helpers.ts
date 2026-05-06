export type SectorMapPolygon = {
    mapElementId: string;
    points: number[];
};

export type ParsedSectorMap = {
    baseImageUrl: string | null;
    mapSize: { w: number; h: number };
    polygons: SectorMapPolygon[];
};

const DEFAULT_MAP_WIDTH = 1200;
const DEFAULT_MAP_HEIGHT = 750;

function parseLengthPx(value: string | null | undefined): number | null {
    if (!value) return null;
    const n = Number(String(value).replace(/px$/i, "").trim());
    return Number.isFinite(n) && n > 0 ? n : null;
}

function parseMapSizeFromSvgDoc(doc: Document): { w: number; h: number } | null {
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

function fromSvgPoints(points: string): number[] {
    return points
        .trim()
        .split(/\s+/)
        .flatMap((pair) => pair.split(","))
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
}

export function parseSectorMapSvg(svgText: string): ParsedSectorMap | null {
    if (!svgText || !svgText.trim()) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");

    if (doc.querySelector("parsererror")) return null;

    const imageEl = doc.querySelector("image");
    const baseImageUrl =
        imageEl?.getAttribute("href") ??
        imageEl?.getAttribute("xlink:href") ??
        null;

    const parsedSize = parseMapSizeFromSvgDoc(doc);
    const mapSize = parsedSize ?? {
        w: DEFAULT_MAP_WIDTH,
        h: DEFAULT_MAP_HEIGHT,
    };

    const polygons: SectorMapPolygon[] = [];
    doc.querySelectorAll("polygon[id]").forEach((node) => {
        const id = node.getAttribute("id");
        const pointsAttr = node.getAttribute("points");
        if (!id || !pointsAttr) return;
        const points = fromSvgPoints(pointsAttr);
        if (points.length < 6) return;
        polygons.push({ mapElementId: id, points });
    });

    return { baseImageUrl, mapSize, polygons };
}
