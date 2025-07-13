
import React from "react";
import { Box, Cylinder, Cone } from "@react-three/drei";

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
            <Cylinder args={[0.25, 0.3, 0.4]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Box args={[0.1, 0.2, 0.1]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.2, 0.1, 0.1]} position={[0, 0.35, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        );
        
      case 'q': // Queen
        return (
          <group>
            <Cylinder args={[0.25, 0.3, 0.4]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            {[0, 1, 2, 3, 4].map(i => (
              <Cone 
                key={i}
                args={[0.05, 0.15]} 
                position={[
                  Math.cos(i * Math.PI * 2 / 5) * 0.15, 
                  0.3, 
                  Math.sin(i * Math.PI * 2 / 5) * 0.15
                ]}
              >
                <meshStandardMaterial color={color} />
              </Cone>
            ))}
          </group>
        );
        
      case 'r': // Rook
        return (
          <group>
            <Box args={[0.4, 0.4, 0.4]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.1, 0.1, 0.45]} position={[-0.15, 0.25, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.1, 0.1, 0.45]} position={[0.15, 0.25, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.45, 0.1, 0.1]} position={[0, 0.25, -0.15]}>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.45, 0.1, 0.1]} position={[0, 0.25, 0.15]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        );
        
      case 'b': // Bishop
        return (
          <group>
            <Cylinder args={[0.25, 0.3, 0.3]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Cone args={[0.15, 0.3]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color={color} />
            </Cone>
          </group>
        );
        
      case 'n': // Knight
        return (
          <group>
            <Cylinder args={[0.25, 0.3, 0.3]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Box args={[0.2, 0.25, 0.35]} position={[0, 0.15, 0.1]}>
              <meshStandardMaterial color={color} />
            </Box>
          </group>
        );
        
      case 'p': // Pawn
        return (
          <group>
            <Cylinder args={[0.2, 0.25, 0.25]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 0.15]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
          </group>
        );
        
      default:
        return (
          <Cylinder args={[0.2, 0.25, 0.25]} position={[0, 0, 0]}>
            <meshStandardMaterial color={color} />
          </Cylinder>
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
