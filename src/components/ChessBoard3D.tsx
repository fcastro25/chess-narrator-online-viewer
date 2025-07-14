
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import AnimatedChessPiece3D from "./AnimatedChessPiece3D";

interface ChessBoard3DProps {
  position: string;
  lastMove?: { from: string; to: string } | null;
  boardStyle?: string;
  pieceStyle?: "classic" | "modern";
  use3DModels?: boolean;
  highlightColor?: string;
  highlightOpacity?: number;
  isInCheck?: boolean;
  isCheckmate?: boolean;
  kingSquare?: string;
}

const ChessBoard3D: React.FC<ChessBoard3DProps> = ({ 
  position, 
  lastMove, 
  boardStyle = "classic",
  pieceStyle = "classic",
  use3DModels = false,
  highlightColor = "yellow",
  highlightOpacity = 0.3,
  isInCheck = false,
  isCheckmate = false,
  kingSquare = ""
}) => {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([5, 5, 5]);
  const controlsRef = useRef<any>();

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

  const isKingInDanger = (row: number, col: number): 'check' | 'checkmate' | null => {
    if (!kingSquare) return null;
    const squareName = getSquareName(row, col);
    if (squareName === kingSquare) {
      return isCheckmate ? 'checkmate' : isInCheck ? 'check' : null;
    }
    return null;
  };

  const getBoardColors = () => {
    switch (boardStyle) {
      case "modern":
        return { light: "#f1f5f9", dark: "#475569" };
      case "wood":
        return { light: "#fefce8", dark: "#92400e" };
      case "green":
        return { light: "#f0fdf4", dark: "#15803d" };
      case "blue":
        return { light: "#eff6ff", dark: "#1d4ed8" };
      case "purple":
        return { light: "#faf5ff", dark: "#7c3aed" };
      default:
        return { light: "#f5f5f4", dark: "#57534e" };
    }
  };

  const getHighlightColor = () => {
    switch (highlightColor) {
      case "blue": return "#60a5fa";
      case "green": return "#4ade80";
      case "red": return "#f87171";
      case "purple": return "#a78bfa";
      case "orange": return "#fb923c";
      default: return "#fde047";
    }
  };

  const pieces = parseFEN(position);
  const boardColors = getBoardColors();

  const presetAngles = [
    { name: "Top", position: [0, 8, 0] as [number, number, number] },
    { name: "Front", position: [0, 2, 8] as [number, number, number] },
    { name: "Side", position: [8, 2, 0] as [number, number, number] },
    { name: "Corner", position: [5, 5, 5] as [number, number, number] },
  ];

  const handleAngleChange = (position: [number, number, number]) => {
    setCameraPosition(position);
    if (controlsRef.current) {
      controlsRef.current.object.position.set(...position);
      controlsRef.current.update();
    }
  };

  const BoardLabels = () => {
    const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    return (
      <group>
        {/* Board frame */}
        <mesh position={[3.5, -0.15, 3.5]}>
          <boxGeometry args={[10, 0.3, 10]} />
          <meshStandardMaterial 
            color={boardColors.dark} 
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        
        {/* File labels (A-H) on bottom edge */}
        {files.map((file, index) => (
          <group key={`file-${file}`} position={[index, 0.1, 8.5]}>
            <mesh>
              <planeGeometry args={[0.8, 0.8]} />
              <meshStandardMaterial 
                color="#f5f5dc" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <ringGeometry args={[0.2, 0.35, 32]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        ))}
        
        {/* Rank labels (1-8) on right edge */}
        {ranks.map((rank, index) => (
          <group key={`rank-${rank}`} position={[8.5, 0.1, index]}>
            <mesh>
              <planeGeometry args={[0.8, 0.8]} />
              <meshStandardMaterial 
                color="#f5f5dc" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <ringGeometry args={[0.2, 0.35, 32]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        ))}
      </group>
    );
  };

  return (
    <div className="relative w-full h-[600px] overflow-visible">
      {/* Angle Control Cube */}
      <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        <div className="grid grid-cols-2 gap-1">
          {presetAngles.map((angle) => (
            <button
              key={angle.name}
              onClick={() => handleAngleChange(angle.position)}
              className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              {angle.name}
            </button>
          ))}
        </div>
      </div>

      <Canvas 
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Melhor iluminação com múltiplas fontes */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 15, 10]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 10, -5]} intensity={0.6} />
        <pointLight position={[0, 8, 0]} intensity={0.8} />
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
        />
        
        {/* Chess Board */}
        <group position={[-3.5, 0, -3.5]}>
          {pieces.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isHighlightedSquare = isHighlighted(rowIndex, colIndex);
              const kingDanger = isKingInDanger(rowIndex, colIndex);
              
              let squareColor = isLight ? boardColors.light : boardColors.dark;
              
              if (isHighlightedSquare) {
                squareColor = getHighlightColor();
              } else if (kingDanger) {
                squareColor = kingDanger === 'checkmate' ? "#ef4444" : "#f97316";
              }
              
              return (
                <group key={`${rowIndex}-${colIndex}`} position={[colIndex, 0, rowIndex]}>
                  <mesh 
                    position={[0, -0.05, 0]} 
                    receiveShadow
                  >
                    <boxGeometry args={[1, 0.1, 1]} />
                    <meshStandardMaterial 
                      color={squareColor} 
                      roughness={0.3}
                      metalness={0.1}
                    />
                  </mesh>
                  
                  {piece && (
                    <AnimatedChessPiece3D
                      piece={piece}
                      position={[0, 0.3, 0]}
                      targetPosition={[0, 0.3, 0]}
                      pieceStyle={pieceStyle}
                      use3DModels={use3DModels}
                    />
                  )}
                </group>
              );
            })
          )}
          
          {/* Board Labels */}
          <BoardLabels />
        </group>
      </Canvas>
    </div>
  );
};

export default ChessBoard3D;
