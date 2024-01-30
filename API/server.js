// server.js
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs").promises;

const pdftk = require("node-pdftk");

const port = 3001; // Ensure this port is different from your React app's port
app.use(cors());
app.get("/generate-pdf", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });

  const pdf = await page.pdf({
    width: "700px",
    height: "850px",
    printBackground: true,
    margin: {
      top: "50px",
    },
  });

  await browser.close();

  res.contentType("application/pdf");
  res.send(pdf);
});

// app.get("/generate-pdf", async (req, res) => {
//   try {
//     // Create a new Puppeteer browser instance for /1
//     const browser1 = await puppeteer.launch();
//     const page1 = await browser1.newPage();

//     // Replace with the URL of your React app for /1
//     const baseUrl = "http://localhost:5173";

//     // Visit route /1
//     await page1.goto(baseUrl + "/1", { waitUntil: "networkidle0" });

//     // Capture a screenshot of route /1 as PDF with custom size
//     const pdf1 = await page1.pdf({
//       width: "700px",
//       height: "800px",
//       printBackground: true,
//     });

//     // Close the Puppeteer browser instance for /1
//     await browser1.close();

//     // Create a new Puppeteer browser instance for /2
//     const browser2 = await puppeteer.launch();
//     const page2 = await browser2.newPage();

//     // Visit route /2
//     await page2.goto(baseUrl + "/2", { waitUntil: "networkidle0" });

//     // Capture a screenshot of route /2 as PDF with custom size
//     const pdf2 = await page2.pdf({
//       width: "700px",
//       height: "800px",
//       printBackground: true,
//     });

//     // Close the Puppeteer browser instance for /2
//     await browser2.close();

//     // Write the PDFs to files
//     await fs.writeFile("pdf1.pdf", pdf1);
//     await fs.writeFile("pdf2.pdf", pdf2);

//     // Load saved PDF files using pdf-lib
//     const pdf1Bytes = await fs.readFile("pdf1.pdf");
//     const pdf2Bytes = await fs.readFile("pdf2.pdf");

//     const pdfDoc1 = await PDFDocument.load(pdf1Bytes);
//     const pdfDoc2 = await PDFDocument.load(pdf2Bytes);

//     // Create a new PDF document to merge pages into
//     const mergedPdfDoc = await PDFDocument.create();

//     // Add pages from the first PDF document
//     const copiedPages1 = await mergedPdfDoc.copyPages(
//       pdfDoc1,
//       pdfDoc1.getPageIndices()
//     );
//     copiedPages1.forEach((page) => mergedPdfDoc.addPage(page));

//     // Add pages from the second PDF document
//     const copiedPages2 = await mergedPdfDoc.copyPages(
//       pdfDoc2,
//       pdfDoc2.getPageIndices()
//     );
//     copiedPages2.forEach((page) => mergedPdfDoc.addPage(page));

//     // Serialize the merged PDF
//     const mergedPdfBytes = await mergedPdfDoc.save();

//     // Write the merged PDF to a file
//     await fs.writeFile("merged.pdf", mergedPdfBytes);

//     // Read the merged PDF file and send it as a response
//     const mergedPdfFile = await fs.readFile("merged.pdf");

//     // Set the content type and send the merged PDF as a response
//     res.contentType("application/pdf");
//     res.send(mergedPdfFile);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
