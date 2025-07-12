
import React, { useState, useEffect, useCallback } from "react";
import GameControls from "./GameControls";
import { Progress } from "@/components/ui/progress";

interface GamePlaybackProps {
  moves: string[];
  currentMoveIndex: number;
  onGoToMove: (index: number) => void;
  onReset: () => void;
}

const GamePlayback: React.FC<GamePlaybackProps> = ({
  moves,
  currentMoveIndex,
  onGoToMove,
  onReset
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  const calculateProgress = (): number => {
    if (moves.length === 0) return 0;
    return Math.round(((currentMoveIndex + 1) / moves.length) * 100);
  };

  const nextMove = useCallback(() => {
    if (currentMoveIndex < moves.length - 1) {
      onGoToMove(currentMoveIndex + 1);
    }
  }, [currentMoveIndex, moves.length, onGoToMove]);

  const previousMove = useCallback(() => {
    if (currentMoveIndex >= 0) {
      onGoToMove(currentMoveIndex - 1);
    }
  }, [currentMoveIndex, onGoToMove]);

  const goToStart = useCallback(() => {
    onReset();
  }, [onReset]);

  const goToEnd = useCallback(() => {
    if (moves.length > 0) {
      onGoToMove(moves.length - 1);
    }
  }, [moves.length, onGoToMove]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    onReset();
  }, [onReset]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentMoveIndex < moves.length - 1) {
      interval = setInterval(() => {
        nextMove();
      }, playbackSpeed);
    } else if (isPlaying && currentMoveIndex >= moves.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentMoveIndex, moves.length, nextMove, playbackSpeed]);

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Progress Bar */}
      {moves.length > 0 && (
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progresso da Partida</span>
            <span>{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Movimento {Math.max(0, currentMoveIndex + 1)} de {moves.length}</span>
          </div>
        </div>
      )}
      
      {/* Game Controls */}
      <GameControls
        onPlay={play}
        onPause={pause}
        onNext={nextMove}
        onPrevious={previousMove}
        onReset={reset}
        onGoToStart={goToStart}
        onGoToEnd={goToEnd}
        isPlaying={isPlaying}
        canGoNext={currentMoveIndex < moves.length - 1}
        canGoPrevious={currentMoveIndex >= 0}
        canGoToEnd={moves.length > 0}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
      />
    </div>
  );
};

export default GamePlayback;
