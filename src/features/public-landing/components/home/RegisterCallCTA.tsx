import { ArrowRight } from "lucide-react";

const RegisterCallCTA = () => {
    return (
        <section className="relative w-full px-4 py-8 sm:py-16">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(87,197,244,0.09) 0%, rgba(159,210,234,0.04) 50%, transparent 80%)",
                }}
            />

            <div
                className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-[48px] border border-white/60 bg-white/30 px-8 text-center backdrop-blur-2xl sm:gap-4 sm:rounded-[64px] sm:px-16"
            >
                <h2 className="text-2xl font-extrabold sm:text-3xl md:text-5xl">
                    Transforme seus Eventos!
                </h2>

                <p className="max-w-md text-base text-[#5e6c87] sm:text-lg">
                    Comece a vender ingressos online com facilidade
                </p>

                <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-2xl sm:px-8 sm:py-3 sm:text-xl mt-8"
                    style={{
                        background:
                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                        boxShadow:
                            "0 6px 20px -4px rgba(42,143,212,0.45), 0 2px 6px rgba(42,143,212,0.2)",
                    }}
                >
                    Criar conta gratuita
                    <ArrowRight className="size-5" />
                </button>
            </div>
        </section>
    );
};

export default RegisterCallCTA;
