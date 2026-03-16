import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoAnalysis = pgTable("video_analysis", {
  id: serial("id").primaryKey(),
  youtubeId: text("youtube_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  channelTitle: text("channel_title"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Analysis Results
  isAppropriate: boolean("is_appropriate"),
  confidenceScore: integer("confidence_score"), // 0-100
  reasoning: text("reasoning"),
  tags: jsonb("tags").$type<string[]>(), // e.g., ["educational", "cartoon", "violence", "scary"]
  ageRating: text("age_rating"), // e.g., "All Ages", "7+", "13+"
  
  // Alternative suggestions for unsafe content
  alternativeSuggestions: jsonb("alternative_suggestions").$type<AlternativeSuggestion[]>(),
  
  // Overstimulation analysis
  overstimulationAnalysis: jsonb("overstimulation_analysis").$type<OverstimulationAnalysis>(),
  
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export const channelAnalysis = pgTable("channel_analysis", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull(),
  channelName: text("channel_name").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  subscriberCount: text("subscriber_count"),
  overallGrade: text("overall_grade"),
  safeCount: integer("safe_count"),
  flaggedCount: integer("flagged_count"),
  totalAnalyzed: integer("total_analyzed"),
  overallReasoning: text("overall_reasoning"),
  overstimulationRating: text("overstimulation_rating"),
  topConcerns: jsonb("top_concerns").$type<string[]>(),
  videoBreakdown: jsonb("video_breakdown").$type<ChannelVideoBreakdown[]>(),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export interface ChannelVideoBreakdown {
  title: string;
  youtubeId: string;
  isAppropriate: boolean;
  ageRating: string;
  overstimulationRating: string;
  confidenceScore: number;
}

// Alternative content suggestion type
export interface AlternativeSuggestion {
  searchQuery: string;
  reason: string;
  suggestedChannels: string[];
}

// Overstimulation analysis type
export interface OverstimulationAnalysis {
  rating: "low" | "moderate" | "high";
  explanation: string;
  ageRecommendation: string;
  factors: string[];
}

// === SCHEMAS ===

export const insertSearchSchema = createInsertSchema(searches).omit({ id: true, createdAt: true });
export const insertVideoAnalysisSchema = createInsertSchema(videoAnalysis).omit({ id: true, analyzedAt: true });
export const insertChannelAnalysisSchema = createInsertSchema(channelAnalysis).omit({ id: true, analyzedAt: true });

// === TYPES ===

export type Search = typeof searches.$inferSelect;
export type InsertSearch = z.infer<typeof insertSearchSchema>;

export type VideoAnalysis = typeof videoAnalysis.$inferSelect;
export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;

export type ChannelAnalysis = typeof channelAnalysis.$inferSelect;
export type InsertChannelAnalysis = z.infer<typeof insertChannelAnalysisSchema>;

// Request types
export const searchRequestSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  maxResults: z.number().optional().default(10),
});
export type SearchRequest = z.infer<typeof searchRequestSchema>;

export const analyzeRequestSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
});
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const channelSearchRequestSchema = z.object({
  query: z.string().min(1, "Channel search query is required"),
  maxResults: z.number().optional().default(6),
});
export type ChannelSearchRequest = z.infer<typeof channelSearchRequestSchema>;

export const channelAnalyzeRequestSchema = z.object({
  channelId: z.string().min(1, "Channel ID is required"),
});
export type ChannelAnalyzeRequest = z.infer<typeof channelAnalyzeRequestSchema>;

// Response types
export interface YouTubeSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

export type SearchResponse = YouTubeSearchResult[];

export interface YouTubeChannelResult {
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
}
