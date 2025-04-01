
import React from 'react';
import { useMap, TrafficSignal } from '../context/MapContext';
import TrafficSignalComponent from './TrafficSignal';
import { MapPin, Navigation } from 'lucide-react';

const MapVisualization: React.FC = () => {
  const { 
    signals, 
    emergencyVehicles, 
    selectedVehicle,
    setDestination
  } = useMap();

  // Simple mock map implementation (in a real app, use a proper map library)
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedVehicle) return;
    
    // Get relative click position in the map and convert to mock coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel coordinates to mock latitude/longitude
    // This is just for simulation purposes
    const lat = 40.7128 + (y / rect.height - 0.5) * 0.02;
    const lng = -74.0060 + (x / rect.width - 0.5) * 0.02;
    
    setDestination(selectedVehicle, [lat, lng]);
  };

  // Find the selected vehicle object
  const vehicle = emergencyVehicles.find(v => v.id === selectedVehicle);

  return (
    <div 
      className="relative w-full h-full bg-gray-100 border rounded-md overflow-hidden" 
      onClick={handleMapClick}
    >
      {/* Road network - simple representation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 transform -translate-y-1/2" />
        <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-300 transform -translate-x-1/2" />
        <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-300 transform -translate-y-1/2" />
        <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-300 transform -translate-y-1/2" />
        <div className="absolute top-0 bottom-0 left-1/4 w-2 bg-gray-300 transform -translate-x-1/2" />
        <div className="absolute top-0 bottom-0 left-3/4 w-2 bg-gray-300 transform -translate-x-1/2" />
      </div>

      {/* Traffic signals */}
      {signals.map((signal) => (
        <div 
          key={signal.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${(signal.location[1] + 74.0060) * 25000}%`, 
            top: `${(signal.location[0] - 40.7128) * 25000}%` 
          }}
        >
          <TrafficSignalComponent signal={signal} />
        </div>
      ))}

      {/* Emergency vehicles */}
      {emergencyVehicles.map((vehicle) => (
        <React.Fragment key={vehicle.id}>
          {/* Vehicle marker */}
          <div 
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${vehicle.isActive ? 'z-30' : 'z-20'}`}
            style={{ 
              left: `${(vehicle.location[1] + 74.0060) * 25000}%`, 
              top: `${(vehicle.location[0] - 40.7128) * 25000}%` 
            }}
          >
            <div className={`p-1 rounded-full ${vehicle.isActive ? 'bg-emergency text-white' : 'bg-white border border-gray-300'}`}>
              <div className={`w-6 h-6 flex items-center justify-center ${vehicle.id === selectedVehicle ? 'ring-2 ring-blue-500' : ''}`}>
                {vehicle.type === 'ambulance' ? (
                  <span className="text-sm font-bold">A</span>
                ) : vehicle.type === 'fire' ? (
                  <span className="text-sm font-bold">F</span>
                ) : (
                  <span className="text-sm font-bold">P</span>
                )}
              </div>
            </div>
          </div>

          {/* Destination marker if set */}
          {vehicle.destination && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ 
                left: `${(vehicle.destination[1] + 74.0060) * 25000}%`, 
                top: `${(vehicle.destination[0] - 40.7128) * 25000}%` 
              }}
            >
              <div className={`${vehicle.id === selectedVehicle ? 'text-emergency' : 'text-gray-500'}`}>
                <MapPin size={24} />
              </div>
            </div>
          )}

          {/* Route visualization */}
          {vehicle.route.length > 0 && (
            <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
              <path 
                d={`M ${(vehicle.route[0][1] + 74.0060) * 25000} ${(vehicle.route[0][0] - 40.7128) * 25000} ${
                  vehicle.route.slice(1).map(point => `L ${(point[1] + 74.0060) * 25000} ${(point[0] - 40.7128) * 25000}`).join(' ')
                }`} 
                stroke={vehicle.isActive ? '#FF3A33' : '#2563EB'}
                strokeWidth="2"
                strokeDasharray={vehicle.isActive ? undefined : "5,5"}
                fill="none"
              />
            </svg>
          )}
        </React.Fragment>
      ))}

      {/* Instructions overlay */}
      {selectedVehicle ? (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded shadow-sm text-xs">
          <p className="font-medium">
            {vehicle?.destination 
              ? "Route set. Click 'Activate Emergency' to override signals." 
              : "Click on the map to set a destination."
            }
          </p>
        </div>
      ) : (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded shadow-sm text-xs">
          <p className="font-medium">Select a vehicle to begin.</p>
        </div>
      )}
    </div>
  );
};

export default MapVisualization;
