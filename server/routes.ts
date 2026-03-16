import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { searchRequestSchema, analyzeRequestSchema, channelSearchRequestSchema, channelAnalyzeRequestSchema } from "@shared/schema";
import { searchYouTube, getVideoDetails, searchChannels, getChannelVideos } from "./services/youtube";
import { analyzeVideoContent, synthesizeChannelAnalysis } from "./services/analyzer";
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
        alternativeSuggestions: analysisResult.alternativeSuggestions,
        overstimulationAnalysis: analysisResult.overstimulationAnalysis,
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

  app.post(api.channel.search.path, async (req, res) => {
    try {
      const input = channelSearchRequestSchema.parse(req.body);
      const results = await searchChannels(input.query, input.maxResults);
      res.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Channel search error:", err);
      res.status(500).json({ message: "Failed to search channels" });
    }
  });

  app.post(api.channel.analyze.path, async (req, res) => {
    try {
      const input = channelAnalyzeRequestSchema.parse(req.body);

      const existing = await storage.getChannelAnalysisByChannelId(input.channelId);
      if (existing) {
        return res.json(existing);
      }

      const videos = await getChannelVideos(input.channelId, 8);
      if (!videos || videos.length === 0) {
        return res.status(400).json({ message: "No videos found for this channel" });
      }

      let channelThumbnailUrl: string | null = null;
      let channelSubscriberCount: string | null = null;
      try {
        const channelInfoParams = new URLSearchParams({
          part: "snippet,statistics",
          id: input.channelId,
          key: process.env.YOUTUBE_API_KEY || "",
        });
        const channelInfoRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?${channelInfoParams}`);
        if (channelInfoRes.ok) {
          const channelInfoData = await channelInfoRes.json();
          if (channelInfoData.items && channelInfoData.items.length > 0) {
            channelThumbnailUrl = channelInfoData.items[0].snippet?.thumbnails?.medium?.url || channelInfoData.items[0].snippet?.thumbnails?.default?.url || null;
            channelSubscriberCount = channelInfoData.items[0].statistics?.subscriberCount || null;
          }
        }
      } catch {
      }

      const videoAnalysisResults = [];
      for (const video of videos) {
        try {
          const result = await analyzeVideoContent(
            video.snippet.title,
            video.snippet.description,
            video.snippet.channelTitle,
            video.snippet.tags
          );
          videoAnalysisResults.push({
            title: video.snippet.title,
            youtubeId: video.id,
            isAppropriate: result.isAppropriate,
            confidenceScore: result.confidenceScore,
            ageRating: result.ageRating,
            reasoning: result.reasoning,
            tags: result.tags,
            overstimulationRating: result.overstimulationAnalysis?.rating || "low",
          });
        } catch (err) {
          console.error(`Failed to analyze video ${video.id}:`, err);
        }
      }

      if (videoAnalysisResults.length === 0) {
        return res.status(500).json({ message: "Failed to analyze any videos from this channel" });
      }

      const synthesis = await synthesizeChannelAnalysis(
        videos[0].snippet.channelTitle,
        videoAnalysisResults
      );

      const safeCount = videoAnalysisResults.filter(v => v.isAppropriate).length;
      const flaggedCount = videoAnalysisResults.length - safeCount;

      const breakdown = videoAnalysisResults.map(v => ({
        title: v.title,
        youtubeId: v.youtubeId,
        isAppropriate: v.isAppropriate,
        ageRating: v.ageRating,
        overstimulationRating: v.overstimulationRating,
        confidenceScore: v.confidenceScore,
      }));

      const channelResult = await storage.createChannelAnalysis({
        channelId: input.channelId,
        channelName: videos[0].snippet.channelTitle,
        thumbnailUrl: channelThumbnailUrl,
        subscriberCount: channelSubscriberCount,
        overallGrade: synthesis.overallGrade,
        safeCount,
        flaggedCount,
        totalAnalyzed: videoAnalysisResults.length,
        overallReasoning: synthesis.overallReasoning,
        overstimulationRating: synthesis.overstimulationRating,
        topConcerns: synthesis.topConcerns,
        videoBreakdown: breakdown,
      });

      res.json(channelResult);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Channel analysis error:", err);
      res.status(500).json({ message: "Failed to analyze channel" });
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
