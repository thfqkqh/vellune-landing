import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getReplies } from "@/lib/posts";

type BoardDetailPageProps = {
  params: Promise<{ id: string }>;
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

export async function generateMetadata({ params }: BoardDetailPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  return {
    title: post ? `${post.title} | VELLUNE` : "Post | VELLUNE",
  };
}

export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  let replies: Awaited<ReturnType<typeof getReplies>> = [];
  try {
    replies = await getReplies(id);
  } catch {
    replies = [];
  }

  return (
    <div className="bg-background px-6 pb-24 pt-32">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/board"
          className="text-xs tracking-[0.25em] text-muted underline-offset-4 hover:underline"
        >
          ← BACK TO BOARD
        </Link>

        <article className="mt-8 rounded-sm border border-black/10 bg-white/60 p-8 md:p-10">
          <h1 className="font-display text-3xl tracking-wide">{post.title}</h1>
          <p className="mt-4 text-xs text-muted">{formatDate(post.created_at)}</p>
          <div className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {post.content}
          </div>
        </article>

        {replies.length > 0 && (
          <section className="mt-8 space-y-4">
            <h2 className="text-xs tracking-[0.25em] text-muted">REPLIES</h2>
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="rounded-sm border border-accent/20 bg-accent/5 p-6"
              >
                <p className="text-xs tracking-[0.2em] text-accent">VELLUNE TEAM</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                  {reply.content}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {formatDate(reply.created_at)}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
