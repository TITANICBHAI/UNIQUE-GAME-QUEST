import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Pause, Play, RefreshCw, HelpCircle, Zap, Volume2, VolumeX, Award, Star, Timer, Sparkles, Heart, Coffee, Radar } from "lucide-react";
import { Achievement, Challenge } from '../game/GameState';

interface GameUIProps {
  score: number;
  energy: number;
  plantCount: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onReset: () => void;
  onShowTutorial: () => void;
  onToggleSpaceUI?: () => void;
  onToggleVoiceControl?: () => void;
  level?: number;
  comboMultiplier?: number;
  achievements?: Achievement[];
  activeChallenges?: Challenge[];
}

const GameUI: React.FC<GameUIProps> = ({
  score,
  energy,
  plantCount,
  isPaused,
  onPauseToggle,
  onReset,
  onShowTutorial,
  onToggleSpaceUI,
  onToggleVoiceControl,
  level = 1,
  comboMultiplier = 1,
  achievements = [],
  activeChallenges = []
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showActionText, setShowActionText] = useState<string | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [lastUnlockedAchievement, setLastUnlockedAchievement] = useState<Achievement | null>(null);
  
  // Toggle sound on/off
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Integrate with AudioManager
  };
  
  // Display temporary action message
  const showAction = (text: string) => {
    setShowActionText(text);
    setTimeout(() => setShowActionText(null), 1500);
  };

  // Handle new achievement display
  useEffect(() => {
    // Check for newly unlocked achievements to display
    const unlockedAchievement = achievements.find(a => a.isUnlocked);
    if (unlockedAchievement && unlockedAchievement !== lastUnlockedAchievement) {
      setLastUnlockedAchievement(unlockedAchievement);
      showAction(`Achievement Unlocked: ${unlockedAchievement.name}!`);
    }
  }, [achievements]);
  
  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
      {/* Action Message */}
      {showActionText && (
        <div className="fixed top-1/4 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div className="bg-purple-900/80 text-white px-6 py-3 rounded-full text-xl font-bold animate-bounce shadow-lg shadow-purple-500/20">
            {showActionText}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-start">
        {/* Stats */}
        <Card className="p-3 bg-black/60 text-white pointer-events-auto backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="flex flex-col gap-1 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 flex items-center gap-1">
                <Star className="h-4 w-4" /> SCORE:
              </span>
              <span className="font-bold">{score.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 flex items-center gap-1">
                <Zap className="h-4 w-4" /> ENERGY:
              </span>
              <div className="w-24 h-4 bg-gray-800 rounded-full overflow-hidden border border-blue-500/30">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                  style={{ width: `${Math.round(energy)}%` }}
                />
              </div>
              <span className="font-bold">{Math.round(energy)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">PLANTS:</span>
              <span className="font-bold">{plantCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">LEVEL:</span>
              <span className="font-bold">{level}</span>
            </div>
            {comboMultiplier > 1 && (
              <div className="flex items-center gap-2 animate-pulse">
                <span className="text-yellow-400">COMBO:</span>
                <span className="font-bold">x{comboMultiplier.toFixed(1)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Controls */}
        <Card className="flex gap-2 p-2 bg-black/60 pointer-events-auto backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10"
            onClick={() => {
              onPauseToggle();
              showAction(isPaused ? "Game Resumed" : "Game Paused");
            }}
            title={isPaused ? "Resume Game" : "Pause Game"}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10"
            onClick={() => {
              onReset();
              showAction("Garden Reset");
            }}
            title="Reset Garden"
          >
            <RefreshCw size={18} />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10"
            onClick={onShowTutorial}
            title="How to Play"
          >
            <HelpCircle size={18} />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10"
            onClick={() => {
              toggleMute();
              showAction(isMuted ? "Sound On" : "Sound Off");
            }}
            title={isMuted ? "Enable Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10"
            onClick={() => setShowAchievements(!showAchievements)}
            title="View Achievements"
          >
            <Award size={18} />
          </Button>
          {onToggleSpaceUI && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-400/20 glow-cyan"
              onClick={() => {
                onToggleSpaceUI();
                showAction("Space Console");
              }}
              title="Space Exploration Console"
            >
              <Radar size={18} />
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            className="text-purple-400 border-purple-400/50 hover:bg-purple-400/20"
            onClick={() => {
              if (onToggleVoiceControl) {
                onToggleVoiceControl();
                showAction("Voice Control Activated! Say: 'ignite fusion', 'bend spacetime', 'quantum superposition'");
              }
            }}
            title="Enable Voice Commands - Say physics commands!"
          >
            <Coffee size={18} />
          </Button>
        </Card>
      </div>
      
      {/* Controls Guide */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <Card className="p-3 bg-black/60 text-white backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <div className="text-xs md:text-sm flex flex-col gap-1.5">
            <div className="font-semibold text-purple-300 mb-1">Quick Controls:</div>
            <div className="flex gap-2 items-center">
              <span className="px-2 py-0.5 bg-gray-700 rounded">Click</span>
              <span>Add particles</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="px-2 py-0.5 bg-gray-700 rounded">Q</span>
              <span>Entangle particles</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="px-2 py-0.5 bg-gray-700 rounded">W</span>
              <span>Collapse wave</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="px-2 py-0.5 bg-gray-700 rounded">E</span>
              <span>Boost energy</span>
            </div>
            
            {/* Donate button */}
            <div className="mt-2 pt-2 border-t border-purple-500/30">
              <a 
                href="https://ko-fi.com/s/e6c6cb567b" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 block text-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Support The Game ❤️
              </a>
              <a 
                href="https://titanic-bhai.itch.io/garden" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 block text-center px-3 py-1.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-md hover:from-gray-800 hover:to-gray-700 transition-colors"
              >
                Play on itch.io
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Challenge */}
      {activeChallenges.length > 0 && (
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <Card className="p-3 bg-black/60 text-white backdrop-blur-sm border border-yellow-500/30 shadow-lg">
            <div className="text-xs md:text-sm flex flex-col gap-1.5">
              <div className="font-semibold text-yellow-300 mb-1 flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> Active Challenge:
              </div>
              {activeChallenges.map(challenge => (
                <div key={challenge.id} className="flex flex-col gap-1">
                  <div className="font-medium">{challenge.name}</div>
                  <div className="text-gray-300 text-xs">{challenge.description}</div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-500" 
                      style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span>{challenge.progress} / {challenge.target}</span>
                    {challenge.timeRemaining !== undefined && (
                      <span className="flex items-center gap-1 text-amber-300">
                        <Timer className="h-3 w-3" /> {Math.ceil(challenge.timeRemaining)}s
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Achievements Panel (pop-up) */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 pointer-events-auto" onClick={() => setShowAchievements(false)}>
          <Card className="max-w-md m-4 bg-gray-900 text-white border border-purple-500 shadow-lg pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" /> Achievements
                </h2>
                <Button size="sm" variant="ghost" onClick={() => setShowAchievements(false)}>
                  <span className="sr-only">Close</span>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${achievement.isUnlocked ? 'bg-purple-900/30 border-purple-500' : 'bg-gray-800/50 border-gray-700'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${achievement.isUnlocked ? 'bg-yellow-500' : 'bg-gray-600'}`}>
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${achievement.isUnlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                        
                        {/* Progress bar */}
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full ${achievement.isUnlocked ? 'bg-yellow-500' : 'bg-blue-600'}`}
                            style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-end text-xs mt-1">
                          <span>{achievement.progress} / {achievement.target}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper component for closing the achievements panel
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default GameUI;
