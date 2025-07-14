import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import ChessPiece3D from "./ChessPiece3D";

interface AnimatedChessPiece3DProps {
  piece: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  pieceStyle?: "classic" | "modern";
  use3DModels?: boolean;
}

const AnimatedChessPiece3D: React.FC<AnimatedChessPiece3DProps> = ({
  piece,
  position,
  targetPosition,
  pieceStyle = "classic",
  use3DModels = false,
}) => {
  const groupRef = useRef<Group>(null);
  const animationRef = useRef({ 
    startPos: [...position] as [number, number, number],
    targetPos: [...targetPosition] as [number, number, number],
    progress: 0,
    isAnimating: false 
  });

  useEffect(() => {
    // Check if position changed to start animation
    const hasChanged = position.some((pos, index) => pos !== targetPosition[index]);
    if (hasChanged && !animationRef.current.isAnimating) {
      animationRef.current.startPos = [...position] as [number, number, number];
      animationRef.current.targetPos = [...targetPosition] as [number, number, number];
      animationRef.current.progress = 0;
      animationRef.current.isAnimating = true;
    }
  }, [position, targetPosition]);

  useFrame((state, delta) => {
    if (!groupRef.current || !animationRef.current.isAnimating) return;

    animationRef.current.progress += delta * 2; // Animation speed

    if (animationRef.current.progress >= 1) {
      animationRef.current.progress = 1;
      animationRef.current.isAnimating = false;
    }

    // Smooth easing function
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const easedProgress = easeInOutCubic(animationRef.current.progress);
    
    // Interpolate position
    const currentX = animationRef.current.startPos[0] + 
      (animationRef.current.targetPos[0] - animationRef.current.startPos[0]) * easedProgress;
    const currentY = animationRef.current.startPos[1] + 
      (animationRef.current.targetPos[1] - animationRef.current.startPos[1]) * easedProgress + 
      Math.sin(easedProgress * Math.PI) * 0.5; // Arc motion
    const currentZ = animationRef.current.startPos[2] + 
      (animationRef.current.targetPos[2] - animationRef.current.startPos[2]) * easedProgress;

    groupRef.current.position.set(currentX, currentY, currentZ);
    
    // Add slight rotation during movement
    if (animationRef.current.isAnimating) {
      groupRef.current.rotation.y = Math.sin(easedProgress * Math.PI) * 0.2;
    } else {
      groupRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ChessPiece3D
        piece={piece}
        position={[0, 0, 0]}
        pieceStyle={pieceStyle}
        use3DModels={use3DModels}
      />
    </group>
  );
};

export default AnimatedChessPiece3D;