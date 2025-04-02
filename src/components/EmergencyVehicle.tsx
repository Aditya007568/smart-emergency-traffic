
import React from 'react';
import { Ambulance, Car, Navigation, FireExtinguisher, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmergencyVehicle as VehicleType } from '../context/MapContext';

interface EmergencyVehicleProps {
  vehicle: VehicleType;
  isSelected: boolean;
  onSelect: () => void;
}

const EmergencyVehicle: React.FC<EmergencyVehicleProps> = ({ 
  vehicle, 
  isSelected,
  onSelect 
}) => {
  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case 'ambulance':
        return <Ambulance size={20} />;
      case 'fire':
        return <FireExtinguisher size={20} />;
      case 'police':
        return <Shield size={20} />;
      default:
        return <Car size={20} />;
    }
  };

  return (
    <div 
      className={cn(
        "p-2 border rounded-md cursor-pointer transition-all duration-300",
        isSelected 
          ? "border-emergency bg-emergency/20 shadow-lg shadow-emergency/30" 
          : "border-gray-200 hover:border-emergency/50",
        vehicle.isActive && "animate-pulse-emergency"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-2">
        <div className={cn(
          "p-1 rounded-full transition-colors duration-300",
          isSelected
            ? "bg-emergency text-white"
            : vehicle.isActive 
              ? "bg-emergency text-white" 
              : "bg-gray-100 text-gray-700"
        )}>
          {getVehicleIcon()}
        </div>
        <div>
          <div className={cn(
            "font-medium capitalize transition-colors duration-300",
            isSelected && "text-emergency font-bold"
          )}>
            {vehicle.type}
            {isSelected && " (Selected)"}
          </div>
          <div className="text-xs text-gray-500">
            {vehicle.isActive 
              ? "Emergency Active" 
              : vehicle.destination 
                ? "Ready" 
                : "No Destination"
            }
          </div>
        </div>
      </div>

      {vehicle.destination && (
        <div className="mt-2 flex items-center text-xs text-gray-600">
          <Navigation size={12} className="mr-1" />
          <span>
            Destination: {vehicle.destination[0].toFixed(4)}, {vehicle.destination[1].toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
};

export default EmergencyVehicle;
