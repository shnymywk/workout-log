"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error: string | null;
};

const initialLoginActionState: LoginActionState = {
  error: null
};

export { initialLoginActionState };

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "");

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  if (path === "/login") {
    return "/dashboard";
  }

  return path;
}

export async function login(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getSafeRedirectPath(formData.get("next"));

  if (!email || !password) {
    return {
      error: "メールアドレスとパスワードを入力してください。"
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      error: "メールアドレスまたはパスワードが正しくありません。"
    };
  }

  redirect(redirectTo);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}
