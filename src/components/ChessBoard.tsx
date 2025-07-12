
import React, { useState, useEffect } from "react";
import ChessPiece from "./ChessPiece";

interface ChessBoardProps {
  position: string;
  lastMove?: { from: string; to: string } | null;
  boardStyle?: string;
  pieceStyle?: "classic" | "modern";
  highlightColor?: string;
  highlightOpacity?: number;
  isInCheck?: boolean;
  isCheckmate?: boolean;
  kingSquare?: string;
  animationDuration?: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  position, 
  lastMove, 
  boardStyle = "classic",
  pieceStyle = "classic",
  highlightColor = "yellow",
  highlightOpacity = 0.3,
  isInCheck = false,
  isCheckmate = false,
  kingSquare = "",
  animationDuration = 400
}) => {
  const [animatingPiece, setAnimatingPiece] = useState<{
    piece: string;
    from: string;
    to: string;
  } | null>(null);
  const [displayPosition, setDisplayPosition] = useState(position);

  const parseFEN = (fen: string) => {
    const parts = fen.split(" ");
    const board = parts[0];
    const rows = board.split("/");
    
    const pieces: (string | null)[][] = [];
    
    rows.forEach(row => {
      const boardRow: (string | null)[] = [];
      for (let char of row) {
        if (isNaN(parseInt(char))) {
          boardRow.push(char);
        } else {
          for (let i = 0; i < parseInt(char); i++) {
            boardRow.push(null);
          }
        }
      }
      pieces.push(boardRow);
    });
    
    return pieces;
  };

  const getSquareName = (row: number, col: number): string => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[col] + ranks[row];
  };

  const getSquarePosition = (square: string): { row: number; col: number } => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1]);
    return { row: rank, col: file };
  };

  const isHighlighted = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    const squareName = getSquareName(row, col);
    return squareName === lastMove.from || squareName === lastMove.to;
  };

  const isKingInDanger = (row: number, col: number): 'check' | 'checkmate' | null => {
    if (!kingSquare) return null;
    const squareName = getSquareName(row, col);
    if (squareName === kingSquare) {
      return isCheckmate ? 'checkmate' : isInCheck ? 'check' : null;
    }
    return null;
  };

  const getBoardStyles = () => {
    switch (boardStyle) {
      case "modern":
        return { light: "bg-slate-100", dark: "bg-slate-600" };
      case "wood":
        return { light: "bg-yellow-100", dark: "bg-yellow-800" };
      case "green":
        return { light: "bg-green-100", dark: "bg-green-700" };
      case "blue":
        return { light: "bg-blue-100", dark: "bg-blue-700" };
      case "purple":
        return { light: "bg-purple-100", dark: "bg-purple-700" };
      default:
        return { light: "bg-stone-200", dark: "bg-stone-600" };
    }
  };

  const getHighlightClass = () => {
    switch (highlightColor) {
      case "blue": return "bg-blue-400";
      case "green": return "bg-green-400";
      case "red": return "bg-red-400";
      case "purple": return "bg-purple-400";
      case "orange": return "bg-orange-400";
      default: return "bg-yellow-300";
    }
  };

  const getCheckHighlightClass = (dangerType: 'check' | 'checkmate') => {
    return dangerType === 'checkmate' ? 'bg-red-500' : 'bg-orange-400';
  };

  // Handle piece animation when position changes
  useEffect(() => {
    if (lastMove && displayPosition !== position) {
      const oldPieces = parseFEN(displayPosition);
      const newPieces = parseFEN(position);
      
      // Find the piece that moved
      const fromPos = getSquarePosition(lastMove.from);
      const toPos = getSquarePosition(lastMove.to);
      
      const movingPiece = oldPieces[fromPos.row][fromPos.col];
      
      if (movingPiece) {
        setAnimatingPiece({
          piece: movingPiece,
          from: lastMove.from,
          to: lastMove.to
        });
        
        // Update display position after animation
        setTimeout(() => {
          setDisplayPosition(position);
          setAnimatingPiece(null);
        }, animationDuration);
      } else {
        setDisplayPosition(position);
      }
    } else {
      setDisplayPosition(position);
    }
  }, [position, lastMove, animationDuration, displayPosition]);

  const boardStyles = getBoardStyles();
  const pieces = parseFEN(displayPosition);

  return (
    <div className="relative">
      {/* Files (a-h) at top */}
      <div className="flex justify-center mb-1">
        <div className="grid grid-cols-8 w-96 text-center text-sm font-medium text-muted-foreground">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
            <div key={file} className="w-12">{file}</div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center">
        {/* Ranks (8-1) on left */}
        <div className="flex flex-col mr-1">
          {['8', '7', '6', '5', '4', '3', '2', '1'].map(rank => (
            <div key={rank} className="h-12 flex items-center text-sm font-medium text-muted-foreground w-4">
              {rank}
            </div>
          ))}
        </div>
        
        {/* Chess Board */}
        <div className="border-2 border-border shadow-lg relative">
          <div className="grid grid-cols-8 gap-0 w-96 h-96">
            {pieces.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isHighlightedSquare = isHighlighted(rowIndex, colIndex);
                const kingDanger = isKingInDanger(rowIndex, colIndex);
                const squareName = getSquareName(rowIndex, colIndex);
                
                // Don't show piece if it's being animated from this square
                const shouldHidePiece = animatingPiece && animatingPiece.from === squareName;
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-12 h-12 flex items-center justify-center
                      transition-all duration-200 relative
                      ${isLight ? boardStyles.light : boardStyles.dark}
                    `}
                  >
                    {isHighlightedSquare && (
                      <div 
                        className={`absolute inset-0 ${getHighlightClass()}`}
                        style={{ opacity: highlightOpacity }}
                      />
                    )}
                    {kingDanger && (
                      <div 
                        className={`absolute inset-0 ${getCheckHighlightClass(kingDanger)}`}
                        style={{ opacity: 0.6 }}
                      />
                    )}
                    {piece && !shouldHidePiece && (
                      <ChessPiece
                        piece={piece}
                        pieceStyle={pieceStyle}
                        className="relative z-10"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          {/* Animated piece */}
          {animatingPiece && (
            <div
              className="absolute pointer-events-none z-20"
              style={{
                transition: `all ${animationDuration}ms ease-in-out`,
                transform: `translate(${getSquarePosition(animatingPiece.to).col * 48}px, ${getSquarePosition(animatingPiece.to).row * 48}px)`,
                left: `${getSquarePosition(animatingPiece.from).col * 48}px`,
                top: `${getSquarePosition(animatingPiece.from).row * 48}px`,
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChessPiece
                piece={animatingPiece.piece}
                pieceStyle={pieceStyle}
                className="relative z-10"
              />
            </div>
          )}
        </div>
        
        {/* Ranks (8-1) on right */}
        <div className="flex flex-col ml-1">
          {['8', '7', '6', '5', '4', '3', '2', '1'].map(rank => (
            <div key={rank} className="h-12 flex items-center text-sm font-medium text-muted-foreground w-4">
              {rank}
            </div>
          ))}
        </div>
      </div>
      
      {/* Files (a-h) at bottom */}
      <div className="flex justify-center mt-1">
        <div className="grid grid-cols-8 w-96 text-center text-sm font-medium text-muted-foreground">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
            <div key={file} className="w-12">{file}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
