// src/app/MapComponent.tsx
"use client";  // Mark this as a client-side component

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Google Maps components
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript), { ssr: false });
const GoogleMap = dynamic(() => import('@react-google-maps/api').then(mod => mod.GoogleMap), { ssr: false });
const Marker = dynamic(() => import('@react-google-maps/api').then(mod => mod.Marker), { ssr: false });

const mapContainerStyle = {
  width: '100%',
  height: '400px', // Set height for the map container
};

const center = {
  lat: 48.8584,  // Latitude of the Eiffel Tower (example)
  lng: 2.2945,   // Longitude of the Eiffel Tower (example)
};

export default function MapComponent() {
  return (
<LoadScript
  id="google-maps-script"  // Add this line
  googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
>
  <GoogleMap
    mapContainerStyle={mapContainerStyle}
    center={center}
    zoom={12}
  >
    <Marker position={center} />
  </GoogleMap>
</LoadScript>

  );
}
