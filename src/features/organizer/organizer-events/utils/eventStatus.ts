import {
    CheckCircle2,
    Clock,
    Flag,
    Hourglass,
    Pause,
    XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { EventStatusName } from "@/features/organizer/organizer-events/types/organizerEvent.types";

export type EventStatusVisual = {
    label: string;
    description: string;
    icon: LucideIcon;
    /** gradiente do badge/coluna */
    gradient: string;
    /** cor dominante (hex) usada em ícones e detalhes */
    accent: string;
    /** fundo translúcido das colunas/cards */
    softBackground: string;
    /** borda translúcida */
    softBorder: string;
};

const FALLBACK: EventStatusVisual = {
    label: "Indefinido",
    description: "Status não reconhecido.",
    icon: Flag,
    gradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
    accent: "#64748b",
    softBackground: "rgba(148,163,184,0.12)",
    softBorder: "rgba(148,163,184,0.35)",
};

export const ORGANIZER_STATUS_ORDER: EventStatusName[] = [
    "PENDING_APPROVAL",
    "APPROVED",
    "POSTPONED",
    "COMPLETED",
    "DECLINED",
    "CANCELED",
];

const STATUS_MAP: Record<EventStatusName, EventStatusVisual> = {
    PENDING_APPROVAL: {
        label: "Aguardando aprovação",
        description: "Em análise pela equipe de curadoria.",
        icon: Hourglass,
        gradient: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)",
        accent: "#b45309",
        softBackground: "rgba(245,158,11,0.10)",
        softBorder: "rgba(245,158,11,0.35)",
    },
    APPROVED: {
        label: "Aprovado",
        description: "Liberado para venda e divulgação.",
        icon: CheckCircle2,
        gradient: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
        accent: "#1c6fb5",
        softBackground: "rgba(42,143,212,0.10)",
        softBorder: "rgba(42,143,212,0.35)",
    },
    POSTPONED: {
        label: "Adiado",
        description: "Datas reagendadas — verifique a programação.",
        icon: Pause,
        gradient: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
        accent: "#c2410c",
        softBackground: "rgba(251,146,60,0.12)",
        softBorder: "rgba(251,146,60,0.35)",
    },
    COMPLETED: {
        label: "Concluído",
        description: "Evento já realizado.",
        icon: Flag,
        gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
        accent: "#047857",
        softBackground: "rgba(52,211,153,0.12)",
        softBorder: "rgba(52,211,153,0.35)",
    },
    DECLINED: {
        label: "Recusado",
        description: "Não aprovado pela curadoria.",
        icon: XCircle,
        gradient: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
        accent: "#b91c1c",
        softBackground: "rgba(248,113,113,0.12)",
        softBorder: "rgba(248,113,113,0.35)",
    },
    CANCELED: {
        label: "Cancelado",
        description: "Evento cancelado.",
        icon: Clock,
        gradient: "linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)",
        accent: "#374151",
        softBackground: "rgba(156,163,175,0.14)",
        softBorder: "rgba(156,163,175,0.35)",
    },
};

export function getStatusVisual(
    status: EventStatusName | null | undefined
): EventStatusVisual {
    if (!status) return FALLBACK;
    return STATUS_MAP[status] ?? FALLBACK;
}
