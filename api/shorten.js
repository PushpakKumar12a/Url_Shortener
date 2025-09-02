import { nanoid } from "nanoid";
import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const urlModel = mongoose.models.url || mongoose.model('url', urlSchema);

async function connectToDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
}

export default async function handler(req, res) {
    await connectToDB();
    if (req.method === 'POST') {
        // Shorten URL
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ error: "Original URL is required" });
        }
        const existing = await urlModel.findOne({ originalUrl });
        if (existing) {
            return res.status(200).json({ shortUrl: `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/${existing.shortId}` });
        }
        const shortId = nanoid(10);
        const dataToSave = new urlModel({ originalUrl, shortId });
        await dataToSave.save();
        return res.status(201).json({ shortUrl: `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/${shortId}` });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
