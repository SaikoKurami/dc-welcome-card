const puppeteer = require('puppeteer-core');
const express = require('express');
const path = require('path');
const chrome = require('chrome-aws-lambda'); // Import chrome-aws-lambda

const app = express();

// Serve static files (e.g., output image)
app.use(express.static('public'));

app.get('/welcomecard', async (req, res) => {
    const { background, text1, text2, text3, avatar } = req.query;

    // Launch Puppeteer with the correct executable path and arguments for cloud environments
    const browser = await puppeteer.launch({
        executablePath: await chrome.executablePath, // Path to Chromium provided by chrome-aws-lambda
        args: chrome.args,  // Arguments suitable for cloud (headless, etc.)
        headless: chrome.headless,  // Ensure headless mode for cloud deployment
    });

    const page = await browser.newPage();

    // Set the HTML content dynamically based on the query parameters
    const htmlContent = `
    <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
                
                body {
                    font-family: 'Poppins', sans-serif;
                    background-image: url(${background});
                    background-size: cover;
                    color: white;
                    text-align: center;
                    padding: 20px;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                }
                h1, h2, h3 {
                    font-size: 50px;
                    font-weight: 600;
                }
                img {
                    border-radius: 50%;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <h1>${text1}</h1>
            <h2>${text2}</h2>
            <h3>${text3}</h3>
            <img src="${avatar}" alt="Avatar" width="100" height="100"/>
        </body>
    </html>`;

    await page.setContent(htmlContent);
    await page.setViewport({ width: 1024, height: 768 });

    const screenshotPath = path.join(__dirname, 'public', 'welcomecard.png');
    await page.screenshot({ path: screenshotPath });

    await browser.close();

    res.sendFile(screenshotPath);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
