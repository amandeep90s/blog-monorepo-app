"use server";

import { revalidatePath } from "next/cache";
import { print } from "graphql";
import z from "zod";

import { authFetchGraphQL } from "@/lib/graphql/fetchQueries";
import { GET_CURRENT_USER, UPDATE_PROFILE_MUTATION } from "@/lib/graphql/gqlQueries";
import { UpdateProfileFormSchema } from "@/lib/schemas/updateProfileFormSchema";
import { createSession, getSession } from "@/lib/session";
import { ProfileFormState } from "@/lib/types/formState";

export async function getCurrentUser() {
  try {
    const data = await authFetchGraphQL(print(GET_CURRENT_USER));

    if (data.errors) {
      throw new Error(data.errors[0]?.message || "Failed to fetch user data");
    }

    return data.getCurrentUser;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function updateProfile(state: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const validatedFields = UpdateProfileFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      data: Object.fromEntries(formData.entries()),
      errors: flattened.fieldErrors,
    };
  }

  // Remove empty string values
  const filteredData = Object.fromEntries(Object.entries(validatedFields.data).filter(([, value]) => value !== ""));

  const data = await authFetchGraphQL(print(UPDATE_PROFILE_MUTATION), {
    input: filteredData,
  });

  if (data.errors) {
    return {
      data: Object.fromEntries(formData.entries()),
      message: data.errors?.[0]?.message ?? "Failed to update profile",
      ok: false,
    };
  }

  // Update session with new profile data
  try {
    const currentSession = await getSession();
    if (currentSession) {
      const updatedUser = { ...currentSession.user };

      // Update the fields that were changed
      if (filteredData.name) updatedUser.name = filteredData.name;
      if (filteredData.bio !== undefined) updatedUser.bio = filteredData.bio;

      await createSession({
        user: updatedUser,
        accessToken: currentSession.accessToken,
      });
    }
  } catch (error) {
    console.error("Failed to update session:", error);
    // Don't fail the whole operation if session update fails
  }

  revalidatePath("/user/profile");

  return {
    message: "Profile updated successfully!",
    ok: true,
  };
}
