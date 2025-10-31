import { DEFAULT_PAGE_SIZE } from "@/constants/app";

import { fetchPosts } from "@/lib/actions/post";
import HeroSection from "@/components/app/hero-section";
import Posts from "@/components/app/posts";
import TechStacksSection from "@/components/app/tech-stacks";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const { posts, totalPosts } = await fetchPosts({ page: page ? Number(page) : undefined });

  return (
    <>
      <HeroSection />
      <Posts
        posts={posts}
        currentPage={page ? Number(page) : 1}
        totalPages={Math.ceil(totalPosts / DEFAULT_PAGE_SIZE)}
      />
      <TechStacksSection />
    </>
  );
}
