
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Search, MessageSquare, Lock, Clock, CheckCircle2, Zap } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { ProjectBriefGenerator } from "./tools/ProjectBriefGenerator";
import { SkillGapAnalyzer } from "./tools/SkillGapAnalyzer";
import { ProjectRecommendation } from "./tools/ProjectRecommendation";
import { ReviewSummarizer } from "./tools/ReviewSummarizer";
import { AI_TOOL_CONFIG } from "@/lib/ai/config";
import { AITool } from "@prisma/client";
import { GridPattern, FloatingShape, NoiseTexture, SectionLabel, containerVariants, itemVariants } from "../ui/DecorativeElements";

interface Props {
  trustScore: number;
}

export function AIHubPage({ trustScore }: Props) {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch cooldowns
    const fetchCooldowns = async () => {
      const toolTypes = Object.values(AITool);
      const results: Record<string, string> = {};
      
      for (const tool of toolTypes) {
        try {
          const res = await fetch(`/api/ai/gate/${tool}`);
          const data = await res.json();
          if (!data.allowed && data.reason === "COOLDOWN_ACTIVE") {
            results[tool] = data.expiresAt;
          }
        } catch (e) {
          console.error("Failed to fetch gate for", tool, e);
        }
      }
      setCooldowns(results);
    };

    fetchCooldowns();
  }, []);

  const tools = [
    {
      type: AITool.PROJECT_BRIEF_GENERATOR,
      title: "Project Brief Generator",
      description: "Ubah ide singkatmu menjadi draft project yang lengkap dan menarik.",
      icon: <Sparkles />,
      color: "#FFE500",
      lightColor: "#FFFDE7",
    },
    {
      type: AITool.SKILL_GAP_ANALYZER,
      title: "Skill Gap Analyzer",
      description: "Temukan skill apa yang paling dibutuhkan pasar dan cara menutup gap-nya.",
      icon: <Brain />,
      color: "#0047FF",
      lightColor: "#E8EFFF",
    },
    {
      type: AITool.PROJECT_RECOMMENDATION,
      title: "Project Recommendation",
      description: "Matchmaking AI yang mencarikan project paling cocok dengan skill-mu.",
      icon: <Search />,
      color: "#00D37F",
      lightColor: "#E6FBF2",
    },
    {
      type: AITool.REVIEW_SUMMARIZER,
      title: "Review Summarizer",
      description: "Consolidate peer feedback into actionable growth metrics.",
      icon: <MessageSquare />,
      color: "#FF4D4D",
      lightColor: "#FFF0F0",
    },
  ];

  const getCooldown = (tool: AITool) => cooldowns[tool];

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "80px 20px",
      position: "relative",
      minHeight: "100vh",
      width: "100%"
    }}>
      <NoiseTexture />
      <GridPattern />

      {selectedTool === "PROJECT_BRIEF_GENERATOR" && <ProjectBriefGenerator onBack={() => setSelectedTool(null)} />}
      {selectedTool === "SKILL_GAP_ANALYZER" && <SkillGapAnalyzer onBack={() => setSelectedTool(null)} />}
      {selectedTool === "PROJECT_RECOMMENDATION" && <ProjectRecommendation onBack={() => setSelectedTool(null)} />}
      {selectedTool === "REVIEW_SUMMARIZER" && <ReviewSummarizer onBack={() => setSelectedTool(null)} />}

      {!selectedTool && (
        <>
          {/* Floating Decorations */}
          <FloatingShape type="circle" color="#FFE500" size={140} top="5%" left="-2%" delay={0} />
          <FloatingShape type="triangle" color="#00D37F" size={100} bottom="10%" right="5%" delay={0.4} />
          <FloatingShape type="square" color="#FF4D4D" size={60} top="20%" right="15%" delay={0.8} />
          <FloatingShape type="circle" color="#0047FF" size={80} bottom="20%" left="10%" delay={1.2} />

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ marginBottom: "80px", textAlign: "center", position: "relative", zIndex: 1 }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <SectionLabel>⚡ POWERED BY AI</SectionLabel>
            </div>
            
            <h1 style={{ 
              fontFamily: "Space Grotesk, sans-serif", 
              fontWeight: 900, 
              fontSize: "clamp(48px, 10vw, 92px)", 
              lineHeight: 0.85,
              marginBottom: "24px",
              letterSpacing: "-4px"
            }}>
              AI HUB <span style={{ color: "#FFE500", WebkitTextStroke: "3px black" }}>01</span>
            </h1>
            
            <div style={{ 
              background: "#000", 
              color: "#FFE500", 
              padding: "8px 24px", 
              display: "inline-block",
              transform: "rotate(-1deg)",
              border: "3px solid #000",
              boxShadow: "4px 4px 0px #000",
              marginBottom: "32px"
            }}>
                <p style={{ margin: 0, fontWeight: 900, fontSize: "18px", letterSpacing: "1px" }}>
                    PREMIUM COLLABORATION TOOLS
                </p>
            </div>

            <p style={{ 
              fontSize: "22px", 
              color: "#3D3D3D", 
              maxWidth: "700px", 
              lineHeight: 1.4,
              fontWeight: 600,
              margin: "0 auto"
            }}>
              Elevate your collaboration game. These tools use cutting-edge AI to help you find the right projects, fill your skill gaps, and understand your team dynamics.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="ai-hub-grid"
            style={{ 
              position: "relative", 
              zIndex: 1, 
              marginBottom: "80px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
              justifyContent: "center"
            }}
          >
            {tools.map((tool) => {
              const config = AI_TOOL_CONFIG[tool.type];
              const isLocked = trustScore < config.minTrustScore;
              
              return (
                <AIToolCard
                  key={tool.type}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  minScore={config.minTrustScore}
                  userScore={trustScore}
                  cooldownHours={config.cooldownHours}
                  isLocked={isLocked}
                  cooldownRemaining={getCooldown(tool.type)}
                  onSelect={() => setSelectedTool(tool.type)}
                  accentColor={tool.color}
                  lightColor={tool.lightColor}
                />
              );
            })}
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            style={{ 
              maxWidth: "1000px",
              margin: "0 auto",
              position: "relative",
              zIndex: 1
            }}
          >
            <div style={{ 
              background: "#FFE500", 
              border: "4px solid #000", 
              padding: "48px", 
              boxShadow: "16px 16px 0px #000",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -10, right: -10, opacity: 0.1 }}>
                <Zap size={120} strokeWidth={3} />
              </div>
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "32px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "-1px" }}>
                  The Trust Protocol
                </h3>
                <p style={{ fontWeight: 700, fontSize: "18px", lineHeight: 1.4 }}>
                  Our AI tools are strictly gated by your <span style={{ background: "#000", color: "#fff", padding: "0 6px" }}>Trust Score</span>. This ensures that the most powerful features are reserved for committed and reliable collaborators.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
                {[
                    "Build your score by completing projects and getting positive reviews.",
                    "Unlock advanced generators, analyzers, and matchmaking algorithms.",
                    "Gain access to exclusive \"Verified Only\" collaborative ecosystems."
                ].map((text, i) => (
                    <div key={i} style={{ display: "flex", gap: "20px", alignItems: "start" }}>
                        <div style={{ background: "#000", color: "#fff", minWidth: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px", border: "2px solid #000", boxShadow: "2px 2px 0px #000" }}>{i + 1}</div>
                        <p style={{ fontSize: "15px", fontWeight: 800, lineHeight: 1.3 }}>{text}</p>
                    </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
