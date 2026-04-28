import goTicketApi from "@/services/api";
import type {
    CreateEventCategoryDTO,
    EventCategoryDTO,
    UpdateEventCategoryPayload,
} from "@/features/admin/admin-categories/types/category.types";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const accessToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = { ...(extra ?? {}) };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
}

/**
 * `GET /event-categories` — lista completa de categorias de evento.
 * O backend não pagina este endpoint, então recebemos um array simples.
 */
const listEventCategories = async (
    signal?: AbortSignal
): Promise<EventCategoryDTO[]> => {
    const response = await goTicketApi.get<EventCategoryDTO[]>(
        "/event-categories",
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

/**
 * `GET /event-categories/{categoryId}` — detalhes de uma categoria.
 */
const getEventCategoryById = async (
    categoryId: number | string,
    signal?: AbortSignal
): Promise<EventCategoryDTO> => {
    const response = await goTicketApi.get<EventCategoryDTO>(
        `/event-categories/${categoryId}`,
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

/**
 * `POST /event-categories` — cadastro de uma nova categoria.
 */
const createEventCategory = async (
    data: CreateEventCategoryDTO
): Promise<void> => {
    await goTicketApi.post("/event-categories", data, {
        headers: authHeaders(),
    });
};

/**
 * `PATCH /event-categories/{categoryId}` — atualização parcial com merge-patch+json.
 */
const updateEventCategory = async (
    categoryId: number | string,
    payload: UpdateEventCategoryPayload
): Promise<EventCategoryDTO> => {
    const response = await goTicketApi.patch<EventCategoryDTO>(
        `/event-categories/${categoryId}`,
        payload,
        {
            headers: authHeaders({
                "Content-Type": "application/merge-patch+json",
            }),
        }
    );
    return response.data;
};

/**
 * `DELETE /event-categories/{categoryId}` — exclusão permanente da categoria.
 */
const deleteEventCategory = async (
    categoryId: number | string
): Promise<void> => {
    await goTicketApi.delete(`/event-categories/${categoryId}`, {
        headers: authHeaders(),
    });
};

export default {
    listEventCategories,
    getEventCategoryById,
    createEventCategory,
    updateEventCategory,
    deleteEventCategory,
};
