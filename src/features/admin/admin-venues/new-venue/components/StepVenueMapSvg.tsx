import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VenueMapEditor from "@/features/admin/admin-venues/components/VenueMapEditor";
import type { VenueDetailDTO } from "@/features/admin/admin-venues/types/venue.types";

type Props = {
    venueId: number;
    venue: VenueDetailDTO | null;
    mapCompleted: boolean;
    onMapSaved: () => void;
};

export function StepVenueMapSvg({ venueId, venue, mapCompleted, onMapSaved }: Props) {
    const idStr = String(venueId);
    const navigate = useNavigate();

    useEffect(() => {
        if (!mapCompleted) return;
        navigate(`/admin/espacos/${idStr}`, {
            replace: true,
            state: {
                successMessage:
                    "Mapa publicado com sucesso. O espaço está pronto para ser vinculado a eventos.",
            },
        });
    }, [mapCompleted, idStr, navigate]);

    return (
        <div className="flex flex-col gap-5">
            <VenueMapEditor
                venueId={idStr}
                venue={venue}
                mode="layout-only"
                onSuccessfulSave={onMapSaved}
            />
        </div>
    );
}
