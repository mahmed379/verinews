import { HeroSection } from "../Components/landing/HeroSection";
import { FeatureGrid } from "../Components/landing/FeatureGrid";
import { FeaturedArticles } from "../Components/landing/FeaturedArticles";


export default function LandingPage() {
  return (
    <div>

      <HeroSection />

      <FeatureGrid />

      <FeaturedArticles />

    </div>
  );
}