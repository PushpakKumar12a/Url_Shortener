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
    const { shortId } = req.query;
    if (!shortId) {
        return res.status(400).json({ message: "Short id is required" });
    }
    const url = await urlModel.findOne({ shortId });
    if (!url) {
        return res.status(404).json({ message: "URL not found" });
    } else {
        res.writeHead(302, { Location: url.originalUrl });
        res.end();
    }
}
