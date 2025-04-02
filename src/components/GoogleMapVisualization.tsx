
import React from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useMap } from '../context/MapContext';

const GoogleMapVisualization: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const { emergencyVehicles, signals } = useMap();

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060,
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

  const vehicleIcons = {
    ambulance: {
      url: '/ambulance-icon.png',
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20)
    },
    fire: {
      url: '/fire-truck-icon.png',
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20)
    },
    police: {
      url: '/police-car-icon.png',
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20)
    }
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

      {emergencyVehicles.map((vehicle) => (
        <React.Fragment key={vehicle.id}>
          <Marker
            position={{
              lat: vehicle.location[0],
              lng: vehicle.location[1]
            }}
            icon={vehicleIcons[vehicle.type]}
          />
          {vehicle.route && vehicle.route.length > 1 && (
            <Polyline
              path={vehicle.route.map(point => ({
                lat: point[0],
                lng: point[1]
              }))}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3
              }}
            />
          )}
        </React.Fragment>
      ))}
    </GoogleMap>
  );
};

export default GoogleMapVisualization;
