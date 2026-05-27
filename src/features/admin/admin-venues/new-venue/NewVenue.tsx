import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { useNewVenue } from "@/features/admin/admin-venues/new-venue/hooks/useNewVenue";
import type { NewVenueStepIndex } from "@/features/admin/admin-venues/new-venue/types/newVenue.types";
import { StepAddress } from "@/features/admin/admin-venues/new-venue/components/StepAddress";
import { StepIdentification } from "@/features/admin/admin-venues/new-venue/components/StepIdentification";
import { StepVenueMapSvg } from "@/features/admin/admin-venues/new-venue/components/StepVenueMapSvg";
import { StepOrganizer } from "@/features/admin/admin-venues/new-venue/components/StepOrganizer";
import { StepSectors } from "@/features/admin/admin-venues/new-venue/components/StepSectors";

const shellClass =
    "rounded-[1.75rem] border border-white/80 bg-white/20 p-6 shadow-[0_16px_48px_-24px_rgba(0,51,77,0.35)] backdrop-blur-2xl sm:p-8";

const stepNavButtonBase =
    "flex min-w-[140px] flex-1 flex-col rounded-2xl px-3 py-2.5 text-left transition-all duration-200 backdrop-blur-xl";

function stepNavButtonClass(isActive: boolean, isDone: boolean, clickable: boolean): string {
    if (isActive) {
        return `${stepNavButtonBase} bg-gradient-to-r from-[#2a8fd4] to-[#1c6fb5] shadow-[0_10px_32px_-14px_rgba(42,143,212,0.45)]`;
    }
    if (isDone) {
        return `${stepNavButtonBase} bg-accent/55 hover:scale-[0.99] shadow-xs`;
    }
    if (clickable) {
        return `${stepNavButtonBase} bg-white/30 hover:scale-[0.99] hover:bg-white/50`;
    }
    return `${stepNavButtonBase} cursor-not-allowed border-white/40 bg-black/5 opacity-35`;
}

export default function NewVenue() {
    const navigate = useNavigate();
    const venueFlow = useNewVenue();

    const handleVoltar = () => {
        venueFlow.setError(null);
        if (venueFlow.step === 0) {
            navigate("/admin/espacos");
            return;
        }
        venueFlow.goBack();
    };

    const nextLabel =
        venueFlow.step === 2
            ? venueFlow.createdVenue
                ? "Continuar para setores"
                : "Criar espaço e continuar"
            : venueFlow.step === 3
              ? "Salvar setores e abrir mapa"
              : "Continuar";

    return (
        <div className="pb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/admin/espacos")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-white/75 bg-white/55 px-3 py-1.5 text-xs font-bold text-[#00334d] shadow-[0_6px_20px_-10px_rgba(42,143,212,0.35)] backdrop-blur-xl transition-all duration-200 hover:scale-[0.98] hover:bg-white hover:shadow-lg"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Lista de espaços
                </button>
            </div>

            <AdminPageHeader
                icon={Layers}
                title="Novo espaço"
                description="Cadastro em etapas — dados, setores e mapa SVG interativo."
            />

            <div
                className={shellClass}
                style={{
                    boxShadow:
                        "0 20px 60px -28px rgba(28,111,181,0.4), inset 0 1px 0 0 rgba(255,255,255,0.9)",
                }}
            >
                <nav
                    className="mb-8 flex flex-wrap gap-2"
                    aria-label="Etapas do cadastro"
                >
                    {venueFlow.steps.map((meta, index) => {
                        const i = index as NewVenueStepIndex;
                        const isActive = venueFlow.step === i;
                        const isDone = i < venueFlow.step;
                        const clickable = i <= venueFlow.maxStepReached;
                        return (
                            <button
                                key={meta.id}
                                type="button"
                                disabled={!clickable}
                                onClick={() => clickable && venueFlow.goToStep(i)}
                                className={stepNavButtonClass(isActive, isDone, clickable)}
                            >
                                <span
                                    className={`text-[12px] font-bold uppercase ${
                                        isActive ? "text-white" : "text-[#5e6c87]"
                                    }`}
                                >
                                    {index + 1} · {meta.title}
                                </span>
                                <span className={`mt-0.5 line-clamp-2 text-[10px] font-medium ${isActive ? "text-accent" : "text-[#5e6c87]"}`}>
                                     {meta.subtitle}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#00334d]">{venueFlow.stepMeta.title}</h2>
                    <p className="mt-1 text-sm text-[#5e6c87]">{venueFlow.stepMeta.subtitle}</p>
                </div>

                {venueFlow.error && (
                    <div
                        className="mb-6 rounded-2xl border border-red-200/90 bg-red-50/75 px-4 py-3 text-sm font-semibold text-red-700 backdrop-blur-xl"
                        style={{
                            boxShadow:
                                "0 8px 28px -12px rgba(180,40,40,0.25), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                        }}
                    >
                        {venueFlow.error}
                    </div>
                )}

                <div className="min-h-[200px]">
                    {venueFlow.step === 0 && (
                        <StepIdentification form={venueFlow.form} onChange={venueFlow.handleFieldChange} />
                    )}
                    {venueFlow.step === 1 && (
                        <StepAddress
                            form={venueFlow.form}
                            isCepLoading={venueFlow.isCepLoading}
                            cepError={venueFlow.cepError}
                            onChange={venueFlow.handleFieldChange}
                        />
                    )}
                    {venueFlow.step === 2 && (
                        <StepOrganizer
                            form={venueFlow.form}
                            organizers={venueFlow.organizers}
                            organizersLoading={venueFlow.organizersLoading}
                            createdVenue={venueFlow.createdVenue}
                            onChange={venueFlow.handleFieldChange}
                        />
                    )}
                    {venueFlow.step === 3 && (
                        <StepSectors
                            sectors={venueFlow.draftSectors}
                            onAdd={venueFlow.addDraftSector}
                            onRemove={venueFlow.removeDraftSector}
                            onUpdate={venueFlow.updateDraftSector}
                        />
                    )}
                    {venueFlow.step === 4 && venueFlow.createdVenue && (
                        <StepVenueMapSvg
                            venueId={venueFlow.createdVenue.venueId}
                            venue={venueFlow.venueForMap ?? venueFlow.createdVenue}
                            mapCompleted={venueFlow.mapCompleted}
                            onMapSaved={venueFlow.onMapSaved}
                        />
                    )}
                </div>

                {venueFlow.step < 4 && (
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/50 pt-6">
                        <button
                            type="button"
                            onClick={handleVoltar}
                            className={`cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-white/50 px-5 py-2.5 text-sm font-bold text-[#00334d] shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-[0.98] hover:bg-white 
                                ${venueFlow.step === 0 ? "bg-linear-to-r from-red-500 to-red-700 text-white" : ""}
                            `}
                        >
                            <ArrowLeft className="size-4" strokeWidth={3} />
                            {venueFlow.step === 0 ? "Sair" : "Etapa anterior"}
                        </button>
                        <button
                            type="button"
                            onClick={() => void venueFlow.goNext()}
                            disabled={
                                venueFlow.isSubmitting ||
                                (venueFlow.step === 2 && venueFlow.organizersLoading && !venueFlow.createdVenue)
                            }
                            className="cursor-pointer inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[0.98] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-45"
                            style={{
                                background:
                                    "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                boxShadow:
                                    "0 10px 28px -8px rgba(42,143,212,0.55), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                            }}
                        >
                            {venueFlow.isSubmitting ? "Processando..." : nextLabel}
                            {!venueFlow.isSubmitting && <ArrowRight className="size-4" strokeWidth={3} />}
                        </button>
                    </div>
                )}

                {venueFlow.step === 4 && (
                    <div className="mt-8 flex flex-wrap justify-start border-t border-white/50 pt-6">
                        <button
                            type="button"
                            onClick={handleVoltar}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/50 px-5 py-2.5 text-sm font-bold text-[#00334d] shadow-md backdrop-blur-xl transition-all duration-200 hover:scale-[0.98] hover:bg-white"
                        >
                            <ArrowLeft className="size-4" />
                            Voltar aos setores
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
