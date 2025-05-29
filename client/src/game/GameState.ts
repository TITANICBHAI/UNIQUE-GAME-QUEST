export type UniversePhase = {
  id: number;
  name: string;
  description: string;
  requiredEnergy: number;
  unlocked: boolean;
};

export type CosmicElement = {
  id: string;
  name: string;
  description: string;
  discovered: boolean;
  requiredPhase: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  progress: number;
  target: number;
};

export type Challenge = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  timeRemaining?: number; // Optional timer for timed challenges
  progress: number;
  target: number;
  rewardPoints: number;
};

export class GameState {
  private score: number = 0;
  private energy: number = 100;
  private maxEnergy: number = 100;
  private regenerationRate: number = 5; // Energy per second
  private level: number = 1;
  private plantCount: number = 0;
  private totalParticlesCreated: number = 0;
  private consecutiveGrowth: number = 0; // For combo tracking
  private comboMultiplier: number = 1;
  private comboTimer: number = 0;
  
  // Universe creation state
  private currentPhase: number = 0;
  private cosmicAge: number = 0; // Time since Big Bang in seconds
  private expansionRate: number = 1.0;
  private matterDensity: number = 0;
  private energyDensity: number = 1.0;
  private cosmicTemperature: number = 0; // Temperature of the universe (billions of Kelvin)
  private quantumCoherence: number = 1.0; // Measure of quantum effects (1.0 = max, 0.0 = classical)
  
  // Cosmic elements and universe phases
  private universePhases: UniversePhase[] = [
    { 
      id: 0, 
      name: "The Void", 
      description: "There is no thing. No time. No sound. Only your awareness floating in an impossible non-space of pure potential.",
      requiredEnergy: 0,
      unlocked: true
    },
    { 
      id: 1, 
      name: "Quantum Foam", 
      description: "Subtle vibrations in nothingness. Fluctuations of probability ripple through the void as reality begins to contemplate itself.",
      requiredEnergy: 100,
      unlocked: false
    },
    { 
      id: 2, 
      name: "The Big Bang", 
      description: "A primordial singularity ignites. From one point emerges everything—space, time, and energy in a blinding flash of creation.",
      requiredEnergy: 300,
      unlocked: false
    },
    { 
      id: 3, 
      name: "Inflation Era", 
      description: "The cosmos expands at incomprehensible speed, stretching quantum fluctuations into the seeds of all future structure.",
      requiredEnergy: 600,
      unlocked: false
    },
    { 
      id: 4, 
      name: "Particle Formation", 
      description: "As the universe cools, symmetry breaks. Pure energy condenses into the first fundamental particles of matter and force.",
      requiredEnergy: 1200,
      unlocked: false
    },
    { 
      id: 5, 
      name: "Nucleosynthesis", 
      description: "Protons and neutrons form, fusing into the first atomic nuclei. The universe is a sea of hydrogen and helium plasma.",
      requiredEnergy: 2000,
      unlocked: false
    },
    { 
      id: 6, 
      name: "Cosmic Structure", 
      description: "Gravity sculpts the universe into vast filaments and voids. The first stars ignite, illuminating the cosmos for the first time.",
      requiredEnergy: 3000,
      unlocked: false
    },
    { 
      id: 7, 
      name: "Stellar Alchemy", 
      description: "Within stellar furnaces, hydrogen fuses into heavier elements. When stars die, they seed space with the building blocks of planets.",
      requiredEnergy: 4000,
      unlocked: false
    },
    { 
      id: 8, 
      name: "Planetary Formation", 
      description: "Around new stars, discs of dust and gas condense into worlds of rock, gas, and ice—each a unique laboratory of chemistry.",
      requiredEnergy: 5000,
      unlocked: false
    },
    { 
      id: 9, 
      name: "Earth Emerges", 
      description: "A blue world forms in the habitable zone, with liquid water oceans and a protective atmosphere. A cosmic oasis is born.",
      requiredEnergy: 6000,
      unlocked: false
    },
    { 
      id: 10, 
      name: "Chemical Evolution", 
      description: "In primordial seas and near volcanic vents, complex organic molecules form and interact in increasingly ordered ways.",
      requiredEnergy: 7000,
      unlocked: false
    },
    { 
      id: 11, 
      name: "Life's Dawn", 
      description: "The first self-replicating entities emerge—not yet alive as we understand it, but no longer merely chemical. The boundary blurs.",
      requiredEnergy: 8000,
      unlocked: false
    },
    { 
      id: 12, 
      name: "Conscious Cosmos", 
      description: "After billions of years, matter evolves the ability to contemplate itself. The universe awakens to its own existence through you.",
      requiredEnergy: 10000,
      unlocked: false
    }
  ];
  
  private cosmicElements: CosmicElement[] = [
    // The Void - Phase 0
    { id: "awareness", name: "Awareness", description: "The first observer - you, as pure potential", discovered: true, requiredPhase: 0 },
    { id: "symmetry", name: "Perfect Symmetry", description: "Balance of all possible forces before reality", discovered: true, requiredPhase: 0 },
    { id: "quantum_potential", name: "Quantum Potential", description: "The field of all possibilities before collapse into reality", discovered: true, requiredPhase: 0 },
    
    // Quantum Foam - Phase 1
    { id: "quantum_foam", name: "Quantum Foam", description: "Microscopic fluctuations of spacetime at the quantum level", discovered: false, requiredPhase: 1 },
    { id: "vacuum_energy", name: "Vacuum Energy", description: "Probabilistic energy arising from nothing", discovered: false, requiredPhase: 1 },
    { id: "virtual_particles", name: "Virtual Particles", description: "Ephemeral particles that pop in and out of existence", discovered: false, requiredPhase: 1 },
    { id: "uncertainty", name: "Uncertainty Principle", description: "Fundamental limit to precision in quantum systems", discovered: false, requiredPhase: 1 },
    
    // Big Bang - Phase 2
    { id: "space_time", name: "Space-Time", description: "The unified fabric of reality itself", discovered: false, requiredPhase: 2 },
    { id: "singularity", name: "Cosmic Singularity", description: "The infinitely dense point from which everything emerged", discovered: false, requiredPhase: 2 },
    { id: "primal_energy", name: "Primal Energy", description: "The raw power that fueled creation", discovered: false, requiredPhase: 2 },
    { id: "creation_event", name: "Creation Event", description: "The primordial moment that initiated existence itself", discovered: false, requiredPhase: 2 },
    { id: "initial_conditions", name: "Initial Conditions", description: "The precise parameters that allowed our universe to form", discovered: false, requiredPhase: 2 },
    
    // Inflation Era - Phase 3
    { id: "inflation_field", name: "Inflation Field", description: "The driving force of exponential cosmic expansion", discovered: false, requiredPhase: 3 },
    { id: "quantum_fluctuations", name: "Quantum Fluctuations", description: "Tiny variations that become the seeds of galaxies", discovered: false, requiredPhase: 3 },
    { id: "cosmic_horizon", name: "Cosmic Horizon", description: "The boundary of the observable universe", discovered: false, requiredPhase: 3 },
    { id: "multiverse_theory", name: "Multiverse Theory", description: "The concept that our universe may be one of many", discovered: false, requiredPhase: 3 },
    { id: "cosmic_strings", name: "Cosmic Strings", description: "Theoretical 1-dimensional defects in spacetime fabric", discovered: false, requiredPhase: 3 },
    
    // Particle Formation - Phase 4
    { id: "quark", name: "Quark", description: "Fundamental particles that form protons and neutrons", discovered: false, requiredPhase: 4 },
    { id: "electron", name: "Electron", description: "Lightweight charged particles that orbit atomic nuclei", discovered: false, requiredPhase: 4 },
    { id: "photon", name: "Photon", description: "Particle of light, the carrier of electromagnetic force", discovered: false, requiredPhase: 4 },
    { id: "symmetry_breaking", name: "Symmetry Breaking", description: "The process that separated the four fundamental forces", discovered: false, requiredPhase: 4 },
    
    // Nucleosynthesis - Phase 5
    { id: "hydrogen", name: "Hydrogen", description: "The first and simplest element", discovered: false, requiredPhase: 5 },
    { id: "helium", name: "Helium", description: "The second element, formed in the early universe", discovered: false, requiredPhase: 5 },
    { id: "deuterium", name: "Deuterium", description: "Heavy hydrogen isotope essential for stellar fusion", discovered: false, requiredPhase: 5 },
    
    // Cosmic Structure - Phase 6
    { id: "dark_matter", name: "Dark Matter", description: "Invisible scaffolding that shapes cosmic structure", discovered: false, requiredPhase: 6 },
    { id: "galaxy", name: "Galaxy", description: "Vast collections of stars, gas, and dark matter", discovered: false, requiredPhase: 6 },
    { id: "star", name: "Star", description: "Massive balls of gas undergoing nuclear fusion", discovered: false, requiredPhase: 6 },
    { id: "nebula", name: "Nebula", description: "Cosmic clouds of gas and dust where stars are born", discovered: false, requiredPhase: 6 },
    
    // Stellar Alchemy - Phase 7
    { id: "carbon", name: "Carbon", description: "Element forged in stars, essential for life", discovered: false, requiredPhase: 7 },
    { id: "oxygen", name: "Oxygen", description: "Element created in stellar cores, vital for respiration", discovered: false, requiredPhase: 7 },
    { id: "iron", name: "Iron", description: "Element formed in supernovas, the most stable nucleus", discovered: false, requiredPhase: 7 },
    { id: "supernova", name: "Supernova", description: "Explosive death of stars that seeds the cosmos with heavy elements", discovered: false, requiredPhase: 7 },
    
    // Planetary Formation - Phase 8
    { id: "planet", name: "Planet", description: "Large body orbiting a star, formed from cosmic dust", discovered: false, requiredPhase: 8 },
    { id: "asteroid", name: "Asteroid", description: "Rocky remnants of planetary formation", discovered: false, requiredPhase: 8 },
    { id: "comet", name: "Comet", description: "Icy bodies that deliver water to forming planets", discovered: false, requiredPhase: 8 },
    { id: "planetary_system", name: "Planetary System", description: "A star with its orbiting worlds and debris", discovered: false, requiredPhase: 8 },
    { id: "accretion_disk", name: "Accretion Disk", description: "Rotating disk of matter that forms planets around stars", discovered: false, requiredPhase: 8 },
    { id: "protoplanet", name: "Protoplanet", description: "An embryonic planet still gathering mass", discovered: false, requiredPhase: 8 },
    { id: "gas_giant", name: "Gas Giant", description: "Massive planet composed primarily of hydrogen and helium", discovered: false, requiredPhase: 8 },
    { id: "terrestrial_planet", name: "Terrestrial Planet", description: "Rocky planet with solid surface like Earth", discovered: false, requiredPhase: 8 },
    
    // Earth Emerges - Phase 9
    { id: "earth", name: "Earth", description: "A habitable planet in the Goldilocks zone", discovered: false, requiredPhase: 9 },
    { id: "water", name: "Water", description: "Essential compound for life as we know it", discovered: false, requiredPhase: 9 },
    { id: "atmosphere", name: "Atmosphere", description: "Protective gaseous layer around a planet", discovered: false, requiredPhase: 9 },
    { id: "tectonic_plates", name: "Tectonic Plates", description: "Moving crustal sections that reshape the planet", discovered: false, requiredPhase: 9 },
    { id: "magnetic_field", name: "Magnetic Field", description: "Earth's protective shield against solar radiation", discovered: false, requiredPhase: 9 },
    { id: "moon_formation", name: "Moon Formation", description: "Creation of Earth's satellite from a cosmic collision", discovered: false, requiredPhase: 9 },
    { id: "volcanoes", name: "Volcanoes", description: "Conduits delivering interior materials to the surface", discovered: false, requiredPhase: 9 },
    { id: "planetary_differentiation", name: "Planetary Differentiation", description: "Process forming Earth's core, mantle and crust", discovered: false, requiredPhase: 9 },
    
    // Chemical Evolution - Phase 10
    { id: "amino_acid", name: "Amino Acid", description: "Building blocks of proteins", discovered: false, requiredPhase: 10 },
    { id: "nucleotide", name: "Nucleotide", description: "Building blocks of DNA and RNA", discovered: false, requiredPhase: 10 },
    { id: "lipid", name: "Lipid", description: "Molecules that form cell membranes", discovered: false, requiredPhase: 10 },
    { id: "organic_compound", name: "Organic Compound", description: "Carbon-based molecules that form the basis of life", discovered: false, requiredPhase: 10 },
    { id: "protein", name: "Protein", description: "Complex molecules performing cellular functions", discovered: false, requiredPhase: 10 },
    { id: "hydrothermal_vent", name: "Hydrothermal Vent", description: "Underwater hot springs providing energy for early chemistry", discovered: false, requiredPhase: 10 },
    { id: "phospholipid_bilayer", name: "Phospholipid Bilayer", description: "Self-assembling structures forming proto-cell boundaries", discovered: false, requiredPhase: 10 },
    { id: "primordial_soup", name: "Primordial Soup", description: "Early Earth's oceans rich with organic compounds", discovered: false, requiredPhase: 10 },
    
    // Life's Dawn - Phase 11
    { id: "rna", name: "RNA", description: "Self-replicating molecule, precursor to life", discovered: false, requiredPhase: 11 },
    { id: "protocell", name: "Protocell", description: "Primitive cell-like structures with basic functions", discovered: false, requiredPhase: 11 },
    { id: "cell_membrane", name: "Cell Membrane", description: "Protective barrier defining the first proto-cells", discovered: false, requiredPhase: 11 },
    { id: "replication", name: "Self-Replication", description: "The fundamental process of creating copies", discovered: false, requiredPhase: 11 },
    { id: "rna_world", name: "RNA World", description: "Theory that RNA preceded DNA as the genetic material", discovered: false, requiredPhase: 11 },
    { id: "metabolism", name: "Metabolism", description: "Chemical processes extracting energy from environment", discovered: false, requiredPhase: 11 },
    { id: "dna", name: "DNA", description: "Double-helix molecule encoding genetic information", discovered: false, requiredPhase: 11 },
    { id: "stromatolite", name: "Stromatolite", description: "Layered microbial mats forming Earth's earliest fossils", discovered: false, requiredPhase: 11 },
    { id: "cyanobacteria", name: "Cyanobacteria", description: "Early microbes that produced oxygen through photosynthesis", discovered: false, requiredPhase: 11 },
    
    // Conscious Cosmos - Phase 12
    { id: "neuron", name: "Neuron", description: "The basic cell of consciousness and thought", discovered: false, requiredPhase: 12 },
    { id: "consciousness", name: "Consciousness", description: "The universe becoming aware of itself", discovered: false, requiredPhase: 12 },
    { id: "recursion", name: "Recursive Thought", description: "The ability to think about thinking, creating infinite loops", discovered: false, requiredPhase: 12 },
    { id: "simulation", name: "Universe Simulation", description: "The universe simulating itself within itself", discovered: false, requiredPhase: 12 },
    { id: "panpsychism", name: "Panpsychism", description: "Theory that consciousness is fundamental to all matter", discovered: false, requiredPhase: 12 },
    { id: "emergent_complexity", name: "Emergent Complexity", description: "Higher order patterns arising from simpler interactions", discovered: false, requiredPhase: 12 },
    { id: "neural_network", name: "Neural Network", description: "Interconnected neurons that process information", discovered: false, requiredPhase: 12 },
    { id: "self_awareness", name: "Self-Awareness", description: "The ability to recognize oneself as distinct from environment", discovered: false, requiredPhase: 12 },
    { id: "cosmic_mind", name: "Cosmic Mind", description: "Philosophical concept that the universe itself may be conscious", discovered: false, requiredPhase: 12 }
  ];
  
  // Game progression elements
  private achievements: Achievement[] = [
    {
      id: 'big_bang',
      name: 'Let There Be Light',
      description: 'Trigger the Big Bang and start universal expansion',
      isUnlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'particle_creator',
      name: 'Particle Creator',
      description: 'Create 100 quantum particles',
      isUnlocked: false,
      progress: 0,
      target: 100
    },
    {
      id: 'matter_maker',
      name: 'Matter Maker',
      description: 'Form stable matter from energy',
      isUnlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'cosmic_architect',
      name: 'Cosmic Architect',
      description: 'Reach the Cosmic Structure phase',
      isUnlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'element_collector',
      name: 'Element Collector',
      description: 'Discover all cosmic elements',
      isUnlocked: false,
      progress: 0,
      target: this.cosmicElements.length
    }
  ];
  
  private onUniversePhaseChanged: ((phase: UniversePhase) => void) | null = null;
  private onCosmicElementDiscovered: ((element: CosmicElement) => void) | null = null;
  
  private activeChallenges: Challenge[] = [];
  
  private availableChallenges: Challenge[] = [
    {
      id: 'quick_growth',
      name: 'Quick Growth',
      description: 'Grow 3 plants in 30 seconds',
      isActive: false,
      isCompleted: false,
      timeRemaining: 30,
      progress: 0,
      target: 3,
      rewardPoints: 200
    },
    {
      id: 'entanglement_chain',
      name: 'Entanglement Chain',
      description: 'Entangle 10 particles in a row',
      isActive: false,
      isCompleted: false,
      progress: 0,
      target: 10,
      rewardPoints: 150
    },
    {
      id: 'energy_efficient',
      name: 'Energy Efficient',
      description: 'Create 5 plants while keeping energy above 70%',
      isActive: false,
      isCompleted: false,
      progress: 0,
      target: 5,
      rewardPoints: 250
    }
  ];
  
  private onAchievementUnlocked: ((achievement: Achievement) => void) | null = null;
  private onChallengeCompleted: ((challenge: Challenge) => void) | null = null;
  private onLevelUp: ((level: number) => void) | null = null;
  
  constructor() {}
  
  getScore(): number {
    return this.score;
  }
  
  getEnergy(): number {
    return (this.energy / this.maxEnergy) * 100; // Return as percentage
  }
  
  getLevel(): number {
    return this.level;
  }
  
  getComboMultiplier(): number {
    return this.comboMultiplier;
  }
  
  getAchievements(): Achievement[] {
    return this.achievements;
  }
  
  getActiveChallenges(): Challenge[] {
    return this.activeChallenges;
  }
  
  setCallbacks(
    onAchievementUnlocked: (achievement: Achievement) => void,
    onChallengeCompleted: (challenge: Challenge) => void,
    onLevelUp: (level: number) => void,
    onUniversePhaseChanged?: (phase: UniversePhase) => void,
    onCosmicElementDiscovered?: (element: CosmicElement) => void
  ) {
    this.onAchievementUnlocked = onAchievementUnlocked;
    this.onChallengeCompleted = onChallengeCompleted;
    this.onLevelUp = onLevelUp;
    
    if (onUniversePhaseChanged) {
      this.onUniversePhaseChanged = onUniversePhaseChanged;
    }
    
    if (onCosmicElementDiscovered) {
      this.onCosmicElementDiscovered = onCosmicElementDiscovered;
    }
  }
  
  // Universe methods
  getCurrentPhase(): number {
    return this.currentPhase;
  }
  
  getUniversePhase(): UniversePhase {
    return this.universePhases[this.currentPhase];
  }
  
  getAllPhases(): UniversePhase[] {
    return this.universePhases;
  }
  
  getCosmicElements(): CosmicElement[] {
    // Only return elements that should be visible in current phase
    if (!this.cosmicElements) return [];
    return this.cosmicElements.filter(e => e.requiredPhase <= this.currentPhase);
  }
  
  getDiscoveredElements(): CosmicElement[] {
    if (!this.cosmicElements) return [];
    return this.cosmicElements.filter(e => e.discovered);
  }
  
  getCosmicAge(): number {
    return this.cosmicAge;
  }
  
  // Universe progression
  advancePhase(): boolean {
    const nextPhaseId = this.currentPhase + 1;
    
    // Check if we have a next phase
    if (nextPhaseId >= this.universePhases.length) {
      return false;
    }
    
    const nextPhase = this.universePhases[nextPhaseId];
    
    // Check if we have enough energy to advance
    if (this.score < nextPhase.requiredEnergy) {
      return false;
    }
    
    // Advance to next phase
    this.currentPhase = nextPhaseId;
    nextPhase.unlocked = true;
    
    // Unlock cosmic elements for this phase
    this.cosmicElements
      .filter(e => e.requiredPhase === nextPhaseId && !e.discovered)
      .forEach(element => this.discoverElement(element.id));
    
    // Update achievements
    if (nextPhaseId === 1) {
      // Big Bang achievement
      this.updateAchievement('big_bang', 1);
    }
    
    if (nextPhaseId === 3) {
      // Matter formation
      this.updateAchievement('matter_maker', 1);
    }
    
    if (nextPhaseId === 5) {
      // Cosmic structure
      this.updateAchievement('cosmic_architect', 1);
    }
    
    // Notify about phase change
    if (this.onUniversePhaseChanged) {
      this.onUniversePhaseChanged(nextPhase);
    }
    
    // Give bonus energy for advancing phases
    this.energy = this.maxEnergy;
    
    return true;
  }
  
  updateCosmos(deltaTime: number) {
    // Quantum fluctuations even in the void
    if (this.currentPhase === 0) {
      // Subtle probability waves in the void
      this.expansionRate = 0.0;
      this.energyDensity = 0.01 + Math.sin(this.cosmicAge * 0.1) * 0.01;
      this.matterDensity = 0.0;
    } 
    else if (this.currentPhase === 1) {
      // Quantum foam - increasing fluctuations
      this.cosmicAge += deltaTime * 0.5;
      this.expansionRate = 0.2 + Math.sin(this.cosmicAge) * 0.2;
      this.energyDensity = 0.1 + Math.sin(this.cosmicAge * 0.5) * 0.05;
      this.matterDensity = 0.0;
    }
    // Regular cosmos progress after Big Bang
    else if (this.currentPhase >= 2) {
      this.cosmicAge += deltaTime;
      
      // Different phase-specific effects based on cosmic age
      switch (this.currentPhase) {
        case 2: // Big Bang
          // Explosive birth of the universe
          this.expansionRate = 20.0;
          this.energyDensity = 0.95;
          this.matterDensity = 0.05;
          break;
        
        case 3: // Inflation Era
          // Extremely rapid expansion
          this.expansionRate = 200.0;
          this.energyDensity = 0.85;
          this.matterDensity = 0.15;
          break;
        
        case 4: // Particle Formation
          // Expansion slows, energy converts to particles
          this.expansionRate = 8.0;
          this.energyDensity = 0.7;
          this.matterDensity = 0.3;
          break;
        
        case 5: // Nucleosynthesis
          // Expansion continues to slow, atoms form
          this.expansionRate = 3.0;
          this.energyDensity = 0.5;
          this.matterDensity = 0.5;
          break;
        
        case 6: // Cosmic Structure
          // Large structures form, matter dominates
          this.expansionRate = 1.5;
          this.energyDensity = 0.35;
          this.matterDensity = 0.65;
          break;
          
        case 7: // Stellar Alchemy
          // Stars burn and evolve
          this.expansionRate = 1.0;
          this.energyDensity = 0.3;
          this.matterDensity = 0.7;
          break;
          
        case 8: // Planetary Formation
          // Solar systems emerge
          this.expansionRate = 0.7;
          this.energyDensity = 0.25;
          this.matterDensity = 0.75;
          break;
          
        case 9: // Earth Emerges
          // Focus on a specific planet
          this.expansionRate = 0.5;
          this.energyDensity = 0.2;
          this.matterDensity = 0.8;
          break;
          
        case 10: // Chemical Evolution
          // Complex molecules form
          this.expansionRate = 0.3;
          this.energyDensity = 0.15;
          this.matterDensity = 0.85;
          break;
          
        case 11: // Life's Dawn
          // Proto-life emerges
          this.expansionRate = 0.2;
          this.energyDensity = 0.1;
          this.matterDensity = 0.9;
          break;
          
        case 12: // Conscious Cosmos
          // Consciousness emerges
          this.expansionRate = 0.1;
          this.energyDensity = 0.05;
          this.matterDensity = 0.95;
          break;
      }
    }
    
    // Auto-discover elements based on current phase and time thresholds
    // The Void - Phase 0
    // Elements are already discovered by default
    
    // Quantum Foam - Phase 1
    if (this.currentPhase >= 1) {
      this.discoverElement('quantum_foam');
      
      if (this.cosmicAge > 8) {
        this.discoverElement('vacuum_energy');
      }
      
      if (this.cosmicAge > 15) {
        this.discoverElement('virtual_particles');
        this.discoverElement('uncertainty');
      }
    }
    
    // Big Bang - Phase 2
    if (this.currentPhase >= 2) {
      this.discoverElement('space_time');
      
      if (this.cosmicAge > 5) {
        this.discoverElement('singularity');
        this.discoverElement('creation_event');
      }
      
      if (this.cosmicAge > 10) {
        this.discoverElement('primal_energy');
        this.discoverElement('initial_conditions');
      }
    }
    
    // Inflation Era - Phase 3
    if (this.currentPhase >= 3) {
      this.discoverElement('inflation_field');
      
      if (this.cosmicAge > 20) {
        this.discoverElement('quantum_fluctuations');
        this.discoverElement('multiverse_theory');
      }
      
      if (this.cosmicAge > 30) {
        this.discoverElement('cosmic_horizon');
        this.discoverElement('cosmic_strings');
      }
    }
    
    // Particle Formation - Phase 4
    if (this.currentPhase >= 4) {
      this.discoverElement('quark');
      
      if (this.cosmicAge > 40) {
        this.discoverElement('electron');
        this.discoverElement('photon');
      }
      
      if (this.cosmicAge > 50) {
        this.discoverElement('symmetry_breaking');
      }
    }
    
    // Nucleosynthesis - Phase 5
    if (this.currentPhase >= 5) {
      this.discoverElement('hydrogen');
      
      if (this.cosmicAge > 60) {
        this.discoverElement('helium');
      }
      
      if (this.cosmicAge > 70) {
        this.discoverElement('deuterium');
      }
    }
    
    // Cosmic Structure - Phase 6
    if (this.currentPhase >= 6) {
      this.discoverElement('dark_matter');
      
      if (this.cosmicAge > 80) {
        this.discoverElement('galaxy');
      }
      
      if (this.cosmicAge > 90) {
        this.discoverElement('star');
        this.discoverElement('nebula');
      }
    }
    
    // Stellar Alchemy - Phase 7
    if (this.currentPhase >= 7) {
      this.discoverElement('carbon');
      
      if (this.cosmicAge > 100) {
        this.discoverElement('oxygen');
      }
      
      if (this.cosmicAge > 110) {
        this.discoverElement('iron');
        this.discoverElement('supernova');
      }
    }
    
    // Planetary Formation - Phase 8
    if (this.currentPhase >= 8) {
      this.discoverElement('planet');
      this.discoverElement('accretion_disk');
      
      if (this.cosmicAge > 115) {
        this.discoverElement('protoplanet');
      }
      
      if (this.cosmicAge > 120) {
        this.discoverElement('asteroid');
        this.discoverElement('comet');
      }
      
      if (this.cosmicAge > 125) {
        this.discoverElement('gas_giant');
      }
      
      if (this.cosmicAge > 130) {
        this.discoverElement('planetary_system');
        this.discoverElement('terrestrial_planet');
      }
    }
    
    // Earth Emerges - Phase 9
    if (this.currentPhase >= 9) {
      this.discoverElement('earth');
      this.discoverElement('magnetic_field');
      
      if (this.cosmicAge > 140) {
        this.discoverElement('water');
        this.discoverElement('moon_formation');
      }
      
      if (this.cosmicAge > 145) {
        this.discoverElement('volcanoes');
      }
      
      if (this.cosmicAge > 150) {
        this.discoverElement('atmosphere');
        this.discoverElement('tectonic_plates');
        this.discoverElement('planetary_differentiation');
      }
    }
    
    // Chemical Evolution - Phase 10
    if (this.currentPhase >= 10) {
      this.discoverElement('amino_acid');
      this.discoverElement('primordial_soup');
      
      if (this.cosmicAge > 160) {
        this.discoverElement('nucleotide');
        this.discoverElement('hydrothermal_vent');
      }
      
      if (this.cosmicAge > 165) {
        this.discoverElement('phospholipid_bilayer');
      }
      
      if (this.cosmicAge > 170) {
        this.discoverElement('lipid');
        this.discoverElement('organic_compound');
        this.discoverElement('protein');
      }
    }
    
    // Life's Dawn - Phase 11
    if (this.currentPhase >= 11) {
      this.discoverElement('rna');
      this.discoverElement('rna_world');
      
      if (this.cosmicAge > 180) {
        this.discoverElement('protocell');
        this.discoverElement('metabolism');
      }
      
      if (this.cosmicAge > 185) {
        this.discoverElement('dna');
      }
      
      if (this.cosmicAge > 190) {
        this.discoverElement('cell_membrane');
        this.discoverElement('replication');
        this.discoverElement('stromatolite');
      }
      
      if (this.cosmicAge > 195) {
        this.discoverElement('cyanobacteria');
      }
    }
    
    // Conscious Cosmos - Phase 12
    if (this.currentPhase >= 12) {
      this.discoverElement('neuron');
      this.discoverElement('neural_network');
      
      if (this.cosmicAge > 200) {
        this.discoverElement('consciousness');
        this.discoverElement('self_awareness');
      }
      
      if (this.cosmicAge > 205) {
        this.discoverElement('panpsychism');
      }
      
      if (this.cosmicAge > 210) {
        this.discoverElement('recursion');
        this.discoverElement('simulation');
        this.discoverElement('emergent_complexity');
      }
      
      if (this.cosmicAge > 215) {
        this.discoverElement('cosmic_mind');
      }
    }
    
    // Auto-advance phases based on cosmic age and sufficient score
    // This creates a sense of natural progression through universe history
    const timeThresholds = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195];
    const nextPhaseId = this.currentPhase + 1;
    
    if (nextPhaseId < this.universePhases.length && 
        (this.cosmicAge > timeThresholds[nextPhaseId] || (this.currentPhase <= 1 && this.score >= this.universePhases[nextPhaseId].requiredEnergy)) &&
        this.score >= this.universePhases[nextPhaseId].requiredEnergy) {
      this.advancePhase();
    }
  }
  
  discoverElement(elementId: string): boolean {
    const element = this.cosmicElements.find(e => e.id === elementId);
    
    if (!element || element.discovered) {
      return false;
    }
    
    // Make sure we're in the right phase
    if (element.requiredPhase > this.currentPhase) {
      return false;
    }
    
    // Discover the element
    element.discovered = true;
    
    // Check if all elements are discovered
    const allDiscovered = this.cosmicElements.every(e => e.discovered);
    if (allDiscovered) {
      this.updateAchievement('element_collector', this.cosmicElements.length);
    } else {
      this.updateAchievement('element_collector', this.getDiscoveredElements().length);
    }
    
    // Notify about discovery
    if (this.onCosmicElementDiscovered) {
      this.onCosmicElementDiscovered(element);
    }
    
    // Grant bonus points for discoveries
    this.score += 100;
    
    return true;
  }
  
  getExpansionRate(): number {
    return this.expansionRate;
  }
  
  getMatterDensity(): number {
    return this.matterDensity;
  }
  
  getEnergyDensity(): number {
    return this.energyDensity;
  }
  
  getCosmicTemperature(): number {
    return this.cosmicTemperature;
  }
  
  getQuantumCoherence(): number {
    return this.quantumCoherence;
  }
  
  attemptBigBang(): boolean {
    // Only allow Big Bang from The Void or Quantum Foam phase
    if (this.currentPhase > 1) {
      return false;
    }
    
    // Need at least 50 energy to trigger Big Bang
    if (this.energy < 50) {
      return false;
    }
    
    // Consume energy
    this.energy -= 50;
    
    // Add score
    this.score += 300;
    
    // If already in Quantum Foam, advance to Big Bang (phase 2)
    if (this.currentPhase === 1) {
      return this.advancePhase();
    }
    
    // If in Void phase, skip directly to Big Bang (phase 2)
    this.currentPhase = 1; // First advance to Quantum Foam
    this.universePhases[1].unlocked = true;
    
    // Discover quantum foam elements
    this.discoverElement('quantum_foam');
    this.discoverElement('vacuum_energy');
    
    // Then immediately advance to Big Bang
    setTimeout(() => {
      this.advancePhase();
    }, 1500);
    
    return true;
  }
  
  addScore(points: number) {
    // Apply combo multiplier to score
    const adjustedPoints = Math.round(points * this.comboMultiplier);
    this.score += adjustedPoints;
    
    // Update achievement progress
    this.updateAchievement('quantum_master', this.score);
    
    // Check for level up (every 500 points)
    const newLevel = Math.floor(this.score / 500) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      // Give energy bonus on level up
      this.maxEnergy += 10;
      this.energy = this.maxEnergy;
      
      if (this.onLevelUp) {
        this.onLevelUp(this.level);
      }
    }
    
    return adjustedPoints; // Return the actual points added with multiplier
  }
  
  useEnergy(amount: number): boolean {
    if (this.energy >= amount) {
      this.energy -= amount;
      
      // Check energy-related challenges
      this.updateChallenges();
      
      return true;
    }
    return false;
  }
  
  regenerateEnergy(deltaTime: number) {
    // Energy regeneration increases slightly with level
    const levelBonus = (this.level - 1) * 0.5;
    const actualRegenRate = this.regenerationRate + levelBonus;
    
    this.energy = Math.min(this.maxEnergy, this.energy + actualRegenRate * deltaTime);
    
    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= deltaTime;
      if (this.comboTimer <= 0) {
        this.comboMultiplier = 1;
        this.consecutiveGrowth = 0;
      }
    }
    
    // Update timed challenges
    this.updateTimedChallenges(deltaTime);
  }
  
  // Called when a plant is created
  registerPlantGrowth() {
    this.plantCount++;
    
    // Update achievement progress
    this.updateAchievement('first_plant', this.plantCount);
    this.updateAchievement('plant_collector', this.plantCount);
    
    // Update challenge progress
    this.activeChallenges.forEach(challenge => {
      if (challenge.id === 'quick_growth') {
        challenge.progress++;
        this.checkChallengeCompletion(challenge);
      }
      
      if (challenge.id === 'energy_efficient' && this.getEnergy() > 70) {
        challenge.progress++;
        this.checkChallengeCompletion(challenge);
      }
    });
    
    // Update combo
    this.consecutiveGrowth++;
    this.comboTimer = 5; // 5 seconds to grow another plant to continue combo
    
    // Increase multiplier (max 5x)
    if (this.consecutiveGrowth >= 3) {
      this.comboMultiplier = Math.min(5, 1 + (this.consecutiveGrowth - 2) * 0.5);
    }
  }
  
  // Called when a particle is created
  registerParticleCreated() {
    this.totalParticlesCreated++;
  }
  
  // Called when particles are entangled
  registerEntanglement(count: number) {
    // Update achievement progress
    this.updateAchievement('entanglement_expert', count);
    
    // Update challenge progress
    this.activeChallenges.forEach(challenge => {
      if (challenge.id === 'entanglement_chain') {
        challenge.progress += count;
        this.checkChallengeCompletion(challenge);
      }
    });
  }
  
  startRandomChallenge() {
    // Don't start a new challenge if we already have an active one
    if (this.activeChallenges.length > 0) return null;
    
    // Filter available challenges that aren't completed
    const availableChallenges = this.availableChallenges.filter(c => !c.isCompleted && !c.isActive);
    if (availableChallenges.length === 0) return null;
    
    // Select a random challenge
    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    const challenge = availableChallenges[randomIndex];
    
    // Activate the challenge
    challenge.isActive = true;
    challenge.progress = 0;
    if (challenge.timeRemaining) {
      challenge.timeRemaining = challenge.timeRemaining; // Reset timer
    }
    
    this.activeChallenges.push(challenge);
    return challenge;
  }
  
  private updateAchievement(id: string, progress: number) {
    const achievement = this.achievements.find(a => a.id === id);
    if (achievement && !achievement.isUnlocked) {
      achievement.progress = Math.max(achievement.progress, progress);
      
      if (achievement.progress >= achievement.target) {
        achievement.isUnlocked = true;
        
        // Bonus points for unlocking an achievement
        this.score += 100;
        
        if (this.onAchievementUnlocked) {
          this.onAchievementUnlocked(achievement);
        }
      }
    }
  }
  
  private updateChallenges() {
    // Logic for updating challenges based on energy usage
  }
  
  private updateTimedChallenges(deltaTime: number) {
    this.activeChallenges.forEach(challenge => {
      if (challenge.timeRemaining !== undefined) {
        challenge.timeRemaining -= deltaTime;
        
        // Failed challenge if time runs out
        if (challenge.timeRemaining <= 0 && !challenge.isCompleted) {
          challenge.isActive = false;
          this.activeChallenges = this.activeChallenges.filter(c => c.id !== challenge.id);
        }
      }
    });
  }
  
  private checkChallengeCompletion(challenge: Challenge) {
    if (challenge.progress >= challenge.target && !challenge.isCompleted) {
      challenge.isCompleted = true;
      challenge.isActive = false;
      
      // Remove from active challenges
      this.activeChallenges = this.activeChallenges.filter(c => c.id !== challenge.id);
      
      // Award points for completing the challenge
      this.score += challenge.rewardPoints;
      
      if (this.onChallengeCompleted) {
        this.onChallengeCompleted(challenge);
      }
    }
  }
  
  reset() {
    this.score = 0;
    this.energy = this.maxEnergy;
    this.level = 1;
    this.plantCount = 0;
    this.totalParticlesCreated = 0;
    this.consecutiveGrowth = 0;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    
    // Reset achievements and challenges
    this.achievements.forEach(a => {
      a.isUnlocked = false;
      a.progress = 0;
    });
    
    this.availableChallenges.forEach(c => {
      c.isActive = false;
      c.isCompleted = false;
      c.progress = 0;
      if (c.timeRemaining !== undefined) {
        c.timeRemaining = c.timeRemaining; // Reset to original value
      }
    });
    
    this.activeChallenges = [];
  }
}
