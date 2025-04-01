
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMap } from '../context/MapContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DestinationInput: React.FC = () => {
  const { selectedVehicle, setDestination, getVehicleById } = useMap();
  const [lat, setLat] = useState('40.7146');
  const [lng, setLng] = useState('-74.0071');
  const { toast } = useToast();

  const selectedVehicleData = selectedVehicle ? getVehicleById(selectedVehicle) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle) {
      toast({
        title: "No vehicle selected",
        description: "Please select a vehicle first.",
        variant: "destructive"
      });
      return;
    }
    
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    if (isNaN(latNum) || isNaN(lngNum)) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude and longitude.",
        variant: "destructive"
      });
      return;
    }
    
    setDestination(selectedVehicle, [latNum, lngNum]);
    toast({
      title: "Destination set",
      description: "Route has been calculated.",
      variant: "default"
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-emergency" />
          Set Destination
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedVehicle ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="latitude" className="text-sm font-medium block mb-1">
                    Latitude
                  </label>
                  <Input
                    id="latitude"
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="40.7146"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="text-sm font-medium block mb-1">
                    Longitude
                  </label>
                  <Input
                    id="longitude"
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="-74.0071"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full flex items-center"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Set Destination
              </Button>
            </form>
            
            {selectedVehicleData?.destination && (
              <div className="mt-4 pt-4 border-t text-sm">
                <div className="font-medium">Current Destination:</div>
                <div className="text-gray-600">
                  {selectedVehicleData.destination[0].toFixed(4)}, {selectedVehicleData.destination[1].toFixed(4)}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Select a vehicle to set destination
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DestinationInput;
