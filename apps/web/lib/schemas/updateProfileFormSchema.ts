import z from "zod";

export const UpdateProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must not be more than 100 characters long" })
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, { message: "Bio must not be more than 500 characters long" }).optional().or(z.literal("")),
});
