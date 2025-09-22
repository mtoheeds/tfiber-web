import OpenAI from "openai";
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function embed(text: string) {
  const r = await ai.embeddings.create({
    model: process.env.EMBED_MODEL || "text-embedding-3-large",
    input: text
  });
  return `[${r.data[0].embedding.join(",")}]`;
}
