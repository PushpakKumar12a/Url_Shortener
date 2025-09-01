import express from "express";
import { connectToDB } from "./config/db";
import urlRouter, { rootRouter } from "./routes/route";


import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

// Serve static files from public directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));


connectToDB();

// Apply routes
app.use('/', rootRouter);
app.use('/api', urlRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});