
import React, { useState } from 'react';
import { useMap } from '../context/MapContext';
import GoogleMapVisualization from './GoogleMapVisualization';
import { MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MapVisualization: React.FC = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');
  const [showApiInput, setShowApiInput] = useState<boolean>(true);
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleMapsApiKey.trim()) {
      setShowApiInput(false);
      toast.success('API Key applied successfully');
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 border rounded-md overflow-hidden">
      {showApiInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-8 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Google Maps API Key Required</h3>
            <p className="text-gray-600 mb-4">
              To display the interactive map, please enter your Google Maps API key. You can get an API key from the 
              <a 
                href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline mx-1"
              >
                Google Cloud Platform Console
              </a>.
            </p>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <Input
                type="text"
                value={googleMapsApiKey}
                onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                placeholder="Enter Google Maps API Key"
                className="w-full"
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Load Map
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <GoogleMapVisualization apiKey={googleMapsApiKey} />
      )}
    </div>
  );
};

export default MapVisualization;
