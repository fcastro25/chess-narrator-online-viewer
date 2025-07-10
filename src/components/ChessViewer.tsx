
import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./ChessBoard";
import PGNInput from "./PGNInput";
import GameControls from "./GameControls";

const ChessViewer: React.FC = () => {
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState(chess.fen());
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const resetGame = useCallback(() => {
    chess.reset();
    setPosition(chess.fen());
    setCurrentMoveIndex(-1);
    setLastMove(null);
  }, [chess]);

  const loadPGN = useCallback((pgn: string) => {
    try {
      const tempChess = new Chess();
      tempChess.loadPgn(pgn);
      const history = tempChess.history({ verbose: true });
      
      resetGame();
      setMoves(history.map(move => move.san));
    } catch (error) {
      console.error("Erro ao carregar PGN:", error);
      alert("PGN inválido. Verifique o formato.");
    }
  }, [resetGame]);

  const goToMove = useCallback((moveIndex: number) => {
    chess.reset();
    
    for (let i = 0; i <= moveIndex; i++) {
      if (i < moves.length) {
        try {
          const move = chess.move(moves[i]);
          if (i === moveIndex) {
            setLastMove({ from: move.from, to: move.to });
          }
        } catch (error) {
          console.error(`Erro no movimento ${i}:`, error);
          break;
        }
      }
    }
    
    setPosition(chess.fen());
    setCurrentMoveIndex(moveIndex);
  }, [chess, moves]);

  const nextMove = useCallback(() => {
    if (currentMoveIndex < moves.length - 1) {
      goToMove(currentMoveIndex + 1);
    }
  }, [currentMoveIndex, moves.length, goToMove]);

  const previousMove = useCallback(() => {
    if (currentMoveIndex >= 0) {
      goToMove(currentMoveIndex - 1);
    }
  }, [currentMoveIndex, goToMove]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    resetGame();
  }, [resetGame]);

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          Visualizador de Partidas de Xadrez
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PGN Input */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PGNInput
              onPGNLoad={loadPGN}
              moves={moves}
              currentMoveIndex={currentMoveIndex}
            />
          </div>
          
          {/* Chess Board */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="flex flex-col items-center">
              <ChessBoard
                position={position}
                lastMove={lastMove}
              />
              
              {/* Game Controls */}
              <div className="mt-6 w-full max-w-md">
                <GameControls
                  onPlay={play}
                  onPause={pause}
                  onNext={nextMove}
                  onPrevious={previousMove}
                  onReset={reset}
                  isPlaying={isPlaying}
                  canGoNext={currentMoveIndex < moves.length - 1}
                  canGoPrevious={currentMoveIndex >= 0}
                  playbackSpeed={playbackSpeed}
                  onSpeedChange={setPlaybackSpeed}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessViewer;
