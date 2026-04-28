import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import type { TestimonialsSectionProps } from "./types";
import { testimonialsSectionSchema } from "./schema";
import { headerVariants, getCardVariants } from "./animations";

const TestimonialsSection = ({
	badge = testimonialsSectionSchema.badge,
	heading = testimonialsSectionSchema.heading,
	headingHighlight = testimonialsSectionSchema.headingHighlight,
	description = testimonialsSectionSchema.description,
	testimonials = testimonialsSectionSchema.testimonials,
}: TestimonialsSectionProps) => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            {badge}
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            {heading}{" "}
            <span className="bg-linear-to-r from-primary via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {headingHighlight}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={getCardVariants(index)}
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


