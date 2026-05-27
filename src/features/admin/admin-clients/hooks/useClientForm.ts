import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import clientService from "@/features/admin/admin-clients/services/client.service";
import { useToast } from "@/components/ui/toast";
import type {
    ClientDetailDTO,
    StatusValue,
    UpdateClientPayload,
} from "@/features/admin/admin-clients/types/client.types";
import { maskCpf, maskCep, stripMask } from "@/utils/validation";
import { fetchCep } from "@/services/cep.service";

type FormState = {
    email: string;
    fullName: string;
    sex: string;
    identityDocument: string;
    birthDate: string;
    streetAddress: string;
    streetAddressNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
};

const EMPTY_FORM: FormState = {
    email: "",
    fullName: "",
    sex: "1",
    identityDocument: "",
    birthDate: "",
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
    identityDocument: maskCpf,
    zipCode: maskCep,
};

const STATUS_OPTIONS: Record<StatusValue, { statusId: number; name: StatusValue }> = {
    ACTIVE: { statusId: 1, name: "ACTIVE" },
    INACTIVE: { statusId: 2, name: "INACTIVE" },
};

function clientToFormState(client: ClientDetailDTO): FormState {
    return {
        email: client.email ?? "",
        fullName: client.fullName ?? "",
        sex: String(client.sex ?? 1),
        identityDocument: maskCpf(client.identityDocument ?? ""),
        birthDate: client.birthDate ?? "",
        streetAddress: client.streetAddress ?? "",
        streetAddressNumber: client.streetAddressNumber ?? "",
        neighborhood: client.neighborhood ?? "",
        city: client.city ?? "",
        state: client.state ?? "",
        country: client.country ?? "",
        zipCode: maskCep(client.zipCode ?? ""),
    };
}

function normalizeOptional(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
}

function buildPatchPayload(
    form: FormState,
    original: ClientDetailDTO
): UpdateClientPayload {
    const payload: UpdateClientPayload = {};

    if (form.email.trim() !== (original.email ?? "")) {
        payload.email = form.email.trim();
    }
    if (form.fullName.trim() !== (original.fullName ?? "")) {
        payload.fullName = form.fullName.trim();
    }

    const sexValue = Number(form.sex);
    if (Number.isFinite(sexValue) && sexValue !== original.sex) {
        payload.sex = sexValue;
    }

    const rawDoc = stripMask(form.identityDocument);
    if (rawDoc !== (original.identityDocument ?? "")) {
        payload.identityDocument = rawDoc;
    }

    if (form.birthDate !== (original.birthDate ?? "")) {
        payload.birthDate = form.birthDate;
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
        const next = normalizeOptional(raw);
        const current = (original[field] as string | null) ?? null;
        if (next !== current) {
            (payload as Record<string, unknown>)[field] = next;
        }
    });

    return payload;
}

function getAxiosErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as
            | { message?: string; error?: string }
            | undefined;
        return data?.message ?? data?.error ?? err.message ?? fallback;
    }
    return fallback;
}

export const useClientForm = (clientId?: string) => {
    const { showToast } = useToast();
    const [client, setClient] = useState<ClientDetailDTO | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const fetchClient = useCallback(
        (signal?: AbortSignal) => {
            if (!clientId) return;
            setIsLoading(true);
            setError(null);

            return clientService
                .getClientById(clientId, signal)
                .then((data) => {
                    setClient(data);
                    setForm(clientToFormState(data));
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    setError(
                        getAxiosErrorMessage(err, "Cliente não encontrado.")
                    );
                    setClient(null);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        [clientId]
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchClient(controller.signal);
        return () => controller.abort();
    }, [fetchClient]);

    const patchPayload = useMemo(() => {
        if (!client) return {};
        return buildPatchPayload(form, client);
    }, [form, client]);

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
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        if (!client || !clientId || !hasChanges) return;
        setIsSaving(true);
        setError(null);
        try {
            const updated = await clientService.updateClient(
                clientId,
                patchPayload
            );
            setClient(updated);
            setForm(clientToFormState(updated));
            showToast({ type: "success", message: "Cliente atualizado com sucesso." });
        } catch (err) {
            const message = getAxiosErrorMessage(
                err,
                "Não foi possível atualizar o cliente."
            );
            setError(message);
            showToast({ type: "error", message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (client) setForm(clientToFormState(client));
    };

    const handleToggleStatus = async (next: StatusValue) => {
        if (!client || !clientId) return;
        if (client.status?.name === next) return;

        setIsTogglingStatus(true);
        setError(null);
        try {
            const updated = await clientService.updateClient(clientId, {
                status: STATUS_OPTIONS[next],
            });
            setClient(updated);
            setForm(clientToFormState(updated));
            showToast({
                type: "update",
                message:
                    next === "ACTIVE" ? "Cliente reativado." : "Cliente desativado.",
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
        client,
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
