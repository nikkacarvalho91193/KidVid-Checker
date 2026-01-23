import OpenAI from "openai";
import type { AlternativeSuggestion } from "@shared/schema";

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
  ] // Only include if isAppropriate is false
}`;

  const response = await openai.chat.completions.create({
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
    max_completion_tokens: 1024,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
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
    };
  } catch {
    throw new Error("Failed to parse AI response");
  }
}
