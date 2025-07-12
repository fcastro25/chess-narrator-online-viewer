
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PGNFileLoader from "./PGNFileLoader";
import GameSelector from "./GameSelector";

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

interface ParsedGame {
  metadata: GameMetadata;
  moves: string;
}

interface PGNInputProps {
  onPGNLoad: (pgn: string, metadata?: GameMetadata) => void;
  moves: string[];
  currentMoveIndex: number;
  onMoveClick: (moveIndex: number) => void;
  onFileLoadStart?: () => void;
  onFileLoadEnd?: () => void;
}

const PGNInput: React.FC<PGNInputProps> = ({ 
  onPGNLoad, 
  moves, 
  currentMoveIndex, 
  onMoveClick,
  onFileLoadStart,
  onFileLoadEnd
}) => {
  const [pgnText, setPgnText] = useState("");
  const [parsedGames, setParsedGames] = useState<ParsedGame[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);

  const parsePGNFile = (content: string): ParsedGame[] => {
    const games: ParsedGame[] = [];
    const sections = content.split(/\n\s*\n/).filter(section => section.trim());
    
    let currentMetadata: GameMetadata = {};
    
    for (const section of sections) {
      const lines = section.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length === 0) continue;
      
      if (lines[0].startsWith('[')) {
        currentMetadata = {};
        for (const line of lines) {
          if (line.startsWith('[') && line.endsWith(']')) {
            const match = line.match(/\[(\w+)\s+"([^"]+)"\]/);
            if (match) {
              const [, key, value] = match;
              currentMetadata[key as keyof GameMetadata] = value;
            }
          }
        }
      } else {
        const moves = lines.join(' ').replace(/\s+/g, ' ').trim();
        if (moves && Object.keys(currentMetadata).length > 0) {
          games.push({
            metadata: { ...currentMetadata },
            moves
          });
        }
      }
    }
    
    return games;
  };

  const handleFileLoad = async (content: string) => {
    onFileLoadStart?.();
    
    // Simular delay para arquivos grandes
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const games = parsePGNFile(content);
      if (games.length > 0) {
        setParsedGames(games);
        setSelectedGameIndex(0);
        onPGNLoad(games[0].moves, games[0].metadata);
        setPgnText(games[0].moves);
      } else {
        alert('Nenhuma partida válida encontrada no arquivo PGN');
      }
    } finally {
      onFileLoadEnd?.();
    }
  };

  const handleGameSelect = (index: number) => {
    setSelectedGameIndex(index);
    const selectedGame = parsedGames[index];
    onPGNLoad(selectedGame.moves, selectedGame.metadata);
    setPgnText(selectedGame.moves);
  };

  const handleLoad = () => {
    if (pgnText.trim()) {
      onPGNLoad(pgnText);
    }
  };

  const samplePGN = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7`;

  const loadSample = () => {
    setPgnText(samplePGN);
    onPGNLoad(samplePGN);
    setParsedGames([]);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg h-fit">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Entrada PGN
      </h2>
      
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Partida Única</TabsTrigger>
          <TabsTrigger value="file">Arquivo PGN</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="file" className="space-y-4">
          <PGNFileLoader onFileLoad={handleFileLoad} />
          
          <GameSelector
            games={parsedGames}
            selectedGameIndex={selectedGameIndex}
            onGameSelect={handleGameSelect}
          />
        </TabsContent>
      </Tabs>

      {moves.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2 text-card-foreground">
            Movimentos ({moves.length})
          </h3>
          <div className="bg-muted p-3 rounded max-h-40 overflow-y-auto text-sm">
            <div className="flex flex-wrap gap-1">
              {moves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => onMoveClick(index)}
                  className={`
                    px-2 py-1 rounded transition-all duration-200 cursor-pointer hover:scale-105
                    ${index === currentMoveIndex
                      ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                      : index < currentMoveIndex
                      ? 'bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGNInput;
