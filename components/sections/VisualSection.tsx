import { visualContent } from "@/data/content";
import { media } from "@/lib/media";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { FadeIn } from "@/components/ui/FadeIn";

export function VisualSection() {
  return (
    <section id="visual" className="relative flex min-h-[70vh] items-center justify-center">
      <BackgroundVideo
        src={media.videos.brand}
        poster={media.posters.brand}
        overlayClassName="bg-black/40"
      />

      <div className="relative z-10 px-6 text-center text-white">
        <FadeIn>
          <h2 className="font-display text-3xl tracking-[0.25em] sm:text-4xl md:text-5xl">
            {visualContent.headline}
          </h2>
          <p className="mt-4 text-sm tracking-[0.2em] text-white/75">
            {visualContent.subheadline}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
