
import React, { useState } from 'react';
import { useMap } from '../context/MapContext';
import GoogleMapVisualization from './GoogleMapVisualization';
import { MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MapVisualization: React.FC = () => {
  // Hardcoded API key for demonstration
  const googleMapsApiKey = 'AIzaSyCGYEhisKq-B_UM-4_AihPE1HnQ27eBsUQ';
  
  return (
    <div className="relative w-full h-full bg-gray-100 border rounded-md overflow-hidden">
      <GoogleMapVisualization apiKey={googleMapsApiKey} />
    </div>
  );
};

export default MapVisualization;
