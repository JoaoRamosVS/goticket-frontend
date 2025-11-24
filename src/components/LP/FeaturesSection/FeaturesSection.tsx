import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { FeaturesSectionProps } from "./types";
import { featuresSectionSchema } from "./schema";
import { headerVariants, getCardVariants, iconHoverVariants } from "./animations";

const FeaturesSection = ({
	badge = featuresSectionSchema.badge,
	heading = featuresSectionSchema.heading,
	description = featuresSectionSchema.description,
	features = featuresSectionSchema.features,
}: FeaturesSectionProps) => {
  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-linear-to-r from-primary via-cyan-500 to-blue-700 bg-clip-text text-transparent">
            {heading}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={getCardVariants(index)}
              >
                <Card className="h-full bg-card/50 backdrop-blur-3xl border border-white/30 hover:border-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-2 group">
                  <CardHeader>
                    <motion.div
                      whileHover={iconHoverVariants}
                      className="w-14 h-14 rounded-2xl bg-linear-to-br p-3 mb-4 group-hover:shadow-lg group-hover:shadow-primary/30"
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


