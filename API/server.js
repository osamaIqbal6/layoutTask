// server.js
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const port = 3001; // Ensure this port is different from your React app's port
app.use(cors());
app.get("/generate-pdf", async (req, res) => {
  console.log("hello");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Replace with the URL of your React app
  await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });
  await page.setViewport({ width: 600, height: 600 });
  // Click the button with the id 'clickme'
  await page.click("#clickme");

  // Wait for any dynamic content changes after the click
  await page.waitForTimeout(1000); // Adjust this timeout as necessary

  const pdf = await page.pdf({
    format: "A4",
  });

  await browser.close();

  res.contentType("application/pdf");
  res.send(pdf);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
