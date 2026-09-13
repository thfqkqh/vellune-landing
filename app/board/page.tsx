import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Board | VELLUNE",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function BoardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let posts: Awaited<ReturnType<typeof getPosts>> = [];

  try {
    posts = await getPosts();
  } catch {
    posts = [];
  }

  return (
    <div className="bg-background px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-wide">BOARD</h1>
            <p className="mt-3 text-sm text-muted">
              회원 전용 게시판입니다.
            </p>
          </div>
          <Link
            href="/board/new"
            className="inline-block bg-foreground px-6 py-3 text-center text-xs tracking-[0.3em] text-background transition hover:bg-accent"
          >
            NEW POST
          </Link>
        </div>

        <div className="mt-10 divide-y divide-black/10 rounded-sm border border-black/10 bg-white/60">
          {posts.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted">
              아직 작성된 글이 없습니다. 첫 번째 글을 작성해 보세요.
            </p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/board/${post.id}`}
                className="block px-6 py-5 transition hover:bg-black/[0.02]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-medium">{post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">
                      {post.content}
                    </p>
                  </div>
                  {user?.id === post.user_id && (
                    <span className="shrink-0 text-[10px] tracking-[0.2em] text-accent">
                      MY POST
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted">
                  {formatDate(post.created_at)}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
