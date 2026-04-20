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

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const priceMatch = html.match(/\$ ?([0-9]+\.?[0-9]*)/);
    const imageMatch = html.match(/property="og:image"\s+content="(.*?)"/i);

    return res.json({
      success: true,
      title: titleMatch ? titleMatch[1] : "Unknown Product",
      price: priceMatch ? priceMatch[1] : "",
      image: imageMatch ? imageMatch[1] : "https://via.placeholder.com/600",
      final_url: url
    });

  } catch (err) {
    return res.json({
      success: false,
      error: err.message
    });
  }
});