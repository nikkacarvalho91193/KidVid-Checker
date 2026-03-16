import { db } from "./db";
import { videoAnalysis, searches, channelAnalysis, type InsertVideoAnalysis, type VideoAnalysis, type InsertSearch, type Search, type ChannelAnalysis, type InsertChannelAnalysis } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createSearch(query: string): Promise<Search>;
  getAnalysisByYoutubeId(youtubeId: string): Promise<VideoAnalysis | undefined>;
  createAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis>;
  getAllAnalyses(): Promise<VideoAnalysis[]>;
  getAnalysisById(id: number): Promise<VideoAnalysis | undefined>;
  getChannelAnalysisByChannelId(channelId: string): Promise<ChannelAnalysis | undefined>;
  createChannelAnalysis(analysis: InsertChannelAnalysis): Promise<ChannelAnalysis>;
  getAllChannelAnalyses(): Promise<ChannelAnalysis[]>;
}

export class DatabaseStorage implements IStorage {
  async createSearch(query: string): Promise<Search> {
    const [search] = await db.insert(searches).values({ query }).returning();
    return search;
  }

  async getAnalysisByYoutubeId(youtubeId: string): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db.select().from(videoAnalysis).where(eq(videoAnalysis.youtubeId, youtubeId));
    return analysis;
  }

  async createAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const [created] = await db.insert(videoAnalysis).values(analysis).returning();
    return created;
  }

  async getAllAnalyses(): Promise<VideoAnalysis[]> {
    return await db.select().from(videoAnalysis).orderBy(desc(videoAnalysis.analyzedAt));
  }

  async getAnalysisById(id: number): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db.select().from(videoAnalysis).where(eq(videoAnalysis.id, id));
    return analysis;
  }

  async getChannelAnalysisByChannelId(channelId: string): Promise<ChannelAnalysis | undefined> {
    const [analysis] = await db.select().from(channelAnalysis).where(eq(channelAnalysis.channelId, channelId));
    return analysis;
  }

  async createChannelAnalysis(analysis: InsertChannelAnalysis): Promise<ChannelAnalysis> {
    const [created] = await db.insert(channelAnalysis).values(analysis).returning();
    return created;
  }

  async getAllChannelAnalyses(): Promise<ChannelAnalysis[]> {
    return await db.select().from(channelAnalysis).orderBy(desc(channelAnalysis.analyzedAt));
  }
}

export const storage = new DatabaseStorage();
