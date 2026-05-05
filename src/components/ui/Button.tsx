"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "green" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: false;
  href?: undefined;
}

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
  asChild?: true;
  isLoading?: boolean;
}

type Props = ButtonProps | LinkButtonProps;

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  green: "btn-green",
  ghost: "btn-secondary",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export function Button({ variant = "primary", size = "md", isLoading, className = "", ...props }: ButtonProps) {
  const cls = `${variantClass[variant]} ${sizeClass[size]} ${className} ${props.disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""}`;

  return (
    <button
      {...props}
      disabled={props.disabled || isLoading}
      className={cls}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {props.children}
    </button>
  );
}

export function LinkButton({ variant = "primary", size = "md", href, className = "", isLoading, ...props }: LinkButtonProps) {
  const cls = `${variantClass[variant]} ${sizeClass[size]} ${className}`;
  return (
    <Link href={href} {...props} className={cls}>
      {props.children}
    </Link>
  );
}
