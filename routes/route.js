import {Router} from "express";
import { generateShortUrl, redirectToUrl } from "../controllers/controller";

const urlRouter = Router();

// API routes
urlRouter.post('/shorten', generateShortUrl);

// Create a separate router for the root-level routes
export const rootRouter = Router();
rootRouter.get('/:shortId', redirectToUrl);

export default urlRouter;