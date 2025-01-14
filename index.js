// index.js
const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const app = express();

app.get('/welcomecard', async (req, res) => {
    const { background, text1, text2, text3, avatar } = req.query;

    const canvas = createCanvas(800, 400); // Set canvas size
    const ctx = canvas.getContext('2d');

    try {
        // Load the background image
        const bgImage = await loadImage(background);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Load and draw the avatar
        const avatarImage = await loadImage(avatar);
        ctx.beginPath();
        ctx.arc(100, 200, 80, 0, Math.PI * 2); // Circular clipping
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, 20, 120, 160, 160);

        // Add text
        ctx.restore(); // Reset clipping
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(decodeURIComponent(text1), 200, 100);

        ctx.font = '24px Arial';
        ctx.fillText(decodeURIComponent(text2), 200, 150);

        ctx.font = '20px Arial';
        ctx.fillText(decodeURIComponent(text3), 200, 200);

        // Send the image as response
        res.setHeader('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);
    } catch (error) {
        res.status(500).send('Error generating image: ' + error.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));