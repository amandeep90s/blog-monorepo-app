import { z } from "zod";

export const PostFormSchema = z.object({
  id: z.string().optional(), // Make id optional for creating new posts
  title: z.string().min(1, "Title cannot be empty").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  tags: z
    .string()
    .min(1)
    .refine((value) => value.split(",").every((tag) => tag.trim() !== ""))
    .transform((value) => value.split(",")),
  thumbnail: z.instanceof(File).optional(),
  published: z.string().transform((value) => value === "on"),
});
