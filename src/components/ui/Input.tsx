"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              color: "#000",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={`nb-input ${error ? "!border-red-500 !shadow-[2px_2px_0px_#FF4D4D]" : ""} ${className}`}
        />
        {hint && !error && (
          <span style={{ fontSize: "12px", color: "#3D3D3D" }}>{hint}</span>
        )}
        {error && (
          <span style={{ fontSize: "12px", color: "#FF4D4D", fontWeight: 600 }}>
            ⚠ {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              color: "#000",
            }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          {...props}
          className={`nb-textarea ${error ? "!border-red-500 !shadow-[2px_2px_0px_#FF4D4D]" : ""} ${className}`}
        />
        {hint && !error && (
          <span style={{ fontSize: "12px", color: "#3D3D3D" }}>{hint}</span>
        )}
        {error && (
          <span style={{ fontSize: "12px", color: "#FF4D4D", fontWeight: 600 }}>
            ⚠ {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
