
import React from "react";

interface ChessBoardProps {
  position: string;
  lastMove?: { from: string; to: string } | null;
  boardStyle?: "classic" | "modern" | "wood";
  pieceStyle?: "classic" | "modern";
}

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  position, 
  lastMove, 
  boardStyle = "classic",
  pieceStyle = "classic" 
}) => {
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

  const getPieceClass = (piece: string): string => {
    const isWhite = piece === piece.toUpperCase();
    const color = isWhite ? 'white' : 'black';
    
    const pieceTypes: { [key: string]: string } = {
      'k': 'king',
      'q': 'queen', 
      'r': 'rook',
      'b': 'bishop',
      'n': 'knight',
      'p': 'pawn'
    };
    
    const pieceType = pieceTypes[piece.toLowerCase()];
    return `piece ${color}-${pieceType}`;
  };

  const getSquareName = (row: number, col: number): string => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[col] + ranks[row];
  };

  const isHighlighted = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    const squareName = getSquareName(row, col);
    return squareName === lastMove.from || squareName === lastMove.to;
  };

  const getBoardStyles = () => {
    switch (boardStyle) {
      case "modern":
        return {
          light: "bg-slate-100",
          dark: "bg-slate-600"
        };
      case "wood":
        return {
          light: "bg-yellow-100",
          dark: "bg-yellow-800"
        };
      default:
        return {
          light: "bg-stone-200",
          dark: "bg-stone-600"
        };
    }
  };

  const boardStyles = getBoardStyles();
  const pieces = parseFEN(position);

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
        <div className="border-2 border-stone-800 shadow-lg">
          <div className="grid grid-cols-8 gap-0 w-96 h-96">
            {pieces.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isHighlightedSquare = isHighlighted(rowIndex, colIndex);
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-12 h-12 flex items-center justify-center
                      transition-all duration-200 relative
                      ${isLight ? boardStyles.light : boardStyles.dark}
                      ${isHighlightedSquare ? 'ring-2 ring-yellow-400 ring-inset' : ''}
                    `}
                  >
                    {isHighlightedSquare && (
                      <div className="absolute inset-0 bg-yellow-300 opacity-30" />
                    )}
                    {piece && (
                      <div 
                        className={`
                          ${getPieceClass(piece)}
                          relative z-10
                        `}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
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
