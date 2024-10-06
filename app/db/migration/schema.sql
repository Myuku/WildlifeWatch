CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_data BYTEA, 
    location TEXT, 
    animal_type VARCHAR(255), 
    response_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

