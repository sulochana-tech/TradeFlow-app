import logo from "@/assets/tradeflow-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  textClassName?: string;
}

const sizes = {
  sm: { img: "h-10 w-10", text: "text-lg" },
  md: { img: "h-14 w-14", text: "text-2xl" },
  lg: { img: "h-20 w-20", text: "text-3xl" },
};

export function Logo({ className, showText = true, size = "md", textClassName }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="TradeFlow logo"
        width={96}
        height={96}
        className={cn(s.img, "object-contain")}
      />
      {showText && (
        <span className={cn("font-bold tracking-tight text-foreground", s.text, textClassName)}>
          Trade<span className="text-primary">Flow</span>
        </span>
      )}
    </div>
  );
}
