
import React from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useMap } from '../context/MapContext';

const GoogleMapVisualization: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const { emergencyVehicles, signals, selectedVehicle } = useMap();

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  // Updated to Pune, India coordinates
  const defaultCenter = {
    lat: 18.5204,
    lng: 73.8567,
  };

  const defaultOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  // Handle loading and error states
  if (loadError) {
    return <div className="p-4 text-red-500">Error loading maps. Please check your API key.</div>;
  }

  if (!isLoaded) {
    return <div className="p-4 flex justify-center items-center h-full">Loading maps...</div>;
  }

  // Only create these objects after Google Maps API is loaded
  const trafficSignalIcon = {
    url: '/traffic-signal-icon.png',
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 15)
  };

  const getVehicleIcon = (vehicleType, isSelected) => {
    const size = isSelected ? 50 : 40;
    
    return {
      url: `/${vehicleType}-icon.png`,
      scaledSize: new google.maps.Size(size, size),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(size/2, size/2)
    };
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={defaultCenter}
      options={defaultOptions}
    >
      {signals.map((signal) => (
        <Marker
          key={signal.id}
          position={{
            lat: signal.location[0],
            lng: signal.location[1]
          }}
          icon={trafficSignalIcon}
        />
      ))}

      {emergencyVehicles.map((vehicle) => {
        const isSelected = vehicle.id === selectedVehicle;
        
        return (
          <React.Fragment key={vehicle.id}>
            <Marker
              position={{
                lat: vehicle.location[0],
                lng: vehicle.location[1]
              }}
              icon={getVehicleIcon(vehicle.type, isSelected)}
              zIndex={isSelected ? 1000 : 100}
              animation={isSelected ? google.maps.Animation.BOUNCE : null}
            />
            {vehicle.route && vehicle.route.length > 1 && (
              <Polyline
                path={vehicle.route.map(point => ({
                  lat: point[0],
                  lng: point[1]
                }))}
                options={{
                  strokeColor: isSelected ? '#FF3A33' : '#FF0000',
                  strokeOpacity: isSelected ? 1 : 0.8,
                  strokeWeight: isSelected ? 5 : 3
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );
};

export default GoogleMapVisualization;
