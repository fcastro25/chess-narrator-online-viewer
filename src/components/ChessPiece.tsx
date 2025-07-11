
import React from "react";

interface ChessPieceProps {
  piece: string;
  className?: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, className = "" }) => {
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

  return (
    <div 
      className={`${getPieceClass(piece)} ${className}`}
    />
  );
};

export default ChessPiece;
