import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Leaf, Zap, Sparkles, Globe, Star, AtomIcon, Beaker, AlignLeft, BookOpen, DnaIcon } from "lucide-react";

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [activePage, setActivePage] = useState(0);
  const totalPages = 3;
  
  // Ensure we can close the tutorial with Escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log("Escape key pressed - closing tutorial");
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  const handleClose = () => {
    console.log("Tutorial close button clicked");
    onClose();
  };
  
  const nextPage = () => {
    if (activePage < totalPages - 1) {
      setActivePage(activePage + 1);
    } else {
      handleClose();
    }
  };
  
  const prevPage = () => {
    if (activePage > 0) {
      setActivePage(activePage - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50" 
         onClick={(e) => {
           // Close when clicking outside the card
           if (e.target === e.currentTarget) {
             handleClose();
           }
         }}>
      <Card className="max-w-2xl mx-4 bg-gradient-to-b from-indigo-900/90 to-black/95 text-white border border-purple-500 shadow-lg shadow-purple-500/20 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-purple-800">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              Cosmic Evolution Simulator
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-xs text-purple-300">
              {activePage + 1} / {totalPages}
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-purple-300 hover:text-white hover:bg-purple-800">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-sm pt-4">
          {/* Page 1: Introduction */}
          {activePage === 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-800/50">
                <h3 className="font-semibold text-lg text-cyan-300 mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Welcome, Universal Architect
                </h3>
                <p className="italic mb-3">
                  You're about to embark on a journey from nothingness to the complexity of life itself. 
                  Guide the universe from its pre-existence state through the Big Bang and beyond,
                  all the way to the emergence of life on Earth.
                </p>
                <p>
                  This simulation follows our best understanding of cosmic evolution, 
                  from quantum fluctuations to galaxies, stars, planets, and ultimately, life.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/30 flex flex-col items-center text-center">
                  <div className="mb-2 bg-blue-500/20 p-2 rounded-full">
                    <Sparkles className="h-8 w-8 text-blue-300" />
                  </div>
                  <h4 className="text-blue-300 font-medium mb-1">Begin in the Void</h4>
                  <p className="text-xs text-gray-300">
                    Start in the pre-existence phase, where time and space have yet to emerge.
                  </p>
                </div>
                
                <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-700/30 flex flex-col items-center text-center">
                  <div className="mb-2 bg-indigo-500/20 p-2 rounded-full">
                    <Star className="h-8 w-8 text-indigo-300" />
                  </div>
                  <h4 className="text-indigo-300 font-medium mb-1">Create a Universe</h4>
                  <p className="text-xs text-gray-300">
                    Trigger the Big Bang and watch your universe expand through cosmic time.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Page 2: Phases */}
          {activePage === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-cyan-300 mb-1 flex items-center gap-2">
                <AlignLeft className="h-5 w-5" />
                The Cosmic Timeline
              </h3>
              
              <div className="relative pl-4 border-l-2 border-blue-600 space-y-3">
                <div className="relative">
                  <div className="absolute -left-[17px] top-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-blue-200" />
                  </div>
                  <div className="pl-3">
                    <h4 className="text-blue-300 font-medium">Pre-Existence & The Big Bang</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      From the void to the explosive birth of spacetime. The universe begins as an infinitely hot, dense singularity.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[17px] top-0 h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-purple-200" />
                  </div>
                  <div className="pl-3">
                    <h4 className="text-purple-300 font-medium">Inflation & Particle Formation</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      The universe expands exponentially, then cools enough for energy to condense into the first particles.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[17px] top-0 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-200" />
                  </div>
                  <div className="pl-3">
                    <h4 className="text-indigo-300 font-medium">Nucleosynthesis & Structure</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      Simple elements form, then gravity pulls matter into the first stars and galaxies.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[17px] top-0 h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-200" />
                  </div>
                  <div className="pl-3">
                    <h4 className="text-green-300 font-medium">Stars, Planets & Earth</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      Stars forge complex elements, which form into planets. Earth emerges as a special world.
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[17px] top-0 h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-amber-200" />
                  </div>
                  <div className="pl-3">
                    <h4 className="text-amber-300 font-medium">Chemistry & Life</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      Complex molecules form in Earth's oceans, eventually leading to the first self-replicating entities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Page 3: Controls */}
          {activePage === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-cyan-300 mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                How to Play
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-blue-900/20 p-3 rounded-md border border-blue-800/30">
                  <h4 className="text-blue-300 font-medium mb-1">Mouse Controls:</h4>
                  <ul className="space-y-1 pl-4 list-disc text-xs">
                    <li><strong>Move mouse</strong> - Influence quantum field</li>
                    <li><strong>Click</strong> - Create energy particles</li>
                    <li><strong>Click + drag</strong> - Generate matter streams</li>
                  </ul>
                </div>
                <div className="bg-purple-900/20 p-3 rounded-md border border-purple-800/30">
                  <h4 className="text-purple-300 font-medium mb-1">Keyboard Controls:</h4>
                  <ul className="space-y-1 pl-4 list-disc text-xs">
                    <li><strong>Q key</strong> - Quantum entanglement</li>
                    <li><strong>W key</strong> - Wave function collapse</li>
                    <li><strong>E key</strong> - Energy field boost</li>
                    <li><strong>Space</strong> - Pause/resume simulation</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-900/30 to-violet-900/30 p-3 rounded-md border border-blue-500/50 mt-3">
                <h4 className="text-blue-300 font-bold mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  New Strategic Game Modes:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ul className="space-y-1 pl-4 list-disc text-xs">
                    <li><strong className="text-cyan-400">1 key</strong> - Create particles (basic mode)</li>
                    <li><strong className="text-cyan-400">2 key</strong> - Gravity wells to attract particles</li>
                    <li><strong className="text-cyan-400">3 key</strong> - Particle streams for directed flow</li>
                  </ul>
                  <ul className="space-y-1 pl-4 list-disc text-xs">
                    <li><strong className="text-cyan-400">4 key</strong> - Fusion mode to combine particles</li>
                    <li><strong className="text-cyan-400">5 key</strong> - Explore cosmic bodies up close</li>
                    <li><strong className="text-cyan-400">M key</strong> - Toggle mode selection panel</li>
                  </ul>
                </div>
              </div>

              <h3 className="font-semibold text-amber-400 flex items-center gap-2 mt-3">
                <Leaf className="h-4 w-4" />
                Tips for Cosmic Evolution:
              </h3>
              <ol className="space-y-1 pl-5 list-decimal bg-yellow-900/10 p-3 rounded-md border border-yellow-800/30">
                <li>Begin by gathering energy in the void to trigger the Big Bang</li>
                <li>Track your progress through the cosmic timeline panel</li>
                <li>Discover new elements and watch them interact in your universe</li>
                <li>Look for the expand button in the cosmic panel to see more details</li>
                <li>Advance through phases by collecting energy and reaching thresholds</li>
              </ol>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="pt-4 flex justify-between">
            {activePage > 0 ? (
              <Button 
                onClick={prevPage}
                className="bg-gray-800 hover:bg-gray-700 transition-all"
              >
                Previous
              </Button>
            ) : <div></div>}
            
            <Button 
              onClick={nextPage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {activePage < totalPages - 1 ? "Next" : "Begin Creation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
