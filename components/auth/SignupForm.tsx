"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/board";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      window.location.href = redirect;
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="rounded-sm border border-black/10 bg-white/60 p-10 text-center">
        <p className="font-display text-2xl tracking-wide">회원가입 완료</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          이메일 인증 링크를 보냈습니다. 메일함을 확인한 뒤 로그인해 주세요.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="mt-8 inline-block text-xs tracking-[0.25em] text-foreground underline-offset-4 hover:underline"
        >
          로그인으로 이동
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-sm border border-black/10 bg-white/60 p-8 md:p-10"
    >
      <div>
        <label htmlFor="email" className="mb-2 block text-xs tracking-[0.2em]">
          EMAIL *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs tracking-[0.2em]">
          PASSWORD *
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-xs tracking-[0.2em]"
        >
          CONFIRM PASSWORD *
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground px-6 py-4 text-xs tracking-[0.3em] text-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "SIGNING UP..." : "SIGN UP"}
      </button>

      <p className="text-center text-sm text-muted">
        이미 계정이 있으신가요?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="text-foreground underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}
