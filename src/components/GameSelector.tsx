
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface GameSelectorProps {
  games: ParsedGame[];
  selectedGameIndex: number;
  onGameSelect: (index: number) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({
  games,
  selectedGameIndex,
  onGameSelect,
}) => {
  const getGameDisplayName = (game: ParsedGame, index: number) => {
    const white = game.metadata.White?.replace(/"/g, '') || 'Jogador 1';
    const black = game.metadata.Black?.replace(/"/g, '') || 'Jogador 2';
    const event = game.metadata.Event?.replace(/"/g, '') || '';
    const round = game.metadata.Round?.replace(/"/g, '') || '';
    
    let displayName = `${white} vs ${black}`;
    if (event || round) {
      displayName += ` (${event}${round ? ` - R${round}` : ''})`;
    }
    
    return displayName;
  };

  if (games.length <= 1) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Selecionar Partida ({games.length} encontradas)
      </label>
      <Select
        value={selectedGameIndex.toString()}
        onValueChange={(value) => onGameSelect(parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma partida" />
        </SelectTrigger>
        <SelectContent>
          {games.map((game, index) => (
            <SelectItem key={index} value={index.toString()}>
              {getGameDisplayName(game, index)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameSelector;
