import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Sparkles, 
  MoveDown, 
  Atom, 
  Combine, 
  Globe, 
  X,
  Menu
} from "lucide-react";

export type GameMode = 'create' | 'gravity' | 'stream' | 'fusion' | 'explore';

interface ModeSelectionPanelProps {
  visible: boolean;
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onClose: () => void;
}

const ModeSelectionPanel: React.FC<ModeSelectionPanelProps> = ({
  visible,
  currentMode,
  onSelectMode,
  onClose
}) => {
  if (!visible) return null;

  const modes: {
    id: GameMode;
    name: string;
    description: string;
    icon: React.ReactNode;
    shortcut: string;
    color: string;
  }[] = [
    {
      id: 'create',
      name: 'Create',
      description: 'Create particles in the quantum field',
      icon: <Sparkles className="h-5 w-5" />,
      shortcut: '1',
      color: 'bg-blue-500'
    },
    {
      id: 'gravity',
      name: 'Gravity Well',
      description: 'Create gravity wells to attract particles',
      icon: <MoveDown className="h-5 w-5" />,
      shortcut: '2',
      color: 'bg-purple-500'
    },
    {
      id: 'stream',
      name: 'Particle Stream',
      description: 'Direct flow of particles with streams',
      icon: <Atom className="h-5 w-5" />,
      shortcut: '3',
      color: 'bg-cyan-500'
    },
    {
      id: 'fusion',
      name: 'Fusion',
      description: 'Combine particles to create cosmic objects',
      icon: <Combine className="h-5 w-5" />,
      shortcut: '4',
      color: 'bg-amber-500'
    },
    {
      id: 'explore',
      name: 'Explore',
      description: 'Examine cosmic objects up close',
      icon: <Globe className="h-5 w-5" />,
      shortcut: '5',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="absolute top-20 right-4 z-40">
      <Card className="w-64 bg-black/80 backdrop-blur-md border border-indigo-500/50 text-white shadow-lg shadow-indigo-500/20">
        <div className="flex justify-between items-center p-2 border-b border-indigo-800/50">
          <div className="flex items-center gap-2">
            <Menu className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium">Interaction Modes</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full hover:bg-indigo-900/50"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <CardContent className="p-2">
          <div className="space-y-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`w-full flex items-center gap-3 p-2 rounded-md text-sm transition-all ${
                  currentMode === mode.id 
                    ? 'bg-indigo-800/80 text-white' 
                    : 'hover:bg-indigo-900/40 text-gray-300'
                }`}
              >
                <div className={`h-7 w-7 rounded-md ${mode.color} flex items-center justify-center`}>
                  {mode.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{mode.name}</div>
                  <div className="text-xs opacity-70">{mode.description}</div>
                </div>
                <div className="text-xs text-gray-400 bg-gray-800/50 px-1.5 py-0.5 rounded-md">
                  {mode.shortcut}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModeSelectionPanel;