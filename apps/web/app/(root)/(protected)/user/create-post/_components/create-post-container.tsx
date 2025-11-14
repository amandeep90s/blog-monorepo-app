"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { saveNewPost } from "@/lib/actions/post";

import UpsertPostForm from "./upsert-post-form";

export const CreatePostContainer = () => {
  const [state, action, isPending] = useActionState(saveNewPost, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && state?.message?.includes("successfully")) {
      router.push("/user/posts");
    }
  }, [state, router]);

  return (
    <div className="bg-card rounded-lg border p-6">
      <UpsertPostForm state={state} formAction={action} isPending={isPending} />
    </div>
  );
};

export default CreatePostContainer;
