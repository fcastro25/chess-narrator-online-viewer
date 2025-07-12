
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PGNFileLoaderProps {
  onFileLoad: (content: string) => void;
}

const PGNFileLoader: React.FC<PGNFileLoaderProps> = ({ onFileLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.pgn')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onFileLoad(content);
        }
      };
      reader.readAsText(file);
    } else if (file) {
      alert('Por favor, selecione um arquivo .pgn válido');
    }
    
    // Reset input para permitir carregar o mesmo arquivo novamente
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pgn"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button onClick={handleButtonClick} variant="outline" className="w-full">
        <Upload className="w-4 h-4 mr-2" />
        Carregar arquivo PGN
      </Button>
    </div>
  );
};

export default PGNFileLoader;
