import { ChatOpenAI } from "@langchain/openai";

export function getLLM() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY. Add it to your environment before using the LLM.");
  }

  return new ChatOpenAI({
    modelName: "gpt-4o", // Change to gpt-4o (sometimes aimlapi doesn't support the 'mini' alias)
    temperature: 0.2,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
    }
  });
}
