
import { GoogleGenAI } from "@google/genai";
import { GenerationSettings } from "../types";

export class GeminiService {
  private getMimeType(base64: string): string {
    const match = base64.match(/^data:([^;]+);base64,/);
    return match ? match[1] : 'image/jpeg';
  }

  async generateFashionImage(
    modelBase64: string,
    productBase64: string,
    settings: GenerationSettings
  ): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = this.buildPrompt(settings);
    
    const modelMime = this.getMimeType(modelBase64);
    const productMime = this.getMimeType(productBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: modelBase64.split(',')[1],
              mimeType: modelMime,
            },
          },
          {
            inlineData: {
              data: productBase64.split(',')[1],
              mimeType: productMime,
            },
          },
          {
            text: `ACT AS A PROFESSIONAL AI COMMERCIAL FASHION PHOTOGRAPHER. 
            TASK: Seamlessly fit the provided product (second image) onto the model (first image).
            
            CORE REQUIREMENTS:
            - Preserve model's face identity, skin tone, and body type perfectly.
            - Integrate product naturally with realistic fabric folds, shadows, and lighting.
            - Background: ${settings.background}.
            - Aesthetic: ${settings.brandStyle} style, consistent with ${settings.brandColor} tones.
            - Platform Optimization: ${settings.platform}.
            - Quality: ${settings.resolution === 'HD' ? 'Ultra high definition, sharp commercial focus' : 'Standard marketing resolution'}.
            - Ensure commercial-grade realism and clean edges.
            
            ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: this.getAspectRatio(settings.platform),
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data returned from Gemini. The prompt might have been filtered.");
  }

  async enhanceImage(imageBase64: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const mimeType = this.getMimeType(imageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: `ACT AS A HIGH-END FASHION RETOUCHER. 
            TASK: Enhance this commercial fashion image.
            
            INSTRUCTIONS:
            - Perform professional color grading and lighting balance.
            - Upscale the image quality and sharpen fine textures (fabric weave, skin pores, hair).
            - Remove AI artifacts while maintaining the original model's identity and product details.
            - The final result must look like a 4K commercial magazine cover shot.
            - KEEP THE COMPOSITION EXACTLY THE SAME.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", 
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Enhancement failed. Please try a different image.");
  }

  private buildPrompt(settings: GenerationSettings): string {
    return `Create a photorealistic marketing image. The product must be perfectly aligned with the model's body. 
    Use professional studio lighting if studio is selected, or natural cinematic lighting for lifestyle. 
    The composition should follow the rule of thirds for ${settings.platform}. 
    Style details: ${settings.brandStyle}. Color palette: ${settings.brandColor}. 
    Ensure the result is polished, ${settings.resolution === 'HD' ? 'exhibiting fine texture detail' : ''} and ready for commercial ads.`;
  }

  private getAspectRatio(platform: string): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" {
    switch (platform) {
      case 'Story':
        return "9:16";
      case 'Instagram Post':
        return "1:1";
      case 'Banner':
        return "16:9";
      case 'Facebook Ad':
        return "16:9";
      default:
        return "3:4";
    }
  }
}

export const geminiService = new GeminiService();
