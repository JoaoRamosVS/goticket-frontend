import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

import type { FAQSectionProps } from "./types";
import { faqSectionSchema } from "./schema";
import { headerVariants, getFAQVariants, answerVariants, chevronVariants } from "./animations";
import { useFAQ } from "./hooks/useFAQ";

const FAQSection = ({
	badge = faqSectionSchema.badge,
	heading = faqSectionSchema.heading,
	headingHighlight = faqSectionSchema.headingHighlight,
	description = faqSectionSchema.description,
	faqs = faqSectionSchema.faqs,
}: FAQSectionProps) => {
	const { openIndex, toggleFAQ } = useFAQ(0);

  return (
    <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black">
              {heading}{" "}
              <span className="bg-linear-to-r from-primary via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                {headingHighlight}
              </span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={getFAQVariants(index)}
            >
              <Card className="bg-card/50 backdrop-blur-3xl shadow-lg py-2 border border-white/30 hover:border-primary/20 transition-all ease-in-out duration-500 overflow-hidden group">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-bold pr-8 group-hover:text-primary transition-colors">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{
                          rotate: openIndex === index ? chevronVariants.rotate : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                    </div>
                  </CardContent>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={answerVariants}
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


