"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, FileText, ImageIcon, Save, Type } from "lucide-react";
import { toast } from "sonner";

import { Post } from "@/types/modelTypes";
import { PostFormState } from "@/lib/types/formState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  state: PostFormState;
  formAction: (payload: FormData) => void;
  post?: Post;
  isPending?: boolean;
};

const UpsertPostForm = ({ state, formAction, post, isPending }: Props) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags?.map((tag) => tag.name).join(", ") || "");
  const [published, setPublished] = useState(post?.published || false);
  const [imageUrl, setImageUrl] = useState("");

  const isEditing = !!post;
  const existingThumbnail = post?.thumbnail;

  useEffect(() => {
    if (state?.message) {
      if (state?.ok) {
        toast.success(state?.message);
      } else {
        toast.error(state?.message);
      }
    }
  }, [state]);

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-linear-to-br">
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <FileText className="text-primary h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{isEditing ? "Edit Your Post" : "Create New Post"}</h1>
            <p className="text-muted-foreground text-lg">
              {isEditing
                ? "Update your blog post and share your latest thoughts"
                : "Share your thoughts and ideas with the world"}
            </p>
          </div>
        </div>

        <form action={formAction} className="space-y-8">
          {isEditing && <input type="hidden" name="id" value={post.id} />}
          {isEditing && existingThumbnail && (
            <input type="hidden" name="previousThumbnailUrl" value={existingThumbnail} />
          )}
          <input type="hidden" name="published" value={published ? "on" : "off"} />

          {/* Post Content Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Type className="text-primary h-5 w-5" />
                <div>
                  <CardTitle className="text-xl">Post Content</CardTitle>
                  <CardDescription>Write your amazing content here</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Post Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter an engaging title for your post..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`text-lg ${state?.errors?.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {state?.errors?.title && (
                  <p className="text-destructive animate-in slide-in-from-left-1 text-sm">{state.errors.title[0]}</p>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-3">
                <Label htmlFor="content" className="text-sm font-semibold">
                  Content *
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your post content here... You can use HTML tags for formatting."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`min-h-[300px] resize-none text-base leading-relaxed ${
                    state?.errors?.content ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {state?.errors?.content && (
                  <p className="text-destructive animate-in slide-in-from-left-1 text-sm">{state.errors.content[0]}</p>
                )}
                <p className="text-muted-foreground text-xs">
                  HTML tags are supported for formatting. Minimum 20 characters required.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="text-primary h-5 w-5" />
                <div>
                  <CardTitle className="text-xl">Post Details</CardTitle>
                  <CardDescription>Add tags and configure your post</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags Field */}
              <div className="space-y-3">
                <Label htmlFor="tags" className="text-sm font-semibold">
                  Tags *
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="nextjs, typescript, react (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={state?.errors?.tags ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {state?.errors?.tags && (
                  <p className="text-destructive animate-in slide-in-from-left-1 text-sm">{state.errors.tags[0]}</p>
                )}
                <p className="text-muted-foreground text-xs">
                  Separate tags with commas to help readers discover your content
                </p>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <Label htmlFor="thumbnail" className="text-sm font-semibold">
                  Thumbnail Image
                </Label>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="border-muted-foreground/25 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed">
                      <ImageIcon className="text-muted-foreground h-5 w-5" />
                    </div>
                    <Input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) setImageUrl(URL.createObjectURL(e.target.files[0]));
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                  {state?.errors?.thumbnail && (
                    <p className="text-destructive animate-in slide-in-from-left-1 text-sm">
                      {state.errors.thumbnail[0]}
                    </p>
                  )}
                  {(imageUrl || existingThumbnail || state?.data?.previousThumbnailUrl) && (
                    <div className="overflow-hidden rounded-lg border">
                      <Image
                        src={imageUrl || existingThumbnail || state?.data?.previousThumbnailUrl || ""}
                        alt="Post thumbnail preview"
                        width={400}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                {published ? (
                  <Eye className="h-5 w-5 text-green-600" />
                ) : (
                  <EyeOff className="text-muted-foreground h-5 w-5" />
                )}
                <div>
                  <CardTitle className="text-xl">Publishing</CardTitle>
                  <CardDescription>Control when your post goes live</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="published" className="font-semibold">
                      Publish immediately
                    </Label>
                    <Badge variant={published ? "default" : "secondary"}>{published ? "Live" : "Draft"}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {published ? "Your post will be visible to everyone" : "Save as draft to publish later"}
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {state?.message && !state?.ok && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent>
                <div className="text-destructive flex items-center gap-2">
                  <div className="bg-destructive h-2 w-2 rounded-full" />
                  <p className="text-sm font-medium">{state.message}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="min-w-[200px] text-base font-semibold shadow-lg transition-all hover:shadow-xl"
            >
              {isPending ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {isEditing ? "Update Post" : "Create Post"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpsertPostForm;
