import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "cream";
  noHover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "white",
  noHover = false,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const base = variant === "cream" ? "nb-card-cream" : "nb-card";
  const hover = noHover ? "hover:shadow-none hover:transform-none" : "";
  const cls = `${base} ${paddingMap[padding]} ${hover} ${className}`;

  return (
    <div {...props} className={cls}>
      {children}
    </div>
  );
}
