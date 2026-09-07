import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/form/ContactForm";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandSection } from "@/components/sections/BrandSection";
import { CompanySection } from "@/components/sections/CompanySection";
import { ProductSection } from "@/components/sections/ProductSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ScienceSection } from "@/components/sections/ScienceSection";
import { VisualSection } from "@/components/sections/VisualSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandSection />
      <CompanySection />
      <ProductSection />
      <ExperienceSection />
      <ScienceSection />
      <VisualSection />
      <ContactSection />
      <Footer />
    </>
  );
}
