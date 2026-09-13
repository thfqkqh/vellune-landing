"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthNavProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AuthNav({ className = "", onNavigate }: AuthNavProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    onNavigate?.();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return null;
  }

  if (email) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <span className="hidden max-w-[140px] truncate text-xs text-muted lg:inline">
          {email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs tracking-[0.25em] transition hover:opacity-70"
        >
          LOGOUT
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Link
        href="/login?redirect=/board"
        onClick={onNavigate}
        className="text-xs tracking-[0.25em] transition hover:opacity-70"
      >
        LOGIN
      </Link>
      <Link
        href="/signup?redirect=/board"
        onClick={onNavigate}
        className="border border-current px-3 py-1.5 text-xs tracking-[0.2em] transition hover:opacity-70"
      >
        SIGN UP
      </Link>
    </div>
  );
}
