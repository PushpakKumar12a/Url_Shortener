# url_shortener

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

# Url_Shortener

## Deployment on Vercel

This project is now structured for Vercel serverless deployment:

- All backend API logic is in the `/api` directory as serverless functions.
- The frontend is served from the `frontend/` directory.
- There is no need to run an Express server; Vercel handles all routing and serverless execution.

### How it works

- To shorten a URL, the frontend calls `/api/shorten` (POST).
- To redirect, Vercel uses the dynamic route `/api/[shortId]`.

### Local Development

You can still run the frontend locally by serving the `frontend/` directory with a static server, but backend logic should be tested via Vercel's dev tools or after deployment.

### Environment Variables

Set your `MONGODB_URI` in the Vercel dashboard under Project Settings > Environment Variables.

---
