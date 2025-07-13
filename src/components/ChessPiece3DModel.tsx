import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

interface ChessPiece3DModelProps {
  piece: string;
  position: [number, number, number];
  styleNumber: string;
}

const STLPiece: React.FC<{ url: string; color: string }> = ({ url, color }) => {
  try {
    const geometry = useLoader(STLLoader, url);
    return (
      <mesh geometry={geometry} scale={[0.01, 0.01, 0.01]}>
        <meshStandardMaterial color={color} />
      </mesh>
    );
  } catch (error) {
    // Fallback to simple geometry if STL fails to load
    return (
      <mesh>
        <cylinderGeometry args={[0.2, 0.25, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }
};

const ChessPiece3DModel: React.FC<ChessPiece3DModelProps> = ({ 
  piece, 
  position, 
  styleNumber 
}) => {
  const color = piece === piece.toUpperCase() ? '#f8f8f8' : '#2c2c2c';
  const type = piece.toLowerCase();
  
  const getPieceFileName = (pieceType: string): string => {
    const pieceMap: { [key: string]: string } = {
      'k': 'king',
      'q': 'queen', 
      'r': 'rook',
      'b': 'bishop',
      'n': 'knight',
      'p': 'pawn'
    };
    
    return pieceMap[pieceType] || 'pawn';
  };

  const modelUrl = `/assets/chess_piece_stls/${getPieceFileName(type)}-${styleNumber}.stl`;
  
  return (
    <group position={position}>
      <Suspense fallback={
        <mesh>
          <cylinderGeometry args={[0.2, 0.25, 0.25]} />
          <meshStandardMaterial color={color} />
        </mesh>
      }>
        <STLPiece url={modelUrl} color={color} />
      </Suspense>
    </group>
  );
};

export default ChessPiece3DModel;