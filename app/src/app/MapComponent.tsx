"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Modal } from 'flowbite-react'; // Assuming you're using Flowbite React for modals

// Dynamically import Google Maps components
const LoadScript = dynamic(() => import('@react-google-maps/api').then(mod => mod.LoadScript), { ssr: false });
const GoogleMap = dynamic(() => import('@react-google-maps/api').then(mod => mod.GoogleMap), { ssr: false });
const Marker = dynamic(() => import('@react-google-maps/api').then(mod => mod.Marker), { ssr: false });
const InfoWindow = dynamic(() => import('@react-google-maps/api').then(mod => mod.InfoWindow), { ssr: false });

const mapContainerStyle = {
  width: '81vw', // Adjust the width of the map container
  height: '85vh', // Adjust the height of the map container
  borderRadius: '10px',
  marginBottom: '20px',
};

// Define props type for passing location change handler
interface MapComponentProps {
  onLocationChange: (lat: number, lng: number) => void;
}

export default function MapComponent({ onLocationChange }: MapComponentProps) {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({ lat: 0, lng: 0 });
  const [allData, setAllData] = useState<JSON | null>(null);
  const [locationData, setLocationData] = useState<null | Array<{ id: string; lat: number; lng: number; animal_name: string }>>(null);
  const [selectedMarker, setSelectedMarker] = useState<null | { lat: number; lng: number; animal_name: string; address: string }>(null);

  // const handleRetrieve = async (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch("http://localhost:5432/image-analysis", {
  //       method: "GET",
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setAllData(data);
  //       });
  //   } catch (error) {
  //     console.error("Error getting data", error);
  //   }
  // };

// New function to retrieve and display only id, longitude, latitude, and animal name
// const handleRetrieveLocationData = async (event: React.MouseEvent) => {
//   event.preventDefault();
//   try {
//     const response = await fetch("http://localhost:5432/image-analysis", {
//       method: "GET",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Parse the 'location' string and extract lat/lng
//         const extractedData = data.map((item: any) => {
//           const location = JSON.parse(item.location); // Parse the location string
//           return {
//             id: item.id,
//             lat: location.lat, // Extract the lat
//             lng: location.lng, // Extract the lng
//             animal_name: item.animal_type, // Animal name
//           };
//         });
//         setLocationData(extractedData);
//       });
//   } catch (error) {
//     console.error("Error getting location data", error);
//   }
// };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          getGeocodedAddress(latitude, longitude);
          onLocationChange(latitude, longitude);
        },
        (error) => {
          setErrorMessage("Unable to retrieve your location");
          console.error(error);
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser");
    }
  };

  const getGeocodedAddress = (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setAddress(results[0].formatted_address);
      } else if (status === "OK" && !results) {
        setErrorMessage("No results found");
      } else {
        setErrorMessage("Geocoder failed due to: " + status);
      }
    });
  };

  const handleMarkerClick = (marker: { lat: number; lng: number; animal_name: string }) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: marker.lat, lng: marker.lng };

    // Fetch the address for the marker
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const address = results[0].formatted_address;
        setSelectedMarker({ ...marker, address });
      } else {
        setErrorMessage("Geocoder failed due to: " + status);
      }
    });
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();

    if (lat && lng) {
      setNewLocation({ lat, lng });
      setIsModalOpen(true);
    }
  };

  const confirmLocationChange = () => {
    setLocation(newLocation);
    getGeocodedAddress(newLocation.lat, newLocation.lng);
    setIsModalOpen(false);
    onLocationChange(newLocation.lat, newLocation.lng);
  };

  const cancelLocationChange = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10 w-full">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <>
          <LoadScript id="google-maps-load-script" googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <div style={mapContainerStyle}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={location}
                zoom={12}
                onClick={handleMapClick}
              >
                {/* Marker for the user's current location */}
                <Marker position={location} />

                {/* Display green markers for each lat/lng from locationData */}
                {locationData &&
                  locationData.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={{ lat: marker.lat, lng: marker.lng }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green marker icon
                      }}
                      onClick={() => handleMarkerClick(marker)} // Handle click event for each marker
                    />
                  ))}

                {/* InfoWindow to display animal name and address */}
                {selectedMarker && (
                  <InfoWindow
                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                    onCloseClick={() => setSelectedMarker(null)} // Close the InfoWindow
                  >
                    <div>
                      <h3>{selectedMarker.animal_name}</h3>
                      <p>{selectedMarker.address}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </LoadScript>

          <Modal show={isModalOpen} onClose={cancelLocationChange}>
            <Modal.Header>Confirm Location Change</Modal.Header>
            <Modal.Body>
              <p>
                Do you want to move to the selected location with coordinates:
                {` Latitude: ${newLocation.lat}, Longitude: ${newLocation.lng}?`}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={confirmLocationChange} className="px-4 py-2 bg-green-500 text-white rounded-md">
                Yes, Move Here
              </button>
              <button onClick={cancelLocationChange} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                Cancel
              </button>
            </Modal.Footer>
          </Modal>

          {address && (
            <p className="mt-8 text-lg font-semibold text-gray-700">
              Current Location: {address}
            </p>
          )}

          <button
            onClick={handleGetCurrentLocation}
            className="relative inline-flex items-center justify-center p-0.5 mb-6 mt-8 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Get Location
            </span>
          </button>

          {/* <button
            onClick={handleRetrieve}
            className="relative inline-flex items-center justify-center p-0.5 mb-6 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-blue-300 to-purple-300 group-hover:from-blue-300 group-hover:to-purple-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Retrieve Sightings Data
            </span>
          </button> */}

          {/* New button to retrieve and display only id, lat, lng */}
          {/* <button
            onClick={handleRetrieveLocationData}
            className="relative inline-flex items-center justify-center p-0.5 mb-6 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-300 to-orange-300 group-hover:from-pink-300 group-hover:to-orange-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-orange-200 dark:focus:ring-orange-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Retrieve Location Data
            </span>
          </button> */}

          {/* {locationData && (
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Location Data (ID, Latitude, Longitude, Animal Name)</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {JSON.stringify(locationData, null, 2)}
              </pre>
            </div>
          )}

          {allData && (
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Retrieved Sightings Data</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {JSON.stringify(allData, null, 2)}
              </pre>
            </div>
          )} */}
        </>
      )}
    </div>
  );
}
