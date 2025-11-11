import { DEFAULT_PAGE_SIZE } from "@/constants/app";

import { fetchUserPosts } from "@/lib/actions/post";

import { NoPost } from "./_components/no-post";
import { PostList } from "./_components/post-list";

type PostsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { page } = await searchParams;
  const { totalPosts, posts } = await fetchUserPosts({
    page: typeof page === "string" ? Number(page) : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  if (!posts || !posts.length) {
    return <NoPost />;
  }

  return <PostList />;
}
