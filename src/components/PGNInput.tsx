
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PGNInputProps {
  onPGNLoad: (pgn: string) => void;
  moves: string[];
  currentMoveIndex: number;
}

const PGNInput: React.FC<PGNInputProps> = ({ onPGNLoad, moves, currentMoveIndex }) => {
  const [pgnText, setPgnText] = useState("");

  const handleLoad = () => {
    if (pgnText.trim()) {
      onPGNLoad(pgnText);
    }
  };

  const samplePGN = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7`;

  const loadSample = () => {
    setPgnText(samplePGN);
    onPGNLoad(samplePGN);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg h-fit">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Entrada PGN
      </h2>
      
      <div className="space-y-4">
        <Textarea
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          placeholder="Cole aqui a notação PGN da partida..."
          className="min-h-32 font-mono text-sm"
        />
        
        <div className="flex gap-2">
          <Button onClick={handleLoad} className="flex-1">
            Carregar PGN
          </Button>
          <Button onClick={loadSample} variant="outline">
            Exemplo
          </Button>
        </div>
      </div>

      {moves.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2 text-card-foreground">
            Movimentos ({moves.length})
          </h3>
          <div className="bg-muted p-3 rounded max-h-40 overflow-y-auto text-sm">
            <div className="flex flex-wrap gap-1">
              {moves.map((move, index) => (
                <span
                  key={index}
                  className={`
                    px-2 py-1 rounded transition-all duration-200
                    ${index === currentMoveIndex
                      ? 'bg-primary text-primary-foreground font-medium'
                      : index < currentMoveIndex
                      ? 'bg-muted-foreground/20 text-muted-foreground'
                      : 'text-foreground'
                    }
                  `}
                >
                  {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGNInput;
