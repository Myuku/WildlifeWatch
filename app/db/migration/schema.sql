CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    location TEXT,
    animal_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
