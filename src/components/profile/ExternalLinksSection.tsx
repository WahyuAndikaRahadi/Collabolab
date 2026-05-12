
"use client";

import { useEffect, useState } from "react";
import { ExternalLinkChip } from "./ExternalLinkChip";
import { LinkedInPreviewCard } from "./LinkedInPreviewCard";

interface Link {
  id: string;
  platform: any;
  url: string;
  username?: string;
  label?: string;
  status: string;
  previewTitle?: string;
  previewImage?: string;
}

interface Props {
  username: string;
}

export function ExternalLinksSection({ username }: Props) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch(`/api/profile/${username}/links`);
        if (res.ok) {
          const data = await res.json();
          setLinks(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile links:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, [username]);

  if (loading) return <div style={{ fontSize: "14px", color: "#666" }}>Memuat profil eksternal...</div>;
  if (links.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {links.map(link => (
        <ExternalLinkChip 
          key={link.id}
          platform={link.platform}
          url={link.url}
          username={link.username}
          label={link.label}
          status={link.status}
          previewTitle={link.previewTitle}
          previewImage={link.previewImage}
          description={link.platform === "LINKEDIN" ? "Lihat riwayat profesional dan pendidikan di LinkedIn." : undefined}
        />
      ))}
    </div>
  );
}
