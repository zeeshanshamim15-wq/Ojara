import Hero from "@/components/Hero";
import BrandStory from "@/components/BrandStory";
import ProductGrid from "@/components/ProductGrid";
import ValueProps from "@/components/ValueProps";
import LifestyleGallery from "@/components/LifestyleGallery";
import ManifestationStories from "@/components/ManifestationStories";
import Newsletter from "@/components/Newsletter";
import SocialProofGrid from "@/components/SocialProofGrid";
import CategoryStrip from "@/components/CategoryStrip";
import GiftingSection from "@/components/GiftingSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <BrandStory />
      <CategoryStrip />
      <GiftingSection />
      <ValueProps />
      <LifestyleGallery />
      <ManifestationStories />
      <SocialProofGrid />
      <Newsletter />
    </>
  );
}
