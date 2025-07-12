import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MoveAnalysisChartProps {
  moves: string[];
  currentMoveIndex: number;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}

const MoveAnalysisChart: React.FC<MoveAnalysisChartProps> = ({ 
  moves, 
  currentMoveIndex, 
  isExpanded, 
  onToggleExpansion 
}) => {
  const generateMoveEvaluation = (move: string, index: number): number => {
    const pieceValues: { [key: string]: number } = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
    };
    
    let evaluation = 0;
    
    if (move.includes('x')) {
      evaluation += 0.3;
    }
    
    if (move.includes('+')) {
      evaluation += 0.2;
    }
    
    if (move === 'O-O' || move === 'O-O-O') {
      evaluation += 0.4;
    }
    
    evaluation += (Math.sin(index * 0.7) * 0.5);
    
    return index % 2 === 0 ? evaluation : -evaluation;
  };

  const data = moves.map((move, index) => ({
    move: index + 1,
    moveNotation: move,
    evaluation: generateMoveEvaluation(move, index),
    isCurrentMove: index === currentMoveIndex
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium">Movimento {label}: {data.moveNotation}</p>
          <p className="text-sm">
            Avaliação: {payload[0].value > 0 ? '+' : ''}{payload[0].value.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value > 0.3 ? 'Movimento excelente' :
             payload[0].value > 0 ? 'Movimento bom' :
             payload[0].value > -0.3 ? 'Movimento neutro' :
             'Movimento questionável'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Análise dos Movimentos</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpansion}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isExpanded && (
        <>
          {moves.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground">
              <p>Carregue uma partida para ver a análise dos movimentos</p>
            </div>
          ) : (
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="move" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[-2, 2]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <Line 
                    type="monotone" 
                    dataKey="evaluation" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
                  />
                  {currentMoveIndex >= 0 && (
                    <ReferenceLine 
                      x={currentMoveIndex + 1} 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            * Análise simulada para demonstração. Em uma implementação real, seria integrada com Stockfish ou ChessBase API.
          </p>
        </>
      )}
    </div>
  );
};

export default MoveAnalysisChart;
