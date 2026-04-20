const express = require("express");
const app = express();

app.use(express.json());

app.post("/scrape", (req, res) => {
  const { url } = req.body;

  res.json({
    success: true,
    title: "TEST PRODUCT",
    price: "999",
    image: "https://via.placeholder.com/600",
    final_url: url
  });
});

app.listen(3000, () => {
  console.log("Server running");
});