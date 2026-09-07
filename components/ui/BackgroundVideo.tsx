"use client";

import { useEffect, useRef, useState } from "react";

type BackgroundVideoProps = {
  src: string;
  poster: string;
  overlayClassName?: string;
  className?: string;
};

export function BackgroundVideo({
  src,
  poster,
  overlayClassName = "bg-black/30",
  className = "",
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usePoster, setUsePoster] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setUsePoster(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || usePoster) return;

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => setUsePoster(true));
    }
  }, [usePoster, src]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {usePoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="h-full w-full object-cover"
          onError={() => setUsePoster(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden />
    </div>
  );
}
