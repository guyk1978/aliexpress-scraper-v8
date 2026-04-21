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
app.post("/scrape", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({
      success: false,
      error: "NO_URL"
    });
  }

  return res.json({
    success: true,
    title: "TEST PRODUCT (SAFE MODE)",
    price: "999",
    image: "https://via.placeholder.com/600",
    final_url: url
  });
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});