
import React from "react";

interface ChessBoardProps {
  position: string;
  lastMove?: { from: string; to: string } | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ position, lastMove }) => {
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

  const getPieceSymbol = (piece: string): string => {
    const symbols: { [key: string]: string } = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };
    return symbols[piece] || piece;
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

  const pieces = parseFEN(position);

  return (
    <div className="inline-block border-4 border-gray-800 shadow-2xl">
      <div className="grid grid-cols-8 gap-0 w-96 h-96">
        {pieces.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isHighlightedSquare = isHighlighted(rowIndex, colIndex);
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-3xl font-bold
                  transition-all duration-300 relative
                  ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                  ${isHighlightedSquare ? 'ring-4 ring-yellow-400 ring-opacity-70' : ''}
                `}
              >
                {isHighlightedSquare && (
                  <div className="absolute inset-0 bg-yellow-300 opacity-30 animate-pulse" />
                )}
                {piece && (
                  <span 
                    className={`
                      relative z-10 transition-all duration-300 transform
                      ${piece === piece.toUpperCase() ? 'text-white' : 'text-black'}
                      drop-shadow-sm
                    `}
                    style={{
                      filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))',
                      textShadow: piece === piece.toLowerCase() ? '1px 1px 1px rgba(255,255,255,0.3)' : '1px 1px 1px rgba(0,0,0,0.7)'
                    }}
                  >
                    {getPieceSymbol(piece)}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
