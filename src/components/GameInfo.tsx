
import React from "react";

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

interface GameInfoProps {
  metadata: GameMetadata;
}

const GameInfo: React.FC<GameInfoProps> = ({ metadata }) => {
  if (!metadata.White && !metadata.Black) {
    return null;
  }

  const formatPlayerName = (name: string, elo?: string) => {
    if (!name) return '';
    const cleanName = name.replace(/"/g, '');
    return elo ? `${cleanName} (${elo})` : cleanName;
  };

  const getResultDisplay = (result?: string) => {
    switch (result) {
      case '1-0': return 'Vitória das Brancas';
      case '0-1': return 'Vitória das Pretas';
      case '1/2-1/2': return 'Empate';
      default: return 'Em andamento';
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border mb-4">
      <div className="text-center mb-2">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-2">
          <span>♔</span>
          <span>{formatPlayerName(metadata.White || '', metadata.WhiteElo)}</span>
          <span className="text-muted-foreground">vs</span>
          <span>{formatPlayerName(metadata.Black || '', metadata.BlackElo)}</span>
          <span>♚</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
        {metadata.Event && (
          <div>
            <span className="font-medium">Evento:</span>
            <div>{metadata.Event.replace(/"/g, '')}</div>
          </div>
        )}
        {metadata.Site && (
          <div>
            <span className="font-medium">Local:</span>
            <div>{metadata.Site.replace(/"/g, '')}</div>
          </div>
        )}
        {metadata.Date && (
          <div>
            <span className="font-medium">Data:</span>
            <div>{metadata.Date.replace(/"/g, '')}</div>
          </div>
        )}
        {metadata.Result && (
          <div>
            <span className="font-medium">Resultado:</span>
            <div>{getResultDisplay(metadata.Result.replace(/"/g, ''))}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInfo;
