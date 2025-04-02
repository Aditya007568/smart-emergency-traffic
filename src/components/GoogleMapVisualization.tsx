
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { useMap } from '../context/MapContext';

const GoogleMapVisualization: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const { isLoaded } = useLoadScript({
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

  const trafficSignalIcon: google.maps.Icon = {
    url: '/traffic-signal-icon.png', // You'll need to add this icon
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 15)
  };

  const vehicleIcons: { [key: string]: google.maps.Icon } = {
    ambulance: {
      url: '/ambulance-icon.png', // You'll need to add this icon
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20)
    },
    fire: {
      url: '/fire-truck-icon.png', // You'll need to add this icon
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20)
    },
    police: {
      url: '/police-car-icon.png', // You'll need to add this icon
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20)
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

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
