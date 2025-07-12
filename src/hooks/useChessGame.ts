
import { useState, useCallback } from "react";
import { Chess } from "chess.js";

interface GameMetadata {
  Event?: string;
  Site?: string;
  Date?: string;
  Round?: string;
  White?: string;
  Black?: string;
  Result?: string;
  WhiteElo?: string;
  BlackElo?: string;
  ECO?: string;
}

export const useChessGame = () => {
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState(chess.fen());
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[], black: string[] }>({ white: [], black: [] });
  const [gameMetadata, setGameMetadata] = useState<GameMetadata>({});
  const [isInCheck, setIsInCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [kingSquare, setKingSquare] = useState<string>("");

  const resetGame = useCallback(() => {
    chess.reset();
    setPosition(chess.fen());
    setCurrentMoveIndex(-1);
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
    setIsInCheck(false);
    setIsCheckmate(false);
    setKingSquare("");
  }, [chess]);

  const calculateCapturedPieces = useCallback((moveIndex: number) => {
    const tempChess = new Chess();
    const captured = { white: [], black: [] };
    
    for (let i = 0; i <= moveIndex; i++) {
      if (i < moves.length) {
        try {
          const move = tempChess.move(moves[i]);
          if (move.captured) {
            if (move.color === 'w') {
              captured.black.push(move.captured);
            } else {
              captured.white.push(move.captured);
            }
          }
        } catch (error) {
          console.error(`Erro no movimento ${i}:`, error);
          break;
        }
      }
    }
    
    return captured;
  }, [moves]);

  const findKingSquare = useCallback((chess: Chess, color: 'w' | 'b'): string => {
    const board = chess.board();
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece && piece.type === 'k' && piece.color === color) {
          const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
          return files[file] + ranks[rank];
        }
      }
    }
    return "";
  }, []);

  const goToMove = useCallback((moveIndex: number) => {
    chess.reset();
    
    for (let i = 0; i <= moveIndex; i++) {
      if (i < moves.length) {
        try {
          const move = chess.move(moves[i]);
          if (i === moveIndex) {
            setLastMove({ from: move.from, to: move.to });
          }
        } catch (error) {
          console.error(`Erro no movimento ${i}:`, error);
          break;
        }
      }
    }
    
    setPosition(chess.fen());
    setCurrentMoveIndex(moveIndex);
    setCapturedPieces(calculateCapturedPieces(moveIndex));
    
    const inCheck = chess.inCheck();
    const inCheckmate = chess.isCheckmate();
    setIsInCheck(inCheck);
    setIsCheckmate(inCheckmate);
    
    if (inCheck || inCheckmate) {
      const currentPlayer = chess.turn();
      setKingSquare(findKingSquare(chess, currentPlayer));
    } else {
      setKingSquare("");
    }
  }, [chess, moves, calculateCapturedPieces, findKingSquare]);

  const loadPGN = useCallback((pgn: string, metadata?: GameMetadata) => {
    try {
      const tempChess = new Chess();
      tempChess.loadPgn(pgn);
      const history = tempChess.history({ verbose: true });
      
      resetGame();
      setMoves(history.map(move => move.san));
      if (metadata) {
        setGameMetadata(metadata);
      } else {
        setGameMetadata({});
      }
    } catch (error) {
      console.error("Erro ao carregar PGN:", error);
      alert("PGN inválido. Verifique o formato.");
    }
  }, [resetGame]);

  return {
    position,
    moves,
    currentMoveIndex,
    lastMove,
    capturedPieces,
    gameMetadata,
    isInCheck,
    isCheckmate,
    kingSquare,
    chess,
    resetGame,
    goToMove,
    loadPGN,
    setCurrentMoveIndex
  };
};
