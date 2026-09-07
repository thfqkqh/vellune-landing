import Image from "next/image";
import { product } from "@/data/product";
import { media } from "@/lib/media";
import { FadeIn } from "@/components/ui/FadeIn";

export function ScienceSection() {
  return (
    <section id="science" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="mb-12 max-w-2xl">
            <p className="text-xs tracking-[0.35em] text-accent">SCIENCE</p>
            <h2 className="mt-4 font-display text-3xl leading-tight tracking-wide sm:text-4xl md:text-5xl">
              <span className="block">SCIENCE</span>
              <span className="block">BEHIND</span>
              <span className="block">THE RHYTHM</span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {product.science.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.1}>
                <div className="border-t border-black/10 pt-6">
                  <p className="text-xs tracking-[0.3em] text-muted">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="grid gap-6">
            <FadeIn delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                <Image
                  src={media.images.scienceIngredient}
                  alt="VELLUNE science and ingredient research"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                <Image
                  src={media.images.productSkin}
                  alt="VELLUNE product and skin texture"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
