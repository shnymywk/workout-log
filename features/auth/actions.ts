"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type {
  GuestLoginActionState,
  LoginActionState,
  SignUpActionState
} from "@/features/auth/action-state";
import { resetGuestDemoData } from "@/features/demo/lib/guest-demo-seed";
import { createClient } from "@/lib/supabase/server";

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

async function getEmailRedirectUrl() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (origin?.startsWith("http://") || origin?.startsWith("https://")) {
    return `${origin}/login`;
  }

  return null;
}

function getGuestCredentials() {
  const email = process.env.DEMO_GUEST_EMAIL?.trim();
  const password = process.env.DEMO_GUEST_PASSWORD ?? "";

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

function revalidateAppPages() {
  revalidatePath("/dashboard");
  revalidatePath("/workouts");
  revalidatePath("/exercises");
  revalidatePath("/goals");
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

export async function loginAsGuest(): Promise<GuestLoginActionState> {
  const credentials = getGuestCredentials();

  if (!credentials) {
    return {
      error: "ゲストログイン設定が未設定です。環境変数を確認してください。"
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error || !data.user) {
    return {
      error: "ゲストログインできませんでした。ゲストアカウント設定を確認してください。"
    };
  }

  const resetResult = await resetGuestDemoData({
    supabase,
    userId: data.user.id
  });

  if (resetResult.error) {
    await supabase.auth.signOut();

    return {
      error: resetResult.error
    };
  }

  revalidateAppPages();
  redirect("/dashboard");
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
  const emailRedirectTo = await getEmailRedirectUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: emailRedirectTo
      ? {
          emailRedirectTo
        }
      : undefined
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
