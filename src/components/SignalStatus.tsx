
import React from 'react';
import { useMap } from '../context/MapContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrafficCone } from 'lucide-react';

const SignalStatus: React.FC = () => {
  const { signals } = useMap();

  // Group signals by status
  const redSignals = signals.filter(signal => signal.status === 'red');
  const greenSignals = signals.filter(signal => signal.status === 'green');
  const amberSignals = signals.filter(signal => signal.status === 'amber');
  const overriddenSignals = signals.filter(signal => signal.isEmergencyOverride);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <TrafficCone className="w-5 h-5 mr-2" />
          Traffic Signal Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-signal-red mr-2" />
            <span className="font-medium">Red:</span>
            <span className="ml-1">{redSignals.length}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-signal-green mr-2" />
            <span className="font-medium">Green:</span>
            <span className="ml-1">{greenSignals.length}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-signal-amber mr-2" />
            <span className="font-medium">Amber:</span>
            <span className="ml-1">{amberSignals.length}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emergency/70 mr-2 animate-pulse" />
            <span className="font-medium">Overridden:</span>
            <span className="ml-1">{overriddenSignals.length}</span>
          </div>
        </div>

        {overriddenSignals.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="font-medium text-sm mb-2">Emergency Override Active:</h4>
            <div className="max-h-24 overflow-y-auto text-xs space-y-1">
              {overriddenSignals.map(signal => (
                <div key={signal.id} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full bg-signal-${signal.status} mr-2`} />
                  <span>{signal.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalStatus;
