/**
 * Item de uma data de evento — espelha
 * `tech.goticket.backendapi.event.dto.EventDateInputDTO`.
 * Os campos chegam ao backend como `LocalDateTime` (sem timezone).
 */
export interface EventDateInputDTO {
    startDate: string;
    endDate: string;
}

/**
 * Payload aceito por `POST /events` quando o criador é um organizer.
 * Espelha `tech.goticket.backendapi.event.dto.CreateEventDTO`.
 *
 * Quando enviado por um organizador, o `organizerID` é ignorado pelo
 * backend (vincula-se ao usuário autenticado).
 */
export interface CreateEventPayload {
    title: string;
    description: string;
    categoryId: number;
    venueId: number;
    ageRestriction: number;
    salesStartDate: string | null;
    eventDates: EventDateInputDTO[];
}

export type NewEventStepIndex = 0 | 1 | 2 | 3;

export const NEW_EVENT_STEPS: Array<{
    id: NewEventStepIndex;
    title: string;
    subtitle: string;
}> = [
    {
        id: 0,
        title: "Detalhes",
        subtitle: "Título, descrição, categoria e classificação.",
    },
    {
        id: 1,
        title: "Espaço",
        subtitle: "Selecione o local onde o evento acontecerá.",
    },
    {
        id: 2,
        title: "Datas",
        subtitle: "Adicione uma ou mais sessões do evento.",
    },
    {
        id: 3,
        title: "Revisão",
        subtitle: "Confira todos os dados e envie para aprovação.",
    },
];

export type NewEventFormState = {
    title: string;
    description: string;
    categoryId: string;
    venueId: string;
    ageRestriction: string;
    salesStartDate: string;
    eventDates: Array<{ id: string; startDate: string; endDate: string }>;
};

export const EMPTY_NEW_EVENT_FORM: NewEventFormState = {
    title: "",
    description: "",
    categoryId: "",
    venueId: "",
    ageRestriction: "0",
    salesStartDate: "",
    eventDates: [],
};
