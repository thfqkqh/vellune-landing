import Image from "next/image";
import { brandContent } from "@/data/content";
import { media } from "@/lib/media";
import { FadeIn } from "@/components/ui/FadeIn";

export function BrandSection() {
  return (
    <section id="brand" className="bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <FadeIn>
          <div>
            <h2 className="font-display text-3xl leading-tight tracking-wide sm:text-4xl md:text-5xl">
              {brandContent.headline.map((line) =>
                line ? (
                  <span key={line} className="block">
                    {line}
                  </span>
                ) : (
                  <span key="spacer" className="block h-4" aria-hidden />
                ),
              )}
            </h2>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted md:text-base">
              {brandContent.description}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
            <Image
              src={media.images.brandSkin}
              alt="VELLUNE brand skin imagery"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
