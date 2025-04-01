
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMap } from '../context/MapContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Siren, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmergencyControls: React.FC = () => {
  const { 
    selectedVehicle, 
    getVehicleById, 
    activateEmergencyMode, 
    deactivateEmergencyMode 
  } = useMap();
  const { toast } = useToast();

  const selectedVehicleData = selectedVehicle ? getVehicleById(selectedVehicle) : null;

  const handleActivateEmergency = () => {
    if (!selectedVehicle) {
      toast({
        title: "No vehicle selected",
        description: "Please select an emergency vehicle first.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVehicleData?.destination) {
      toast({
        title: "No destination set",
        description: "Please set a destination for the vehicle first.",
        variant: "destructive"
      });
      return;
    }

    activateEmergencyMode(selectedVehicle);
    toast({
      title: "Emergency Mode Activated",
      description: "Traffic signals on the route will prioritize this vehicle.",
      variant: "default"
    });
  };

  const handleDeactivateEmergency = () => {
    if (!selectedVehicle) return;
    
    deactivateEmergencyMode(selectedVehicle);
    toast({
      title: "Emergency Mode Deactivated",
      description: "Traffic signals have returned to normal operation.",
      variant: "default"
    });
  };

  const isEmergencyActive = selectedVehicleData?.isActive || false;

  return (
    <Card className={isEmergencyActive ? "border-emergency" : undefined}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Siren className={`w-5 h-5 mr-2 ${isEmergencyActive ? "text-emergency" : ""}`} />
          Emergency Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedVehicle ? (
          <>
            {isEmergencyActive ? (
              <div className="space-y-3">
                <div className="bg-emergency/10 border border-emergency rounded-md p-3 text-sm">
                  <p className="font-medium text-emergency">Emergency Mode Active</p>
                  <p className="text-gray-700 mt-1">
                    Traffic signals on route are being overridden
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-emergency text-emergency hover:bg-emergency hover:text-white"
                  onClick={handleDeactivateEmergency}
                >
                  Deactivate Emergency Mode
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant={selectedVehicleData?.destination ? "default" : "outline"}
                  className={`w-full ${
                    selectedVehicleData?.destination 
                      ? "bg-emergency hover:bg-emergency/90 text-white" 
                      : "text-gray-500"
                  }`}
                  disabled={!selectedVehicleData?.destination}
                  onClick={handleActivateEmergency}
                >
                  <Siren className="w-4 h-4 mr-2" />
                  Activate Emergency Override
                </Button>

                {!selectedVehicleData?.destination && (
                  <div className="text-xs text-gray-500 text-center">
                    Set a destination first to activate emergency mode
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Select a vehicle to access emergency controls
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyControls;
