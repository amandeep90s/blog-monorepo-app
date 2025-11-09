"use client";

import { useActionState, useEffect } from "react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

import { Comment } from "@/types/modelTypes";
import { saveComment } from "@/lib/actions/comment";
import { SessionUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/ui/user-avatar";

type AddCommentProps = {
  postId: string;
  user: SessionUser;
  refetchComments: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      {
        comments: Comment[];
        count: number;
      },
      Error
    >
  >;
};

export const AddComment = ({ postId, user, refetchComments }: AddCommentProps) => {
  const [state, action, isPending] = useActionState(saveComment, undefined);

  // Handle state changes for notifications and refetching comments
  useEffect(() => {
    if (state?.message) {
      if (state.ok) {
        toast.success("Comment posted!", {
          description: state.message,
        });
        refetchComments();
      } else {
        toast.error("Failed to post comment", {
          description: state.message,
        });
      }
    }
  }, [state, refetchComments]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4" />
        <h4 className="text-sm font-medium">Add a comment</h4>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="postId" value={postId} />

        <div className="flex gap-3">
          <div className="shrink-0">
            <UserAvatar className="size-8" src={user.avatar} alt={user.name || "User avatar"} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="content" className="sr-only">
                Your comment
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Share your thoughts..."
                defaultValue={state?.data?.content || ""}
                disabled={isPending}
                className="min-h-[100px] resize-none"
              />
              {state?.errors?.content && <p className="text-sm text-red-500">{state.errors.content[0]}</p>}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">{user.name}</span>

              <Button type="submit" disabled={isPending} size="sm" className="gap-2">
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
