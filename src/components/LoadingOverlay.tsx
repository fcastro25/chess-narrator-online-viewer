
import React from "react";
import { Loader } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Carregando partidas..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card p-8 rounded-lg shadow-lg border max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-card-foreground text-center font-medium">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
