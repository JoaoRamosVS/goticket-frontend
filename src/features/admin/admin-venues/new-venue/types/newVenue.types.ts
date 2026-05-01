import type { CreateVenuePayload } from "@/features/admin/admin-venues/types/venue.types";

export type NewVenueStepIndex = 0 | 1 | 2 | 3 | 4;

export type NewVenueStepMeta = {
    id: string;
    title: string;
    subtitle: string;
};

export const NEW_VENUE_STEPS: NewVenueStepMeta[] = [
    {
        id: "identification",
        title: "Identificação",
        subtitle: "Nome, documento e descrição do espaço.",
    },
    {
        id: "address",
        title: "Endereço",
        subtitle: "Localização completa do local.",
    },
    {
        id: "organizer",
        title: "Organizador",
        subtitle: "Responsável e criação do cadastro no sistema.",
    },
    {
        id: "sectors",
        title: "Setores",
        subtitle: "Capacidades e metadados antes do desenho no mapa.",
    },
    {
        id: "venueMapSvg",
        title: "Mapa SVG",
        subtitle: "Imagem base e polígonos interativos.",
    },
];

/** Rascunho de setor antes do desenho no canvas (IDs estáveis para o SVG). */
export type NewVenueDraftSector = {
    key: string;
    name: string;
    description: string;
    maxCapacity: number;
    mapElementId: string;
};

export type NewVenueFormState = Omit<CreateVenuePayload, "organizerID"> & {
    organizerID: string;
};

export const EMPTY_NEW_VENUE_FORM: NewVenueFormState = {
    name: "",
    legalName: "",
    CNPJ: "",
    description: "",
    streetAddress: "",
    streetAddressNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    zipCode: "",
    organizerID: "",
};
