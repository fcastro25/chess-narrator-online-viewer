import React from "react";
import ChessPiece from "./ChessPiece";

interface CapturedPiecesProps {
  pieces: string[];
  color: "white" | "black";
  pieceStyle?: "classic" | "modern";
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ 
  pieces, 
  color, 
  pieceStyle = "classic" 
}) => {
  const sortPieces = (pieces: string[]): string[] => {
    const order = ['q', 'r', 'b', 'n', 'p'];
    return pieces.sort((a, b) => {
      const aIndex = order.indexOf(a.toLowerCase());
      const bIndex = order.indexOf(b.toLowerCase());
      return aIndex - bIndex;
    });
  };

  // Convert pieces to opposite color for display (captured pieces show opponent's pieces)
  const getDisplayPiece = (piece: string): string => {
    return color === "white" ? piece.toLowerCase() : piece.toUpperCase();
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
            className="flex justify-center transition-all duration-200 hover:scale-110"
          >
            <ChessPiece
              piece={getDisplayPiece(piece)}
              pieceStyle={pieceStyle}
              className="drop-shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;
