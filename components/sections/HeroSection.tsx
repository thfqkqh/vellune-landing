import { heroContent } from "@/data/content";
import { media } from "@/lib/media";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { FadeIn } from "@/components/ui/FadeIn";

export function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center">
      <BackgroundVideo
        src={media.videos.hero}
        poster={media.posters.hero}
        overlayClassName="bg-black/35"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32 text-center text-white">
        <FadeIn>
          <p className="mb-8 font-display text-sm tracking-[0.45em] text-white/80">
            VELLUNE
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-display text-4xl leading-tight tracking-wide sm:text-5xl md:text-7xl">
            {heroContent.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {heroContent.subheadline}
          </p>
          <p className="mt-2 text-sm text-white/70">{heroContent.subheadlineKo}</p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <ScrollIndicator targetId="brand" />
        </FadeIn>
      </div>
    </section>
  );
}
