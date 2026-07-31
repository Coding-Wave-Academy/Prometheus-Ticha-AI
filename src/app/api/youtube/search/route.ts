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

/* ------------------------------------------------------------------ */
/*  Subject-specific search refinements                                */
/* ------------------------------------------------------------------ */
const subjectSearchRefinements: Record<string, string> = {
  physics: "physics GCE A-Level explainer tutorial",
  math: "mathematics GCE A-Level tutorial explained",
  "pure mathematics": "pure mathematics A-Level tutorial explained",
  "further mathematics": "further mathematics A-Level tutorial",
  ict: "ICT computing GCE tutorial explained",
  chemistry: "chemistry GCE A-Level tutorial explained",
  biology: "biology GCE A-Level tutorial explained",
};

/* ------------------------------------------------------------------ */
/*  Verified embeddable fallback video IDs per subject                 */
/* ------------------------------------------------------------------ */
const fallbackVideos: Record<string, YouTubeVideoResult[]> = {
  physics: [
    {
      id: "ZM8ECpBuQYE",
      title: "Newton's Laws of Motion - Full Course",
      description: "Complete breakdown of Newton's three laws with real-world examples.",
      thumbnail: "https://i.ytimg.com/vi/ZM8ECpBuQYE/hqdefault.jpg",
      channelTitle: "Khan Academy",
      youtubeUrl: "https://www.youtube.com/watch?v=ZM8ECpBuQYE",
      embedUrl: "https://www.youtube.com/embed/ZM8ECpBuQYE",
    },
    {
      id: "kKKM8Y-u7ds",
      title: "Electromagnetic Induction Explained",
      description: "How changing magnetic fields create electric current.",
      thumbnail: "https://i.ytimg.com/vi/kKKM8Y-u7ds/hqdefault.jpg",
      channelTitle: "The Organic Chemistry Tutor",
      youtubeUrl: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
      embedUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
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
  chemistry: [
    {
      id: "xuPl_8wv9xo",
      title: "Atomic Structure & Electron Configuration",
      description: "Complete breakdown of atomic structure for exam preparation.",
      thumbnail: "https://i.ytimg.com/vi/xuPl_8wv9xo/hqdefault.jpg",
      channelTitle: "Professor Dave Explains",
      youtubeUrl: "https://www.youtube.com/watch?v=xuPl_8wv9xo",
      embedUrl: "https://www.youtube.com/embed/xuPl_8wv9xo",
    },
  ],
  biology: [
    {
      id: "URUJD5NEXC8",
      title: "Cell Structure & Function",
      description: "Amoeba Sisters guide to cell organelles and their functions.",
      thumbnail: "https://i.ytimg.com/vi/URUJD5NEXC8/hqdefault.jpg",
      channelTitle: "Amoeba Sisters",
      youtubeUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
      embedUrl: "https://www.youtube.com/embed/URUJD5NEXC8",
    },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { query, subject } = await req.json();
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Build a subject-aware search query
    const subjectKey = (subject || "physics").toLowerCase();
    const refinement = subjectSearchRefinements[subjectKey] || "GCE A-Level explainer tutorial";
    const searchQuery = query
      ? `${query} ${refinement}`
      : `${subject || "Physics"} ${refinement}`;

    if (!apiKey) {
      console.log("No YOUTUBE_API_KEY configured, returning fallback videos.");
      return NextResponse.json({ videos: fallbackVideos[subjectKey] || fallbackVideos.physics });
    }

    // Call YouTube Data API v3 with videoEmbeddable=true and medium duration for quality content
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(
      searchQuery
    )}&type=video&videoEmbeddable=true&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("YouTube Data API response non-ok:", response.status, errorText);
      return NextResponse.json({ videos: fallbackVideos[subjectKey] || fallbackVideos.physics });
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ videos: fallbackVideos[subjectKey] || fallbackVideos.physics });
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
