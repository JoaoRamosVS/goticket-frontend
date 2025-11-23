import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Clock, 
  BarChart3,
  Smartphone,
  Globe
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Zap,
    title: "Vendas Instantâneas",
    description: "Sistema de pagamento integrado com processamento em tempo real. Seus ingressos vendem enquanto você dorme.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Proteção anti-fraude e criptografia de ponta a ponta. Seus dados e transações sempre protegidos.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Analytics Avançado",
    description: "Dashboards em tempo real com insights profundos sobre vendas, público e performance dos seus eventos.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: Users,
    title: "Gestão de Público",
    description: "Controle total sobre participantes, check-ins digitais e comunicação direta com seu público.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Clock,
    title: "Check-in Rápido",
    description: "Sistema de validação ultrarrápido com QR codes. Atenda centenas de pessoas em minutos.",
    color: "from-indigo-400 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description: "Relatórios completos e exportáveis para análise de performance e planejamento futuro.",
    color: "from-teal-400 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Interface otimizada para qualquer dispositivo. Gerencie seus eventos de qualquer lugar.",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Globe,
    title: "Multi-idioma",
    description: "Suporte para múltiplos idiomas e moedas. Expanda seus eventos para o mundo inteiro.",
    color: "from-violet-400 to-purple-500",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Funcionalidades
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-cyan-500 to-blue-700 bg-clip-text text-transparent">
            Tudo que você precisa
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Uma plataforma completa para criar, vender e gerenciar eventos de forma profissional e descomplicada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-3xl border border-white/30 hover:border-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-2 group">
                  <CardHeader>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br p-3 mb-4 group-hover:shadow-lg group-hover:shadow-primary/30"
                      style={{
                        background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                      }}
                    >
                      <Icon className="w-full h-full text-white" />
                    </motion.div>
                    <CardTitle className="text-xl mb-2 font-black">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


