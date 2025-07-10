
import React from "react";

interface CapturedPiecesProps {
  pieces: string[];
  color: "white" | "black";
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  const getPieceSymbol = (piece: string): string => {
    const symbols: { [key: string]: string } = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };
    
    // Convert to the opposite color symbol since captured pieces show the opponent's pieces
    const oppositePiece = color === "white" ? piece.toLowerCase() : piece.toUpperCase();
    return symbols[oppositePiece] || piece;
  };

  const sortPieces = (pieces: string[]): string[] => {
    const order = ['q', 'r', 'b', 'n', 'p'];
    return pieces.sort((a, b) => {
      const aIndex = order.indexOf(a.toLowerCase());
      const bIndex = order.indexOf(b.toLowerCase());
      return aIndex - bIndex;
    });
  };

  if (pieces.length === 0) {
    return (
      <div className="w-16 min-h-[100px] bg-card p-2 rounded-lg shadow-sm">
        <h4 className="text-xs font-medium text-center mb-2 text-card-foreground">
          {color === "white" ? "Brancas" : "Negras"}
        </h4>
        <div className="text-center text-muted-foreground text-xs">
          Nenhuma peça capturada
        </div>
      </div>
    );
  }

  return (
    <div className="w-16 min-h-[100px] bg-card p-2 rounded-lg shadow-sm">
      <h4 className="text-xs font-medium text-center mb-2 text-card-foreground">
        {color === "white" ? "Brancas" : "Negras"}
      </h4>
      <div className="flex flex-col gap-1">
        {sortPieces(pieces).map((piece, index) => (
          <div
            key={index}
            className="text-2xl text-center transition-all duration-200 hover:scale-110"
          >
            <span
              className={`drop-shadow-sm ${
                color === "white" ? "text-gray-800" : "text-gray-200"
              }`}
              style={{
                filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))'
              }}
            >
              {getPieceSymbol(piece)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;
