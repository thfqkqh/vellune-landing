"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { product } from "@/data/product";
import { media } from "@/lib/media";
import { FadeIn } from "@/components/ui/FadeIn";

export function ProductSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0.2, 0.6], [1, 1.05]);

  return (
    <section id="product" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[0.35em] text-accent">{product.name}</p>
            <h2 className="mt-4 font-display text-3xl tracking-wide sm:text-4xl md:text-5xl">
              {product.fullName}
            </h2>
            <p className="mt-3 text-sm text-muted">{product.volume}</p>
          </div>
        </FadeIn>

        <div ref={containerRef} className="grid gap-8 md:grid-cols-2">
          <motion.div style={{ scale }} className="relative aspect-[3/4] overflow-hidden bg-black/5">
            <Image
              src={media.images.productMain}
              alt={`${product.name} product front`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <FadeIn delay={0.15}>
            <div className="flex flex-col justify-center">
              <div className="relative mb-8 aspect-[4/3] overflow-hidden bg-black/5">
                <Image
                  src={media.images.productDetail}
                  alt={`${product.name} product detail`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="font-display text-2xl tracking-wide sm:text-3xl">
                {product.tagline}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
                {product.description}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
