import Image from "next/image";

type AchiraLogoProps = {
  className?: string;
  priority?: boolean;
};

export function AchiraLogo({ className = "h-10 w-10", priority }: AchiraLogoProps) {
  return (
    <Image
      src="/achira-logo.png"
      alt="Achira Artist"
      width={200}
      height={280}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
