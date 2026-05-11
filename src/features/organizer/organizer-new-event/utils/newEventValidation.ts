import type {
    NewEventFormState,
    NewEventStepIndex,
} from "@/features/organizer/organizer-new-event/types/newEvent.types";

export type StepValidation = {
    isValid: boolean;
    error: string | null;
};

function isPositiveInteger(value: string): boolean {
    if (value.trim() === "") return false;
    const n = Number(value);
    return Number.isInteger(n) && n >= 0 && n <= 120;
}

function dateTimeLocalToLocalDateTime(value: string): string | null {
    if (!value) return null;
    return value.length === 16 ? `${value}:00` : value;
}

function isInTheFuture(localDateTime: string): boolean {
    const parsed = new Date(localDateTime);
    if (Number.isNaN(parsed.getTime())) return false;
    return parsed.getTime() > Date.now();
}

export function validateStep(
    step: NewEventStepIndex,
    form: NewEventFormState
): StepValidation {
    if (step === 0) {
        if (form.title.trim().length < 3) {
            return { isValid: false, error: "Informe um título com ao menos 3 caracteres." };
        }
        if (form.description.trim().length < 10) {
            return {
                isValid: false,
                error: "Descreva o evento com ao menos 10 caracteres.",
            };
        }
        if (!form.categoryId) {
            return { isValid: false, error: "Selecione uma categoria." };
        }
        if (!isPositiveInteger(form.ageRestriction)) {
            return {
                isValid: false,
                error: "Informe uma restrição de idade entre 0 e 120.",
            };
        }
        if (form.salesStartDate) {
            const normalized = dateTimeLocalToLocalDateTime(form.salesStartDate);
            if (!normalized || !isInTheFuture(normalized)) {
                return {
                    isValid: false,
                    error: "A data de início das vendas deve estar no futuro.",
                };
            }
        }
        return { isValid: true, error: null };
    }

    if (step === 1) {
        if (!form.venueId) {
            return { isValid: false, error: "Selecione um espaço para o evento." };
        }
        return { isValid: true, error: null };
    }

    if (step === 2) {
        if (form.eventDates.length === 0) {
            return {
                isValid: false,
                error: "Adicione ao menos uma data para o evento.",
            };
        }
        for (let i = 0; i < form.eventDates.length; i++) {
            const date = form.eventDates[i];
            const start = dateTimeLocalToLocalDateTime(date.startDate);
            const end = dateTimeLocalToLocalDateTime(date.endDate);
            if (!start || !end) {
                return {
                    isValid: false,
                    error: `Preencha início e término da data #${i + 1}.`,
                };
            }
            if (!isInTheFuture(start) || !isInTheFuture(end)) {
                return {
                    isValid: false,
                    error: `A data #${i + 1} deve estar no futuro.`,
                };
            }
            if (new Date(end).getTime() <= new Date(start).getTime()) {
                return {
                    isValid: false,
                    error: `O término da data #${i + 1} deve ser depois do início.`,
                };
            }
        }
        return { isValid: true, error: null };
    }

    return { isValid: true, error: null };
}

export function normalizeDateTimeLocal(value: string): string | null {
    return dateTimeLocalToLocalDateTime(value);
}
