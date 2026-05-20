"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function TopProgressBar({ isLoading }: { isLoading: boolean }) {
  const [width, setWidth] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      setWidth(0);
      const steps = [15, 30, 45, 60, 72, 80, 85];
      let step = 0;
      const delays = [80, 150, 200, 300, 400, 600, 900];

      const runStep = () => {
        if (step < steps.length) {
          setWidth(steps[step]);
          intervalRef.current = setTimeout(runStep, delays[step]);
          step++;
        }
      };
      intervalRef.current = setTimeout(runStep, 50);
    } else {
      setWidth(100);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {(isLoading || width > 0) && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: isLoading ? 0 : 0.3 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            zIndex: 99999,
            background: "#F5F0E8",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              backgroundSize: "200% 100%",
              width: `${width}%`,
              borderRight: width < 100 ? "2px solid #000" : "none",
              
              transition: width === 100 
                ? "width 0.2s ease" 
                : `width ${width < 50 ? 0.3 : 0.5}s ease`,
            }}
            animate={{
              backgroundPosition: isLoading ? ["0% 0%", "200% 0%"] : "0% 0%",
            }}
            transition={{
              backgroundPosition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PageOverlay({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99998,
            backgroundColor: "rgba(245, 240, 232, 0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.45 }}
            style={{
              background: "#ffffff",
              border: "3px solid #000000",
              boxShadow: "8px 8px 0px #000000",
              padding: "32px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              borderRadius: "12px",
              maxWidth: "280px",
              width: "90%",
            }}
          >
      
              <img
                src="/images/loading2.gif"
                alt="Loading..."
                style={{ width: "80%", height: "80%", objectFit: "cover" }}
              />
      

            {/* Text + dots */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <h2
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 900,
                  fontSize: "20px",
                  letterSpacing: "3px",
                  color: "#000",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Memuat...
              </h2>

              <div style={{ display: "flex", gap: "8px" }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: ["0%", "-60%", "0%"] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: "easeInOut",
                    }}
                    style={{
                      width: "10px",
                      height: "10px",
                      background:
                        i === 0 ? "#FFE500" : i === 1 ? "#00D37F" : "#FF4D4D",
                      border: "2px solid #000",
                      borderRadius: "50%",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NavigationLoader() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathname = useRef(pathname);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("/") &&
        !href.startsWith("//") &&
        href !== pathname &&
        !target.hasAttribute("download") &&
        !target.getAttribute("target")
      ) {
        setIsNavigating(true);
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;

      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      finishTimerRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    }
  }, [pathname]);

  return (
    <>
      <TopProgressBar isLoading={isNavigating} />
      <PageOverlay isLoading={isNavigating} />
    </>
  );
}
