import { useEffect, useRef, useState } from "react";
import { QuantumGarden } from "./game/QuantumGarden";
import GameUI from "./components/GameUI";
import Tutorial from "./components/Tutorial";
import CosmicEvolutionPanel from "./components/CosmicEvolutionPanel";
import ModeSelectionPanel, { GameMode } from "./components/ModeSelectionPanel";
import SpaceExplorationUI from "./components/SpaceExplorationUI";
import StrategicDecisionPanel from "./components/StrategicDecisionPanel";
import { Achievement, Challenge, UniversePhase, CosmicElement } from "./game/GameState";
import { SpaceScanner } from "./game/SpaceScanner";
import { AtmosphericEntry } from "./game/AtmosphericEntry";
import { SpaceNavigator } from "./game/SpaceNavigator";
import { CosmicPhysicsEngine } from "./game/CosmicPhysicsEngine";
import { SkillBasedControlSystem } from "./game/SkillBasedControlSystem";
import { DynamicChallengeSystem } from "./game/DynamicChallengeSystem";
import { TechnologyTreeSystem } from "./game/TechnologyTreeSystem";
import { AdvancedInputSystem } from "./game/AdvancedInputSystem";
import { StrategicGameplayEngine } from "./game/StrategicGameplayEngine";
import "@fontsource/inter";
import "./index.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<QuantumGarden | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [plantCount, setPlantCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  
  // Cosmic evolution state
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [universePhases, setUniversePhases] = useState<UniversePhase[]>([]);
  const [cosmicElements, setCosmicElements] = useState<CosmicElement[]>([]);
  const [cosmicAge, setCosmicAge] = useState(0);
  const [expansionRate, setExpansionRate] = useState(1.0);
  const [matterDensity, setMatterDensity] = useState(0);
  const [energyDensity, setEnergyDensity] = useState(1.0);
  
  // Game mode state
  const [currentMode, setCurrentMode] = useState<GameMode>('create');
  const [showModePanel, setShowModePanel] = useState(false);
  
  // Space exploration state
  const [showSpaceUI, setShowSpaceUI] = useState(false);
  const [spaceScanner, setSpaceScanner] = useState<SpaceScanner | null>(null);
  const [atmosphericEntry, setAtmosphericEntry] = useState<AtmosphericEntry | null>(null);
  const [spaceNavigator, setSpaceNavigator] = useState<SpaceNavigator | null>(null);
  
  // Advanced game systems
  const [cosmicPhysics, setCosmicPhysics] = useState<CosmicPhysicsEngine | null>(null);
  const [skillSystem, setSkillSystem] = useState<SkillBasedControlSystem | null>(null);
  const [challengeSystem, setChallengeSystem] = useState<DynamicChallengeSystem | null>(null);
  const [techTree, setTechTree] = useState<TechnologyTreeSystem | null>(null);
  const [advancedInput, setAdvancedInput] = useState<AdvancedInputSystem | null>(null);
  const [strategicEngine, setStrategicEngine] = useState<StrategicGameplayEngine | null>(null);
  
  // Input system state
  const [voiceControlEnabled, setVoiceControlEnabled] = useState(false);
  const [currentInputMode, setCurrentInputMode] = useState<'gesture' | 'voice' | 'keyboard' | 'multimodal'>('gesture');
  const [showStrategicDecisions, setShowStrategicDecisions] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const newGame = new QuantumGarden(canvasRef.current, {
      onScoreUpdate: (newScore) => setScore(newScore),
      onEnergyUpdate: (newEnergy) => setEnergy(newEnergy),
      onPlantCountUpdate: (count) => setPlantCount(count),
      onLevelUp: (newLevel) => {
        setLevel(newLevel);
        showGameNotification(`Level Up! You're now level ${newLevel}`);
      },
      onComboUpdate: (newMultiplier) => setComboMultiplier(newMultiplier),
      onAchievementUnlocked: (achievement) => {
        setAchievements(prevAchievements => [...prevAchievements]);
        showGameNotification(`Achievement Unlocked: ${achievement.name}!`);
      },
      onChallengeUpdated: (challenges) => {
        setActiveChallenges([...challenges]);
      },
      onChallengeCompleted: (challenge) => {
        showGameNotification(`Challenge Completed: ${challenge.name}!`);
      },
      onUniversePhaseChanged: (phase) => {
        setCurrentPhase(phase.id);
        showGameNotification(`Universe evolved to: ${phase.name}`);
        // Update universe phases to show unlocked states
        if (newGame.getAllPhases) {
          setUniversePhases(newGame.getAllPhases());
        }
      },
      onCosmicElementDiscovered: (element) => {
        showGameNotification(`Discovered: ${element.name}`);
        // Update cosmic elements list
        if (newGame.getCosmicElements) {
          setCosmicElements(newGame.getCosmicElements());
        }
      },
      onCosmicParametersUpdated: (params) => {
        setCosmicAge(params.cosmicAge);
        setExpansionRate(params.expansionRate);
        setMatterDensity(params.matterDensity);
        setEnergyDensity(params.energyDensity);
      }
    });
    
    setGame(newGame);
    
    // Initialize space exploration systems
    const scanner = new SpaceScanner();
    const entry = new AtmosphericEntry(canvasRef.current);
    const navigator = new SpaceNavigator(canvasRef.current);
    
    setSpaceScanner(scanner);
    setAtmosphericEntry(entry);
    setSpaceNavigator(navigator);
    
    // Initialize advanced game systems
    const physics = new CosmicPhysicsEngine();
    const skills = new SkillBasedControlSystem(canvasRef.current);
    const challenges = new DynamicChallengeSystem(new Map([
      ['stellar_ignition', 0],
      ['orbital_mechanics', 0],
      ['quantum_entanglement', 0]
    ]));
    const technology = new TechnologyTreeSystem();
    const input = new AdvancedInputSystem(canvasRef.current);
    
    setCosmicPhysics(physics);
    setSkillSystem(skills);
    setChallengeSystem(challenges);
    setTechTree(technology);
    setAdvancedInput(input);
    
    // Initialize Strategic Gameplay Engine
    const strategic = new StrategicGameplayEngine();
    setStrategicEngine(strategic);
    
    // Connect systems together
    skills.onChallengeComplete = (result) => {
      technology.addPracticalExperience(result.masteryGained);
      showGameNotification(`Skill mastery increased! Precision: ${(result.precision * 100).toFixed(1)}%`);
    };
    
    input.onCosmicAction = (action, inputType, data) => {
      if (inputType === 'gesture') {
        const challenge = skills.initiateCosmicManipulation(action, {});
        showGameNotification(`Cosmic gesture: ${data.pattern.name} - ${data.pattern.cosmicEffect}`);
        
        // Apply gesture effects to game
        if (action === 'stellar_ignition') {
          newGame.triggerCosmicEvent('stellar_fusion', { efficiency: data.pattern.requiredAccuracy });
        } else if (action === 'orbital_mechanics') {
          newGame.triggerCosmicEvent('orbital_creation', { stability: 0.9 });
        } else if (action === 'quantum_entanglement') {
          newGame.triggerCosmicEvent('quantum_enhancement', { coherence: 0.95 });
        }
      } else if (inputType === 'voice') {
        showGameNotification(`Voice: ${data.command.scientificBasis}`);
        
        // Apply voice command effects
        if (action === 'fusion_ignition') {
          newGame.triggerCosmicEvent('voice_fusion', { power: 1.5 });
        } else if (action === 'spacetime_curvature') {
          newGame.triggerCosmicEvent('spacetime_warp', { curvature: 2.0 });
        }
      } else if (inputType === 'keyboard') {
        showGameNotification(`Equation: ${data.sequence.description}`);
        
        // Apply equation effects
        if (action === 'mass_energy') {
          newGame.triggerCosmicEvent('mass_conversion', { efficiency: 0.95 });
        } else if (action === 'schwarzschild_radius') {
          newGame.triggerCosmicEvent('black_hole_formation', { precision: 1.0 });
        }
      }
      
      // Trigger strategic decisions based on cosmic actions
      if (strategic) {
        if (action === 'stellar_ignition' || action === 'black_hole_formation') {
          strategic.triggerCosmicEvent('major_stellar_event', { type: action });
          setTimeout(() => setShowStrategicDecisions(true), 2000); // Show decision panel after dramatic effect
        } else if (action === 'spacetime_curvature' || action === 'quantum_entanglement') {
          strategic.triggerCosmicEvent('spacetime_manipulation', { type: action });
          setTimeout(() => setShowStrategicDecisions(true), 1500);
        }
      }
    };
    
    // Set initial achievements - commented out until implemented
    // setAchievements([]);
    
    // Set initial cosmic evolution data - default values for now
    setCurrentPhase(0);
    
    // Initialize with empty array if needed
    setUniversePhases([
      {
        id: 0,
        name: "Pre-Existence",
        description: "Before the universe began",
        requiredEnergy: 100,
        unlocked: true
      },
      {
        id: 1,
        name: "Big Bang",
        description: "The birth of the universe",
        requiredEnergy: 200,
        unlocked: false
      }
    ]);
    
    if (newGame.getAllPhases) {
      setUniversePhases(newGame.getAllPhases());
    }
    
    if (newGame.getCosmicElements) {
      setCosmicElements(newGame.getCosmicElements());
    }
    
    // Handle resize
    const handleResize = () => {
      if (containerRef.current && canvasRef.current && newGame) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        // Skip resize call for now to avoid errors
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing
    
    return () => {
      window.removeEventListener('resize', handleResize);
      newGame.destroy();
    };
  }, []);

  const showGameNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Hide notification after a delay
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleStrategicDecision = (decisionId: string, optionId: string) => {
    if (!strategicEngine) return;
    
    const result = strategicEngine.makeDecision(decisionId, optionId);
    setShowStrategicDecisions(false);
    
    if (result) {
      showGameNotification(`Decision made: ${result.chosenOption.name} - ${result.consequences.join(', ')}`);
      
      // Apply resource changes from decision
      if (result.resourceChanges && Object.keys(result.resourceChanges).length > 0) {
        const changes = Object.entries(result.resourceChanges).map(([resource, change]) => 
          `${change > 0 ? '+' : ''}${change} ${resource}`
        ).join(', ');
        setTimeout(() => showGameNotification(`Resources: ${changes}`), 1000);
      }
    }
  };

  // Handle game pause/resume
  useEffect(() => {
    if (!game) return;
    
    if (paused) {
      game.pause();
    } else {
      game.resume();
    }
  }, [paused, game]);
  
  // Add keyboard shortcuts for game controls
  useEffect(() => {
    if (!game) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only apply shortcuts when game is running
      if (paused) return;
      
      switch(e.key.toLowerCase()) {
        case 'q':
          console.log('Q pressed - Entangle particles');
          game.triggerEntanglement?.();
          break;
        case 'w':
          console.log('W pressed - Collapse wave');
          game.triggerWaveCollapse?.();
          break;
        case 'e':
          console.log('E pressed - Boost energy');
          game.triggerEnergyBoost?.();
          break;
        case ' ':
          console.log('Space pressed - Toggle pause');
          togglePause();
          break;
        case 'c':
          console.log('C pressed - Start random challenge');
          startRandomChallenge();
          break;
        // Mode selection shortcuts
        case '1':
          console.log('1 pressed - Create mode');
          handleModeChange('create');
          break;
        case '2':
          console.log('2 pressed - Gravity well mode');
          handleModeChange('gravity');
          break;
        case '3':
          console.log('3 pressed - Stream mode');
          handleModeChange('stream');
          break;
        case '4':
          console.log('4 pressed - Fusion mode');
          handleModeChange('fusion');
          break;
        case '5':
          console.log('5 pressed - Explore mode');
          handleModeChange('explore');
          break;
        case 'm':
          console.log('M pressed - Toggle mode panel');
          setShowModePanel(prev => !prev);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [game, paused]);
  
  // Function to handle mode changes
  const handleModeChange = (mode: GameMode) => {
    setCurrentMode(mode);
    showGameNotification(`Mode changed to: ${mode}`);
    
    // Update game mode if the method exists
    if (game && game.setInteractionMode) {
      game.setInteractionMode(mode);
    }
  };

  const togglePause = () => setPaused(!paused);
  
  const closeTutorial = () => {
    console.log("Closing tutorial");
    setShowTutorial(false);
    
    // Start a random challenge after the tutorial closes
    if (game) {
      setTimeout(() => {
        startRandomChallenge();
      }, 5000);
    }
  };
  
  const resetGame = () => {
    if (game) {
      game.reset();
      setLevel(1);
      setComboMultiplier(1);
      setActiveChallenges([]);
      
      // Reset achievements but keep the reference
      setAchievements(prev => {
        const reset = prev.map(a => ({...a, isUnlocked: false, progress: 0}));
        return reset;
      });
    }
  };
  
  const startRandomChallenge = () => {
    // Temporarily showing fixed notification until we implement actual challenges
    showGameNotification("New Challenge: Gather 50 energy points!");
  };

  // Handler for Big Bang trigger
  const handleTriggerBigBang = () => {
    // Simple placeholder for the big bang trigger
    if (energy >= 100) {
      showGameNotification("The Big Bang has been triggered! The universe begins to expand...");
      // Update phase if we implement this feature
      setCurrentPhase(1);
      // Update the phases list to show the Big Bang phase as unlocked
      setUniversePhases(prevPhases => 
        prevPhases.map(phase => 
          phase.id === 1 ? {...phase, unlocked: true} : phase
        )
      );
      return true;
    } else {
      showGameNotification("Not enough energy to trigger the Big Bang. Keep gathering energy!");
      return false;
    }
  };

  return (
    <div className="game-container" ref={containerRef}>
      <canvas 
        ref={canvasRef} 
        className="game-canvas"
        tabIndex={0} 
      />
      
      <GameUI 
        score={score}
        energy={energy}
        plantCount={plantCount}
        isPaused={paused}
        onPauseToggle={togglePause}
        onReset={resetGame}
        onShowTutorial={() => setShowTutorial(true)}
        onToggleSpaceUI={() => setShowSpaceUI(!showSpaceUI)}
        onToggleVoiceControl={() => {
          setVoiceControlEnabled(!voiceControlEnabled);
          if (advancedInput) {
            if (!voiceControlEnabled) {
              advancedInput.enableVoiceControl();
            } else {
              advancedInput.disableVoiceControl();
            }
          }
        }}
        level={level}
        comboMultiplier={comboMultiplier}
        achievements={achievements}
        activeChallenges={activeChallenges}
      />
      
      {/* Cosmic Evolution Panel */}
      {universePhases && universePhases.length > 0 && (
        <CosmicEvolutionPanel
          currentPhase={currentPhase}
          phases={universePhases}
          elements={cosmicElements || []}
          cosmicAge={cosmicAge}
          expansionRate={expansionRate}
          matterDensity={matterDensity}
          energyDensity={energyDensity}
          onTriggerBigBang={currentPhase === 0 ? handleTriggerBigBang : undefined}
        />
      )}
      
      {/* Mode Selection Panel */}
      <ModeSelectionPanel
        visible={showModePanel}
        currentMode={currentMode}
        onSelectMode={handleModeChange}
        onClose={() => setShowModePanel(false)}
      />

      {/* Space Exploration UI */}
      {spaceScanner && atmosphericEntry && spaceNavigator && (
        <SpaceExplorationUI
          scanner={spaceScanner}
          atmosphericEntry={atmosphericEntry}
          navigator={spaceNavigator}
          isVisible={showSpaceUI}
        />
      )}

      {/* Strategic Decision Panel */}
      <StrategicDecisionPanel
        strategicEngine={strategicEngine}
        isVisible={showStrategicDecisions}
        onDecisionMade={handleStrategicDecision}
      />

      {showTutorial && (
        <Tutorial onClose={closeTutorial} />
      )}
      
      {showNotification && (
        <div className="fixed top-1/3 left-0 right-0 flex justify-center items-center z-50 pointer-events-none">
          <div className="bg-purple-900/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg shadow-purple-500/30 animate-float border border-purple-500/50">
            {notificationMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
