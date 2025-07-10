
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from "lucide-react";

interface GameControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  isPlaying: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  canGoToEnd: boolean;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onReset,
  onGoToStart,
  onGoToEnd,
  isPlaying,
  canGoNext,
  canGoPrevious,
  canGoToEnd,
  playbackSpeed,
  onSpeedChange,
}) => {
  const handleSpeedChange = (value: number[]) => {
    onSpeedChange(value[0]);
  };

  const getSpeedLabel = (speed: number): string => {
    if (speed >= 2000) return "Muito Lento";
    if (speed >= 1500) return "Lento";
    if (speed >= 1000) return "Normal";
    if (speed >= 500) return "Rápido";
    return "Muito Rápido";
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg space-y-4">
      <h3 className="text-lg font-medium text-card-foreground text-center">
        Controles de Reprodução
      </h3>
      
      {/* Botões de controle */}
      <div className="flex justify-center gap-2">
        <Button
          onClick={onGoToStart}
          disabled={!canGoPrevious}
          variant="outline"
          size="sm"
          title="Ir para o início"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          size="sm"
          title="Movimento anterior"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={isPlaying ? onPause : onPlay}
          disabled={!canGoNext && !isPlaying}
          size="sm"
          title={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant="outline"
          size="sm"
          title="Próximo movimento"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={onGoToEnd}
          disabled={!canGoToEnd}
          variant="outline"
          size="sm"
          title="Ir para o final"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          title="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Controle de velocidade */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Velocidade:</span>
          <span>{getSpeedLabel(playbackSpeed)}</span>
        </div>
        <Slider
          value={[playbackSpeed]}
          onValueChange={handleSpeedChange}
          min={200}
          max={3000}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Rápido</span>
          <span>Lento</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
