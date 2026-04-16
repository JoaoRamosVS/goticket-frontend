import HeroSection from "@/components/lp/HeroSection"
import FeaturesSection from "@/components/lp/FeaturesSection/FeaturesSection"
import TestimonialsSection from "@/components/lp/TestimonialsSection/TestimonialsSection"
import HowItWorksSection from "@/components/lp/HowItWorksSection/HowItWorksSection"
import FAQSection from "@/components/global/FAQSection/FAQSection"
import CTASection from "@/components/lp/CTASection/CTASection"

const Index = () => {
  return (
    <>
        <HeroSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FeaturesSection />
        <FAQSection />
        <CTASection />
    </>
  )
}

export default Index