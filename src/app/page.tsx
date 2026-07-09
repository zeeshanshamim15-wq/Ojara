import IntentionNav from "@/components/IntentionNav";
import Hero from "@/components/Hero";
import PressStrip from "@/components/PressStrip";
import BrandStory from "@/components/BrandStory";
import ProductGrid from "@/components/ProductGrid";
import ValueProps from "@/components/ValueProps";
import LifestyleGallery from "@/components/LifestyleGallery";
import ManifestationStories from "@/components/ManifestationStories";
import Newsletter from "@/components/Newsletter";
import SocialProofGrid from "@/components/SocialProofGrid";

export default function Home() {
  return (
    <>
      <IntentionNav />
      <Hero />
      <PressStrip />
      <BrandStory />
      <ProductGrid />
      <ValueProps />
      <LifestyleGallery />
      <ManifestationStories />
      <Newsletter />
      <SocialProofGrid />
    </>
  );
}
