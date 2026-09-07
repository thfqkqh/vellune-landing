"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { companyContent } from "@/data/content";
import { media } from "@/lib/media";
import { FadeIn, staggerContainer, staggerItem } from "@/components/ui/FadeIn";

export function CompanySection() {
  return (
    <section id="company" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
              <Image
                src={media.images.companyLab}
                alt="VELLUNE LABS research environment"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>

          <div>
            <FadeIn>
              <p className="mb-4 text-xs tracking-[0.35em] text-accent">
                {companyContent.label}
              </p>
              <h2 className="font-display text-3xl leading-tight tracking-wide sm:text-4xl">
                {companyContent.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted md:text-base">
                {companyContent.description}
              </p>
            </FadeIn>

            <motion.ul
              className="mt-10 space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {companyContent.keywords.map((keyword, index) => (
                <motion.li
                  key={keyword.id}
                  variants={staggerItem}
                  className="border-t border-black/10 pt-6"
                >
                  <p className="text-xs tracking-[0.3em] text-muted">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl tracking-wide">
                    {keyword.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{keyword.description}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
