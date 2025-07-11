
import React from "react";

interface ChessPieceProps {
  piece: string;
  className?: string;
  pieceStyle?: "classic" | "modern";
}

const ChessPiece: React.FC<ChessPieceProps> = ({ 
  piece, 
  className = "", 
  pieceStyle = "classic" 
}) => {
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
    
    // Add piece style to the class name
    const styleClass = pieceStyle === "modern" ? "modern-piece" : "piece";
    
    return `${styleClass} ${color}-${pieceType}`;
  };

  // Don't render anything if piece is null or undefined
  if (!piece) {
    return null;
  }

  return (
    <div 
      className={`${getPieceClass(piece)} ${className}`}
    />
  );
};

export default ChessPiece;
