import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./ChessBoard";
import PGNInput from "./PGNInput";
import GameControls from "./GameControls";
import CapturedPieces from "./CapturedPieces";
import SettingsDrawer from "./SettingsDrawer";
import MoveAnalysisChart from "./MoveAnalysisChart";

const ChessViewer: React.FC = () => {
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState(chess.fen());
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[], black: string[] }>({ white: [], black: [] });
  const [boardStyle, setBoardStyle] = useState<"classic" | "modern" | "wood">("classic");
  const [pieceStyle, setPieceStyle] = useState<"classic" | "modern">("classic");

  const resetGame = useCallback(() => {
    chess.reset();
    setPosition(chess.fen());
    setCurrentMoveIndex(-1);
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
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

  const calculateCapturedPieces = useCallback((moveIndex: number) => {
    const tempChess = new Chess();
    const captured = { white: [], black: [] };
    
    for (let i = 0; i <= moveIndex; i++) {
      if (i < moves.length) {
        try {
          const move = tempChess.move(moves[i]);
          if (move.captured) {
            if (move.color === 'w') {
              captured.black.push(move.captured);
            } else {
              captured.white.push(move.captured);
            }
          }
        } catch (error) {
          console.error(`Erro no movimento ${i}:`, error);
          break;
        }
      }
    }
    
    return captured;
  }, [moves]);

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
    setCapturedPieces(calculateCapturedPieces(moveIndex));
  }, [chess, moves, calculateCapturedPieces]);

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

  const goToStart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const goToEnd = useCallback(() => {
    if (moves.length > 0) {
      goToMove(moves.length - 1);
    }
  }, [moves.length, goToMove]);

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

  const handleMoveClick = useCallback((moveIndex: number) => {
    setIsPlaying(false);
    goToMove(moveIndex);
  }, [goToMove]);

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header with Settings */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <SettingsDrawer
            boardStyle={boardStyle}
            pieceStyle={pieceStyle}
            onBoardStyleChange={setBoardStyle}
            onPieceStyleChange={setPieceStyle}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* PGN Input */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PGNInput
              onPGNLoad={loadPGN}
              moves={moves}
              currentMoveIndex={currentMoveIndex}
              onMoveClick={handleMoveClick}
            />
          </div>
          
          {/* Chess Board with Captured Pieces */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
              {/* Captured Black Pieces (left) */}
              <div className="order-2 lg:order-1">
                <CapturedPieces 
                  pieces={capturedPieces.black} 
                  color="black" 
                  pieceStyle={pieceStyle} 
                />
              </div>
              
              {/* Chess Board */}
              <div className="order-1 lg:order-2 flex flex-col items-center">
                <ChessBoard
                  position={position}
                  lastMove={lastMove}
                  boardStyle={boardStyle}
                  pieceStyle={pieceStyle}
                />
                
                {/* Game Controls */}
                <div className="mt-6 w-full max-w-md">
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
              </div>
              
              {/* Captured White Pieces (right) */}
              <div className="order-3">
                <CapturedPieces 
                  pieces={capturedPieces.white} 
                  color="white" 
                  pieceStyle={pieceStyle} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Move Analysis Chart */}
        <div className="mt-8">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Análise dos Movimentos</h3>
            <MoveAnalysisChart moves={moves} currentMoveIndex={currentMoveIndex} />
            <p className="text-xs text-muted-foreground mt-2">
              * Análise simulada para demonstração. Em uma implementação real, seria integrada com Stockfish ou ChessBase API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessViewer;
