import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up | VELLUNE",
};

export default function SignupPage() {
  return (
    <div className="bg-background px-6 pb-24 pt-32">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl tracking-wide">SIGN UP</h1>
        <p className="mt-3 text-sm text-muted">
          VELLUNE 게시판 이용을 위해 계정을 만드세요.
        </p>
        <div className="mt-10">
          <Suspense fallback={null}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
