import { nanoid } from "nanoid";
import { urlModel } from "../models/model";

export async function generateShortUrl(req, res) {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).send({ error: "Original URL is required" });
        }

        // Check for existing URL
        const existing = await urlModel.findOne({ originalUrl });
        if (existing) {
            return res.status(200).send({ shortUrl: `${req.protocol}://${req.get("host")}/${existing.shortId}` });
        }

        // Not found, create new
        const shortId = nanoid(10);
        const dataToSave = new urlModel({
            originalUrl,
            shortId
        });
        await dataToSave.save();
        res.status(201).send({ shortUrl: `${req.protocol}://${req.get("host")}/${shortId}` });
    } catch (error) {
        console.error("Error generating short URL:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }

}


export async function redirectToUrl(req, res) {
    try{
        const {shortId} = req.params;
        if(!shortId){
            return res.status(400)
            .send({message:"Short id is required"});

        }
        const url = await urlModel.findOne({shortId});
        if(!url){
            return res.status(404)
            .send({message:"URL not found"});
        }else{
            res.redirect(url.originalUrl);
        }
    }catch(error){
        return res.status(500)
        .send({error: "Internal Server Error"});
    }
}