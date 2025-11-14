import { CreatePostContainer } from "./_components/create-post-container";

export default function CreatePostPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold md:text-4xl">Create New Post</h1>
        <p className="text-muted-foreground mt-2">Share your thoughts, ideas, and expertise with the community.</p>
      </div>
      <CreatePostContainer />
    </div>
  );
}
