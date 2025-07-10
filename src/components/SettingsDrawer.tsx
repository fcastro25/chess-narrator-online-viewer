
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
import { Button } from "@/components/ui/button";
import { Settings, Palette, Crown } from "lucide-react";

interface SettingsDrawerProps {
  boardStyle: "classic" | "modern" | "wood";
  pieceStyle: "classic" | "modern";
  onBoardStyleChange: (style: "classic" | "modern" | "wood") => void;
  onPieceStyleChange: (style: "classic" | "modern") => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  boardStyle,
  pieceStyle,
  onBoardStyleChange,
  onPieceStyleChange,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configurações do Tabuleiro</DrawerTitle>
          <DrawerDescription>
            Personalize a aparência do tabuleiro e das peças
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-6 space-y-6">
          {/* Board Style Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <h3 className="text-lg font-medium">Estilo do Tabuleiro</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={boardStyle === "classic" ? "default" : "outline"}
                onClick={() => onBoardStyleChange("classic")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                  <div className="bg-stone-200 rounded-sm"></div>
                  <div className="bg-stone-600 rounded-sm"></div>
                  <div className="bg-stone-600 rounded-sm"></div>
                  <div className="bg-stone-200 rounded-sm"></div>
                </div>
                <span className="text-xs">Clássico</span>
              </Button>
              
              <Button
                variant={boardStyle === "modern" ? "default" : "outline"}
                onClick={() => onBoardStyleChange("modern")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                  <div className="bg-slate-100 rounded-sm"></div>
                  <div className="bg-slate-600 rounded-sm"></div>
                  <div className="bg-slate-600 rounded-sm"></div>
                  <div className="bg-slate-100 rounded-sm"></div>
                </div>
                <span className="text-xs">Moderno</span>
              </Button>
              
              <Button
                variant={boardStyle === "wood" ? "default" : "outline"}
                onClick={() => onBoardStyleChange("wood")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                  <div className="bg-yellow-100 rounded-sm"></div>
                  <div className="bg-yellow-800 rounded-sm"></div>
                  <div className="bg-yellow-800 rounded-sm"></div>
                  <div className="bg-yellow-100 rounded-sm"></div>
                </div>
                <span className="text-xs">Madeira</span>
              </Button>
            </div>
          </div>

          {/* Piece Style Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <h3 className="text-lg font-medium">Estilo das Peças</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={pieceStyle === "classic" ? "default" : "outline"}
                onClick={() => onPieceStyleChange("classic")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <span className="text-2xl">♔</span>
                <span className="text-xs">Clássico</span>
              </Button>
              
              <Button
                variant={pieceStyle === "modern" ? "default" : "outline"}
                onClick={() => onPieceStyleChange("modern")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <span className="text-2xl">♚</span>
                <span className="text-xs">Moderno</span>
              </Button>
            </div>
          </div>
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
