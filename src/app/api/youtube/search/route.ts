import { NextRequest, NextResponse } from "next/server";
import { GCE_VIDEO_CATALOG, normalizeSubjectName, findVideoForTopic } from "@/lib/videoCatalog";

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

function searchCatalog(query: string, subject?: string): YouTubeVideoResult[] {
  const normSubject = subject ? normalizeSubjectName(subject).toLowerCase() : "";
  const queryTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  // Filter by subject first if provided
  let pool = GCE_VIDEO_CATALOG;
  if (normSubject) {
    const subjectMatches = GCE_VIDEO_CATALOG.filter(
      (item) => item.subject.toLowerCase() === normSubject
    );
    if (subjectMatches.length > 0) {
      pool = subjectMatches;
    }
  }

  // Score items based on token matches in title, topic, and keywords
  const scored = pool.map((item) => {
    let score = 0;
    const itemText = `${item.topic} ${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();

    for (const token of queryTokens) {
      if (itemText.includes(token)) {
        if (item.topic.toLowerCase().includes(token)) score += 5;
        else if (item.title.toLowerCase().includes(token)) score += 3;
        else score += 1;
      }
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const matched = scored
    .filter((s) => s.score > 0)
    .map((s) => ({
      id: s.item.id,
      title: s.item.title,
      description: s.item.description,
      thumbnail: s.item.thumbnail,
      channelTitle: s.item.channelTitle,
      youtubeUrl: s.item.youtubeUrl,
      embedUrl: s.item.embedUrl,
    }));

  if (matched.length > 0) return matched;

  // Fallback to top pool items
  return pool.slice(0, 6).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    thumbnail: item.thumbnail,
    channelTitle: item.channelTitle,
    youtubeUrl: item.youtubeUrl,
    embedUrl: item.embedUrl,
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { query, subject } = await req.json().catch(() => ({}));
    const apiKey = process.env.YOUTUBE_API_KEY;

    const subjectName = normalizeSubjectName(subject);
    const catalogResults = searchCatalog(query || subjectName, subject);

    if (!apiKey) {
      return NextResponse.json({ videos: catalogResults });
    }

    const searchQuery = query
      ? `${query} ${subjectName} GCE A-Level tutorial`
      : `${subjectName} GCE A-Level explainer tutorial`;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(
      searchQuery
    )}&type=video&videoEmbeddable=true&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        Referer: "https://prometheus-ticha-ai.vercel.app/",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ videos: catalogResults });
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ videos: catalogResults });
    }

    const liveVideos: YouTubeVideoResult[] = data.items
      .filter((item: any) => item.id?.videoId)
      .map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        channelTitle: item.snippet.channelTitle,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      }));

    return NextResponse.json({ videos: liveVideos.length > 0 ? liveVideos : catalogResults });
  } catch (err) {
    console.error("YouTube search API exception:", err);
    return NextResponse.json({ videos: searchCatalog("Physics", "Physics") });
  }
}

