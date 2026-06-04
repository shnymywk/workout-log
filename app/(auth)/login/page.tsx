import { LoginForm } from "@/features/auth/components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    mode?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { mode, next } = await searchParams;

  return <LoginForm initialMode={mode === "signUp" ? "signUp" : "login"} nextPath={next} />;
}
