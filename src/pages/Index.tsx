
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-dark-blue/90 dark:to-dark-blue/80">
        <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 shadow-lg">
          <div className="container mx-auto flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-3 mb-2">
              <Siren className="w-10 h-10 text-emergency animate-pulse" />
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Smart Emergency Traffic System
              </h1>
            </div>
            <p className="text-blue-100 text-lg">Traffic Signal Override for Emergency Vehicles</p>
          </div>
        </header>

        <main className="container mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-100/50 overflow-hidden transition-all duration-300 hover:shadow-blue-200/30">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100/50 flex items-center">
                  <h2 className="text-xl font-semibold text-blue-800 flex-grow">Traffic Map</h2>
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

        <footer className="bg-blue-700/10 p-4 mt-8 border-t border-blue-200">
          <div className="container mx-auto text-center text-blue-700 text-sm">
            Smart Emergency Traffic System &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </MapProvider>
  );
};

export default Index;
