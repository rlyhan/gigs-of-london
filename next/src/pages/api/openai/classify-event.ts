import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { text, gigs } = req.body;

    if (!text || !gigs) {
        return res.status(400).json({ error: "Missing text or gigs" });
    }

    try {
        const prompt = `
You are an expert event recommender.

User request:
"${text}"

Gig list:
${JSON.stringify(gigs)}

Return ONLY a JSON object shaped like:

{
  "suggestions": [
    { "name": "string", "id": "string", "reason": "string" }
  ]
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });

        // Get the message
        const msg = completion.choices[0].message;

        // NEW: Always try parsed first, fallback to content
        const parsed =
            msg.parsed ??
            (msg.content ? JSON.parse(msg.content) : null);

        if (!parsed) {
            throw new Error("Model returned no JSON.");
        }

        return res.status(200).json(parsed);

    } catch (err) {
        console.error("AI error:", err);
        return res.status(500).json({ error: "AI failed to return JSON" });
    }
}
