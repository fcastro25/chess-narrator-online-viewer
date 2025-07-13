
import React from "react";
import { Mesh } from "three";

interface ChessPiece3DProps {
  piece: string;
  position: [number, number, number];
  pieceStyle?: string;
}

const ChessPiece3D: React.FC<ChessPiece3DProps> = ({ 
  piece, 
  position, 
  pieceStyle = "classic" 
}) => {
  const color = piece === piece.toUpperCase() ? '#f8f8f8' : '#2c2c2c';
  const type = piece.toLowerCase();
  
  const renderPiece = () => {
    switch (type) {
      case 'k': // King
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.1, 0.2, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.2, 0.1, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
        
      case 'q': // Queen
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {[0, 1, 2, 3, 4].map(i => (
              <mesh 
                key={i}
                position={[
                  Math.cos(i * Math.PI * 2 / 5) * 0.15, 
                  0.3, 
                  Math.sin(i * Math.PI * 2 / 5) * 0.15
                ]}
              >
                <coneGeometry args={[0.05, 0.15]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );
        
      case 'r': // Rook
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.15, 0.25, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.45]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.15, 0.25, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.45]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.25, -0.15]}>
              <boxGeometry args={[0.45, 0.1, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.25, 0.15]}>
              <boxGeometry args={[0.45, 0.1, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
        
      case 'b': // Bishop
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.15, 0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
        
      case 'n': // Knight
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.15, 0.1]}>
              <boxGeometry args={[0.2, 0.25, 0.35]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
        
      case 'p': // Pawn
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.25]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.15]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
        
      default:
        return (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.25]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };
  
  return (
    <group position={position}>
      {renderPiece()}
    </group>
  );
};

export default ChessPiece3D;
