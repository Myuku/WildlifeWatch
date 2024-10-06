"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Google Maps components
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript), { ssr: false });
const GoogleMap = dynamic(() => import('@react-google-maps/api').then(mod => mod.GoogleMap), { ssr: false });
const Marker = dynamic(() => import('@react-google-maps/api').then(mod => mod.Marker), { ssr: false });

const mapContainerStyle = {
  width: '81vw', // Adjust the width of the map container
  height: '85vh', // Adjust the height of the map container
  borderRadius: '10px',
  marginBottom: '20px',
};

export default function MapComponent() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to get the user's current location when the button is clicked
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          getGeocodedAddress(latitude, longitude);  // Call the function to get the address
        },
        (error) => {
          setErrorMessage('Unable to retrieve your location');
          console.error(error);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser');
    }
  };

  // Function to get the actual address based on latitude and longitude
  const getGeocodedAddress = (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setAddress(results[0].formatted_address);  // Set the formatted address
      } else if (status === 'OK' && !results) {
        setErrorMessage('No results found');
      } else {
        setErrorMessage('Geocoder failed due to: ' + status);
      }
    });
  };

  // Handle click on the map to get the clicked location
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();  // Get the latitude of the clicked point
    const lng = event.latLng?.lng();  // Get the longitude of the clicked point

    if (lat && lng) {
      setLocation({ lat, lng });  // Update the location state
      getGeocodedAddress(lat, lng);  // Reverse geocode to get the new address
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 w-full">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <>
          <LoadScript
            id="google-maps-load-script"
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} // Ensure the API key is set properly
          >
            <div style={mapContainerStyle}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={location}
                zoom={12}
                onClick={handleMapClick}  // Handle click event on the map
              >
                <Marker position={location} />
              </GoogleMap>
            </div>
          </LoadScript>

            {/* Display the address */}
            {address && (
            <p className="mt-8 text-lg font-semibold text-gray-700">
                Current Location: {address}
            </p>
            )}

            {/* Button to get the user's current location */}
            <button
            onClick={handleGetCurrentLocation}
            className="relative inline-flex items-center justify-center p-0.5 mb-6 mt-8 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
            >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Get Location          
            </span>
            </button>

        </>
      )}
    </div>
  );
}
