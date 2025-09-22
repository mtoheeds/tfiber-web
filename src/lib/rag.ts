import OpenAI from "openai";
import { pg } from "@/lib/db";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function searchKb(query: string, k = 6) {
  const qe = await ai.embeddings.create({
    model: process.env.EMBED_MODEL || "text-embedding-3-large",
    input: query
  });
  const v = `[${qe.data[0].embedding.join(",")}]`;

  const db = await pg();
  const { rows } = await db.query(
    `select id, tag, region, title, body, (embedding <=> $1::vector) as dist
       from kb
      where embedding is not null
      order by embedding <=> $1::vector
      limit $2`,
    [v, k]
  );
  await db.end();
  return rows as { id:string; tag:string; region:string; title:string; body:string; dist:number }[];
}
