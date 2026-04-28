/**
 * Espelha `tech.goticket.backendapi.event.dto.EventCategoryDTO`
 * (`GET /event-categories`).
 */
export interface EventCategoryDTO {
    categoryId: number;
    name: string;
    slug: string;
}

/**
 * Payload aceito pelo `PATCH /event-categories/{categoryId}` (merge-patch+json).
 * O slug é gerado automaticamente pelo backend a partir do nome.
 */
export interface UpdateEventCategoryPayload {
    name?: string;
}

/**
 * Payload de criação utilizado em `POST /event-categories`.
 */
export interface CreateEventCategoryDTO {
    name: string;
}
