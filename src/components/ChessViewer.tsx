import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./ChessBoard";
import PGNInput from "./PGNInput";
import GameControls from "./GameControls";
import CapturedPieces from "./CapturedPieces";
import SettingsDrawer from "./SettingsDrawer";
import MoveAnalysisChart from "./MoveAnalysisChart";
import ThemeProvider from "./ThemeProvider";
import GameInfo from "./GameInfo";
import { Progress } from "@/components/ui/progress";

interface GameMetadata {
  Event?: string;
  Site?: string;
  Date?: string;
  Round?: string;
  White?: string;
  Black?: string;
  Result?: string;
  WhiteElo?: string;
  BlackElo?: string;
  ECO?: string;
}

type PieceStyle = "classic" | "modern";

const ChessViewer: React.FC = () => {
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState(chess.fen());
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[], black: string[] }>({ white: [], black: [] });
  const [boardStyle, setBoardStyle] = useState<string>("classic");
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>("classic");
  const [highlightColor, setHighlightColor] = useState<string>("yellow");
  const [highlightOpacity, setHighlightOpacity] = useState<number>(0.3);
  const [gameMetadata, setGameMetadata] = useState<GameMetadata>({});
  const [isInCheck, setIsInCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [kingSquare, setKingSquare] = useState<string>("");
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(true);

  const resetGame = useCallback(() => {
    chess.reset();
    setPosition(chess.fen());
    setCurrentMoveIndex(-1);
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
    setIsInCheck(false);
    setIsCheckmate(false);
    setKingSquare("");
  }, [chess]);

  const loadPGN = useCallback((pgn: string, metadata?: GameMetadata) => {
    try {
      const tempChess = new Chess();
      tempChess.loadPgn(pgn);
      const history = tempChess.history({ verbose: true });
      
      resetGame();
      setMoves(history.map(move => move.san));
      if (metadata) {
        setGameMetadata(metadata);
      } else {
        setGameMetadata({});
      }
    } catch (error) {
      console.error("Erro ao carregar PGN:", error);
      alert("PGN inválido. Verifique o formato.");
    }
  }, [resetGame]);

  const calculateProgress = (): number => {
    if (moves.length === 0) return 0;
    return Math.round(((currentMoveIndex + 1) / moves.length) * 100);
  };

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

  const findKingSquare = useCallback((chess: Chess, color: 'w' | 'b'): string => {
    const board = chess.board();
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece && piece.type === 'k' && piece.color === color) {
          const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
          return files[file] + ranks[rank];
        }
      }
    }
    return "";
  }, []);

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
    
    // Check for check and checkmate
    const inCheck = chess.inCheck();
    const inCheckmate = chess.isCheckmate();
    setIsInCheck(inCheck);
    setIsCheckmate(inCheckmate);
    
    if (inCheck || inCheckmate) {
      const currentPlayer = chess.turn();
      setKingSquare(findKingSquare(chess, currentPlayer));
    } else {
      setKingSquare("");
    }
  }, [chess, moves, calculateCapturedPieces, findKingSquare]);

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

  const handlePieceStyleChange = useCallback((style: string) => {
    setPieceStyle(style as PieceStyle);
  }, []);

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
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto p-4">
          {/* Header with Settings */}
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <SettingsDrawer
              boardStyle={boardStyle}
              pieceStyle={pieceStyle}
              highlightColor={highlightColor}
              highlightOpacity={highlightOpacity}
              onBoardStyleChange={setBoardStyle}
              onPieceStyleChange={handlePieceStyleChange}
              onHighlightColorChange={setHighlightColor}
              onHighlightOpacityChange={setHighlightOpacity}
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
              {/* Game Info */}
              <GameInfo metadata={gameMetadata} />
              
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
                    highlightColor={highlightColor}
                    highlightOpacity={highlightOpacity}
                    isInCheck={isInCheck}
                    isCheckmate={isCheckmate}
                    kingSquare={kingSquare}
                    animationDuration={Math.min(800, Math.max(200, 1000 - (3000 - playbackSpeed) / 4))}
                  />
                  
                  {/* Progress Bar */}
                  {moves.length > 0 && (
                    <div className="mt-4 w-full max-w-md">
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
                  <div className="mt-4 w-full max-w-md">
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
            <MoveAnalysisChart 
              moves={moves} 
              currentMoveIndex={currentMoveIndex}
              isExpanded={isAnalysisExpanded}
              onToggleExpansion={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ChessViewer;
