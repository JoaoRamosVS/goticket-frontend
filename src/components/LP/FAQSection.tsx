import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Quanto custa usar a GoTicket?",
    answer: "Oferecemos um plano gratuito para começar, com taxas competitivas apenas sobre as vendas realizadas. Não há mensalidade ou taxa de setup. Você paga apenas quando vende ingressos.",
  },
  {
    question: "Como funciona o processo de pagamento?",
    answer: "Os pagamentos são processados de forma segura e os valores são transferidos diretamente para sua conta. Você pode acompanhar todas as transações em tempo real no painel de controle.",
  },
  {
    question: "Posso personalizar os ingressos?",
    answer: "Sim! Você pode personalizar completamente os ingressos com seu logo, cores, informações do evento e muito mais. Também oferecemos templates prontos para facilitar.",
  },
  {
    question: "A plataforma funciona em dispositivos móveis?",
    answer: "Sim! A GoTicket é totalmente responsiva e funciona perfeitamente em smartphones e tablets. Você pode gerenciar seus eventos de qualquer lugar.",
  },
  {
    question: "Como funciona o check-in no evento?",
    answer: "O check-in é super simples! Cada ingresso tem um QR code único. Basta escanear com qualquer smartphone usando nosso app ou site. O processo é rápido e não requer internet no local.",
  },
  {
    question: "Posso vender ingressos para eventos gratuitos?",
    answer: "Claro! Você pode criar eventos gratuitos sem nenhum custo. É perfeito para workshops, palestras e eventos comunitários.",
  },
  {
    question: "Há limite de eventos ou ingressos?",
    answer: "No plano gratuito, você pode criar eventos ilimitados. Para eventos maiores, oferecemos planos premium com recursos adicionais e suporte prioritário.",
  },
  {
    question: "O que acontece se meu evento for cancelado?",
    answer: "Você tem controle total sobre reembolsos. Pode configurar políticas de cancelamento e processar reembolsos diretamente pela plataforma. Nosso suporte está sempre disponível para ajudar.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            FAQ
          </Badge>
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black">
              Dúvidas{" "} 
              <span className="bg-linear-to-r from-primary via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                Frequentes
              </span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tire suas dúvidas sobre a plataforma e descubra como podemos ajudar você
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-3xl shadow-lg py-2 border border-white/30 hover:border-primary/20 transition-all ease-in-out duration-500 overflow-hidden group">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-bold pr-8 group-hover:text-primary transition-colors">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{
                          rotate: openIndex === index ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                    </div>
                  </CardContent>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0 pb-6 px-6">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;


