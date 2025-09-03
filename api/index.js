import express from "express";
import { connectToDB } from "../config/db";
import urlRouter, { rootRouter } from "../routes/route";

const app = express();
app.use(express.json());

connectToDB();

app.use('/', rootRouter);
app.use('/api', urlRouter);

export default app;

// Vercel handler
export const handler = (req, res) => {
  app(req, res);
};

