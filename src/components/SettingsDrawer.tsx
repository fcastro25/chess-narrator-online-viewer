
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Palette, Crown, Lightbulb, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface SettingsDrawerProps {
  boardStyle: string;
  pieceStyle: string;
  use3DModels: boolean;
  highlightColor: string;
  highlightOpacity: number;
  onBoardStyleChange: (style: string) => void;
  onPieceStyleChange: (style: string) => void;
  onUse3DModelsChange: (use3D: boolean) => void;
  onHighlightColorChange: (color: string) => void;
  onHighlightOpacityChange: (opacity: number) => void;
}

const boardStyles = [
  { id: "classic", name: "Clássico", colors: ["bg-stone-200", "bg-stone-600"] },
  { id: "modern", name: "Moderno", colors: ["bg-slate-100", "bg-slate-600"] },
  { id: "wood", name: "Madeira", colors: ["bg-yellow-100", "bg-yellow-800"] },
  { id: "green", name: "Verde", colors: ["bg-green-100", "bg-green-700"] },
  { id: "blue", name: "Azul", colors: ["bg-blue-100", "bg-blue-700"] },
  { id: "purple", name: "Roxo", colors: ["bg-purple-100", "bg-purple-700"] },
];

const pieceStyles = [
  { id: "classic", name: "Clássico", symbol: "♔" },
  { id: "modern", name: "Moderno", symbol: "♚" },
  { id: "minimal", name: "Minimalista", symbol: "⚬" },
  { id: "bold", name: "Negrito", symbol: "●" },
];

const highlightColors = [
  { id: "yellow", name: "Amarelo", class: "bg-yellow-300" },
  { id: "blue", name: "Azul", class: "bg-blue-400" },
  { id: "green", name: "Verde", class: "bg-green-400" },
  { id: "red", name: "Vermelho", class: "bg-red-400" },
  { id: "purple", name: "Roxo", class: "bg-purple-400" },
  { id: "orange", name: "Laranja", class: "bg-orange-400" },
];

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  boardStyle,
  pieceStyle,
  use3DModels,
  highlightColor,
  highlightOpacity,
  onBoardStyleChange,
  onPieceStyleChange,
  onUse3DModelsChange,
  onHighlightColorChange,
  onHighlightOpacityChange,
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Configurações</DrawerTitle>
          <DrawerDescription>
            Personalize a aparência do tabuleiro, peças e interface
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-6 overflow-y-auto">
          <Tabs defaultValue="board" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="board">Tabuleiro</TabsTrigger>
              <TabsTrigger value="pieces">Peças</TabsTrigger>
              <TabsTrigger value="highlight">Highlight</TabsTrigger>
              <TabsTrigger value="theme">Interface</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Estilo do Tabuleiro</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {boardStyles.map((style) => (
                    <Button
                      key={style.id}
                      variant={boardStyle === style.id ? "default" : "outline"}
                      onClick={() => onBoardStyleChange(style.id)}
                      className="h-auto p-4 flex flex-col gap-2"
                    >
                      <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                        <div className={`${style.colors[0]} rounded-sm`}></div>
                        <div className={`${style.colors[1]} rounded-sm`}></div>
                        <div className={`${style.colors[1]} rounded-sm`}></div>
                        <div className={`${style.colors[0]} rounded-sm`}></div>
                      </div>
                      <span className="text-xs">{style.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pieces" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Estilo das Peças</h3>
                </div>
                 <div className="grid grid-cols-2 gap-3">
                   {pieceStyles.map((style) => (
                     <Button
                       key={style.id}
                       variant={pieceStyle === style.id ? "default" : "outline"}
                       onClick={() => onPieceStyleChange(style.id)}
                       className="h-auto p-4 flex flex-col gap-2"
                     >
                       <span className="text-2xl">{style.symbol}</span>
                       <span className="text-xs">{style.name}</span>
                     </Button>
                   ))}
                 </div>
                 
                 <div className="space-y-3 mt-6">
                   <h4 className="text-md font-medium">Tipo de Modelo 3D</h4>
                   <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                     <div>
                       <p className="font-medium">Modelos STL Complexos</p>
                       <p className="text-sm text-muted-foreground">
                         Use modelos 3D detalhados em STL (apenas no modo 3D)
                       </p>
                     </div>
                     <Switch
                       checked={use3DModels}
                       onCheckedChange={onUse3DModelsChange}
                     />
                   </div>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="highlight" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Highlight dos Lances</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium">Cor</label>
                  <div className="grid grid-cols-3 gap-2">
                    {highlightColors.map((color) => (
                      <Button
                        key={color.id}
                        variant={highlightColor === color.id ? "default" : "outline"}
                        onClick={() => onHighlightColorChange(color.id)}
                        className="h-12 flex flex-col gap-1"
                      >
                        <div className={`w-6 h-6 rounded ${color.class}`}></div>
                        <span className="text-xs">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Opacidade: {Math.round(highlightOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={highlightOpacity}
                    onChange={(e) => onHighlightOpacityChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="w-16 h-16 bg-stone-200 rounded flex items-center justify-center relative">
                    <div 
                      className={`absolute inset-0 rounded ${
                        highlightColors.find(c => c.id === highlightColor)?.class
                      }`}
                      style={{ opacity: highlightOpacity }}
                    ></div>
                    <span className="relative z-10 text-stone-800">♔</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="theme" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Aparência da Interface</h3>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <div>
                      <p className="font-medium">Modo Noturno</p>
                      <p className="text-sm text-muted-foreground">
                        Interface escura para melhor conforto visual
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 pt-0">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
