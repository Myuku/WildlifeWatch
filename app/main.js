const http = require('http');
const vision = require('@google-cloud/vision');
const axios = require('axios');
const client = new vision.ImageAnnotatorClient();

const OpenAI = require("openai");
const { z }  = require("zod");
const { zodResponseFormat } = require("openai/helpers/zod");

const openai = new OpenAI();

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
    notes: z.string()
})

// Must: animal
// Optional: location, appearance

async function getTraits(animal, location, appearance){
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
    
    user_prompt = animal;
    if(location != null){
        user_prompt += ", it is found in " + location;
    }
    if(appearance != null){
        user_prompt += ", it is " + appearance + " in appearance";
    }
    messages.push({
        "role": "user",
        "content": user_prompt
    })

    const response_format = zodResponseFormat(AnimalTraitsResponse, "animal_traits_response");
    const completion = await openai.beta.chat.completions.parse({
        model: MODEL_NAME,
        messages: messages,
        response_format: response_format
    })
    return JSON.stringify(completion.choices[0].message.parsed);
}

const apiKey = ''
// Function to detect labels in the image
async function detectLabels(imagePath) {
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;
    return labels.map(label => label.description);
}

// Function to run label detection 5 times and pick the one with the most labels
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

// Function to query GPT API to identify the label containing the name of an animal
async function identifyAnimalLabel(labels) {// Use your OpenAI GPT API key
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

// Function to get more details or something interesting about the animal
async function getAnimalDetails(animalLabel) {
    const url = 'https://api.openai.com/v1/chat/completions';

    const prompt = `Tell me if the animal is an endangered species and if it is, tell me to report it to the local aurthority: ${animalLabel}.`;

    const data = {
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'You are an AI that provides interesting facts and details about animals.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 150
    };

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error querying GPT API for animal details:', error);
        return 'Error getting animal details.';
    }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    try {
        // Analyze the image and get the labels with the most detections
        const imagePath = 'https://www.wanderlustmagazine.com/wp-content/uploads/2023/11/sumatran-orangutan-main-390x700.jpg';
        const bestLabels = await getBestLabelDetection(imagePath);

        // Ask GPT to identify the animal label
        if (bestLabels.length > 0) {
            const animalLabel = await identifyAnimalLabel(bestLabels);

            if (animalLabel !== 'Error identifying animal label.') {
                // Ask GPT for more details
                const animalDetails = await getTraits(animalLabel, null, null);
                res.end(`Animal label identified: ${animalLabel}\n\nInteresting facts or details:\n${animalDetails}\n`);
            } else {
                res.end(`Animal label could not be identified.\n`);
            }
        } else {
            res.end('No labels detected in the image.\n');
        }
    } catch (error) {
        console.error('Error detecting labels or querying GPT:', error);
        res.end('Error occurred during label detection or GPT API query.\n');
    }
});

// Start server
server.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});
