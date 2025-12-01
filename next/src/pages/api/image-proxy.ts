import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url, width } = req.query;

    if (!url) return res.status(400).send("Missing URL");

    // Fetch the external image
    const response = await fetch(url as string);
    const buffer = await response.arrayBuffer();

    // Optimize & resize using Sharp
    const optimized = await sharp(Buffer.from(buffer))
        .resize({ width: width ? parseInt(width as string) : undefined })
        .webp({ quality: 80 })
        .toBuffer();

    // Cache on CDN / browser
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    res.setHeader("Content-Type", "image/webp");
    res.send(optimized);
}
