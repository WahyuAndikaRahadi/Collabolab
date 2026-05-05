import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "yellow" | "green" | "coral" | "blue" | "outline";
}

const variantMap: Record<string, string> = {
  default: "badge",
  yellow: "badge badge-yellow",
  green: "badge badge-green",
  coral: "badge badge-coral",
  blue: "badge badge-blue",
  outline: "badge badge-outline",
};

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span {...props} className={`${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
}
