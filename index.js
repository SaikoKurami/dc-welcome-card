const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();

// Register custom font
registerFont('./fonts/DelaSukoGothicOne-R.otf', { family: 'DelaSukoGothic' });

app.get('/welcomecard', async (req, res) => {
    const { background, text1, text2, text3, avatar } = req.query;

    const canvas = createCanvas(1024, 500); // Width (1024) and height (500)
    const ctx = canvas.getContext('2d');
    
    // Define position variables
    const avatarSize = 160; // Diameter of the avatar
    const avatarBorderSize = 10; // Thickness of the border
    const avatarX = canvas.width / 2; // Center horizontally
    const avatarY = canvas.height / 2 - 90; // Slightly above center

    const textY1 = 310; // Y-coordinate for the first line of text
    const textY2 = textY1 + 50; // Spacing for the second line
    const textY3 = textY2 + 40; // Spacing for the third line

    try {
        // Load the background image
        const bgImage = await loadImage(background);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Draw the avatar border
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, (avatarSize / 2) + avatarBorderSize, 0, Math.PI * 2); // Outer border circle
        ctx.fillStyle = '#937981'; // Set the border color
        ctx.fill(); // Fill the circle with the border color
        ctx.closePath();
        ctx.restore();

        // Load and draw the avatar
        const avatarImage = await loadImage(avatar);
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2); // Circular clipping
        ctx.closePath();
        ctx.clip(); // Apply clipping
        ctx.drawImage(
            avatarImage,
            avatarX - avatarSize / 2,
            avatarY - avatarSize / 2,
            avatarSize,
            avatarSize
        );
        ctx.restore(); // Restore the clipping state

        // Add text with centering logic and custom font
        ctx.font = '50px "DelaSukoGothic"'; // Custom font without bold
        ctx.fillStyle = '#ffffff';
        const text1Width = ctx.measureText(decodeURIComponent(text1)).width;
        const textX1 = (canvas.width - text1Width) / 2; // Center text
        ctx.fillText(decodeURIComponent(text1), textX1, textY1);

        ctx.font = '30px "DelaSukoGothic"'; // Custom font without bold
        ctx.fillStyle = '#be9ca8';
        const text2Width = ctx.measureText(decodeURIComponent(text2)).width;
        const textX2 = (canvas.width - text2Width) / 2; // Center text
        ctx.fillText(decodeURIComponent(text2), textX2, textY2);

        ctx.font = '17px "DelaSukoGothic"'; // Custom font without bold
        ctx.fillStyle = '#ffffff';
        const text3Width = ctx.measureText(decodeURIComponent(text3)).width;
        const textX3 = (canvas.width - text3Width) / 2; // Center text
        ctx.fillText(decodeURIComponent(text3), textX3, textY3);

        // Send the image as response
        res.setHeader('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);
    } catch (error) {
        res.status(500).send('Error generating image: ' + error.message);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
