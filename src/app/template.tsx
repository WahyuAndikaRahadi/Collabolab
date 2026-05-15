"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengecek apakah ini kunjungan pertama atau hanya pindah halaman
    const isFirstVisit = !sessionStorage.getItem("collabolab-loaded");
    
    // 5 detik untuk kunjungan pertama, 1.5 detik untuk pindah halaman
    const durationMs = isFirstVisit ? 5000 : 1500;

    // Sembunyikan scrollbar
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset";
      
      // Tandai bahwa user sudah pernah meload halaman utama
      if (isFirstVisit) {
        sessionStorage.setItem("collabolab-loaded", "true");
      }
    }, durationMs);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              backgroundColor: "#F5F0E8", // Neobrutalism cream background
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "#ffffff",
                border: "3px solid #000000",
                boxShadow: "10px 10px 0px #000000",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
                borderRadius: "12px",
                maxWidth: "300px",
                width: "90%",
              }}
            >
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "8px",
                border: "3px solid #000",
                overflow: "hidden",
                boxShadow: "4px 4px 0px #FFE500",
                background: "#fff"
              }}>
                <img 
                  src="/images/loading-collabolab.gif" 
                  alt="Loading CollaboLab..." 
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px"
              }}>
                <h2 style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 900,
                  fontSize: "24px",
                  letterSpacing: "3px",
                  color: "#000",
                  margin: 0,
                  textTransform: "uppercase"
                }}>
                  Loading
                </h2>
                
                {/* Animated Dots */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: ["0%", "-50%", "0%"],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                      }}
                      style={{
                        width: "12px",
                        height: "12px",
                        background: i === 0 ? "#FFE500" : i === 1 ? "#00D37F" : "#FF4D4D",
                        border: "2px solid #000",
                        borderRadius: "50%"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
