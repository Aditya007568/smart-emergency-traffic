
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMap } from '../context/MapContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Common locations with coordinates
const commonLocations = [
  { name: "Hospital", coordinates: [40.7168, -74.0060] },
  { name: "Fire Station", coordinates: [40.7130, -74.0090] },
  { name: "Police HQ", coordinates: [40.7110, -74.0045] },
  { name: "Central Park", coordinates: [40.7150, -74.0030] },
  { name: "Downtown", coordinates: [40.7120, -74.0080] },
  { name: "City Hall", coordinates: [40.7135, -74.0055] },
];

const DestinationInput: React.FC = () => {
  const { selectedVehicle, setDestination, getVehicleById } = useMap();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<typeof commonLocations>([]);
  const { toast } = useToast();

  const selectedVehicleData = selectedVehicle ? getVehicleById(selectedVehicle) : null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.trim().length > 1) {
      // Filter locations based on search input
      const results = commonLocations.filter(location => 
        location.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (location: typeof commonLocations[0]) => {
    if (!selectedVehicle) {
      toast({
        title: "No vehicle selected",
        description: "Please select a vehicle first.",
        variant: "destructive"
      });
      return;
    }
    
    setDestination(selectedVehicle, location.coordinates);
    setSearchInput(location.name);
    setSearchResults([]);
    
    toast({
      title: "Destination set",
      description: `Route to ${location.name} has been calculated.`,
      variant: "default"
    });
  };

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
    
    // Try to find a matching location
    const matchedLocation = commonLocations.find(
      loc => loc.name.toLowerCase() === searchInput.toLowerCase()
    );
    
    if (matchedLocation) {
      handleSelectLocation(matchedLocation);
    } else {
      toast({
        title: "Location not found",
        description: "Please select a location from the suggestions.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
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
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    value={searchInput}
                    onChange={handleSearch}
                    placeholder="Search for a location..."
                    className="pl-9"
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                    {searchResults.map((location) => (
                      <div
                        key={location.name}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectLocation(location)}
                      >
                        <MapPin className="h-4 w-4 text-emergency mr-2" />
                        {location.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full flex items-center bg-emergency hover:bg-emergency/90 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Set Destination
              </Button>
            </form>
            
            {selectedVehicleData?.destination && commonLocations.some(loc => 
              loc.coordinates[0] === selectedVehicleData.destination?.[0] && 
              loc.coordinates[1] === selectedVehicleData.destination?.[1]
            ) ? (
              <div className="mt-4 pt-4 border-t text-sm">
                <div className="font-medium">Current Destination:</div>
                <div className="text-gray-600 flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-emergency" />
                  {commonLocations.find(loc => 
                    loc.coordinates[0] === selectedVehicleData.destination?.[0] && 
                    loc.coordinates[1] === selectedVehicleData.destination?.[1]
                  )?.name || 'Custom location'}
                </div>
              </div>
            ) : selectedVehicleData?.destination ? (
              <div className="mt-4 pt-4 border-t text-sm">
                <div className="font-medium">Current Destination:</div>
                <div className="text-gray-600 flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-emergency" />
                  Custom location ({selectedVehicleData.destination[0].toFixed(4)}, {selectedVehicleData.destination[1].toFixed(4)})
                </div>
              </div>
            ) : null}
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
