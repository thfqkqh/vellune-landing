"use client";

import { useState } from "react";
import { footerContent } from "@/data/content";
import { PrivacyModal } from "@/components/ui/PrivacyModal";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-black/5 bg-background py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xl tracking-[0.3em]">VELLUNE</p>
            <p className="mt-2 text-sm text-muted">{footerContent.company}</p>
          </div>

          <div className="space-y-2 text-sm text-muted">
            <p>CONTACT</p>
            <a
              href={`mailto:${footerContent.email}`}
              className="block text-foreground transition hover:text-accent"
            >
              {footerContent.email}
            </a>
            <a
              href={footerContent.instagram}
              target="_blank"
              rel="noreferrer"
              className="block transition hover:text-accent"
            >
              INSTAGRAM
            </a>
          </div>

          <div className="text-sm text-muted">
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="mb-3 block transition hover:text-foreground"
            >
              PRIVACY POLICY
            </button>
            <p>{footerContent.copyright}</p>
          </div>
        </div>
      </footer>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
