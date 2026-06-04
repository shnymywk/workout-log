"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error: string | null;
};

export type SignUpActionState = {
  error: string | null;
  success: string | null;
};

const initialLoginActionState: LoginActionState = {
  error: null
};

const initialSignUpActionState: SignUpActionState = {
  error: null,
  success: null
};

export { initialLoginActionState, initialSignUpActionState };

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

export async function signUp(
  _previousState: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getSafeRedirectPath(formData.get("next"));

  if (!email || !password) {
    return {
      error: "メールアドレスとパスワードを入力してください。",
      success: null
    };
  }

  if (password.length < 8) {
    return {
      error: "パスワードは8文字以上で入力してください。",
      success: null
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return {
      error: "新規登録できませんでした。入力内容を確認してください。",
      success: null
    };
  }

  if (!data.session) {
    return {
      error: null,
      success: "確認メールを送信しました。メール内のリンクから登録を完了してください。"
    };
  }

  redirect(redirectTo);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}
