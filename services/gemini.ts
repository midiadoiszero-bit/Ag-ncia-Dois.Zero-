
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

export async function sendChatMessage(messages: Message[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Transform chat history for Gemini API
    const contents = messages.map(msg => {
      const parts: any[] = [{ text: msg.content }];
      
      if (msg.attachments) {
        msg.attachments.forEach(attachment => {
          parts.push({
            inlineData: {
              mimeType: attachment.type,
              data: attachment.data.split(',')[1] // Remove prefix if present
            }
          });
        });
      }
      
      return {
        role: msg.role === 'model' ? 'model' : 'user',
        parts: parts
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
