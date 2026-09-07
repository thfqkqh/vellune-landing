"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { product } from "@/data/product";
import { media } from "@/lib/media";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { FadeIn } from "@/components/ui/FadeIn";

export function ExperienceSection() {
  const [activeId, setActiveId] = useState<string>(product.benefits[0].id);

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <BackgroundVideo
        src={media.videos.texture}
        poster={media.posters.texture}
        overlayClassName="bg-black/45"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-white">
        <FadeIn>
          <p className="text-xs tracking-[0.35em] text-white/70">
            PRODUCT EXPERIENCE
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-wide sm:text-4xl">
            SENSORY CARE
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {product.benefits.map((benefit, index) => {
            const isActive = activeId === benefit.id;

            return (
              <motion.button
                key={benefit.id}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                onClick={() => setActiveId(benefit.id)}
                className={`border-t pt-6 text-left transition ${
                  isActive ? "border-accent" : "border-white/20"
                }`}
              >
                <p
                  className={`text-xs tracking-[0.3em] ${
                    isActive ? "text-accent" : "text-white/60"
                  }`}
                >
                  0{index + 1}
                </p>
                <h3
                  className={`mt-3 font-display text-xl tracking-wide ${
                    isActive ? "text-white" : "text-white/80"
                  }`}
                >
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {benefit.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
