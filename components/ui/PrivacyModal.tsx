"use client";

import { privacyPolicy } from "@/data/content";

type PrivacyModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-sm bg-background p-8 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="privacy-title" className="font-display text-2xl tracking-wide">
            {privacyPolicy.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted transition hover:text-foreground"
            aria-label="Close privacy policy"
          >
            ✕
          </button>
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-muted">
          {privacyPolicy.sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-1 font-medium text-foreground">
                {section.title}
              </h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
