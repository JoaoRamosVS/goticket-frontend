import HeroSection from "@/features/public-landing/components/lp/HeroSection"
import FeaturesSection from "@/features/public-landing/components/lp/FeaturesSection/FeaturesSection"
import TestimonialsSection from "@/features/public-landing/components/lp/TestimonialsSection/TestimonialsSection"
import HowItWorksSection from "@/features/public-landing/components/lp/HowItWorksSection/HowItWorksSection"
import FAQSection from "@/features/public-landing/components/FAQSection/FAQSection"
import CTASection from "@/features/public-landing/components/lp/CTASection/CTASection"
import MainLayout from "@/layouts/MainLayout"

const Index = () => {
  return (
    <MainLayout>
      <>
          <HeroSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FeaturesSection />
          <FAQSection />
          <CTASection />
      </>
    </MainLayout>
  )
}

export default Index