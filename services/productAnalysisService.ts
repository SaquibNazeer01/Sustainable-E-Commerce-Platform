import { createEcoBotChat } from './geminiService';

const analyzeProductPrompt = `You are an expert in sustainable and eco-friendly products. Analyze the provided image and:
1. Determine if the product appears to be eco-friendly based on:
   - Material composition (natural, recyclable, biodegradable)
   - Packaging (minimal, sustainable)
   - Apparent durability and reusability
2. Provide a brief explanation of your assessment
3. Give an eco-score rating (A-E)
4. Suggest more sustainable alternatives if applicable

Format your response as JSON:
{
  "isEcoFriendly": boolean,
  "ecoScore": "A" | "B" | "C" | "D" | "E",
  "explanation": string,
  "suggestions": string[]
}`;

export async function analyzeProductImage(imageBase64: string) {
  try {
    const chat = await createEcoBotChat();
    const analysis = await chat.sendMessage({
      text: analyzeProductPrompt,
      images: [imageBase64]
    });
    
    return JSON.parse(analysis.response.text());
  } catch (error) {
    console.error('Error analyzing product:', error);
    throw new Error('Failed to analyze product image');
  }
}