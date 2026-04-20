app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({ success: false, error: "NO_URL" });
  }

  try {
    // =========================
    // STEP 1: Fetch HTML
    // =========================
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    });

    const html = await response.text();

    // =========================
    // STEP 2: TITLE EXTRACTION
    // =========================
    let title =
      html.match(/<title>(.*?)<\/title>/i)?.[1] ||
      html.match(/"title"\s*:\s*"([^"]+)"/)?.[1] ||
      "Unknown Product";

    title = title.replace(" - AliExpress", "").trim();

    // =========================
    // STEP 3: PRICE EXTRACTION
    // =========================
    let price =
      html.match(/\$\s?([0-9]+\.?[0-9]*)/)?.[1] ||
      html.match(/"price"\s*:\s*"?([0-9]+\.?[0-9]*)"?/)?.[1] ||
      "";

    // =========================
    // STEP 4: IMAGE EXTRACTION
    // =========================
    let image =
      html.match(/property="og:image"\s+content="(.*?)"/i)?.[1] ||
      html.match(/"image"\s*:\s*"([^"]+)"/)?.[1] ||
      "https://via.placeholder.com/600";

    // =========================
    // RESPONSE
    // =========================
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