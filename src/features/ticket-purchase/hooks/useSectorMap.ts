import { useEffect, useState } from "react";
import {
    parseSectorMapSvg,
    type ParsedSectorMap,
} from "@/features/ticket-purchase/utils/sector-map.helpers";

type UseSectorMapResult = {
    map: ParsedSectorMap | null;
    isLoading: boolean;
};

export default function useSectorMap(
    venueId: number | null
): UseSectorMapResult {
    const [map, setMap] = useState<ParsedSectorMap | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!venueId) {
            setMap(null);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);
        setMap(null);

        const url = `${import.meta.env.VITE_API_URL}/venues/${venueId}/sector-map`;

        fetch(url, { signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) return null;
                const text = await response.text();
                return parseSectorMapSvg(text);
            })
            .then((parsed) => {
                if (controller.signal.aborted) return;
                setMap(parsed);
            })
            .catch(() => {
                if (controller.signal.aborted) return;
                setMap(null);
            })
            .finally(() => {
                if (controller.signal.aborted) return;
                setIsLoading(false);
            });

        return () => controller.abort();
    }, [venueId]);

    return { map, isLoading };
}
