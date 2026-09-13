import { NewPostForm } from "@/components/auth/NewPostForm";

export const metadata = {
  title: "New Post | VELLUNE",
};

export default function NewPostPage() {
  return (
    <div className="bg-background px-6 pb-24 pt-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl tracking-wide">NEW POST</h1>
        <p className="mt-3 text-sm text-muted">새 글을 작성합니다.</p>
        <div className="mt-10">
          <NewPostForm />
        </div>
      </div>
    </div>
  );
}
