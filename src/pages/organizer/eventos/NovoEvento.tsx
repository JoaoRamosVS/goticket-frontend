import { ArrowLeft, ArrowRight, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { useToast } from "@/components/ui/toast";

import { StepDates } from "@/features/organizer/organizer-new-event/components/StepDates";
import { StepDetails } from "@/features/organizer/organizer-new-event/components/StepDetails";
import { StepImages } from "@/features/organizer/organizer-new-event/components/StepImages";
import { StepReview } from "@/features/organizer/organizer-new-event/components/StepReview";
import { StepVenue } from "@/features/organizer/organizer-new-event/components/StepVenue";
import { useNewOrganizerEvent } from "@/features/organizer/organizer-new-event/hooks/useNewOrganizerEvent";
import type { NewEventStepIndex } from "@/features/organizer/organizer-new-event/types/newEvent.types";

const shellClass =
    "rounded-[1.75rem] border border-white/80 bg-white/20 p-6 shadow-[0_16px_48px_-24px_rgba(0,51,77,0.35)] backdrop-blur-2xl sm:p-8";

const stepNavButtonBase =
    "flex min-w-[140px] flex-1 flex-col rounded-2xl px-3 py-2.5 text-left transition-all duration-200 backdrop-blur-xl";

function stepNavButtonClass(
    isActive: boolean,
    isDone: boolean,
    clickable: boolean
): string {
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

const OrganizerNovoEvento = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const flow = useNewOrganizerEvent((eventId) => {
        showToast({
            type: "success",
            message: "Evento enviado para aprovação. Configure os setores e lotes agora.",
        });
        navigate(`/organizer/eventos/${eventId}/configurar`);
    });

    const handleVoltar = () => {
        if (flow.step === 0) {
            navigate("/organizer/eventos");
            return;
        }
        flow.goBack();
    };

    const nextLabel =
        flow.step === 4 ? "Enviar para aprovação" : "Continuar";
    const NextIcon = flow.step === 4 ? Send : ArrowRight;

    return (
        <div className="pb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/organizer/eventos")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-white/75 bg-white/55 px-3 py-1.5 text-xs font-bold text-[#00334d] shadow-[0_6px_20px_-10px_rgba(42,143,212,0.35)] backdrop-blur-xl transition-all duration-200 hover:scale-[0.98] hover:bg-white hover:shadow-lg"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para meus eventos
                </button>
            </div>

            <AdminPageHeader
                icon={Sparkles}
                title="Novo evento"
                description="Cadastro em etapas — os dados são enviados para curadoria e ficam em PENDING_APPROVAL."
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
                    {flow.steps.map((meta) => {
                        const i = meta.id as NewEventStepIndex;
                        const isActive = flow.step === i;
                        const isDone = i < flow.step;
                        const clickable = i <= flow.maxStepReached;
                        return (
                            <button
                                key={meta.id}
                                type="button"
                                disabled={!clickable}
                                onClick={() => clickable && flow.goToStep(i)}
                                className={stepNavButtonClass(
                                    isActive,
                                    isDone,
                                    clickable
                                )}
                            >
                                <span
                                    className={`text-[12px] font-bold uppercase ${
                                        isActive ? "text-white" : "text-[#5e6c87]"
                                    }`}
                                >
                                    {meta.id + 1} · {meta.title}
                                </span>
                                <span
                                    className={`mt-0.5 line-clamp-2 text-[10px] font-medium ${
                                        isActive ? "text-accent" : "text-[#5e6c87]"
                                    }`}
                                >
                                    {meta.subtitle}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#00334d]">
                        {flow.stepMeta.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#5e6c87]">
                        {flow.stepMeta.subtitle}
                    </p>
                </div>

                {flow.error && (
                    <div
                        className="mb-6 rounded-2xl border border-red-200/90 bg-red-50/75 px-4 py-3 text-sm font-semibold text-red-700 backdrop-blur-xl"
                        style={{
                            boxShadow:
                                "0 8px 28px -12px rgba(180,40,40,0.25), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                        }}
                    >
                        {flow.error}
                    </div>
                )}

                <div className="min-h-[280px]">
                    {flow.step === 0 && (
                        <StepDetails
                            form={flow.form}
                            categories={flow.categories}
                            categoriesLoading={flow.categoriesLoading}
                            onChange={flow.handleFieldChange}
                        />
                    )}
                    {flow.step === 1 && (
                        <StepVenue
                            form={flow.form}
                            venues={flow.venues}
                            venuesLoading={flow.venuesLoading}
                            onChange={flow.handleFieldChange}
                        />
                    )}
                    {flow.step === 2 && (
                        <StepDates
                            form={flow.form}
                            onAdd={flow.addEventDate}
                            onUpdate={flow.updateEventDate}
                            onRemove={flow.removeEventDate}
                        />
                    )}
                    {flow.step === 3 && (
                        <StepImages
                            images={flow.images}
                            onAdd={flow.addImages}
                            onRemove={flow.removeImage}
                            onMove={flow.moveImage}
                        />
                    )}
                    {flow.step === 4 && (
                        <StepReview
                            form={flow.form}
                            categories={flow.categories}
                            venues={flow.venues}
                            images={flow.images}
                        />
                    )}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/50 pt-6">
                    <button
                        type="button"
                        onClick={handleVoltar}
                        className={`cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-white/50 px-5 py-2.5 text-sm font-bold text-[#00334d] shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-[0.98] hover:bg-white ${
                            flow.step === 0
                                ? "bg-linear-to-r from-red-500 to-red-700 text-white"
                                : ""
                        }`}
                    >
                        <ArrowLeft className="size-4" strokeWidth={3} />
                        {flow.step === 0 ? "Sair" : "Etapa anterior"}
                    </button>
                    <button
                        type="button"
                        onClick={() => void flow.goNext()}
                        disabled={flow.isSubmitting}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[0.98] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-45"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 10px 28px -8px rgba(42,143,212,0.55), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                    >
                        {flow.isSubmitting ? "Enviando..." : nextLabel}
                        {!flow.isSubmitting && (
                            <NextIcon className="size-4" strokeWidth={3} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizerNovoEvento;
