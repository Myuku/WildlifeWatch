const http = require('http');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

// Function to detect animals in the image
async function detectAnimals(imagePath) {
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;
    const animalLabels = labels.filter(label => label.description.match(/dog|cat|bird|fish|lion|tiger|bear|animal/i));
    return animalLabels.map(label => label.description).join(', ');
}

// Exact spieces name, common name

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Set status and headers for the response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    // Detect animals and include the result in the response
    try {
        const detectedAnimals = await detectAnimals('image1.jpg');
        if (detectedAnimals) {
            res.end(`Animals detected: ${detectedAnimals}\n`);
        } else {
            res.end('No animals detected in the image.\n');
        }
    } catch (error) {
        console.error('Error detecting animals:', error);
        res.end('Error occurred during animal detection.\n');
    }
});

// Start server
server.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});
