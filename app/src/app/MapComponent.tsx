"use client";  // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Google Maps components
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript), { ssr: false });
const GoogleMap = dynamic(() => import('@react-google-maps/api').then(mod => mod.GoogleMap), { ssr: false });
const Marker = dynamic(() => import('@react-google-maps/api').then(mod => mod.Marker), { ssr: false });

// Define the container style for the map
const mapContainerStyle = {
  width: '81vw',  // Slightly increase the horizontal width to 75% of the viewport width
  height: '85vh',  // Keep the vertical height at 85% of the viewport height
  borderRadius: '10px',  // Optional: Add rounded corners
  marginBottom: '20px',  // Add some margin to ensure it doesn’t touch the footer
};

export default function MapComponent() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
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
    <div className="flex justify-center mt-10 w-full"> {/* Center the map on the page */} 
      {errorMessage ? (
        <p>{errorMessage}</p>  // Display error message if unable to get location
      ) : (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}  // Use Google Maps API key
          id="google-maps-script"
        >
          <div style={mapContainerStyle}> {/* Map container with slightly increased width */}
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}  // Center map based on user's location
              zoom={12}
            >
              <Marker position={location} />  {/* Mark the user's current location */}
            </GoogleMap>
          </div>
        </LoadScript>
      )}
    </div>
  );
}
