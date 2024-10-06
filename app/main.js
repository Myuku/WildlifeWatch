const express = require('express');
const vision = require('@google-cloud/vision');
const axios = require('axios');
const { Client } = require('pg');
const OpenAI = require("openai");
const { z }  = require("zod");
const { zodResponseFormat } = require("openai/helpers/zod");
require('dotenv').config();

const app = express();
app.use(express.json()); 

const client = new vision.ImageAnnotatorClient();
const openai = new OpenAI();

const apiKey = process.env.OPENAI_API_KEY

// Import multer
const fs = require('fs')
const multer = require('multer')
const cors = require('cors');
const upload = multer({dest: 'uploads/' });

// Enable CORS for all routes
app.use(cors());

const pgClient = new Client({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});
pgClient.connect();

const MODEL_NAME = "gpt-4o-2024-08-06";
const AnimalTraitsResponse = z.object({
    common_name: z.string(),
    scientific_name: z.string(),
    visual_appearance: z.string(),
    conservation_status: z.string(),
    species_range: z.string(),
    diet: z.string(),
    aggressiveness: z.string(),
    diurnality: z.string(),
    notes: z.string().nullable(),
});

async function getTraits(animal, location, appearance) {
    let messages = [
        {
            "role": "system",
            "content": "The user will provide a name of an animal. Respond concisely with information on their common name, scientific name, visual appearance, conservation status, species range, diet, how aggressive they are, and diurnality."
        },
        {
            "role": "system",
            "content": "The user may optionally provide the location of the image taken, by name or coordinates, as well as a description of its appearance. You may use this information to refine your response, such as identifying the subspecies local to the area."
        }
    ];
    
    let user_prompt = animal;
    if (location != null) {
        user_prompt += ", it is found in " + location;
    }
    if (appearance != null) {
        user_prompt += ", it is " + appearance + " in appearance";
    }

    messages.push({
        "role": "user",
        "content": user_prompt
    });

    const response_format = zodResponseFormat(AnimalTraitsResponse, "animal_traits_response");
    const completion = await openai.beta.chat.completions.parse({
        model: MODEL_NAME,
        messages: messages,
        response_format: response_format
    });

    return completion.choices[0].message.parsed;
}

async function detectLabels(imagePath) {
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;
    return labels.map(label => label.description);
}

async function getBestLabelDetection(imagePath) {
    let maxLabels = [];
    let maxLabelCount = 0;

    for (let i = 0; i < 3; i++) {
        const detectedLabels = await detectLabels(imagePath);
        const labelCount = detectedLabels.length;

        if (labelCount > maxLabelCount) {
            maxLabelCount = labelCount;
            maxLabels = detectedLabels;
        }
        console.log(`Run ${i + 1}: ${labelCount} labels detected`);
    }

    return maxLabels;
}

async function identifyAnimalLabel(labels) {
    const url = 'https://api.openai.com/v1/chat/completions';

    const prompt = `Given the following labels, identify the label containing the name of an animal. Respond only with the corresponding label, and nothing else.\nLabels: ${labels.join(', ')}`;

    const data = {
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'You are an AI that identifies animals from labels.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 50
    };

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error querying GPT API:', error);
        return 'Error identifying animal label.';
    }
}

async function storeImageDetailsWithBinary(imageBinary, location, animalType) {
    const query = `
        INSERT INTO images (image_data, location, animal_type) 
        VALUES ($1, $2, $3) 
        RETURNING id, location, animal_type, created_at;
    `;
    const values = [imageBinary, location, animalType];

    try {
        const result = await pgClient.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error storing image details:', error);
        throw error;
    }
}

// get all
app.get('/image-analysis', async (req, res) => {
    try {
        // Query the database to retrieve all image analysis records
        const query = `SELECT id, image_data, location, animal_type, created_at FROM images`;
        const result = await pgClient.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No image analysis records found' });
        }

        // Convert binary image data to base64 for each record
        const analysisRecords = result.rows.map(row => ({
            id: row.id,
            image: `data:image/jpeg;base64,${row.image_data.toString('base64')}`, // Adjust MIME type if needed
            location: row.location,
            animal_type: row.animal_type,
            created_at: row.created_at
        }));

        // Return all the image analysis records
        return res.json(analysisRecords);
    } catch (error) {
        console.error('Error retrieving all image analysis:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving image analysis records.' });
    }
});


app.get('/image-analysis/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `SELECT id, image_data, location, animal_type, created_at FROM images WHERE id = $1`;
        const result = await pgClient.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Image analysis not found' });
        }

        const imageBase64 = result.rows[0].image_data.toString('base64');
        
        return res.json({
            id: result.rows[0].id,
            image: `data:image/jpeg;base64,${imageBase64}`,
            location: result.rows[0].location,
            animal_type: result.rows[0].animal_type,
            created_at: result.rows[0].created_at,
        });
    } catch (error) {
        console.error('Error retrieving image analysis:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving the image analysis.' });
    }
});

app.post('/image-analysis', upload.single('image'), async (req, res) => {
    const { location } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }

    try {
        const imageBinary = fs.readFileSync(imageFile.path);

        const locationData = JSON.parse(location);

        const bestLabels = await getBestLabelDetection(imageFile.path);

        if (bestLabels.length > 0) {
            const animalLabel = await identifyAnimalLabel(bestLabels);

            if (animalLabel !== 'Error identifying animal label.') {
                const animalDetails = await getTraits(animalLabel, locationData, null);

                const storedImage = await storeImageDetailsWithBinary(imageBinary, JSON.stringify(locationData), animalLabel);

                return res.json({
                    id: storedImage.id,
                    animal: animalLabel,
                    details: animalDetails,
                });
            } else {
                return res.status(400).json({ error: 'Animal label could not be identified.' });
            }
        } else {
            return res.status(400).json({ error: 'No labels detected in the image.' });
        }
    } catch (error) {
        console.error('Detailed error:', error); // Log detailed error message
        return res.status(500).json({ error: 'An error occurred while processing the image.' });
    } finally {
        fs.unlink(imageFile.path, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
        });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
