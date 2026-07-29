import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface YouTubeVideoResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  youtubeUrl: string;
  embedUrl: string;
}

const fallbackVideos: Record<string, YouTubeVideoResult[]> = {
  physics: [
    {
      id: "pQp6bmjPU_0",
      title: "Faraday's Law of Electromagnetic Induction Explained",
      description: "Visual animation of magnetic flux inducing electrical EMF across conductor loops.",
      thumbnail: "https://i.ytimg.com/vi/pQp6bmjPU_0/hqdefault.jpg",
      channelTitle: "Doc Physics",
      youtubeUrl: "https://www.youtube.com/watch?v=pQp6bmjPU_0",
      embedUrl: "https://www.youtube-nocookie.com/embed/pQp6bmjPU_0",
    },
    {
      id: "nk26G_B5vI0",
      title: "Quantum Tunneling Explained in 3 Minutes",
      description: "How particles cross potential energy barriers in quantum physics.",
      thumbnail: "https://i.ytimg.com/vi/nk26G_B5vI0/hqdefault.jpg",
      channelTitle: "MinutePhysics",
      youtubeUrl: "https://www.youtube.com/watch?v=nk26G_B5vI0",
      embedUrl: "https://www.youtube-nocookie.com/embed/nk26G_B5vI0",
    },
  ],
  math: [
    {
      id: "rAof9Ld5sOg",
      title: "Calculus Limits & Local Linearity Intuition",
      description: "Visualizing derivative slope and limits as curves zoom into straight lines.",
      thumbnail: "https://i.ytimg.com/vi/rAof9Ld5sOg/hqdefault.jpg",
      channelTitle: "3Blue1Brown",
      youtubeUrl: "https://www.youtube.com/watch?v=rAof9Ld5sOg",
      embedUrl: "https://www.youtube-nocookie.com/embed/rAof9Ld5sOg",
    },
  ],
  ict: [
    {
      id: "GFQaEYEc8_8",
      title: "Database Normalization (1NF, 2NF, 3NF)",
      description: "Step-by-step tutorial on eliminating data redundancy in relational databases.",
      thumbnail: "https://i.ytimg.com/vi/GFQaEYEc8_8/hqdefault.jpg",
      channelTitle: "Caleb Curry",
      youtubeUrl: "https://www.youtube.com/watch?v=GFQaEYEc8_8",
      embedUrl: "https://www.youtube-nocookie.com/embed/GFQaEYEc8_8",
    },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { query, subject } = await req.json();
    const apiKey = process.env.YOUTUBE_API_KEY;

    const searchQuery = query || `${subject || "Physics"} GCE A-Level explainer`;

    if (!apiKey) {
      console.log("No YOUTUBE_API_KEY configured, returning fallback videos.");
      const key = (subject || "physics").toLowerCase();
      return NextResponse.json({ videos: fallbackVideos[key] || fallbackVideos.physics });
    }

    // Call YouTube Data API v3 search endpoint
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(
      searchQuery
    )}&type=video&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("YouTube Data API response non-ok:", response.status, errorText);
      const key = (subject || "physics").toLowerCase();
      return NextResponse.json({ videos: fallbackVideos[key] || fallbackVideos.physics });
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      const key = (subject || "physics").toLowerCase();
      return NextResponse.json({ videos: fallbackVideos[key] || fallbackVideos.physics });
    }

    const videos: YouTubeVideoResult[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${item.id.videoId}`,
    }));

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("YouTube search API exception:", err);
    return NextResponse.json({ videos: fallbackVideos.physics });
  }
}
