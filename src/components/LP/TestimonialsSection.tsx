import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Organizadora de Eventos",
    company: "Festival Tech",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    rating: 5,
    text: "A GoTicket transformou completamente como organizo meus eventos. A interface é intuitiva, o suporte é excepcional e as vendas aumentaram 300% desde que comecei a usar.",
  },
  {
    name: "João Santos",
    role: "CEO",
    company: "Eventos Premium",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    rating: 5,
    text: "Nunca vi uma plataforma tão completa e fácil de usar. O sistema de analytics nos dá insights valiosos e o check-in digital economiza horas de trabalho.",
  },
  {
    name: "Ana Costa",
    role: "Produtora Cultural",
    company: "Cultura Viva",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    rating: 5,
    text: "Como produtora de eventos culturais, preciso de algo confiável e profissional. A GoTicket superou todas as expectativas. Recomendo para qualquer tipo de evento!",
  },
  {
    name: "Carlos Oliveira",
    role: "Fundador",
    company: "Startup Weekend",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    rating: 5,
    text: "A melhor decisão que tomamos foi migrar para a GoTicket. O processo é simples, os relatórios são detalhados e nossos participantes adoram a experiência.",
  },
  {
    name: "Fernanda Lima",
    role: "Diretora de Marketing",
    company: "Mega Eventos",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    rating: 5,
    text: "A plataforma é incrível! Conseguimos gerenciar múltiplos eventos simultaneamente sem complicação. O suporte ao cliente é rápido e sempre resolve nossos problemas.",
  },
  {
    name: "Roberto Alves",
    role: "Organizador",
    company: "Festival de Música",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    rating: 5,
    text: "O sistema de vendas é perfeito. Integração com pagamentos funcionou perfeitamente e o check-in no dia do evento foi super rápido. Nossos participantes ficaram impressionados!",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
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
            Depoimentos
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            O que nossos{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              clientes dizem
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Diversos organizadores confiam na GoTicket para seus eventos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-3xl border border-white/30 p-6 hover:border-primary/10 transition-all duration-300 hover:shadow-sm hover:shadow-primary/20 hover:-translate-y-2 relative group">
                {/* Quote icon decoration */}
                <Quote className="absolute top-4 right-4 w-16 h-16 text-primary/10 group-hover:text-primary/20 transition-colors" />
                
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed relative z-10">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


