import React from "react";
import ChessPiece from "./ChessPiece";

interface CapturedPiecesProps {
  pieces: string[];
  color: "white" | "black";
  pieceStyle?: "classic" | "modern";
  position?: "left" | "right";
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ 
  pieces, 
  color, 
  pieceStyle = "classic",
  position = "left"
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

  // Posicionamento floating baseado na posição
  const positionClasses = position === "left" 
    ? "fixed left-8 top-1/2 -translate-y-1/2 z-50" 
    : "fixed right-8 top-1/2 -translate-y-1/2 z-50";

  // Classes responsivas para diferentes tamanhos de tela
  const responsiveClasses = "hidden xl:block";
  if (pieces.length === 0) {
    return (
      <div className={`w-16 min-h-[100px] bg-card/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border ${positionClasses} ${responsiveClasses}`}>
        <h4 className="text-xs font-medium text-center mb-2 text-card-foreground">
          {color === "white" ? "Brancas" : "Negras"}
        </h4>
        <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
          Nenhuma peça capturada
        </div>
        
        {/* Indicador de quantidade de peças capturadas */}
        {pieces.length > 0 && (
          <div className="mt-2 text-center">
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {pieces.length}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-16 min-h-[100px] bg-card/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border ${positionClasses} ${responsiveClasses}`}>
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
