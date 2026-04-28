import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { HowItWorksSectionProps } from "./types";
import { howItWorksSectionSchema } from "./schema";
import { headerVariants, getStepVariants, ctaVariants, iconHoverVariants, buttonHoverVariants, buttonTapVariants } from "./animations";
import { getHoverClasses } from "./hooks/useHoverClasses";

const HowItWorksSection = ({
	badge = howItWorksSectionSchema.badge,
	heading = howItWorksSectionSchema.heading,
	headingHighlight = howItWorksSectionSchema.headingHighlight,
	description = howItWorksSectionSchema.description,
	steps = howItWorksSectionSchema.steps,
	cta = howItWorksSectionSchema.cta,
}: HowItWorksSectionProps) => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">

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
            <span className="bg-linear-to-r from-primary via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              {headingHighlight}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const hoverClasses = getHoverClasses(step.hoverColorClass);
            
            return (
              <div key={step.number} className="relative">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={getStepVariants(index)}
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
                          whileHover={iconHoverVariants}
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={ctaVariants}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground font-bold text-xl mb-4">
            {cta.text}
          </p>
          <motion.div
            whileHover={buttonHoverVariants}
            whileTap={buttonTapVariants}
            className="inline-block"
          >
            <Link
              to={cta.buttonUrl || "/cadastro"}
              className="inline-flex items-center gap-2 hover:gap-4 px-8 py-4 rounded-full bg-linear-to-r from-primary to-[#2959b9] text-white font-black text-lg shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-400 hover:scale-95"
            >
              {cta.buttonText}
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

