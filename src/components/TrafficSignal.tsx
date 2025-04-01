
import React from 'react';
import { TrafficSignal as SignalType } from '../context/MapContext';

interface TrafficSignalProps {
  signal: SignalType;
}

const TrafficSignal: React.FC<TrafficSignalProps> = ({ signal }) => {
  const getStatusClass = () => {
    switch (signal.status) {
      case 'red':
        return 'bg-signal-red';
      case 'green':
        return 'bg-signal-green';
      case 'amber':
        return 'bg-signal-amber';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="relative">
      <div className={`w-6 h-6 rounded-full ${getStatusClass()} ${signal.isEmergencyOverride ? 'animate-pulse-emergency' : ''}`}>
        {signal.isEmergencyOverride && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        )}
      </div>
      <div className="mt-1 text-xs font-medium text-gray-700">
        {signal.name}
      </div>
    </div>
  );
};

export default TrafficSignal;
