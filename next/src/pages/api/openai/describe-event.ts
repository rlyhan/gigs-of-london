import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, venue, date, time, info, pleaseNote } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Missing event name" });
    }

    const existingInfo = [info, pleaseNote].filter(Boolean).join("\n");

    const prompt = `Given the following event details, write 1-2 sentences describing what to expect.

Event: "${name}"
Venue: ${venue || "Unknown venue"}
Date: ${date || "Unknown date"}${time ? `, ${time}` : ""}
${existingInfo ? `Existing info: "${existingInfo}"` : ""}

Rules:
- Describe what the artist/act is known for and what kind of performance to expect
- Do NOT include the date, time, venue name, or ticket information — these are already displayed elsewhere
- Do NOT use marketing language like "Join us", "Don't miss", "unforgettable", "you won't want to miss"
- Write in a neutral, informative tone
- If you cannot identify the specific artist or event, write a brief generic description based on the event name

Example tone: "Known for his heartfelt pop melodies and captivating performances, expect an intimate yet electrifying performance from Nek that will resonate with fans old and new."`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 200,
        });

        const description = completion.choices[0].message?.content?.trim();

        if (!description) {
            return res.status(500).json({ error: "AI returned empty description" });
        }

        return res.status(200).json({ description });
    } catch (err) {
        console.error("AI describe-event error:", err);
        return res.status(500).json({ error: "Failed to generate description" });
    }
}
