const http = require('http');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

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
    notes: z.string() | z.null()
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
    return completion.choices[0].message.parsed;
}

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
