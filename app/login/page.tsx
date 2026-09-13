import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | VELLUNE",
};

export default function LoginPage() {
  return (
    <div className="bg-background px-6 pb-24 pt-32">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl tracking-wide">LOGIN</h1>
        <p className="mt-3 text-sm text-muted">
          로그인 후 게시판을 이용할 수 있습니다.
        </p>
        <div className="mt-10">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
