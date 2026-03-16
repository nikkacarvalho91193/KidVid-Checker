import type { YouTubeSearchResult, YouTubeChannelResult } from "@shared/schema";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        medium?: { url: string };
        default?: { url: string };
      };
    };
  }>;
}

interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        medium?: { url: string };
        default?: { url: string };
      };
      tags?: string[];
      categoryId?: string;
    };
    contentDetails?: {
      contentRating?: {
        ytRating?: string;
      };
    };
  }>;
}

interface YouTubeChannelSearchResponse {
  items: Array<{
    id: { channelId: string };
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      thumbnails: {
        medium?: { url: string };
        default?: { url: string };
      };
    };
  }>;
}

interface YouTubeChannelDetailsResponse {
  items: Array<{
    id: string;
    statistics: {
      subscriberCount: string;
      videoCount: string;
    };
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }>;
}

interface YouTubePlaylistItemsResponse {
  items: Array<{
    contentDetails: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        medium?: { url: string };
        default?: { url: string };
      };
    };
  }>;
}

export async function searchYouTube(query: string, maxResults: number = 10): Promise<YouTubeSearchResult[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(maxResults),
    key: YOUTUBE_API_KEY,
    safeSearch: "none",
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube API error: ${error}`);
  }

  const data: YouTubeSearchResponse = await response.json();

  return data.items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || "",
  }));
}

export async function getVideoDetails(videoId: string): Promise<YouTubeVideoResponse["items"][0] | null> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    id: videoId,
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube API error: ${error}`);
  }

  const data: YouTubeVideoResponse = await response.json();
  return data.items[0] || null;
}

export async function searchChannels(query: string, maxResults: number = 6): Promise<YouTubeChannelResult[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  const searchParams = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "channel",
    maxResults: String(maxResults),
    key: YOUTUBE_API_KEY,
  });

  const searchResponse = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`);
  if (!searchResponse.ok) {
    const error = await searchResponse.text();
    throw new Error(`YouTube API error: ${error}`);
  }

  const searchData: YouTubeChannelSearchResponse = await searchResponse.json();
  if (!searchData.items || searchData.items.length === 0) {
    return [];
  }

  const channelIds = searchData.items.map(item => item.id.channelId).join(",");
  const detailsParams = new URLSearchParams({
    part: "statistics",
    id: channelIds,
    key: YOUTUBE_API_KEY,
  });

  const detailsResponse = await fetch(`${YOUTUBE_API_BASE}/channels?${detailsParams}`);
  let statsMap: Record<string, string> = {};
  if (detailsResponse.ok) {
    const detailsData: YouTubeChannelDetailsResponse = await detailsResponse.json();
    for (const item of detailsData.items) {
      statsMap[item.id] = item.statistics.subscriberCount;
    }
  }

  return searchData.items.map((item) => ({
    channelId: item.id.channelId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || "",
    subscriberCount: statsMap[item.id.channelId] || "0",
  }));
}

export async function getChannelVideos(channelId: string, maxResults: number = 8): Promise<YouTubeVideoResponse["items"]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  const channelParams = new URLSearchParams({
    part: "contentDetails",
    id: channelId,
    key: YOUTUBE_API_KEY,
  });

  const channelResponse = await fetch(`${YOUTUBE_API_BASE}/channels?${channelParams}`);
  if (!channelResponse.ok) {
    const error = await channelResponse.text();
    throw new Error(`YouTube API error: ${error}`);
  }

  const channelData: YouTubeChannelDetailsResponse = await channelResponse.json();
  if (!channelData.items || channelData.items.length === 0) {
    return [];
  }

  const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

  const playlistParams = new URLSearchParams({
    part: "contentDetails,snippet",
    playlistId: uploadsPlaylistId,
    maxResults: String(maxResults),
    key: YOUTUBE_API_KEY,
  });

  const playlistResponse = await fetch(`${YOUTUBE_API_BASE}/playlistItems?${playlistParams}`);
  if (!playlistResponse.ok) {
    const error = await playlistResponse.text();
    throw new Error(`YouTube API error: ${error}`);
  }

  const playlistData: YouTubePlaylistItemsResponse = await playlistResponse.json();
  const videoIds = playlistData.items.map(item => item.contentDetails.videoId).join(",");

  if (!videoIds) return [];

  const videosParams = new URLSearchParams({
    part: "snippet,contentDetails",
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  const videosResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${videosParams}`);
  if (!videosResponse.ok) {
    const error = await videosResponse.text();
    throw new Error(`YouTube API error: ${error}`);
  }

  const videosData: YouTubeVideoResponse = await videosResponse.json();
  return videosData.items || [];
}
