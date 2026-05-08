
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Search, MessageSquare, Lock, Clock, CheckCircle2 } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { ProjectBriefGenerator } from "./tools/ProjectBriefGenerator";
import { SkillGapAnalyzer } from "./tools/SkillGapAnalyzer";
import { ProjectRecommendation } from "./tools/ProjectRecommendation";
import { ReviewSummarizer } from "./tools/ReviewSummarizer";
import { AI_TOOL_CONFIG } from "@/lib/ai/config";
import { AITool } from "@prisma/client";

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
    },
    {
      type: AITool.SKILL_GAP_ANALYZER,
      title: "Skill Gap Analyzer",
      description: "Temukan skill apa yang paling dibutuhkan pasar dan cara menutup gap-nya.",
      icon: <Brain />,
    },
    {
      type: AITool.PROJECT_RECOMMENDATION,
      title: "Project Recommendation",
      description: "Matchmaking AI yang mencarikan project paling cocok dengan skill-mu.",
      icon: <Search />,
    },
    {
      type: AITool.REVIEW_SUMMARIZER,
      title: "Review Summarizer",
      description: "Consolidate peer feedback into actionable growth metrics.",
      icon: <MessageSquare />,
    },
  ];

  const getCooldown = (tool: AITool) => cooldowns[tool];

  if (selectedTool === "PROJECT_BRIEF_GENERATOR") return <ProjectBriefGenerator onBack={() => setSelectedTool(null)} />;
  if (selectedTool === "SKILL_GAP_ANALYZER") return <SkillGapAnalyzer onBack={() => setSelectedTool(null)} />;
  if (selectedTool === "PROJECT_RECOMMENDATION") return <ProjectRecommendation onBack={() => setSelectedTool(null)} />;
  if (selectedTool === "REVIEW_SUMMARIZER") return <ReviewSummarizer onBack={() => setSelectedTool(null)} />;

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "60px 20px",
      position: "relative" 
    }}>
      {/* Background Decoration */}
      <div style={{ 
        position: "fixed", 
        top: "10%", 
        left: "5%", 
        width: "100px", 
        height: "100px", 
        border: "4px solid #FFE500", 
        borderRadius: "50%", 
        zIndex: -1,
        opacity: 0.5 
      }} />
      <div style={{ 
        position: "fixed", 
        bottom: "15%", 
        right: "8%", 
        width: "80px", 
        height: "80px", 
        background: "#00D37F", 
        border: "4px solid #000", 
        zIndex: -1,
        transform: "rotate(15deg)",
        opacity: 0.3 
      }} />

      <div style={{ marginBottom: "64px", textAlign: "center" }}>
        <div style={{ 
          background: "#000", 
          color: "#fff", 
          display: "inline-block", 
          padding: "4px 12px", 
          fontWeight: 900, 
          fontSize: "14px", 
          marginBottom: "16px",
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>
          Premium Collaboration Tools
        </div>
        <h1 style={{ 
          fontFamily: "Space Grotesk, sans-serif", 
          fontWeight: 900, 
          fontSize: "clamp(48px, 8vw, 72px)", 
          lineHeight: 0.9,
          marginBottom: "20px",
          letterSpacing: "-3px"
        }}>
          AI HUB <span style={{ color: "#FFE500", WebkitTextStroke: "3px black" }}>01</span>
        </h1>
        <p style={{ 
          fontSize: "20px", 
          color: "#3D3D3D", 
          maxWidth: "650px", 
          lineHeight: 1.4,
          fontWeight: 500,
          margin: "0 auto"
        }}>
          Elevate your collaboration game. These tools use cutting-edge AI to help you find the right projects, fill your skill gaps, and understand your team dynamics.
        </p>
      </div>

      <div className="ai-hub-grid">
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
            />
          );
        })}
      </div>

      {/* Info Section - also centered with the grid */}
      <div style={{ 
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <div style={{ 
          background: "#FFE500", 
          border: "4px solid #000", 
          padding: "48px", 
          boxShadow: "12px 12px 0px #000",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "40px",
        }}>
          <div>
            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "16px", textTransform: "uppercase" }}>
              The Trust Protocol
            </h3>
            <p style={{ fontWeight: 600, lineHeight: 1.6 }}>
              Our AI tools are strictly gated by your <span style={{ background: "#000", color: "#fff", padding: "0 4px" }}>Trust Score</span>. This ensures that the most powerful features are reserved for committed and reliable collaborators.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "start" }}>
              <div style={{ background: "#000", color: "#fff", minWidth: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>1</div>
              <p style={{ fontSize: "14px", fontWeight: 700 }}>Build your score by completing projects and getting positive reviews.</p>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "start" }}>
              <div style={{ background: "#000", color: "#fff", minWidth: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>2</div>
              <p style={{ fontSize: "14px", fontWeight: 700 }}>Unlock advanced generators, analyzers, and matchmaking algorithms.</p>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "start" }}>
              <div style={{ background: "#000", color: "#fff", minWidth: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>3</div>
              <p style={{ fontSize: "14px", fontWeight: 700 }}>Gain access to exclusive "Verified Only" collaborative ecosystems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
