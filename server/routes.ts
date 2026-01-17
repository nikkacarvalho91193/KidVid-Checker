import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { searchRequestSchema, analyzeRequestSchema } from "@shared/schema";
import { searchYouTube, getVideoDetails } from "./services/youtube";
import { analyzeVideoContent } from "./services/analyzer";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.youtube.search.path, async (req, res) => {
    try {
      const input = searchRequestSchema.parse(req.body);
      
      await storage.createSearch(input.query);
      
      const results = await searchYouTube(input.query, input.maxResults);
      res.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Search error:", err);
      res.status(500).json({ message: "Failed to search YouTube" });
    }
  });

  app.post(api.youtube.analyze.path, async (req, res) => {
    try {
      const input = analyzeRequestSchema.parse(req.body);
      
      const existing = await storage.getAnalysisByYoutubeId(input.videoId);
      if (existing) {
        return res.json(existing);
      }
      
      const videoDetails = await getVideoDetails(input.videoId);
      if (!videoDetails) {
        return res.status(400).json({ message: "Video not found" });
      }
      
      const analysisResult = await analyzeVideoContent(
        videoDetails.snippet.title,
        videoDetails.snippet.description,
        videoDetails.snippet.channelTitle,
        videoDetails.snippet.tags
      );
      
      const analysis = await storage.createAnalysis({
        youtubeId: input.videoId,
        title: videoDetails.snippet.title,
        description: videoDetails.snippet.description,
        channelTitle: videoDetails.snippet.channelTitle,
        thumbnailUrl: videoDetails.snippet.thumbnails.medium?.url || videoDetails.snippet.thumbnails.default?.url || "",
        isAppropriate: analysisResult.isAppropriate,
        confidenceScore: analysisResult.confidenceScore,
        reasoning: analysisResult.reasoning,
        tags: analysisResult.tags,
        ageRating: analysisResult.ageRating,
      });
      
      res.json(analysis);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Analysis error:", err);
      res.status(500).json({ message: "Failed to analyze video" });
    }
  });

  app.get(api.history.list.path, async (req, res) => {
    try {
      const analyses = await storage.getAllAnalyses();
      res.json(analyses);
    } catch (err) {
      console.error("History error:", err);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  app.get(api.history.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getAnalysisById(id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (err) {
      console.error("History error:", err);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  return httpServer;
}
