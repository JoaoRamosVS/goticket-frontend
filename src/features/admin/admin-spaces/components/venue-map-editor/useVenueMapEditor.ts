import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import spaceService from "@/features/admin/admin-spaces/services/space.service";
import type { UpsertVenueSectorDTO } from "@/features/admin/admin-spaces/types/space.types";
import type {
    EditableSector,
    HoveredEdge,
    VenueMapEditorProps,
} from "@/features/admin/admin-spaces/types/VenueMapEditor.types";
import {
    DEFAULT_MAP_HEIGHT,
    DEFAULT_MAP_WIDTH,
    defaultSquare,
    fromSvgPoints,
    fromVenueSector,
    getErrorMessage,
    getInsertVertexIndex,
    parseMapSizeFromSvgDoc,
    randomColor,
    toSvgPoints,
} from "@/features/admin/admin-spaces/components/venue-map-editor/VenueMapEditor.helper";

export const useVenueMapEditor = ({ venueId, venue }: VenueMapEditorProps) => {
    const [sectors, setSectors] = useState<EditableSector[]>([]);
    const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
    const [baseImageDataUrl, setBaseImageDataUrl] = useState<string | null>(null);
    const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);
    const [mapSize, setMapSize] = useState({ w: DEFAULT_MAP_WIDTH, h: DEFAULT_MAP_HEIGHT });
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingMap, setIsSavingMap] = useState(false);
    const [isSavingSectors, setIsSavingSectors] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [hoveredEdge, setHoveredEdge] = useState<HoveredEdge | null>(null);
    const mapSizeFromSvgRef = useRef(false);
    const pendingIntrinsicSizeRef = useRef(false);

    const selectedSector = useMemo(
        () => sectors.find((sector) => sector.localId === selectedSectorId) ?? null,
        [sectors, selectedSectorId]
    );

    useEffect(() => {
        if (!baseImageDataUrl) {
            setBaseImage(null);
            return;
        }
        const img = new window.Image();
        img.onload = () => setBaseImage(img);
        img.src = baseImageDataUrl;
    }, [baseImageDataUrl]);

    useEffect(() => {
        if (!venueId) return;

        const controller = new AbortController();
        setIsLoading(true);
        setError(null);
        setBaseImageDataUrl(null);
        mapSizeFromSvgRef.current = false;
        setMapSize({ w: DEFAULT_MAP_WIDTH, h: DEFAULT_MAP_HEIGHT });
        setSectors([]);
        setSelectedSectorId(null);

        Promise.all([
            spaceService.listVenueSectors(venueId, controller.signal),
            venue?.venueID
                ? fetch(
                      `${import.meta.env.VITE_API_URL}/venues/${venue.venueID}/sector-map`,
                      { signal: controller.signal }
                  ).then((res) => (res.ok ? res.text() : ""))
                : Promise.resolve(""),
        ])
            .then(([sectorRows, svgText]) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgText || "<svg />", "image/svg+xml");
                const imageHref =
                    doc.querySelector("image")?.getAttribute("href") ??
                    doc.querySelector("image")?.getAttribute("xlink:href");
                setBaseImageDataUrl(imageHref ?? null);

                const parsedSize = parseMapSizeFromSvgDoc(doc);
                if (parsedSize) {
                    mapSizeFromSvgRef.current = true;
                    setMapSize(parsedSize);
                } else {
                    mapSizeFromSvgRef.current = false;
                }

                const layoutW = parsedSize?.w ?? DEFAULT_MAP_WIDTH;
                const layoutH = parsedSize?.h ?? DEFAULT_MAP_HEIGHT;

                const pointsById = new Map<string, number[]>();
                doc.querySelectorAll("polygon[id]").forEach((node) => {
                    const id = node.getAttribute("id");
                    const points = node.getAttribute("points");
                    if (!id || !points) return;
                    pointsById.set(id, fromSvgPoints(points));
                });

                const mapped: EditableSector[] = sectorRows.map((row) =>
                    fromVenueSector(row, pointsById.get(row.mapElementId ?? ""), layoutW, layoutH)
                );
                setSectors(mapped);
                setSelectedSectorId(mapped[0]?.localId ?? null);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError("Não foi possível carregar os dados do mapa.");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [venueId, venue?.venueID]);

    useEffect(() => {
        if (!baseImage || baseImage.naturalWidth <= 0 || baseImage.naturalHeight <= 0) {
            return;
        }
        if (pendingIntrinsicSizeRef.current) {
            pendingIntrinsicSizeRef.current = false;
            mapSizeFromSvgRef.current = false;
            setMapSize({ w: baseImage.naturalWidth, h: baseImage.naturalHeight });
            return;
        }
        if (!mapSizeFromSvgRef.current) {
            setMapSize({ w: baseImage.naturalWidth, h: baseImage.naturalHeight });
        }
    }, [baseImage]);

    const handleBaseImageUpload = async (file: File | null) => {
        if (!file) return;
        pendingIntrinsicSizeRef.current = true;
        const reader = new FileReader();
        reader.onload = () => {
            setBaseImageDataUrl(String(reader.result));
        };
        reader.readAsDataURL(file);
    };

    const addSector = () => {
        const newSector: EditableSector = {
            localId: crypto.randomUUID(),
            name: `Setor ${sectors.length + 1}`,
            description: "Novo setor",
            maxCapacity: 100,
            mapElementId: `sector-${Date.now()}`,
            points: defaultSquare(mapSize.w, mapSize.h),
            color: randomColor(),
        };
        setSectors((prev) => [...prev, newSector]);
        setSelectedSectorId(newSector.localId);
    };

    const updateSelectedSector = (patch: Partial<EditableSector>) => {
        if (!selectedSectorId) return;
        setSectors((prev) =>
            prev.map((sector) =>
                sector.localId === selectedSectorId ? { ...sector, ...patch } : sector
            )
        );
    };

    const removeSelectedSector = () => {
        if (!selectedSectorId) return;
        setSectors((prev) => prev.filter((sector) => sector.localId !== selectedSectorId));
        setSelectedSectorId((current) => {
            if (!current) return null;
            const remaining = sectors.filter((sector) => sector.localId !== current);
            return remaining[0]?.localId ?? null;
        });
    };

    const updateVertex = (vertexIndex: number, x: number, y: number) => {
        if (!selectedSector) return;
        const nextPoints = [...selectedSector.points];
        nextPoints[vertexIndex * 2] = Math.max(0, Math.min(mapSize.w, Math.round(x)));
        nextPoints[vertexIndex * 2 + 1] = Math.max(0, Math.min(mapSize.h, Math.round(y)));
        updateSelectedSector({ points: nextPoints });
    };

    const insertVertexInSelectedSector = (x: number, y: number) => {
        if (!selectedSector) return;
        const boundedX = Math.max(0, Math.min(mapSize.w, Math.round(x)));
        const boundedY = Math.max(0, Math.min(mapSize.h, Math.round(y)));
        const insertAtVertex = getInsertVertexIndex(selectedSector.points, boundedX, boundedY);
        const insertAtPointIndex = insertAtVertex * 2;
        const nextPoints = [...selectedSector.points];
        nextPoints.splice(insertAtPointIndex, 0, boundedX, boundedY);
        updateSelectedSector({ points: nextPoints });
    };

    const insertVertexAtSegment = (
        sectorLocalId: string,
        segmentStart: number,
        x: number,
        y: number
    ) => {
        const boundedX = Math.max(0, Math.min(mapSize.w, Math.round(x)));
        const boundedY = Math.max(0, Math.min(mapSize.h, Math.round(y)));
        const insertAtPointIndex = (segmentStart + 1) * 2;
        setSectors((prev) =>
            prev.map((item) => {
                if (item.localId !== sectorLocalId) return item;
                const nextPoints = [...item.points];
                nextPoints.splice(insertAtPointIndex, 0, boundedX, boundedY);
                return { ...item, points: nextPoints };
            })
        );
    };

    const saveSectors = async () => {
        setIsSavingSectors(true);
        setError(null);
        setSuccess(null);
        try {
            const payload: UpsertVenueSectorDTO[] = sectors.map((sector) => ({
                sectorID: sector.sectorID,
                name: sector.name.trim(),
                description: sector.description.trim(),
                maxCapacity: Number(sector.maxCapacity) || 0,
                mapElementId: sector.mapElementId.trim(),
            }));
            const saved = await spaceService.replaceVenueSectors(venueId, payload);
            const pointsByMapElementId = new Map(
                sectors.map((sector) => [sector.mapElementId, sector.points] as const)
            );
            const remapped = saved.map((row) =>
                fromVenueSector(row, pointsByMapElementId.get(row.mapElementId ?? ""), mapSize.w, mapSize.h)
            );
            setSectors(remapped);
            setSelectedSectorId(remapped[0]?.localId ?? null);
            setSuccess("Setores atualizados com sucesso.");
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Não foi possível salvar os setores."));
        } finally {
            setIsSavingSectors(false);
        }
    };

    const saveMap = async () => {
        if (!baseImageDataUrl) {
            setError("Faça upload da imagem base antes de gerar o mapa.");
            return;
        }
        setIsSavingMap(true);
        setError(null);
        setSuccess(null);
        try {
            const polygons = sectors
                .map(
                    (sector) =>
                        `<polygon id="${sector.mapElementId}" points="${toSvgPoints(
                            sector.points
                        )}" fill="${sector.color}" opacity="0.45" />`
                )
                .join("\n");

            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mapSize.w} ${mapSize.h}" preserveAspectRatio="xMidYMid meet">
<image href="${baseImageDataUrl}" width="${mapSize.w}" height="${mapSize.h}" preserveAspectRatio="none" />
${polygons}
</svg>`;

            const file = new File([svg], "sector-map.svg", { type: "image/svg+xml" });
            await spaceService.uploadVenueSectorMap(venueId, file);
            setSuccess("Mapa SVG enviado com sucesso.");
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Não foi possível enviar o mapa SVG."));
        } finally {
            setIsSavingMap(false);
        }
    };

    return {
        sectors,
        setSectors,
        selectedSectorId,
        selectedSector,
        baseImage,
        mapSize,
        isLoading,
        isSavingMap,
        isSavingSectors,
        error,
        success,
        hoveredEdge,
        setSelectedSectorId,
        setHoveredEdge,
        handleBaseImageUpload,
        addSector,
        updateSelectedSector,
        removeSelectedSector,
        updateVertex,
        insertVertexInSelectedSector,
        insertVertexAtSegment,
        saveSectors,
        saveMap,
    };
};
