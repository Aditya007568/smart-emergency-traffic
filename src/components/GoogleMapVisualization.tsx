
import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { useMap } from '../context/MapContext';
import { toast } from 'sonner';

// Default map styles
const containerStyle = {
  width: '100%',
  height: '100%'
};

// NYC center as default
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

// Marker icons
const icons = {
  ambulance: { 
    url: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png",
    scaledSize: { width: 40, height: 40 },
  },
  fire: { 
    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    scaledSize: { width: 40, height: 40 },
  },
  police: { 
    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    scaledSize: { width: 40, height: 40 },
  },
  signal: { 
    url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    scaledSize: { width: 30, height: 30 },
  },
  destination: { 
    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    scaledSize: { width: 40, height: 40 },
  }
};

interface GoogleMapProps {
  apiKey: string;
}

const GoogleMapVisualization: React.FC<GoogleMapProps> = ({ apiKey }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState<string>(apiKey || '');
  const [isKeyValid, setIsKeyValid] = useState<boolean>(Boolean(apiKey));
  
  const { 
    signals, 
    emergencyVehicles, 
    selectedVehicle,
    setDestination 
  } = useMap();

  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKeyInput,
  });

  // Handle map click for destination setting
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!selectedVehicle || !event.latLng) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setDestination(selectedVehicle, [lat, lng]);
    
    toast.success('Destination set', {
      description: 'Click "Activate Emergency" to begin route'
    });
  }, [selectedVehicle, setDestination]);

  // Store a reference to the map when it loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Clean up map reference when component unmounts
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle API key submission
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsKeyValid(true);
    toast.success('API Key applied', {
      description: 'Map will reload with your API key'
    });
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6 rounded-md text-center">
        <div className="text-red-500 font-semibold">Error loading Google Maps</div>
        <p className="text-gray-600 mt-2">
          There was an error loading Google Maps. Please check your API key.
        </p>
        {!isKeyValid && (
          <form onSubmit={handleApiKeySubmit} className="mt-4 w-full max-w-md">
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your Google Maps API Key"
              className="px-4 py-2 border rounded-md w-full"
            />
            <button
              type="submit"
              className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply API Key
            </button>
          </form>
        )}
      </div>
    );
  }

  if (!isLoaded || !isKeyValid) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6 rounded-md text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
        {!apiKey && !isKeyValid && (
          <form onSubmit={handleApiKeySubmit} className="mt-4 w-full max-w-md">
            <p className="text-gray-600 mb-4">
              Please enter your Google Maps API Key to display the map.
              <br />
              <a 
                href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Get an API key
              </a>
            </p>
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your Google Maps API Key"
              className="px-4 py-2 border rounded-md w-full"
            />
            <button
              type="submit"
              className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Load Map
            </button>
          </form>
        )}
        {apiKey && isKeyValid && <p className="text-gray-600">Loading map...</p>}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {/* Traffic Signals */}
        {signals.map((signal) => (
          <Marker
            key={signal.id}
            position={{ lat: signal.location[0], lng: signal.location[1] }}
            icon={{
              url: `https://maps.google.com/mapfiles/ms/icons/${signal.status === 'green' ? 'green' : signal.status === 'red' ? 'red' : 'yellow'}-dot.png`,
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            title={`${signal.name} - ${signal.status.toUpperCase()}`}
          />
        ))}

        {/* Emergency Vehicles */}
        {emergencyVehicles.map((vehicle) => (
          <React.Fragment key={vehicle.id}>
            {/* Vehicle Marker */}
            <Marker
              position={{ lat: vehicle.location[0], lng: vehicle.location[1] }}
              icon={{
                url: icons[vehicle.type].url,
                scaledSize: new window.google.maps.Size(
                  vehicle.id === selectedVehicle ? 50 : 40, 
                  vehicle.id === selectedVehicle ? 50 : 40
                ),
              }}
              zIndex={vehicle.id === selectedVehicle ? 100 : 10}
              animation={vehicle.isActive ? window.google.maps.Animation.BOUNCE : undefined}
              title={`${vehicle.type.toUpperCase()} ${vehicle.isActive ? '(ACTIVE)' : ''}`}
            />

            {/* Destination Marker */}
            {vehicle.destination && (
              <Marker
                position={{ lat: vehicle.destination[0], lng: vehicle.destination[1] }}
                icon={icons.destination}
                title="Destination"
              />
            )}

            {/* Route Path */}
            {vehicle.route.length > 0 && (
              <Polyline
                path={vehicle.route.map(point => ({ lat: point[0], lng: point[1] }))}
                options={{
                  strokeColor: vehicle.isActive ? '#FF3A33' : '#2563EB',
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                  strokePattern: vehicle.isActive ? undefined : [10, 5]
                }}
              />
            )}
          </React.Fragment>
        ))}
      </GoogleMap>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded shadow-sm text-xs">
        {selectedVehicle ? (
          <p className="font-medium">
            {emergencyVehicles.find(v => v.id === selectedVehicle)?.destination 
              ? "Route set. Click 'Activate Emergency' to override signals." 
              : "Click on the map to set a destination."
            }
          </p>
        ) : (
          <p className="font-medium">Select a vehicle to begin.</p>
        )}
      </div>
    </div>
  );
};

export default GoogleMapVisualization;
