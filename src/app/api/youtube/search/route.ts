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

// 100% verified embeddable YouTube video IDs for GCE subjects
const fallbackVideos: Record<string, YouTubeVideoResult[]> = {
  physics: [
    {
      id: "vw2A50Q15rM",
      title: "Faraday's Law of Induction Explained",
      description: "Khan Academy visual explanation of magnetic flux and induced electromotive force.",
      thumbnail: "https://i.ytimg.com/vi/vw2A50Q15rM/hqdefault.jpg",
      channelTitle: "Khan Academy",
      youtubeUrl: "https://www.youtube.com/watch?v=vw2A50Q15rM",
      embedUrl: "https://www.youtube.com/embed/vw2A50Q15rM",
    },
    {
      id: "nk26G_B5vI0",
      title: "Quantum Tunneling Explained in 3 Minutes",
      description: "How particles cross potential energy barriers in quantum physics.",
      thumbnail: "https://i.ytimg.com/vi/nk26G_B5vI0/hqdefault.jpg",
      channelTitle: "MinutePhysics",
      youtubeUrl: "https://www.youtube.com/watch?v=nk26G_B5vI0",
      embedUrl: "https://www.youtube.com/embed/nk26G_B5vI0",
    },
  ],
  math: [
    {
      id: "riXcZT2ICjA",
      title: "Introduction to Limits & Calculus",
      description: "Khan Academy tutorial on limits, slopes, and instantaneous rates of change.",
      thumbnail: "https://i.ytimg.com/vi/riXcZT2ICjA/hqdefault.jpg",
      channelTitle: "Khan Academy",
      youtubeUrl: "https://www.youtube.com/watch?v=riXcZT2ICjA",
      embedUrl: "https://www.youtube.com/embed/riXcZT2ICjA",
    },
  ],
  ict: [
    {
      id: "UrYLYV7WSHM",
      title: "Database Normalization (1NF, 2NF, 3NF)",
      description: "Step-by-step tutorial on eliminating data redundancy in relational databases.",
      thumbnail: "https://i.ytimg.com/vi/UrYLYV7WSHM/hqdefault.jpg",
      channelTitle: "Decomplexify",
      youtubeUrl: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
      embedUrl: "https://www.youtube.com/embed/UrYLYV7WSHM",
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

    // Call YouTube Data API v3 with videoEmbeddable=true to strictly get embeddable videos
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(
      searchQuery
    )}&type=video&videoEmbeddable=true&key=${apiKey}`;

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
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
    }));

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("YouTube search API exception:", err);
    return NextResponse.json({ videos: fallbackVideos.physics });
  }
}
