"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function NewPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/login?redirect=/board/new");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
      })
      .select("id")
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/board/${data.id}`);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-sm border border-black/10 bg-white/60 p-8 md:p-10"
    >
      <div>
        <label htmlFor="title" className="mb-2 block text-xs tracking-[0.2em]">
          TITLE *
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-xs tracking-[0.2em]">
          CONTENT *
        </label>
        <textarea
          id="content"
          rows={10}
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full resize-none border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-foreground px-6 py-4 text-xs tracking-[0.3em] text-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "PUBLISHING..." : "PUBLISH"}
        </button>
        <Link
          href="/board"
          className="flex-1 border border-black/10 px-6 py-4 text-center text-xs tracking-[0.3em] transition hover:border-accent"
        >
          CANCEL
        </Link>
      </div>
    </form>
  );
}
