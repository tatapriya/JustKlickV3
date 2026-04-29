import Hero from "../components/Hero";
import ExploreCategories from "../components/ExploreCategories";
import RecommendedSection from "../components/RecommendedSection";
import FeaturesStrip from "../components/FeaturesStrip";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import FAQSection from "../components/FAQSection";

export default function Home() {
  return (
    <div className="w-full bg-white">
      <Hero />

      <RecommendedSection />

      <ExploreCategories />

      <FeaturesStrip />

      <HowItWorks />

      <CTASection />

      <FAQSection />
      
    </div>
  );
}