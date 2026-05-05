"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "480px",
  md: "600px",
  lg: "800px",
};

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKey]);

  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(2px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          border: "3px solid #000",
          borderRadius: "8px",
          boxShadow: "8px 8px 0px #000",
          width: "100%",
          maxWidth: sizeMap[size],
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {title && (
          <div
            style={{
              background: "#FFE500",
              borderBottom: "2px solid #000",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 800,
                fontSize: "18px",
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              id="modal-close-btn"
              style={{
                background: "#000",
                color: "#FFE500",
                border: "none",
                borderRadius: "4px",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                fontWeight: 900,
                fontSize: "16px",
                lineHeight: 1,
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
