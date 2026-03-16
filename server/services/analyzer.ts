import OpenAI from "openai";
import type { AlternativeSuggestion, OverstimulationAnalysis, ChannelVideoBreakdown } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface AnalysisResult {
  isAppropriate: boolean;
  confidenceScore: number;
  reasoning: string;
  tags: string[];
  ageRating: string;
  alternativeSuggestions?: AlternativeSuggestion[];
  overstimulationAnalysis?: OverstimulationAnalysis;
}

export async function analyzeVideoContent(
  title: string,
  description: string,
  channelTitle: string,
  tags?: string[]
): Promise<AnalysisResult> {
  const prompt = `You are a child safety expert analyzing YouTube video content to determine if it's appropriate for children.

Analyze the following video information and determine:
1. Is this content appropriate for children under 13?
2. What is your confidence level (0-100)?
3. What age rating would you assign? (All Ages, 7+, 10+, 13+, Not for Children)
4. What content tags apply? (e.g., educational, cartoon, music, gaming, scary, violence, language, mature themes)
5. A brief explanation of your reasoning.
6. If the content is NOT appropriate for children, suggest 2-3 child-safe alternative search queries based on the video's topic. Include known kid-friendly YouTube channels that cover similar topics.
7. OVERSTIMULATION ANALYSIS (Decision Support Feature - Not Medical Advice): Analyze the video metadata for indicators of potentially overstimulating content for young children. Consider these factors:
   - Rapid scene changes or fast editing (often indicated by words like "compilation", "fast", "quick cuts")
   - Excessive sound effects (indicated by descriptions mentioning lots of sounds, noises)
   - Intense or loud background music (energetic, upbeat, electronic music references)
   - Repeated visual cues or patterns (looping content, repetitive sequences)
   - Bright colors or flashing visuals (neon, colorful, flashing, bright)
   - Fast-paced language or narration
   - Highly repetitive phrasing or content
   
   Rate the overstimulation level as "low", "moderate", or "high" and provide:
   - A parent-friendly explanation (1-2 sentences)
   - Age recommendation: Who is this appropriate for? (e.g., "Suitable for toddlers 2+", "Better for preschoolers 4+", "Best for school-age children 6+")
   - List of detected overstimulation factors

Video Information:
- Title: ${title}
- Channel: ${channelTitle}
- Description: ${description || "No description available"}
${tags && tags.length > 0 ? `- Tags: ${tags.join(", ")}` : ""}

Known kid-friendly channels to consider for alternatives:
- Educational: "National Geographic Kids", "SciShow Kids", "Crash Course Kids", "PBS Kids", "Khan Academy Kids"
- Entertainment: "Ryan's World", "Blippi", "CoComelon", "Pinkfong", "Super Simple Songs"
- Gaming: "Stampy", "DanTDM (family-friendly content)", "PrestonPlayz"
- Science/Nature: "Wild Kratts", "The Brain Scoop Kids", "SmarterEveryDay"
- Stories/Reading: "Storyline Online", "Brightly Storytime"

Respond in JSON format:
{
  "isAppropriate": boolean,
  "confidenceScore": number (0-100),
  "ageRating": string,
  "tags": string[],
  "reasoning": string,
  "alternativeSuggestions": [
    {
      "searchQuery": "kid-friendly search term related to the topic",
      "reason": "why this is a good alternative",
      "suggestedChannels": ["Channel Name 1", "Channel Name 2"]
    }
  ],
  "overstimulationAnalysis": {
    "rating": "low" | "moderate" | "high",
    "explanation": "Parent-friendly explanation of overstimulation assessment",
    "ageRecommendation": "Suitable for toddlers 2+" | "Better for preschoolers 4+" | "Best for school-age children 6+" | etc.,
    "factors": ["factor1", "factor2"] // detected overstimulation factors, empty array if low
  }
}`;

  let response;
  try {
    response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in child safety and content moderation. Analyze content objectively and err on the side of caution when it comes to child safety. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 4096,
    });
  } catch (apiError: any) {
    console.error("OpenAI API error:", apiError?.message || apiError);
    console.error("Error details:", JSON.stringify(apiError, null, 2));
    throw new Error(`AI API error: ${apiError?.message || "Unknown error"}`);
  }

  const content = response.choices[0]?.message?.content;
  if (!content) {
    console.error("Empty response from AI. Full response:", JSON.stringify(response, null, 2));
    throw new Error("No response from AI");
  }

  try {
    const result = JSON.parse(content) as AnalysisResult;
    return {
      isAppropriate: result.isAppropriate ?? false,
      confidenceScore: Math.min(100, Math.max(0, result.confidenceScore ?? 50)),
      reasoning: result.reasoning ?? "Analysis completed",
      tags: Array.isArray(result.tags) ? result.tags : [],
      ageRating: result.ageRating ?? "Unknown",
      alternativeSuggestions: result.isAppropriate === false && Array.isArray(result.alternativeSuggestions) 
        ? result.alternativeSuggestions 
        : undefined,
      overstimulationAnalysis: result.overstimulationAnalysis ? {
        rating: result.overstimulationAnalysis.rating ?? "low",
        explanation: result.overstimulationAnalysis.explanation ?? "No overstimulation concerns detected.",
        ageRecommendation: result.overstimulationAnalysis.ageRecommendation ?? "Suitable for all ages",
        factors: Array.isArray(result.overstimulationAnalysis.factors) ? result.overstimulationAnalysis.factors : [],
      } : undefined,
    };
  } catch {
    throw new Error("Failed to parse AI response");
  }
}

export interface ChannelVideoAnalysisResult {
  title: string;
  youtubeId: string;
  isAppropriate: boolean;
  confidenceScore: number;
  ageRating: string;
  reasoning: string;
  tags: string[];
  overstimulationRating: string;
}

export interface ChannelAnalysisResult {
  overallGrade: string;
  overallReasoning: string;
  overstimulationRating: string;
  topConcerns: string[];
  safeCount: number;
  flaggedCount: number;
  totalAnalyzed: number;
  videoBreakdown: ChannelVideoAnalysisResult[];
}

export async function analyzeChannel(
  channelName: string,
  videos: Array<{ id: string; snippet: { title: string; description: string; channelTitle: string; tags?: string[] } }>
): Promise<ChannelAnalysisResult> {
  const videoResults: ChannelVideoAnalysisResult[] = [];
  for (const video of videos) {
    try {
      const result = await analyzeVideoContent(
        video.snippet.title,
        video.snippet.description,
        video.snippet.channelTitle,
        video.snippet.tags
      );
      videoResults.push({
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

  if (videoResults.length === 0) {
    throw new Error("Failed to analyze any videos from this channel");
  }

  const synthesis = await synthesizeChannelAnalysis(channelName, videoResults);
  const safeCount = videoResults.filter(v => v.isAppropriate).length;

  return {
    ...synthesis,
    safeCount,
    flaggedCount: videoResults.length - safeCount,
    totalAnalyzed: videoResults.length,
    videoBreakdown: videoResults,
  };
}

export interface ChannelSynthesisResult {
  overallGrade: string;
  overallReasoning: string;
  overstimulationRating: string;
  topConcerns: string[];
}

export async function synthesizeChannelAnalysis(
  channelName: string,
  videoResults: Array<{
    title: string;
    isAppropriate: boolean;
    confidenceScore: number;
    ageRating: string;
    reasoning: string;
    tags: string[];
    overstimulationRating: string;
  }>
): Promise<ChannelSynthesisResult> {
  const safeCount = videoResults.filter(v => v.isAppropriate).length;
  const total = videoResults.length;

  const videoSummaries = videoResults.map((v, i) =>
    `${i + 1}. "${v.title}" — ${v.isAppropriate ? "Safe" : "Flagged"} (${v.ageRating}, confidence: ${v.confidenceScore}%, overstim: ${v.overstimulationRating}) Tags: ${v.tags.join(", ")}. ${v.reasoning}`
  ).join("\n");

  const prompt = `You are a child safety expert. Analyze the following sample of ${total} recent videos from the YouTube channel "${channelName}" and produce an overall channel safety assessment.

Per-video results:
${videoSummaries}

Summary stats: ${safeCount}/${total} videos rated safe.

Based on this data, provide:
1. An overall letter grade (A, B, C, D, or F) where A = very safe for children, F = not safe at all
2. A 2-3 sentence parent-facing summary explaining the grade
3. An aggregate overstimulation rating for the channel ("low", "moderate", or "high")
4. A list of the top concerns found (empty array if the channel is very safe)

Respond in JSON:
{
  "overallGrade": "A" | "B" | "C" | "D" | "F",
  "overallReasoning": "Parent-facing summary...",
  "overstimulationRating": "low" | "moderate" | "high",
  "topConcerns": ["concern1", "concern2"]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert in child safety and content moderation. Provide an honest, balanced assessment. Always respond with valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI for channel synthesis");
  }

  const result = JSON.parse(content) as ChannelSynthesisResult;
  return {
    overallGrade: result.overallGrade ?? "C",
    overallReasoning: result.overallReasoning ?? "Analysis completed.",
    overstimulationRating: result.overstimulationRating ?? "moderate",
    topConcerns: Array.isArray(result.topConcerns) ? result.topConcerns : [],
  };
}
