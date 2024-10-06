"use client";  // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Google Maps components
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript), { ssr: false });
const GoogleMap = dynamic(() => import('@react-google-maps/api').then(mod => mod.GoogleMap), { ssr: false });
const Marker = dynamic(() => import('@react-google-maps/api').then(mod => mod.Marker), { ssr: false });

const mapContainerStyle = {
  width: '100%',
  height: '400px', // Set height for the map container
};

export default function MapComponent() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });  // Default location (could be set to any default value)
  const [errorMessage, setErrorMessage] = useState('');

  // Use the Geolocation API to get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage('Unable to retrieve your location');
          console.error(error);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser');
    }
  }, []);

  return (
    <div>
      {errorMessage ? (
        <p>{errorMessage}</p>  // Display error message if unable to get location
      ) : (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}  // Use Google Maps API key
          id="google-maps-script"
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location}  // Use the user's current location to center the map
            zoom={12}
          >
            <Marker position={location} />  {/* Mark the user's current location */}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}
