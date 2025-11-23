import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Calendar, 
  Ticket, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crie sua conta",
    description: "Cadastre-se em menos de 2 minutos. Não precisa de cartão de crédito para começar.",
    color: "from-primary to-cyan-400",
    hoverColorClass: "primary",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Configure seu evento",
    description: "Adicione detalhes, datas, preços e configure tudo do seu jeito. Interface super intuitiva.",
    color: "from-purple-400 to-pink-400",
    hoverColorClass: "purple-400",
  },
  {
    number: "03",
    icon: Ticket,
    title: "Compartilhe e venda",
    description: "Gere links únicos, compartilhe nas redes sociais e comece a vender ingressos imediatamente.",
    color: "from-blue-400 to-indigo-400",
    hoverColorClass: "blue-400",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Gerencie e analise",
    description: "Acompanhe vendas em tempo real, faça check-ins rápidos e analise o desempenho do seu evento.",
    color: "from-green-400 to-emerald-400",
    hoverColorClass: "green-400",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Como Funciona
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Simples como{" "}
            <span className="bg-linear-to-r from-primary via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              1, 2, 3, 4
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Em poucos minutos você está pronto para criar e vender ingressos para seu evento
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            // Mapear hoverColorClass para classes completas do Tailwind
            const getHoverClasses = (colorClass: string) => {
              const classMap: Record<string, {shadow: string; text: string }> = {
                'primary': {
                  shadow: 'group-hover:shadow-primary/20',
                  text: 'group-hover:text-primary/20',
                },
                'purple-400': {
                  shadow: 'group-hover:shadow-purple-400/20',
                  text: 'group-hover:text-purple-400/20',
                },
                'blue-400': {
                  shadow: 'group-hover:shadow-blue-400/20',
                  text: 'group-hover:text-blue-400/20',
                },
                'green-400': {
                  shadow: 'group-hover:shadow-green-400/20',
                  text: 'group-hover:text-green-400/20',
                },
              };
              return classMap[colorClass] || classMap['primary'];
            };
            
            const hoverClasses = getHoverClasses(step.hoverColorClass);
            
            return (
              <div key={step.number} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card 
                    className={`h-full bg-card/50 backdrop-blur-3xl border-0 transition-all duration-300 hover:shadow-md ${hoverClasses.shadow} hover:-translate-y-2 group relative overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} p-4 shadow-lg`}
                        >
                          <Icon className="w-full h-full text-white" />
                        </motion.div>
                        <span className={`text-6xl font-black text-muted-foreground/20 ${hoverClasses.text} transition-colors`}>
                          {step.number}
                        </span>
                      </div>
                      <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* CTA at the end */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground font-bold text-xl mb-4">
            Preparado para uma nova era de eventos?
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <a
              href="/cadastro"
              className="inline-flex items-center gap-2 hover:gap-4 px-8 py-4 rounded-full bg-linear-to-r from-primary to-[#2959b9] text-white font-black text-lg shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-400 hover:scale-95"
            >
              Começar agora
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

