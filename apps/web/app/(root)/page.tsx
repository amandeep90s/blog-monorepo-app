import { fetchPosts } from "@/lib/actions/post";
import HeroSection from "@/components/app/hero-section";
import Posts from "@/components/app/posts";
import TechStacksSection from "@/components/app/tech-stacks";

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <>
      <HeroSection />
      <Posts posts={posts} />
      <TechStacksSection />
    </>
  );
}
