import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/toast";

import venueService from "@/features/admin/admin-venues/services/venue.service";
import type { UpdateVenuePayload, VenueDetailDTO } from "@/features/admin/admin-venues/types/venue.types";
import { maskCnpj, maskCep, stripMask } from "@/utils/validation";
import { fetchCep } from "@/services/cep.service";

type StatusValue = "ACTIVE" | "INACTIVE";

type FormState = {
    name: string;
    legalName: string;
    CNPJ: string;
    description: string;
    streetAddress: string;
    streetAddressNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
};

const EMPTY_FORM: FormState = {
    name: "",
    legalName: "",
    CNPJ: "",
    description: "",
    streetAddress: "",
    streetAddressNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
};

type MaskFn = (value: string) => string;

const FIELD_MASKS: Partial<Record<keyof FormState, MaskFn>> = {
    CNPJ: maskCnpj,
    zipCode: maskCep,
};

const STATUS_OPTIONS: Record<
    StatusValue,
    { statusId: number; name: StatusValue }
> = {
    ACTIVE: { statusId: 1, name: "ACTIVE" },
    INACTIVE: { statusId: 2, name: "INACTIVE" },
};

function venueToFormState(venue: VenueDetailDTO): FormState {
    return {
        name: venue.name ?? "",
        legalName: venue.legalName ?? "",
        CNPJ: maskCnpj(venue.CNPJ ?? ""),
        description: venue.description ?? "",
        streetAddress: venue.streetAddress ?? "",
        streetAddressNumber: venue.streetAddressNumber ?? "",
        neighborhood: venue.neighborhood ?? "",
        city: venue.city ?? "",
        state: venue.state ?? "",
        country: venue.country ?? "",
        zipCode: maskCep(venue.zipCode ?? ""),
    };
}

function normalizeOptional(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
}

function buildPatchPayload(
    form: FormState,
    original: VenueDetailDTO
): UpdateVenuePayload {
    const payload: UpdateVenuePayload = {};

    if (form.name.trim() !== (original.name ?? "")) {
        payload.name = form.name.trim();
    }
    if (form.legalName.trim() !== (original.legalName ?? "")) {
        payload.legalName = form.legalName.trim();
    }
    const rawCnpj = stripMask(form.CNPJ);
    if (rawCnpj !== (original.CNPJ ?? "")) {
        payload.CNPJ = rawCnpj;
    }

    const nextDescription = normalizeOptional(form.description);
    const currentDescription = original.description ?? null;
    if (nextDescription !== currentDescription) {
        payload.description = nextDescription;
    }

    const addressFields: Array<
        keyof Pick<
            FormState,
            | "streetAddress"
            | "streetAddressNumber"
            | "neighborhood"
            | "city"
            | "state"
            | "country"
            | "zipCode"
        >
    > = [
        "streetAddress",
        "streetAddressNumber",
        "neighborhood",
        "city",
        "state",
        "country",
        "zipCode",
    ];

    addressFields.forEach((field) => {
        const raw = field === "zipCode" ? stripMask(form[field]) : form[field];
        const next = raw.trim();
        const current = (original[field] as string | null) ?? "";
        if (next !== current) {
            (payload as Record<string, unknown>)[field] = next;
        }
    });

    return payload;
}

function getAxiosErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as
            | { message?: string; error?: string; errors?: string[] }
            | undefined;
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
            return data.errors.join(" · ");
        }
        return data?.message ?? data?.error ?? err.message ?? fallback;
    }
    return fallback;
}

export const useVenueForm = (venueId?: string) => {
    const { showToast } = useToast();
    const [venue, setVenue] = useState<VenueDetailDTO | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const fetchVenue = useCallback(
        (signal?: AbortSignal) => {
            if (!venueId) return;
            setIsLoading(true);
            setError(null);

            return venueService
                .getVenueById(venueId, signal)
                .then((data) => {
                    setVenue(data);
                    setForm(venueToFormState(data));
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    setError(
                        getAxiosErrorMessage(err, "Espaço não encontrado.")
                    );
                    setVenue(null);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        [venueId]
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchVenue(controller.signal);
        return () => controller.abort();
    }, [fetchVenue]);

    const patchPayload = useMemo(() => {
        if (!venue) return {};
        return buildPatchPayload(form, venue);
    }, [form, venue]);

    const hasChanges = Object.keys(patchPayload).length > 0;

    const fetchAndFillAddress = useCallback(async (digits: string) => {
        setIsCepLoading(true);
        setCepError(null);
        const result = await fetchCep(digits);
        setIsCepLoading(false);
        if (!result) {
            setCepError("CEP não encontrado.");
            return;
        }
        setForm((prev) => ({
            ...prev,
            streetAddress: result.streetAddress || prev.streetAddress,
            neighborhood: result.neighborhood || prev.neighborhood,
            city: result.city || prev.city,
            state: result.state || prev.state,
        }));
    }, []);

    const handleFieldChange =
        <K extends keyof FormState>(field: K) =>
        (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
            const maskFn = FIELD_MASKS[field];
            const value = maskFn ? maskFn(e.target.value) : e.target.value;
            setForm((prev) => ({ ...prev, [field]: value }));

            if (field === "zipCode") {
                const digits = stripMask(value);
                if (digits.length === 8) {
                    fetchAndFillAddress(digits);
                } else {
                    setCepError(null);
                }
            }
        };

    const handleSave = async () => {
        if (!venue || !venueId || !hasChanges) return;
        setIsSaving(true);
        setError(null);
        try {
            const updated = await venueService.updateVenue(
                venueId,
                patchPayload
            );
            setVenue(updated);
            setForm(venueToFormState(updated));
            showToast({ type: "success", message: "Espaço atualizado com sucesso." });
        } catch (err) {
            const message = getAxiosErrorMessage(
                err,
                "Não foi possível atualizar o espaço."
            );
            setError(message);
            showToast({ type: "error", message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (venue) setForm(venueToFormState(venue));
    };

    const handleToggleStatus = async (next: StatusValue) => {
        if (!venue || !venueId) return;
        if (venue.status?.name === next) return;

        setIsTogglingStatus(true);
        setError(null);
        try {
            const updated = await venueService.updateVenue(venueId, {
                status: STATUS_OPTIONS[next],
            });
            setVenue(updated);
            setForm(venueToFormState(updated));
            showToast({
                type: "update",
                message:
                    next === "ACTIVE" ? "Espaço ativado." : "Espaço desativado.",
            });
        } catch (err) {
            const message = getAxiosErrorMessage(
                err,
                "Não foi possível alterar o status."
            );
            setError(message);
            showToast({ type: "error", message });
        } finally {
            setIsTogglingStatus(false);
        }
    };

    return {
        venue,
        form,
        isLoading,
        isSaving,
        isTogglingStatus,
        isCepLoading,
        cepError,
        error,
        hasChanges,
        handleFieldChange,
        handleSave,
        handleReset,
        handleToggleStatus,
    };
};
