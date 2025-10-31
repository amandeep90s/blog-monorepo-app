import HeroSection from "@/components/app/hero-section";
import Posts from "@/components/app/posts";
import TechStacksSection from "@/components/app/tech-stacks";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Posts posts={[]} />
      <TechStacksSection />
    </>
  );
}
