"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/board";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    router.push(redirect);
    router.refresh();
  };

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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground px-6 py-4 text-xs tracking-[0.3em] text-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "LOGGING IN..." : "LOGIN"}
      </button>

      <p className="text-center text-sm text-muted">
        계정이 없으신가요?{" "}
        <Link
          href={`/signup?redirect=${encodeURIComponent(redirect)}`}
          className="text-foreground underline-offset-4 hover:underline"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
