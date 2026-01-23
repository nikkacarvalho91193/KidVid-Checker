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

// === TYPES ===

export type Search = typeof searches.$inferSelect;
export type InsertSearch = z.infer<typeof insertSearchSchema>;

export type VideoAnalysis = typeof videoAnalysis.$inferSelect;
export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;

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
