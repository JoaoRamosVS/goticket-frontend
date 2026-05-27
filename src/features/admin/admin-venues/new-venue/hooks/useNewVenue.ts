import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import venueService from "@/features/admin/admin-venues/services/venue.service";
import type { UpsertVenueSectorDTO } from "@/features/admin/admin-venues/types/venue.types";
import type { VenueDetailDTO } from "@/features/admin/admin-venues/types/venue.types";
import type { OrganizerMinDTO } from "@/features/admin/admin-organizers/types/organizer.types";
import {
    EMPTY_NEW_VENUE_FORM,
    NEW_VENUE_STEPS,
    type NewVenueDraftSector,
    type NewVenueFormState,
    type NewVenueStepIndex,
} from "@/features/admin/admin-venues/new-venue/types/newVenue.types";
import {
    findVenueByCnpjForNewVenue,
    listOrganizersForNewVenue,
    persistNewVenue,
    refreshVenueDetail,
} from "@/features/admin/admin-venues/new-venue/services/newVenue.service";
import { normalizeCnpjDigits } from "@/features/admin/admin-venues/new-venue/utils/cnpj";
import { maskCnpj, maskCep, stripMask } from "@/utils/validation";
import { fetchCep } from "@/services/cep.service";

type MaskFn = (value: string) => string;

const FIELD_MASKS: Partial<Record<keyof NewVenueFormState, MaskFn>> = {
    CNPJ: maskCnpj,
    zipCode: maskCep,
};

function newDraftSector(index: number): NewVenueDraftSector {
    const slug = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    return {
        key: crypto.randomUUID(),
        name: `Setor ${index + 1}`,
        description: "Descrição do setor",
        maxCapacity: 100,
        mapElementId: `poly-${slug}`,
    };
}

function axiosMessage(err: unknown, fallback: string): string {
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

export function useNewVenue() {
    const [step, setStep] = useState<NewVenueStepIndex>(0);
    const [maxStepReached, setMaxStepReached] = useState<NewVenueStepIndex>(0);

    const [form, setForm] = useState<NewVenueFormState>(EMPTY_NEW_VENUE_FORM);
    const [organizers, setOrganizers] = useState<OrganizerMinDTO[]>([]);
    const [organizersLoading, setOrganizersLoading] = useState(true);

    const [createdVenue, setCreatedVenue] = useState<VenueDetailDTO | null>(null);
    const [draftSectors, setDraftSectors] = useState<NewVenueDraftSector[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);

    const [mapCompleted, setMapCompleted] = useState(false);
    const [venueForMap, setVenueForMap] = useState<VenueDetailDTO | null>(null);

    useEffect(() => {
        const ac = new AbortController();
        setOrganizersLoading(true);
        listOrganizersForNewVenue(ac.signal)
            .then(setOrganizers)
            .catch(() => {
                if (!ac.signal.aborted) {
                    setError("Não foi possível carregar organizadores.");
                }
            })
            .finally(() => {
                if (!ac.signal.aborted) setOrganizersLoading(false);
            });
        return () => ac.abort();
    }, []);

    const bumpMax = useCallback((next: NewVenueStepIndex) => {
        setMaxStepReached((prev) => (next > prev ? next : prev));
    }, []);

    const validateStep = useCallback(
        (s: NewVenueStepIndex): string | null => {
            if (s === 0) {
                if (!form.name.trim()) return "Informe o nome fantasia.";
                if (!form.legalName.trim()) return "Informe a razão social.";
                const cnpj = normalizeCnpjDigits(form.CNPJ);
                if (cnpj.length !== 14) return "CNPJ deve conter 14 dígitos.";
            }
            if (s === 1) {
                const req: (keyof NewVenueFormState)[] = [
                    "streetAddress",
                    "streetAddressNumber",
                    "neighborhood",
                    "city",
                    "state",
                    "country",
                    "zipCode",
                ];
                for (const k of req) {
                    if (!form[k].trim()) return "Preencha todos os campos de endereço.";
                }
            }
            if (s === 2) {
                if (!form.organizerId.trim()) return "Selecione um organizador.";
            }
            if (s === 3) {
                if (draftSectors.length === 0) return "Adicione ao menos um setor.";
                for (const sec of draftSectors) {
                    if (!sec.name.trim()) return "Cada setor precisa de um nome.";
                    if (!sec.mapElementId.trim()) return "Cada setor precisa de um ID de mapa.";
                    if (sec.maxCapacity < 1) return "Capacidade mínima de 1 por setor.";
                }
            }
            return null;
        },
        [form, draftSectors]
    );

    const syncSectorsFromApi = useCallback(
        async (venueId: number, signal?: AbortSignal) => {
            const rows = await venueService.listVenueSectors(venueId, signal);
            if (signal?.aborted) return;
            if (rows.length === 0) {
                setDraftSectors([newDraftSector(0)]);
                return;
            }
            setDraftSectors(
                rows.map((r) => ({
                    key: crypto.randomUUID(),
                    name: r.name,
                    description: r.description,
                    maxCapacity: r.maxCapacity,
                    mapElementId: r.mapElementId?.trim() || `poly-${r.sectorId}`,
                }))
            );
        },
        []
    );

    useEffect(() => {
        if (step !== 3 || !createdVenue) return;
        const ac = new AbortController();
        syncSectorsFromApi(createdVenue.venueId, ac.signal).catch(() => {
            if (!ac.signal.aborted) {
                setDraftSectors((prev) => (prev.length > 0 ? prev : [newDraftSector(0)]));
            }
        });
        return () => ac.abort();
    }, [step, createdVenue?.venueId, syncSectorsFromApi]);

    useEffect(() => {
        if (step === 4 && createdVenue) {
            const ac = new AbortController();
            refreshVenueDetail(createdVenue.venueId, ac.signal)
                .then(setVenueForMap)
                .catch(() => {
                    if (!ac.signal.aborted) setVenueForMap(createdVenue);
                });
            return () => ac.abort();
        }
        return undefined;
    }, [step, createdVenue]);

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
        <K extends keyof NewVenueFormState>(field: K) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const goToStep = useCallback(
        (target: NewVenueStepIndex) => {
            if (target > maxStepReached) return;
            if (target >= 3 && !createdVenue) {
                setError("Referência do espaço não encontrada. Volte ao organizador e continue novamente.");
                setStep(2);
                return;
            }
            setError(null);
            setStep(target);
        },
        [maxStepReached, createdVenue]
    );

    const goBack = useCallback(() => {
        setError(null);
        setStep((s) => (s > 0 ? ((s - 1) as NewVenueStepIndex) : s));
    }, []);

    const goNext = useCallback(async () => {
        const err = validateStep(step);
        if (err) {
            setError(err);
            return;
        }
        setError(null);

        if (step === 2) {
            setIsSubmitting(true);
            try {
                let venue = createdVenue;
                if (!createdVenue) {
                    const payload = {
                        name: form.name.trim(),
                        legalName: form.legalName.trim(),
                        CNPJ: normalizeCnpjDigits(form.CNPJ),
                        description: form.description.trim(),
                        streetAddress: form.streetAddress.trim(),
                        streetAddressNumber: form.streetAddressNumber.trim(),
                        neighborhood: form.neighborhood.trim(),
                        city: form.city.trim(),
                        state: form.state.trim(),
                        country: form.country.trim(),
                        zipCode: form.zipCode.trim(),
                        organizerId: form.organizerId.trim(),
                    };
                    venue = await persistNewVenue(payload);
                }
                if (!venue?.venueId) {
                    throw new Error("Não foi possível obter o identificador do espaço criado.");
                }
                setCreatedVenue(venue);
                const next = 3 as NewVenueStepIndex;
                setStep(next);
                bumpMax(next);
            } catch (e) {
                const message = axiosMessage(e, "Não foi possível criar o espaço.");
                const isDuplicateCnpj =
                    message.toLowerCase().includes("cnpj") &&
                    message.toLowerCase().includes("já está cadastrado");

                if (isDuplicateCnpj) {
                    try {
                        const recoveredVenue = await findVenueByCnpjForNewVenue(form.CNPJ);
                        if (recoveredVenue?.venueId) {
                            setCreatedVenue(recoveredVenue);
                            const next = 3 as NewVenueStepIndex;
                            setStep(next);
                            bumpMax(next);
                            setError("Espaço já existente recuperado. Continue para cadastrar setores e mapa.");
                            return;
                        }
                    } catch {
                        // mantém tratamento padrão abaixo
                    }
                }
                setError(axiosMessage(e, "Não foi possível criar o espaço."));
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        if (step === 3) {
            if (!createdVenue) {
                setError("Espaço ainda não foi criado.");
                return;
            }
            setIsSubmitting(true);
            try {
                const sectorsPayload: UpsertVenueSectorDTO[] = draftSectors.map((d) => ({
                    name: d.name.trim(),
                    description: d.description.trim(),
                    maxCapacity: d.maxCapacity,
                    mapElementId: d.mapElementId.trim(),
                }));
                await venueService.replaceVenueSectors(createdVenue.venueId, sectorsPayload);
                const refreshed = await refreshVenueDetail(createdVenue.venueId);
                setCreatedVenue(refreshed);
                const next = 4 as NewVenueStepIndex;
                setStep(next);
                bumpMax(next);
                setMapCompleted(false);
            } catch (e) {
                setError(axiosMessage(e, "Não foi possível salvar os setores."));
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        if (step < 4) {
            const next = (step + 1) as NewVenueStepIndex;
            setStep(next);
            bumpMax(next);
        }
    }, [step, validateStep, form, createdVenue, draftSectors, bumpMax]);

    const addDraftSector = useCallback(() => {
        setDraftSectors((prev) => [...prev, newDraftSector(prev.length)]);
    }, []);

    const removeDraftSector = useCallback((key: string) => {
        setDraftSectors((prev) => prev.filter((s) => s.key !== key));
    }, []);

    const updateDraftSector = useCallback((key: string, patch: Partial<NewVenueDraftSector>) => {
        setDraftSectors((prev) =>
            prev.map((s) => (s.key === key ? { ...s, ...patch } : s))
        );
    }, []);

    const onMapSaved = useCallback(() => {
        setMapCompleted(true);
        if (createdVenue) {
            void refreshVenueDetail(createdVenue.venueId).then(setCreatedVenue);
        }
    }, [createdVenue]);

    const stepMeta = useMemo(() => NEW_VENUE_STEPS[step], [step]);

    return {
        step,
        maxStepReached,
        stepMeta,
        steps: NEW_VENUE_STEPS,
        form,
        handleFieldChange,
        organizers,
        organizersLoading,
        createdVenue,
        draftSectors,
        addDraftSector,
        removeDraftSector,
        updateDraftSector,
        isSubmitting,
        error,
        setError,
        isCepLoading,
        cepError,
        goBack,
        goNext,
        goToStep,
        mapCompleted,
        venueForMap,
        onMapSaved,
    };
}
