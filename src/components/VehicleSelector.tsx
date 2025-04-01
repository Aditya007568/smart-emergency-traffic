
import React from 'react';
import { useMap } from '../context/MapContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, Car, Plus } from 'lucide-react';
import EmergencyVehicleComponent from './EmergencyVehicle';

const VehicleSelector: React.FC = () => {
  const { 
    emergencyVehicles, 
    selectedVehicle, 
    setSelectedVehicle,
    addEmergencyVehicle 
  } = useMap();

  const handleAddVehicle = (type: 'ambulance' | 'fire' | 'police') => {
    const newId = addEmergencyVehicle(type);
    setSelectedVehicle(newId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Emergency Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emergencyVehicles.length > 0 ? (
            emergencyVehicles.map((vehicle) => (
              <EmergencyVehicleComponent
                key={vehicle.id}
                vehicle={vehicle}
                isSelected={vehicle.id === selectedVehicle}
                onSelect={() => setSelectedVehicle(vehicle.id)}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No emergency vehicles added yet
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAddVehicle('ambulance')}
            className="flex items-center justify-center"
          >
            <Ambulance className="h-4 w-4 mr-1" />
            <span>Ambulance</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddVehicle('fire')}
            className="flex items-center justify-center"
          >
            <Car className="h-4 w-4 mr-1" />
            <span>Fire</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAddVehicle('police')}
            className="flex items-center justify-center"
          >
            <Car className="h-4 w-4 mr-1" />
            <span>Police</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSelector;
