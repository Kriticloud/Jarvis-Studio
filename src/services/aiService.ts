import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeWebsiteContent(data: { url: string; title: string; description: string; content: string }) {
  const model = "gemini-3-flash-preview";

  const prompt = `Analyze the following website content and provide a comprehensive redesign strategy. 
  URL: ${data.url}
  Title: ${data.title}
  Description: ${data.description}
  
  Body Content Sample: 
  ${data.content}

  Please generate a detailed JSON response with the following structure:
  {
    "score": number (0-100, modernity/quality score),
    "analysis": {
      "strengths": string[],
      "weaknesses": string[],
      "uxIssues": string[],
      "trustLevel": string (Low/Medium/High),
      "conversionPotential": string
    },
    "redesign": {
      "strategy": string,
      "heroSection": {
        "headline": string,
        "subheadline": string,
        "cta": string,
        "visualConcept": string
      },
      "colorPalette": {
        "primary": string,
        "secondary": string,
        "accent": string,
        "neutral": string,
        "rationale": string
      },
      "typography": {
        "headingFont": string,
        "bodyFont": string,
        "rationale": string
      },
      "sections": Array<{
        "name": string,
        "purpose": string,
        "layout": string
      }>
    },
    "branding": {
      "mood": string,
      "positioning": string,
      "tone": string
    }
  }`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    if (error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("RATE_LIMIT_EXCEEDED")) {
      throw new Error("AI Quota Exceeded: The design engine is currently at capacity. Please try again in a few moments or upgrade to a Pro plan.");
    }
    throw new Error(error?.message || "Failed to analyze website content");
  }
}

export async function generateVisualInspiration(prompt: string) {
  try {
    // Use image generation for visual redesign concept
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Using a more stable model for general processing
      contents: {
        parts: [
          {
            text: `A premium, high-end website redesign mockup. Style: ${prompt}. Cinematic lighting, 8k resolution, minimalist luxury aesthetic, modern UI.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error: any) {
    console.error("Visual Inspiration Error:", error);
    // Non-blocking for visual mockup if it fails
    return null;
  }
}
