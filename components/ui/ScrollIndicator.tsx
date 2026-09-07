"use client";

type ScrollIndicatorProps = {
  targetId: string;
  label?: string;
};

export function ScrollIndicator({
  targetId,
  label = "SCROLL ↓",
}: ScrollIndicatorProps) {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group mt-12 flex flex-col items-center gap-2 text-xs tracking-[0.35em] text-white/80 transition hover:text-white"
      aria-label={`Scroll to ${targetId}`}
    >
      <span>{label}</span>
      <span className="block h-10 w-px animate-pulse bg-white/60 transition group-hover:bg-white" />
    </button>
  );
}
