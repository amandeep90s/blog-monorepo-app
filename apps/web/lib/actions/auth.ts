"use server";

import { redirect } from "next/navigation";
import { print } from "graphql";
import z from "zod";

import { SignUpFormSchema } from "@/lib/schemas/signUpFormSchema";
import { SignUpFromState } from "@/lib/types/formState";

import { fetchGraphQL } from "../graphql/fetchQueries";
import { CREATE_USER_MUTATION } from "../graphql/gqlQueries";

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

export async function signIn() {
  //
}
