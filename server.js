const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({ success: false, error: "NO_URL" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const data = await page.evaluate(() => {
      const title =
        document.querySelector("h1")?.innerText ||
        document.title;

      const price =
        document.body.innerText.match(/\$ ?([0-9]+\.?[0-9]*)/)?.[1] || "";

      const image =
        document.querySelector("img")?.src || "";

      return { title, price, image };
    });

    await browser.close();

    res.json({
      success: true,
      ...data
    });

  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("V8 Scraper running");
});