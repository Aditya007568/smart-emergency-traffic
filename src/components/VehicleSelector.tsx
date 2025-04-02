
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, ShieldAlert, Truck } from 'lucide-react';
import { useMap } from '../context/MapContext';

const VehicleSelector = () => {
  const { addEmergencyVehicle, selectedVehicle, setSelectedVehicle } = useMap();

  const vehicleTypes = [
    { 
      type: 'ambulance', 
      icon: Ambulance, 
      label: 'Ambulance' 
    },
    { 
      type: 'fire', 
      icon: Truck, 
      label: 'Fire Truck' 
    },
    { 
      type: 'police', 
      icon: ShieldAlert, 
      label: 'Police' 
    }
  ];

  const handleAddVehicle = (type: 'ambulance' | 'fire' | 'police') => {
    const newVehicleId = addEmergencyVehicle(type);
    setSelectedVehicle(newVehicleId);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Emergency Vehicles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {vehicleTypes.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant={selectedVehicle === type ? 'default' : 'outline'}
            className="w-full flex items-center justify-start gap-2"
            onClick={() => handleAddVehicle(type)}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;
