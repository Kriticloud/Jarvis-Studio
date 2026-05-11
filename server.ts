import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to fetch website metadata and some content
  app.post("/api/analyze", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      
      // Extract basic info
      const title = $("title").text();
      const description = $('meta[name="description"]').attr("content") || "";
      
      // Get a sample of the text content to analyze
      const bodyText = $("body").text().replace(/\s+/g, ' ').trim().slice(0, 5000);
      
      // Try to find images for visual context
      const logos = $('img[src*="logo"]').map((i, el) => $(el).attr("src")).get();
      const images = $("img").slice(0, 5).map((i, el) => $(el).attr("src")).get();

      res.json({
        url,
        title,
        description,
        content: bodyText,
        logos,
        images,
      });
    } catch (error: any) {
      console.error("Fetch error:", error.message);
      res.status(500).json({ error: "Failed to fetch website content. It might be blocking scrapers." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
