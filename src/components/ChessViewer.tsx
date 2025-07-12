
import React, { useState, useCallback } from "react";
import ChessBoard from "./ChessBoard";
import PGNInput from "./PGNInput";
import CapturedPieces from "./CapturedPieces";
import SettingsDrawer from "./SettingsDrawer";
import MoveAnalysisChart from "./MoveAnalysisChart";
import ThemeProvider from "./ThemeProvider";
import GameInfo from "./GameInfo";
import GamePlayback from "./GamePlayback";
import LoadingOverlay from "./LoadingOverlay";
import { useChessGame } from "../hooks/useChessGame";

type PieceStyle = "classic" | "modern";

const ChessViewer: React.FC = () => {
  const {
    position,
    moves,
    currentMoveIndex,
    lastMove,
    capturedPieces,
    gameMetadata,
    isInCheck,
    isCheckmate,
    kingSquare,
    resetGame,
    goToMove,
    loadPGN,
    setCurrentMoveIndex
  } = useChessGame();

  const [boardStyle, setBoardStyle] = useState<string>("classic");
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>("classic");
  const [highlightColor, setHighlightColor] = useState<string>("yellow");
  const [highlightOpacity, setHighlightOpacity] = useState<number>(0.3);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMoveClick = useCallback((moveIndex: number) => {
    goToMove(moveIndex);
  }, [goToMove]);

  const handlePieceStyleChange = useCallback((style: string) => {
    setPieceStyle(style as PieceStyle);
  }, []);

  const handleFileLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handleFileLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <LoadingOverlay 
          isVisible={isLoading} 
          message="Carregando partidas do arquivo PGN..."
        />
        
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
                onFileLoadStart={handleFileLoadStart}
                onFileLoadEnd={handleFileLoadEnd}
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
                    animationDuration={400}
                  />
                  
                  {/* Game Playback Controls */}
                  <div className="mt-4">
                    <GamePlayback
                      moves={moves}
                      currentMoveIndex={currentMoveIndex}
                      onGoToMove={goToMove}
                      onReset={resetGame}
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
