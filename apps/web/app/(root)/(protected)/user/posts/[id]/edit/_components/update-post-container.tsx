"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Post } from "@/types/modelTypes";
import { updatePost } from "@/lib/actions/post";

import UpsertPostForm from "../../../../create-post/_components/upsert-post-form";

type UpdatePostContainerProps = {
  post: Post;
};

export const UpdatePostContainer = ({ post }: UpdatePostContainerProps) => {
  const [state, action, isPending] = useActionState(updatePost, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && state?.message?.includes("successfully")) {
      router.push("/user/posts");
    }
  }, [state, router]);

  return (
    <div className="bg-card rounded-lg border p-6">
      <UpsertPostForm state={state} formAction={action} post={post} isPending={isPending} />
    </div>
  );
};
