import { db } from "./db";
import { videoAnalysis, searches, type InsertVideoAnalysis, type VideoAnalysis, type InsertSearch, type Search } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createSearch(query: string): Promise<Search>;
  getAnalysisByYoutubeId(youtubeId: string): Promise<VideoAnalysis | undefined>;
  createAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis>;
  getAllAnalyses(): Promise<VideoAnalysis[]>;
  getAnalysisById(id: number): Promise<VideoAnalysis | undefined>;
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
}

export const storage = new DatabaseStorage();
