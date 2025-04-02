
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TrafficSignal {
  id: string;
  name: string;
  location: [number, number]; // [lat, long]
  status: 'red' | 'green' | 'amber';
  timeRemaining: number;
  isEmergencyOverride: boolean;
}

export interface EmergencyVehicle {
  id: string;
  type: 'ambulance' | 'fire' | 'police';
  location: [number, number];
  destination: [number, number] | null;
  isActive: boolean;
  route: [number, number][];
}

interface MapContextType {
  signals: TrafficSignal[];
  emergencyVehicles: EmergencyVehicle[];
  selectedVehicle: string | null;
  setSelectedVehicle: (id: string | null) => void;
  addEmergencyVehicle: (type: 'ambulance' | 'fire' | 'police') => string;
  setDestination: (vehicleId: string, destination: [number, number]) => void;
  activateEmergencyMode: (vehicleId: string) => void;
  deactivateEmergencyMode: (vehicleId: string) => void;
  getSignalById: (id: string) => TrafficSignal | undefined;
  getVehicleById: (id: string) => EmergencyVehicle | undefined;
  updateSignalStatus: (id: string, status: 'red' | 'green' | 'amber') => void;
  toggleSignalOverride: (id: string) => void;
}

// Initial sample data for Pune, India
const initialSignals: TrafficSignal[] = [
  { 
    id: "s1", 
    name: "Fergusson College Road & JM Road", 
    location: [18.5204, 73.8467], 
    status: "red", 
    timeRemaining: 30,
    isEmergencyOverride: false,
  },
  { 
    id: "s2", 
    name: "Karve Road & Paud Road", 
    location: [18.5138, 73.8270], 
    status: "green", 
    timeRemaining: 20,
    isEmergencyOverride: false,
  },
  { 
    id: "s3", 
    name: "Laxmi Road & Kumthekar Road", 
    location: [18.5218, 73.8570], 
    status: "amber", 
    timeRemaining: 5,
    isEmergencyOverride: false,
  },
  { 
    id: "s4", 
    name: "University Circle", 
    location: [18.5248, 73.8630], 
    status: "red", 
    timeRemaining: 25,
    isEmergencyOverride: false,
  },
  { 
    id: "s5", 
    name: "Sinhagad Road Junction", 
    location: [18.5158, 73.8220], 
    status: "amber", 
    timeRemaining: 8,
    isEmergencyOverride: false,
  },
];

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [signals, setSignals] = useState<TrafficSignal[]>(initialSignals);
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const addEmergencyVehicle = (type: 'ambulance' | 'fire' | 'police') => {
    const newVehicle: EmergencyVehicle = {
      id: `vehicle-${Date.now()}`,
      type,
      location: [18.5204, 73.8567], // Default to Pune center
      destination: null,
      isActive: false,
      route: [],
    };
    
    setEmergencyVehicles(prev => [...prev, newVehicle]);
    return newVehicle.id;
  };

  const setDestination = (vehicleId: string, destination: [number, number]) => {
    setEmergencyVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? {
              ...vehicle,
              destination,
              // Simulate a route with some waypoints
              route: [
                vehicle.location,
                [
                  (vehicle.location[0] + destination[0]) / 2 - 0.002, 
                  (vehicle.location[1] + destination[1]) / 2 - 0.001
                ],
                [
                  (vehicle.location[0] + destination[0]) / 2 + 0.002, 
                  (vehicle.location[1] + destination[1]) / 2 + 0.001
                ],
                destination,
              ]
            } 
          : vehicle
      )
    );
  };

  const activateEmergencyMode = (vehicleId: string) => {
    setEmergencyVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, isActive: true } 
          : vehicle
      )
    );

    // Simulate turning nearby signals to green based on vehicle route
    const vehicle = emergencyVehicles.find(v => v.id === vehicleId);
    
    if (vehicle?.route) {
      // Find the nearest signal to each route point
      vehicle.route.forEach(point => {
        const nearestSignal = findNearestSignal(point);
        if (nearestSignal) {
          updateSignalStatus(nearestSignal.id, "green");
          toggleSignalOverride(nearestSignal.id);
        }
      });
    }
  };

  const deactivateEmergencyMode = (vehicleId: string) => {
    setEmergencyVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, isActive: false } 
          : vehicle
      )
    );

    // Reset all overridden signals
    setSignals(prev => 
      prev.map(signal => 
        signal.isEmergencyOverride 
          ? { ...signal, isEmergencyOverride: false } 
          : signal
      )
    );
  };

  const updateSignalStatus = (id: string, status: 'red' | 'green' | 'amber') => {
    setSignals(prev => 
      prev.map(signal => 
        signal.id === id 
          ? { ...signal, status } 
          : signal
      )
    );
  };

  const toggleSignalOverride = (id: string) => {
    setSignals(prev => 
      prev.map(signal => 
        signal.id === id 
          ? { ...signal, isEmergencyOverride: !signal.isEmergencyOverride } 
          : signal
      )
    );
  };

  // Helper to find the nearest signal to a point
  const findNearestSignal = (point: [number, number]): TrafficSignal | undefined => {
    let nearestDistance = Number.MAX_VALUE;
    let nearestSignal: TrafficSignal | undefined;

    signals.forEach(signal => {
      const distance = Math.sqrt(
        Math.pow(signal.location[0] - point[0], 2) + 
        Math.pow(signal.location[1] - point[1], 2)
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSignal = signal;
      }
    });

    return nearestSignal;
  };

  const getSignalById = (id: string) => {
    return signals.find(signal => signal.id === id);
  };

  const getVehicleById = (id: string) => {
    return emergencyVehicles.find(vehicle => vehicle.id === id);
  };

  return (
    <MapContext.Provider
      value={{
        signals,
        emergencyVehicles,
        selectedVehicle,
        setSelectedVehicle,
        addEmergencyVehicle,
        setDestination,
        activateEmergencyMode,
        deactivateEmergencyMode,
        getSignalById,
        getVehicleById,
        updateSignalStatus,
        toggleSignalOverride
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
