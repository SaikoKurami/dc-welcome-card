const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();

app.get('/welcomecard', async (req, res) => {
    const { background, text1, text2, text3, avatar } = req.query;

    const canvas = createCanvas(1000, 500); // Width (1024) and height (500)
    const ctx = canvas.getContext('2d');
    
    // Define position variables
    const avatarSize = 160; // Diameter of the avatar
    const avatarBorderSize = 10; // Thickness of the border
    const avatarX = canvas.width / 2; // Center horizontally
    const avatarY = canvas.height / 2 - 90; // Slightly above center

    const textY1 = 310; // Y-coordinate for the first line of text
    const textY2 = textY1 + 55; // Spacing for the second line
    const textY3 = textY2 + 40; // Spacing for the third line

    try {
        // Load the background image
        const bgImage = await loadImage(background);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Draw the avatar border
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, (avatarSize / 2) + avatarBorderSize, 0, Math.PI * 2); // Outer border circle
        ctx.fillStyle = "rgb(147, 121, 129)"; // Border color in RGB
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        // Load and draw the avatar
        const avatarImage = await loadImage(avatar);
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2); // Circular clipping
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
            avatarImage,
            avatarX - avatarSize / 2,
            avatarY - avatarSize / 2,
            avatarSize,
            avatarSize
        );
        ctx.restore(); // Restore the clipping state

        // Add text with centering logic
        ctx.font = "normal 900 50px Verdana"; // Use bold weight with multiple font options
        ctx.fillStyle = "rgb(255, 255, 255)"; // White in RGB
        const text1Width = ctx.measureText(decodeURIComponent(text1)).width;
        const textX1 = (canvas.width - text1Width) / 2; // Center text
        ctx.fillText(decodeURIComponent(text1), textX1, textY1);

        ctx.font = "normal 900 40px Verdana"; // Use bold weight with multiple font options
        ctx.fillStyle = "rgb(190, 156, 168)"; // #be9ca8 in RGB
        const text2Width = ctx.measureText(decodeURIComponent(text2)).width;
        const textX2 = (canvas.width - text2Width) / 2; // Center text
        ctx.fillText(decodeURIComponent(text2), textX2, textY2);

    // Function to draw text with letter spacing
    function drawTextWithSpacing(ctx, text, x, y, letterSpacing) {
        let currentX = x;
        for (const char of text) {
            ctx.fillText(char, currentX, y);
            currentX += ctx.measureText(char).width + letterSpacing;
        }
    }

    // Modify the existing text3 rendering logic
    ctx.font = "normal 900 17px Verdana"; // Use bold weight with multiple font options
    ctx.fillStyle = "rgb(255, 255, 255)"; // White in RGB
    const letterSpacing = 4; // Adjust spacing between letters as needed
    const text3Decoded = decodeURIComponent(text3);
    const text3Width =
        Array.from(text3Decoded).reduce((width, char) => width + ctx.measureText(char).width, 0) +
        letterSpacing * (text3Decoded.length - 1);
    const textX3 = (canvas.width - text3Width) / 2; // Center text
    drawTextWithSpacing(ctx, text3Decoded, textX3, textY3, letterSpacing);

        // Send the image as response
        res.setHeader('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);
    } catch (error) {
        res.status(500).send('Error generating image: ' + error.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
