const express = require("express");
const app = express();

app.use(express.json());

// =======================
// CORS FIX
// =======================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.send("🚀 V8 SERVER IS LIVE");
});

// =======================
// SAFE SCRAPER
// =======================
app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({ success: false, error: "NO_URL" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    });

    const html = await response.text();

    const title =
      html.match(/<title>(.*?)<\/title>/i)?.[1]?.replace(" - AliExpress", "").trim() ||
      "Unknown Product";

    const price =
      html.match(/"price"\s*:\s*"?(.*?)"?[,}]/)?.[1] ||
      html.match(/\$ ?([0-9]+\.?[0-9]*)/)?.[1] ||
      "";

    const image =
      html.match(/property="og:image"\s+content="(.*?)"/i)?.[1] ||
      "";

    return res.json({
      success: true,
      title,
      price,
      image,
      final_url: url
    });

  } catch (err) {
    return res.json({
      success: false,
      error: err.message
    });
  }
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});