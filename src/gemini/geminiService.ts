import { genAI } from "./config";
import { reminder, reminder2 } from "../models/prompts";
import { GenerateChatTextOptions } from "../models/interfaces";

export const generateChatText = async ({
  context,
  prompt,
  history = reminder2,
  temperature = 0.9,
}: GenerateChatTextOptions): Promise<string> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: { temperature },
  });

  try {
    const chat = await model.startChat({
      history: [
        {
          role: "user",
          parts: typeof context === "string" ? context : context.join(".\n"),
        },
        {
          role: "model",
          parts: history,
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating response from Google Gemini:", error);
    throw new Error("Failed to generate OpenAI response");
  }
};
