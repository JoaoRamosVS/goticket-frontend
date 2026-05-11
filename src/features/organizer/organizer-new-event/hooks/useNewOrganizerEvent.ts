import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import categoryService from "@/features/admin/admin-categories/services/category.service";
import venueService from "@/features/admin/admin-venues/services/venue.service";
import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";
import type { VenueMinDTO } from "@/features/admin/admin-venues/types/venue.types";

import newEventService from "@/features/organizer/organizer-new-event/services/newEvent.service";
import {
    EMPTY_NEW_EVENT_FORM,
    NEW_EVENT_STEPS,
    type CreateEventPayload,
    type NewEventFormState,
    type NewEventStepIndex,
} from "@/features/organizer/organizer-new-event/types/newEvent.types";
import {
    normalizeDateTimeLocal,
    validateStep,
} from "@/features/organizer/organizer-new-event/utils/newEventValidation";

const VENUE_FETCH_PAGE_SIZE = 100;

function generateDateRowId(): string {
    return `date-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useNewOrganizerEvent = (onCreated: (eventId?: number) => void) => {
    const [step, setStep] = useState<NewEventStepIndex>(0);
    const [maxStepReached, setMaxStepReached] = useState<NewEventStepIndex>(0);
    const [form, setForm] = useState<NewEventFormState>(EMPTY_NEW_EVENT_FORM);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [categories, setCategories] = useState<EventCategoryDTO[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [venues, setVenues] = useState<VenueMinDTO[]>([]);
    const [venuesLoading, setVenuesLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setCategoriesLoading(true);
        categoryService
            .listEventCategories(controller.signal)
            .then((data) => setCategories(data ?? []))
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                setCategories([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setCategoriesLoading(false);
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setVenuesLoading(true);
        venueService
            .listVenues(0, VENUE_FETCH_PAGE_SIZE, controller.signal)
            .then((data) => setVenues(data.venueMinDTOList ?? []))
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                setVenues([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setVenuesLoading(false);
            });
        return () => controller.abort();
    }, []);

    const handleFieldChange = useCallback(
        <K extends keyof NewEventFormState>(field: K, value: NewEventFormState[K]) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            setError(null);
        },
        []
    );

    const addEventDate = useCallback(() => {
        setForm((prev) => ({
            ...prev,
            eventDates: [
                ...prev.eventDates,
                { id: generateDateRowId(), startDate: "", endDate: "" },
            ],
        }));
        setError(null);
    }, []);

    const updateEventDate = useCallback(
        (id: string, field: "startDate" | "endDate", value: string) => {
            setForm((prev) => ({
                ...prev,
                eventDates: prev.eventDates.map((date) =>
                    date.id === id ? { ...date, [field]: value } : date
                ),
            }));
            setError(null);
        },
        []
    );

    const removeEventDate = useCallback((id: string) => {
        setForm((prev) => ({
            ...prev,
            eventDates: prev.eventDates.filter((date) => date.id !== id),
        }));
        setError(null);
    }, []);

    const goToStep = useCallback(
        (target: NewEventStepIndex) => {
            if (target > maxStepReached) return;
            setStep(target);
            setError(null);
        },
        [maxStepReached]
    );

    const goBack = useCallback(() => {
        setStep((prev) => (prev > 0 ? ((prev - 1) as NewEventStepIndex) : prev));
        setError(null);
    }, []);

    const goNext = useCallback(async () => {
        const validation = validateStep(step, form);
        if (!validation.isValid) {
            setError(validation.error);
            return;
        }

        if (step === 3) {
            const categoryIdNumber = Number(form.categoryId);
            const venueIdNumber = Number(form.venueId);
            const ageRestriction = Number(form.ageRestriction);
            const eventDates = form.eventDates.map((d) => ({
                startDate: normalizeDateTimeLocal(d.startDate) as string,
                endDate: normalizeDateTimeLocal(d.endDate) as string,
            }));

            const payload: CreateEventPayload = {
                title: form.title.trim(),
                description: form.description.trim(),
                categoryId: categoryIdNumber,
                venueId: venueIdNumber,
                ageRestriction,
                salesStartDate: form.salesStartDate
                    ? normalizeDateTimeLocal(form.salesStartDate)
                    : null,
                eventDates,
            };

            setIsSubmitting(true);
            setError(null);
            try {
                await newEventService.createEvent(payload);
                onCreated();
            } catch (err: unknown) {
                const message =
                    axios.isAxiosError(err) && err.response?.data?.errors?.length
                        ? err.response.data.errors.join(" ")
                        : axios.isAxiosError(err) && err.response?.status === 401
                          ? "Sessão expirada. Faça login novamente."
                          : "Não foi possível criar o evento.";
                setError(message);
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        const next = (step + 1) as NewEventStepIndex;
        setStep(next);
        setMaxStepReached((prev) => (next > prev ? next : prev));
    }, [step, form, onCreated]);

    const stepMeta = useMemo(() => NEW_EVENT_STEPS[step], [step]);

    return {
        step,
        maxStepReached,
        steps: NEW_EVENT_STEPS,
        stepMeta,
        form,
        error,
        isSubmitting,
        categories,
        categoriesLoading,
        venues,
        venuesLoading,
        handleFieldChange,
        addEventDate,
        updateEventDate,
        removeEventDate,
        goToStep,
        goBack,
        goNext,
    };
};
