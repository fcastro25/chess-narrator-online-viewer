
import React from "react";

interface ChessPieceProps {
  piece: string;
  pieceStyle?: string;
  className?: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ 
  piece, 
  pieceStyle = "classic", 
  className = "" 
}) => {
  const getPieceClass = (piece: string): string => {
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    const type = piece.toLowerCase();
    
    const pieceMap: { [key: string]: string } = {
      'k': 'king',
      'q': 'queen', 
      'r': 'rook',
      'b': 'bishop',
      'n': 'knight',
      'p': 'pawn'
    };

    const pieceType = pieceMap[type] || 'pawn';
    return `chess-piece-${pieceStyle} chess-${color}-${pieceType}`;
  };

  return (
    <div 
      className={`inline-block ${getPieceClass(piece)} ${className}`}
      style={{ width: '32px', height: '32px' }}
    />
  );
};

export default ChessPiece;
