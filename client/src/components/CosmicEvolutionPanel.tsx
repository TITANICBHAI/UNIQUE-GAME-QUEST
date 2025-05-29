import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { UniversePhase, CosmicElement } from '../game/GameState';
import { ChevronRight, Star, AtomIcon, Sparkles, Zap, GlobeIcon, DnaIcon, RocketIcon, Maximize2 } from "lucide-react";

interface CosmicEvolutionPanelProps {
  currentPhase: number;
  phases: UniversePhase[];
  elements: CosmicElement[];
  cosmicAge: number;
  expansionRate: number;
  matterDensity: number;
  energyDensity: number;
  cosmicTemperature?: number;
  quantumCoherence?: number;
  onTriggerBigBang?: () => void;
}

const CosmicEvolutionPanel: React.FC<CosmicEvolutionPanelProps> = ({
  currentPhase,
  phases,
  elements,
  cosmicAge,
  expansionRate,
  matterDensity,
  energyDensity,
  cosmicTemperature = 0,
  quantumCoherence = 1.0,
  onTriggerBigBang
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseBigBang, setPulseBigBang] = useState(true);

  // Pulse Big Bang button effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseBigBang(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper to format cosmic age for different phases
  const formatCosmicAge = (ageInSeconds: number): string => {
    // For early universe phases, use scientific cosmology time formats
    if (currentPhase <= 2) {
      if (ageInSeconds < 10) return `${ageInSeconds.toFixed(2)} seconds`;
      if (ageInSeconds < 60) return `${Math.round(ageInSeconds)} seconds`;
      return `${Math.round(ageInSeconds / 60)} minutes`;
    }
    
    // For later phases, use longer time scales
    if (currentPhase <= 5) {
      if (ageInSeconds < 3600) return `${Math.round(ageInSeconds / 60)} minutes`;
      if (ageInSeconds < 86400) return `${Math.round(ageInSeconds / 3600)} hours`;
      return `${Math.round(ageInSeconds / 86400)} days`;
    }
    
    // For advanced phases, show years to represent cosmic timescales
    return `${Math.round(ageInSeconds / 31536000)} billion years`;
  };
  
  // Only show elements relevant to current phase
  const visibleElements = elements.filter(e => e.discovered);
  
  // Get icon for current phase
  const getCurrentPhaseIcon = () => {
    if (currentPhase <= 2) return <Sparkles className="h-5 w-5" />;
    if (currentPhase <= 5) return <Star className="h-5 w-5" />;
    if (currentPhase <= 7) return <RocketIcon className="h-5 w-5" />;
    if (currentPhase <= 9) return <GlobeIcon className="h-5 w-5" />;
    return <DnaIcon className="h-5 w-5" />;
  };
  
  return (
    <div className={`fixed ${isExpanded ? 'inset-0 flex items-center justify-center' : 'top-1/2 right-4 transform -translate-y-1/2'} z-40 pointer-events-auto transition-all duration-300`}>
      <Card className={`${isExpanded 
        ? 'w-full max-w-4xl h-[90vh] overflow-y-auto' 
        : 'max-w-xs'} 
        bg-black/80 backdrop-blur-md border border-purple-500/50 text-white shadow-xl p-4 cosmic-panel`}>
        
        {/* Header & Expand Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-purple-300">
            {getCurrentPhaseIcon()}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
              {currentPhase >= 1 ? "Cosmic Evolution" : "Pre-Universe Void"}
            </span>
          </h2>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-700/50 transition-colors"
          >
            <Maximize2 className="h-4 w-4 text-purple-200" />
          </button>
        </div>
        
        <div className="space-y-5">
          {/* Current Phase & Age */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold flex items-center gap-2 text-purple-300">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>{currentPhase >= 1 ? formatCosmicAge(cosmicAge) : "Timeless"}</span>
              </div>
              
              <div className="px-2 py-1 bg-purple-900/40 rounded-full text-xs text-cyan-300 font-medium">
                Phase {currentPhase}
              </div>
            </div>
            
            {/* Show big bang button if in initial phase */}
            {currentPhase === 0 && onTriggerBigBang && (
              <button
                onClick={onTriggerBigBang}
                className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                  rounded-md font-medium text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-900/50
                  transition-all duration-300 ${pulseBigBang ? 'animate-pulse scale-105' : ''}`}
              >
                <Sparkles className="h-5 w-5" /> Trigger Big Bang
              </button>
            )}
            
            {/* Current phase info */}
            <div className="bg-purple-900/40 p-4 rounded-md border border-purple-500/30">
              <h3 className="font-semibold text-base text-cyan-300">{phases[currentPhase].name}</h3>
              <p className="mt-2 text-gray-200 leading-relaxed">{phases[currentPhase].description}</p>
            </div>
          </div>
          
          {/* Universe parameters */}
          {currentPhase >= 1 && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-blue-300 flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> Universe Parameters
              </h3>
              
              <div className={`grid ${isExpanded ? 'grid-cols-3' : 'grid-cols-2'} gap-3 text-sm`}>
                <div className="bg-blue-900/30 p-3 rounded border border-blue-500/30 flex flex-col">
                  <div className="text-gray-300 mb-1">Expansion Rate</div>
                  <div className="font-semibold text-blue-200 flex items-end gap-1">
                    {expansionRate.toFixed(1)}<span className="text-xs text-blue-300">x</span>
                    <div className="ml-auto h-1.5 bg-blue-900/70 rounded-full w-16 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(expansionRate * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-900/30 p-3 rounded border border-amber-500/30 flex flex-col">
                  <div className="text-gray-300 mb-1">Matter Density</div>
                  <div className="font-semibold text-amber-200 flex items-end gap-1">
                    {(matterDensity * 100).toFixed(0)}<span className="text-xs text-amber-300">%</span>
                    <div className="ml-auto h-1.5 bg-amber-900/70 rounded-full w-16 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${matterDensity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-900/30 p-3 rounded border border-purple-500/30 flex flex-col">
                  <div className="text-gray-300 mb-1">Energy Density</div>
                  <div className="font-semibold text-purple-200 flex items-end gap-1">
                    {(energyDensity * 100).toFixed(0)}<span className="text-xs text-purple-300">%</span>
                    <div className="ml-auto h-1.5 bg-purple-900/70 rounded-full w-16 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${energyDensity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Advanced scientific parameters - only visible when expanded */}
                {isExpanded && (
                  <>
                    <div className="bg-red-900/30 p-3 rounded border border-red-500/30 flex flex-col">
                      <div className="text-gray-300 mb-1">Temperature</div>
                      <div className="font-semibold text-red-200 flex items-end gap-1">
                        {currentPhase <= 1 ? "—" : 
                          currentPhase === 2 ? "10²³" :
                          currentPhase === 3 ? "10¹⁵" :
                          currentPhase === 4 ? "10⁹" :
                          currentPhase <= 6 ? "10⁶" : "10³"
                        }
                        <span className="text-xs text-red-300">K</span>
                        {currentPhase > 1 && (
                          <div className="ml-auto h-1.5 bg-red-900/70 rounded-full w-16 overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${100 - (currentPhase * 7)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-teal-900/30 p-3 rounded border border-teal-500/30 flex flex-col">
                      <div className="text-gray-300 mb-1">Quantum Coherence</div>
                      <div className="font-semibold text-teal-200 flex items-end gap-1">
                        {currentPhase <= 3 ? "Strong" : 
                          currentPhase <= 5 ? "Moderate" : 
                          currentPhase <= 8 ? "Weak" : "Localized"
                        }
                        <div className="ml-auto h-1.5 bg-teal-900/70 rounded-full w-16 overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${Math.max(100 - (currentPhase * 8), 5)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/30 p-3 rounded border border-indigo-500/30 flex flex-col">
                      <div className="text-gray-300 mb-1">Emergent Complexity</div>
                      <div className="font-semibold text-indigo-200 flex items-end gap-1">
                        {currentPhase <= 2 ? "Zero" : 
                          currentPhase <= 4 ? "Simple" :
                          currentPhase <= 7 ? "Moderate" :
                          currentPhase <= 10 ? "Complex" : "Recursive"
                        }
                        <div className="ml-auto h-1.5 bg-indigo-900/70 rounded-full w-16 overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(currentPhase * 8, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Timeline of phases */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-amber-300 flex items-center gap-1">
              <ChevronRight className="h-4 w-4" /> Cosmic Timeline
            </h3>
            
            <div className="relative pl-3 border-l border-amber-700/50 space-y-3">
              {phases.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`relative transition-all ${
                    index === currentPhase 
                      ? 'text-white' 
                      : phase.unlocked 
                        ? 'text-gray-300' 
                        : 'text-gray-500'
                  }`}
                >
                  {/* Timeline node */}
                  <div 
                    className={`absolute -left-[23px] top-0 h-5 w-5 rounded-full flex items-center justify-center
                      ${index === currentPhase 
                        ? 'bg-amber-500 shadow-lg shadow-amber-500/40' 
                        : phase.unlocked 
                          ? 'bg-gray-600' 
                          : 'bg-gray-800'}`}
                  >
                    {index <= currentPhase && 
                      <div className={`h-2 w-2 rounded-full ${index === currentPhase ? 'bg-amber-200 animate-pulse' : 'bg-gray-400'}`} />
                    }
                  </div>
                  
                  {/* Phase content */}
                  <div 
                    className={`pl-3 py-1 ${
                      index === currentPhase 
                        ? 'bg-amber-900/20 border-l-2 border-amber-500 rounded-r-md' 
                        : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${index === currentPhase ? 'text-amber-300' : ''}`}>
                        {phase.name}
                      </span>
                      
                      {!phase.unlocked && index > 0 && (
                        <span className="text-xs bg-gray-800/80 px-2 py-0.5 rounded-full">
                          {phase.requiredEnergy} pts
                        </span>
                      )}
                    </div>
                    
                    {/* Show description for current phase or in expanded view */}
                    {(index === currentPhase || isExpanded) && (
                      <p className="text-xs mt-1 text-gray-400">{phase.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Discovered elements grid */}
          {visibleElements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-green-300 flex items-center gap-1">
                <AtomIcon className="h-4 w-4" /> Discovered Elements ({visibleElements.length})
              </h3>
              
              <div className={`grid ${isExpanded ? 'grid-cols-3' : 'grid-cols-2'} gap-2 text-xs`}>
                {visibleElements.map(element => (
                  <div
                    key={element.id}
                    className="bg-green-900/30 p-2.5 rounded border border-green-500/30 flex flex-col animate-float"
                  >
                    <div className="font-medium text-green-200">{element.name}</div>
                    <div className="text-gray-400 text-xs mt-1">{element.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CosmicEvolutionPanel;