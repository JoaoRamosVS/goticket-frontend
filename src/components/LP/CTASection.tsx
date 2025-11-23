import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      {/* Background gradient from transparent to blue */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-primary/60" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <Card className="bg-card/60 backdrop-blur-3xl border border-white/30 p-12 md:p-16 relative shadow-xl rounded-[50px]">
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <Rocket className="w-16 h-16 text-primary relative z-10" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
            >
              E ai, tá pronto para{" "}
              <span className="bg-linear-to-r from-primary via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                transformar
              </span>{" "}
              seus eventos?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Junte-se a milhares de organizadores que já estão criando eventos incríveis com a GoTicket.
              Comece grátis hoje mesmo!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                className="rounded-full text-xl px-8 py-6 bg-linear-to-r from-primary to-[#2959b9] hover:scale-95 text-white border-0 shadow-2xl hover:shadow-primary/50 transition-all"
              >
                <Link to="/cadastro">
                  Criar conta gratuita
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full text-xl px-8 py-6 hover:scale-105 transition-all"
              >
                <Link to="/login">
                  Já tenho uma conta
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Setup em 2 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Suporte 24/7</span>
              </div>
            </motion.div>
          </div>
        </Card>
      </div>
    </section>
  );
};

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default CTASection;

