import { ChatOpenAI } from "@langchain/openai";

export function getLLM() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY. Add it to your environment before using the LLM.");
  }

  return new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.2
  });
}
