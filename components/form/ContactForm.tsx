"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactContent, inquiryTypes } from "@/data/content";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations";
import { PrivacyModal } from "@/components/ui/PrivacyModal";
import { FadeIn } from "@/components/ui/FadeIn";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [inquiryId, setInquiryId] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      type: "GENERAL",
      company: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      privacy: undefined,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as {
        success?: boolean;
        id?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "문의 전송에 실패했습니다.");
      }

      setInquiryId(result.id ?? "");
      setStatus("success");
      reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "문의 전송에 실패했습니다.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-black/10 bg-white/60 p-10 text-center">
        <p className="font-display text-3xl tracking-wide">
          {contactContent.successTitle}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {contactContent.successMessage}
        </p>
        {inquiryId && (
          <p className="mt-4 text-xs tracking-[0.2em] text-accent">
            INQUIRY ID: {inquiryId}
          </p>
        )}
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-xs tracking-[0.25em] text-foreground underline-offset-4 hover:underline"
        >
          SEND ANOTHER INQUIRY
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-sm border border-black/10 bg-white/60 p-8 md:p-10"
        noValidate
      >
        <div>
          <label htmlFor="type" className="mb-2 block text-xs tracking-[0.2em]">
            INQUIRY TYPE *
          </label>
          <select
            id="type"
            {...register("type")}
            className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
          >
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-2 text-xs text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="company" className="mb-2 block text-xs tracking-[0.2em]">
              COMPANY
            </label>
            <input
              id="company"
              type="text"
              {...register("company")}
              className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-xs tracking-[0.2em]">
              NAME *
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs tracking-[0.2em]">
              EMAIL *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-xs tracking-[0.2em]">
              PHONE
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-xs tracking-[0.2em]">
            MESSAGE *
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className="w-full resize-none border border-black/10 bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          {errors.message && (
            <p className="mt-2 text-xs text-red-600">{errors.message.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              {...register("privacy")}
              className="mt-1"
            />
            <span>
              개인정보 수집 및 이용에 동의합니다.{" "}
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="text-foreground underline-offset-4 hover:underline"
              >
                자세히 보기
              </button>
            </span>
          </label>
          {errors.privacy && (
            <p className="mt-2 text-xs text-red-600">{errors.privacy.message}</p>
          )}
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-foreground px-6 py-4 text-xs tracking-[0.3em] text-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "SENDING..." : "SEND"}
        </button>
      </form>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <FadeIn>
            <div>
              <h2 className="font-display text-3xl leading-tight tracking-wide sm:text-4xl md:text-5xl">
                {contactContent.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
                {contactContent.description}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
