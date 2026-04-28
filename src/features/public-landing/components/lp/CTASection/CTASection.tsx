import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

import type { CTASectionProps } from "./types";
import { ctaSectionSchema } from "./schema";
import { iconVariants, headingVariants, descriptionVariants, buttonsVariants, featuresVariants } from "./animations";

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

const CTASection = ({
	heading = ctaSectionSchema.heading,
	headingHighlight = ctaSectionSchema.headingHighlight,
	description = ctaSectionSchema.description,
	primaryButton = ctaSectionSchema.primaryButton,
	secondaryButton = ctaSectionSchema.secondaryButton,
	features = ctaSectionSchema.features,
}: CTASectionProps) => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-primary/60" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <Card className="bg-card/60 backdrop-blur-3xl border border-white/30 p-12 md:p-16 relative shadow-xl rounded-[50px]">
          <div className="relative z-10 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={iconVariants}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <Rocket className="w-16 h-16 text-primary relative z-10" />
              </div>
            </motion.div>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headingVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
            >
              {heading}{" "}
              <span className="bg-linear-to-r from-primary via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                {headingHighlight}
              </span>{" "}
              seus eventos?
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={descriptionVariants}
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={buttonsVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                className="rounded-full text-xl px-8 py-6 bg-linear-to-r from-primary to-[#2959b9] hover:scale-95 text-white border-0 shadow-2xl hover:shadow-primary/50 transition-all"
              >
                <Link to={primaryButton.url || "/cadastro"}>
                  {primaryButton.text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full text-xl px-8 py-6 hover:scale-105 transition-all"
              >
                <Link to={secondaryButton.url || "/login"}>
                  {secondaryButton.text}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={featuresVariants}
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckIcon />
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;

