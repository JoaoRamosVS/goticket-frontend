import organizerService from "@/features/admin/admin-organizers/services/organizer.service";
import venueService from "@/features/admin/admin-venues/services/venue.service";
import type { CreateVenuePayload } from "@/features/admin/admin-venues/types/venue.types";
import type { OrganizerMinDTO } from "@/features/admin/admin-organizers/types/organizer.types";
import type { VenueDetailDTO } from "@/features/admin/admin-venues/types/venue.types";
import { normalizeCnpjDigits } from "@/features/admin/admin-venues/new-venue/utils/cnpj";

const ORGANIZER_LIST_PAGE_SIZE = 500;
const VENUE_RECOVERY_PAGE_SIZE = 200;

/**
 * Lista organizadores para o seletor na tela de novo espaço (admin).
 */
export async function listOrganizersForNewVenue(
    signal?: AbortSignal
): Promise<OrganizerMinDTO[]> {
    const data = await organizerService.listOrganizers(
        0,
        ORGANIZER_LIST_PAGE_SIZE,
        signal
    );
    return data.organizerMinDTOList ?? [];
}

/**
 * Persiste o espaço com `POST /venues`.
 */
export async function persistNewVenue(
    payload: CreateVenuePayload
): Promise<VenueDetailDTO> {
    return venueService.createVenue(payload);
}

/**
 * Recarrega detalhes após mutações (setores / mapa).
 */
export async function refreshVenueDetail(
    venueId: number | string,
    signal?: AbortSignal
): Promise<VenueDetailDTO> {
    return venueService.getVenueById(venueId, signal);
}

/**
 * Tenta recuperar um espaço existente por CNPJ para retomar o fluxo do wizard.
 */
export async function findVenueByCnpjForNewVenue(
    cnpj: string,
    signal?: AbortSignal
): Promise<VenueDetailDTO | null> {
    const wanted = normalizeCnpjDigits(cnpj);
    if (!wanted) return null;

    let page = 0;
    while (true) {
        const data = await venueService.listVenues(page, VENUE_RECOVERY_PAGE_SIZE, signal);
        const match = data.venueMinDTOList.find(
            (venue) => normalizeCnpjDigits(venue.CNPJ) === wanted
        );
        if (match) {
            return venueService.getVenueById(match.venueID, signal);
        }

        page += 1;
        if (page >= data.totalPages) {
            return null;
        }
    }
}
