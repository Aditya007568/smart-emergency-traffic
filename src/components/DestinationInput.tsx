
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMap } from '../context/MapContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const commonLocations = [
  { name: "Hospital", coordinates: [40.7168, -74.0060] as [number, number] },
  { name: "Fire Station", coordinates: [40.7130, -74.0090] as [number, number] },
  { name: "Police HQ", coordinates: [40.7110, -74.0045] as [number, number] },
  { name: "Central Park", coordinates: [40.7150, -74.0030] as [number, number] },
  { name: "Downtown", coordinates: [40.7120, -74.0080] as [number, number] },
  { name: "City Hall", coordinates: [40.7135, -74.0055] as [number, number] },
];

const DestinationInput: React.FC = () => {
  const { selectedVehicle, setDestination, getVehicleById } = useMap();
  const [searchInput, setSearchInput] = useState('');
  const [fromSearchInput, setFromSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<typeof commonLocations>([]);
  const [fromSearchResults, setFromSearchResults] = useState<typeof commonLocations>([]);
  const { toast } = useToast();

  const selectedVehicleData = selectedVehicle ? getVehicleById(selectedVehicle) : null;

  const handleSearch = (value: string, type: 'to' | 'from') => {
    const locations = commonLocations.filter(location => 
      location.name.toLowerCase().includes(value.toLowerCase())
    );
    
    if (type === 'to') {
      setSearchInput(value);
      setSearchResults(locations);
    } else {
      setFromSearchInput(value);
      setFromSearchResults(locations);
    }
  };

  const handleSelectLocation = (location: typeof commonLocations[0], type: 'to' | 'from') => {
    if (!selectedVehicle) {
      toast({
        title: "No vehicle selected",
        description: "Please select a vehicle first.",
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'to') {
      setDestination(selectedVehicle, location.coordinates);
      setSearchInput(location.name);
      setSearchResults([]);
    } else {
      // Placeholder for setting origin - you might want to expand this functionality
      setFromSearchInput(location.name);
      setFromSearchResults([]);
    }
    
    toast({
      title: "Location set",
      description: `${type === 'to' ? 'Destination' : 'Origin'} set to ${location.name}`,
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
    
    const matchedDestination = commonLocations.find(
      loc => loc.name.toLowerCase() === searchInput.toLowerCase()
    );
    
    if (matchedDestination) {
      handleSelectLocation(matchedDestination, 'to');
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
          Set Route
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedVehicle ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <div className="mb-2">
                  <label className="text-sm text-gray-600 mb-1 block">From</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      value={fromSearchInput}
                      onChange={(e) => handleSearch(e.target.value, 'from')}
                      placeholder="Search origin location..."
                      className="pl-9"
                    />
                  </div>
                  
                  {fromSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                      {fromSearchResults.map((location) => (
                        <div
                          key={location.name}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleSelectLocation(location, 'from')}
                        >
                          <MapPin className="h-4 w-4 text-emergency mr-2" />
                          {location.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">To</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      value={searchInput}
                      onChange={(e) => handleSearch(e.target.value, 'to')}
                      placeholder="Search destination location..."
                      className="pl-9"
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                      {searchResults.map((location) => (
                        <div
                          key={location.name}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleSelectLocation(location, 'to')}
                        >
                          <MapPin className="h-4 w-4 text-emergency mr-2" />
                          {location.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full flex items-center bg-emergency hover:bg-emergency/90 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Set Route
              </Button>
            </form>
            
            {selectedVehicleData?.destination && commonLocations.some(loc => 
              loc.coordinates[0] === selectedVehicleData.destination?.[0] && 
              loc.coordinates[1] === selectedVehicleData.destination?.[1]
            ) ? (
              <div className="mt-4 pt-4 border-t text-sm">
                <div className="font-medium">Current Route:</div>
                <div className="text-gray-600 flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-emergency" />
                  {commonLocations.find(loc => 
                    loc.coordinates[0] === selectedVehicleData.destination?.[0] && 
                    loc.coordinates[1] === selectedVehicleData.destination?.[1]
                  )?.name || 'Custom destination'}
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
            Select a vehicle to set route
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DestinationInput;
