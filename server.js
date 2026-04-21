const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// HEALTH
app.get("/", (req, res) => {
  res.send("🚀 V8 REAL ENGINE LIVE");
});

// SCRAPE
app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({ success: false, error: "NO_URL" });
  }

  try {
    const response = await axios.get(url, {
      timeout: 20000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    });

    const html = response.data;

    const title =
      html.match(/<title>(.*?)<\/title>/i)?.[1]?.replace(" - AliExpress", "").trim() ||
      "Unknown Product";

    const price =
      html.match(/\$ ?([0-9]+\.?[0-9]*)/)?.[1] || "";

    const image =
      html.match(/property="og:image"\s+content="(.*?)"/i)?.[1] || "";

    res.json({
      success: true,
      title,
      price,
      image,
      final_url: url
    });

  } catch (err) {
    res.json({
      success: false,
      error: "ALIEXPRESS_BLOCKED_OR_TIMEOUT"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Live on " + PORT));