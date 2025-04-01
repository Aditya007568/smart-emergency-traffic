
import React from 'react';
import { MapProvider } from '../context/MapContext';
import MapVisualization from '../components/MapVisualization';
import VehicleSelector from '../components/VehicleSelector';
import DestinationInput from '../components/DestinationInput';
import EmergencyControls from '../components/EmergencyControls';
import SignalStatus from '../components/SignalStatus';
import { Siren } from 'lucide-react';

const Index = () => {
  return (
    <MapProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-dark-blue/90 dark:to-dark-blue/80">
        <header className="bg-dark-blue text-white p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Siren className="w-8 h-8 text-emergency" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Smart Emergency Traffic System</h1>
                <p className="text-gray-300 text-sm">Traffic Signal Override for Emergency Vehicles</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="bg-blue-50/50 p-4 border-b border-gray-100 flex items-center">
                  <h2 className="text-xl font-semibold text-dark-blue flex-grow">Traffic Map</h2>
                </div>
                <div className="h-[540px]">
                  <MapVisualization />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <VehicleSelector />
              <DestinationInput />
              <EmergencyControls />
              <SignalStatus />
            </div>
          </div>
        </main>

        <footer className="bg-dark-blue/5 p-4 mt-8 border-t border-gray-200">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            Smart Emergency Traffic System &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </MapProvider>
  );
};

export default Index;
