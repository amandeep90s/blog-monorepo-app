"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { print } from "graphql";
import z from "zod";

import { fetchGraphQL } from "@/lib/graphql/fetchQueries";
import { CREATE_USER_MUTATION, SIGN_IN_MUTATION } from "@/lib/graphql/gqlQueries";
import { SignInFormSchema } from "@/lib/schemas/signInFormSchema";
import { SignUpFormSchema } from "@/lib/schemas/signUpFormSchema";
import { clearSession, createSession } from "@/lib/session";
import { SignInFormState, SignUpFromState } from "@/lib/types/formState";

export async function signUp(state: SignUpFromState, formData: FormData): Promise<SignUpFromState> {
  const validatedFields = SignUpFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      data: Object.fromEntries(formData.entries()),
      errors: flattened.fieldErrors,
    };
  }

  const data = await fetchGraphQL(print(CREATE_USER_MUTATION), { input: { ...validatedFields.data } });

  if (data.errors) {
    return {
      data: Object.fromEntries(formData.entries()),
      message: data.errors?.[0]?.message ?? "Something went wrong",
    };
  }

  // Return success state and redirect will be handled by the client
  redirect("/sign-in");
}

export async function signIn(state: SignInFormState, formData: FormData): Promise<SignInFormState> {
  const validatedFields = SignInFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      data: Object.fromEntries(formData.entries()),
      errors: flattened.fieldErrors,
    };
  }

  const data = await fetchGraphQL(print(SIGN_IN_MUTATION), { input: { ...validatedFields.data } });

  if (data.errors) {
    return {
      data: Object.fromEntries(formData.entries()),
      message: data.errors?.[0]?.message ?? "Invalid Credentials",
    };
  }

  const { id, name, email, avatar, bio, accessToken } = data.signIn;

  // Set session cookie
  await createSession({ user: { id, name, email, avatar, bio }, accessToken });

  // Successfully signed in, revalidate the path to update any server components
  revalidatePath("/");
  // On successful sign-in, redirect to home page
  redirect("/");
}

export async function signOut() {
  await clearSession();
  redirect("/sign-in");
}
