
import React from 'react';
import { MapProvider } from '../context/MapContext';
import MapVisualization from '../components/MapVisualization';
import VehicleSelector from '../components/VehicleSelector';
import DestinationInput from '../components/DestinationInput';
import EmergencyControls from '../components/EmergencyControls';
import SignalStatus from '../components/SignalStatus';

const Index = () => {
  return (
    <MapProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-dark-blue text-white p-4 shadow-lg">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Smart Emergency Traffic System</h1>
            <p className="text-gray-300 text-sm">
              Traffic Signal Override for Emergency Vehicles
            </p>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4 h-[600px]">
                <h2 className="text-xl font-bold mb-4">Traffic Map</h2>
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

        <footer className="bg-gray-100 p-4 mt-8 border-t">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            Smart Emergency Traffic System &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </MapProvider>
  );
};

export default Index;
