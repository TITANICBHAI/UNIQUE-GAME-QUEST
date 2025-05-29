/**
 * TechnologyTreeSystem - Deep progression with meaningful cosmic choices
 * Every decision shapes the universe's evolution and unlocks new possibilities
 */

export interface CosmicTechnology {
  id: string;
  name: string;
  description: string;
  category: TechCategory;
  tier: number; // 1-10, representing cosmic advancement level
  prerequisites: string[]; // Required tech IDs
  exclusiveWith?: string[]; // Mutually exclusive technologies
  researchCost: ResearchRequirement;
  unlockEffects: TechEffect[];
  ongoingEffects: TechEffect[];
  cosmicImpact: CosmicImpact;
  realWorldBasis: string;
  ethicalDilemma?: EthicalChoice;
}

export type TechCategory = 
  | 'stellar_engineering' | 'quantum_manipulation' | 'spacetime_control'
  | 'information_theory' | 'consciousness_studies' | 'dark_sector_physics'
  | 'civilization_guidance' | 'reality_programming' | 'temporal_mechanics'
  | 'cosmic_ecology' | 'entropy_management' | 'dimensional_physics';

export interface ResearchRequirement {
  cosmicInformation: number;
  practicalExperience: number; // Gained from successfully completing challenges
  theoreticalKnowledge: string[]; // Specific theories that must be mastered
  cosmicInfluence: number; // Influence over cosmic structures
  ethicalAlignment?: string; // Some techs require specific ethical stances
}

export interface TechEffect {
  type: 'resource_multiplier' | 'new_ability' | 'cosmic_law_modification' 
       | 'civilization_influence' | 'reality_access' | 'temporal_control';
  target: string;
  magnitude: number;
  description: string;
  permanentChange?: boolean; // Some effects permanently alter the universe
}

export interface CosmicImpact {
  universeScale: 'local' | 'galactic' | 'cosmic' | 'multiversal';
  timeHorizon: 'immediate' | 'stellar' | 'galactic' | 'cosmic';
  reversibility: 'reversible' | 'difficult' | 'impossible';
  cascadeEffects: string[]; // How this technology affects other systems
  moralWeight: number; // 1-10, how ethically significant this choice is
}

export interface EthicalChoice {
  dilemma: string;
  options: EthicalOption[];
  consequences: { [optionId: string]: string[] };
}

export interface EthicalOption {
  id: string;
  choice: string;
  philosophy: string; // Utilitarian, Deontological, Virtue Ethics, etc.
  shortTermEffect: string;
  longTermEffect: string;
}

export interface TechTreeBranch {
  id: string;
  name: string;
  description: string;
  philosophy: string;
  technologies: CosmicTechnology[];
  branchConflicts: string[]; // Incompatible with other branches
  ultimateTech: string; // End-game technology for this branch
}

export class TechnologyTreeSystem {
  private availableTechs: Map<string, CosmicTechnology> = new Map();
  private researchedTechs: Set<string> = new Set();
  private activeBranches: Set<string> = new Set();
  private techBranches: Map<string, TechTreeBranch> = new Map();
  private ethicalChoices: Map<string, string> = new Map(); // Tech ID -> Chosen option
  private cosmicConsequences: string[] = []; // Permanent changes to universe
  
  // Player research resources
  private cosmicInformation: number = 0;
  private practicalExperience: number = 0;
  private cosmicInfluence: number = 0;
  private theoreticalKnowledge: Set<string> = new Set();
  
  constructor() {
    this.initializeTechnologyTree();
  }
  
  /**
   * Initialize the comprehensive technology tree
   */
  private initializeTechnologyTree(): void {
    this.createStellarEngineeringBranch();
    this.createQuantumManipulationBranch();
    this.createSpacetimeControlBranch();
    this.createConsciousnessStudiesBranch();
    this.createRealityProgrammingBranch();
    this.createTemporalMechanicsBranch();
    this.createDimensionalPhysicsBranch();
  }
  
  /**
   * Stellar Engineering Branch - Master stars and energy
   */
  private createStellarEngineeringBranch(): void {
    const technologies: CosmicTechnology[] = [
      {
        id: 'basic_fusion_control',
        name: 'Fusion Regulation',
        description: 'Control nuclear fusion reactions in stellar cores',
        category: 'stellar_engineering',
        tier: 1,
        prerequisites: [],
        researchCost: {
          cosmicInformation: 100,
          practicalExperience: 50,
          theoreticalKnowledge: ['Nuclear Physics'],
          cosmicInfluence: 0
        },
        unlockEffects: [
          {
            type: 'new_ability',
            target: 'stellar_ignition',
            magnitude: 1,
            description: 'Can manually ignite stars from gas clouds'
          }
        ],
        ongoingEffects: [
          {
            type: 'resource_multiplier',
            target: 'stellarNeutrinos',
            magnitude: 1.5,
            description: 'Improved stellar energy extraction'
          }
        ],
        cosmicImpact: {
          universeScale: 'local',
          timeHorizon: 'stellar',
          reversibility: 'reversible',
          cascadeEffects: ['Increased star formation rate', 'Enhanced stellar stability'],
          moralWeight: 3
        },
        realWorldBasis: 'Based on theoretical stellar engineering proposals by Freeman Dyson'
      },
      
      {
        id: 'dyson_sphere_construction',
        name: 'Dyson Sphere Mastery',
        description: 'Build megastructures to capture entire stellar output',
        category: 'stellar_engineering',
        tier: 4,
        prerequisites: ['basic_fusion_control', 'advanced_materials'],
        researchCost: {
          cosmicInformation: 1000,
          practicalExperience: 500,
          theoreticalKnowledge: ['Megastructure Engineering', 'Materials Science'],
          cosmicInfluence: 100
        },
        unlockEffects: [
          {
            type: 'new_ability',
            target: 'stellar_harvest',
            magnitude: 1,
            description: 'Can build energy-collecting megastructures around stars'
          }
        ],
        ongoingEffects: [
          {
            type: 'resource_multiplier',
            target: 'energy_output',
            magnitude: 1000,
            description: 'Massive energy generation from stellar capture'
          }
        ],
        cosmicImpact: {
          universeScale: 'galactic',
          timeHorizon: 'galactic',
          reversibility: 'difficult',
          cascadeEffects: ['Visible alteration of stellar emissions', 'Galactic energy redistribution'],
          moralWeight: 7
        },
        realWorldBasis: 'Freeman Dyson\'s theoretical stellar energy capture megastructures',
        ethicalDilemma: {
          dilemma: 'Building Dyson spheres will alter stellar emissions, potentially affecting other civilizations',
          options: [
            {
              id: 'proceed_carefully',
              choice: 'Build gradually with civilization consent',
              philosophy: 'Deontological',
              shortTermEffect: 'Slower energy gain, diplomatic relations maintained',
              longTermEffect: 'Sustainable galactic development, but energy shortage may limit growth'
            },
            {
              id: 'maximize_efficiency',
              choice: 'Build maximum structures for greatest benefit',
              philosophy: 'Utilitarian',
              shortTermEffect: 'Massive energy gain, some civilizations affected',
              longTermEffect: 'Galactic energy abundance enables advanced technologies'
            }
          ],
          consequences: {
            'proceed_carefully': ['Slower tech progression', 'Galactic cooperation bonus'],
            'maximize_efficiency': ['Faster tech progression', 'Civilization conflict risk']
          }
        }
      },
      
      {
        id: 'stellar_lifecycle_manipulation',
        name: 'Stellar Evolution Control',
        description: 'Accelerate or slow stellar aging, prevent supernovae, create exotic stellar types',
        category: 'stellar_engineering',
        tier: 7,
        prerequisites: ['dyson_sphere_construction', 'quantum_field_control'],
        researchCost: {
          cosmicInformation: 5000,
          practicalExperience: 2000,
          theoreticalKnowledge: ['Stellar Evolution', 'Nuclear Astrophysics', 'Quantum Fields'],
          cosmicInfluence: 500
        },
        unlockEffects: [
          {
            type: 'cosmic_law_modification',
            target: 'stellar_physics',
            magnitude: 1,
            description: 'Can modify fundamental stellar evolution processes',
            permanentChange: true
          }
        ],
        ongoingEffects: [
          {
            type: 'new_ability',
            target: 'stellar_resurrection',
            magnitude: 1,
            description: 'Can reverse stellar death and recreate stars'
          }
        ],
        cosmicImpact: {
          universeScale: 'cosmic',
          timeHorizon: 'cosmic',
          reversibility: 'impossible',
          cascadeEffects: ['Altered galactic evolution', 'Modified heavy element production', 'Changed cosmic timeline'],
          moralWeight: 9
        },
        realWorldBasis: 'Theoretical stellar engineering concepts from advanced civilization scenarios'
      }
    ];
    
    const branch: TechTreeBranch = {
      id: 'stellar_engineering',
      name: 'Stellar Mastery',
      description: 'Control the birth, life, and death of stars themselves',
      philosophy: 'Harness cosmic energy through stellar manipulation',
      technologies,
      branchConflicts: ['dark_energy_dominance'],
      ultimateTech: 'stellar_lifecycle_manipulation'
    };
    
    this.techBranches.set('stellar_engineering', branch);
    technologies.forEach(tech => this.availableTechs.set(tech.id, tech));
  }
  
  /**
   * Quantum Manipulation Branch - Control reality at fundamental level
   */
  private createQuantumManipulationBranch(): void {
    const technologies: CosmicTechnology[] = [
      {
        id: 'quantum_entanglement_networks',
        name: 'Quantum Communication Networks',
        description: 'Create instantaneous information transfer across any distance',
        category: 'quantum_manipulation',
        tier: 2,
        prerequisites: [],
        researchCost: {
          cosmicInformation: 200,
          practicalExperience: 100,
          theoreticalKnowledge: ['Quantum Mechanics', 'Information Theory'],
          cosmicInfluence: 10
        },
        unlockEffects: [
          {
            type: 'new_ability',
            target: 'instant_communication',
            magnitude: 1,
            description: 'Can establish quantum communication across galactic distances'
          }
        ],
        ongoingEffects: [
          {
            type: 'resource_multiplier',
            target: 'coordination_efficiency',
            magnitude: 3,
            description: 'Perfect coordination enables more efficient cosmic operations'
          }
        ],
        cosmicImpact: {
          universeScale: 'galactic',
          timeHorizon: 'immediate',
          reversibility: 'reversible',
          cascadeEffects: ['Enhanced galactic civilization development', 'Quantum information preservation'],
          moralWeight: 4
        },
        realWorldBasis: 'Based on quantum entanglement research and proposed quantum internet'
      },
      
      {
        id: 'quantum_vacuum_engineering',
        name: 'Vacuum State Manipulation',
        description: 'Control the quantum vacuum to extract infinite energy or alter physical laws',
        category: 'quantum_manipulation',
        tier: 6,
        prerequisites: ['quantum_entanglement_networks', 'zero_point_energy'],
        researchCost: {
          cosmicInformation: 3000,
          practicalExperience: 1500,
          theoreticalKnowledge: ['Quantum Field Theory', 'Vacuum Physics', 'Casimir Effect'],
          cosmicInfluence: 300,
          ethicalAlignment: 'careful_experimentation'
        },
        unlockEffects: [
          {
            type: 'reality_access',
            target: 'physical_constants',
            magnitude: 1,
            description: 'Can modify fundamental physical constants in localized regions'
          }
        ],
        ongoingEffects: [
          {
            type: 'resource_multiplier',
            target: 'quantumVacuumEnergy',
            magnitude: 100,
            description: 'Direct extraction from quantum vacuum'
          }
        ],
        cosmicImpact: {
          universeScale: 'cosmic',
          timeHorizon: 'cosmic',
          reversibility: 'impossible',
          cascadeEffects: ['Risk of vacuum decay', 'Potential universe destruction', 'God-like power access'],
          moralWeight: 10
        },
        realWorldBasis: 'Based on Sidney Coleman\'s false vacuum decay theory and Casimir effect research',
        ethicalDilemma: {
          dilemma: 'Vacuum manipulation could trigger universe-ending vacuum decay',
          options: [
            {
              id: 'limited_experimentation',
              choice: 'Only small-scale, carefully controlled experiments',
              philosophy: 'Precautionary Principle',
              shortTermEffect: 'Limited power gain, universe remains safe',
              longTermEffect: 'Slow but safe technological progress'
            },
            {
              id: 'full_exploitation',
              choice: 'Exploit vacuum energy for maximum cosmic influence',
              philosophy: 'Cosmic Utilitarianism',
              shortTermEffect: 'Enormous power, 1% chance of universe destruction',
              longTermEffect: 'Either cosmic godhood or universal annihilation'
            }
          ],
          consequences: {
            'limited_experimentation': ['Safe progression', 'Limited vacuum powers'],
            'full_exploitation': ['Risk universe destruction', 'Unlimited energy access']
          }
        }
      }
    ];
    
    const branch: TechTreeBranch = {
      id: 'quantum_manipulation',
      name: 'Quantum Mastery',
      description: 'Control reality at the most fundamental quantum level',
      philosophy: 'Manipulate the quantum substrate of existence itself',
      technologies,
      branchConflicts: ['classical_physics_mastery'],
      ultimateTech: 'quantum_vacuum_engineering'
    };
    
    this.techBranches.set('quantum_manipulation', branch);
    technologies.forEach(tech => this.availableTechs.set(tech.id, tech));
  }
  
  /**
   * Spacetime Control Branch - Master gravity, space, and time
   */
  private createSpacetimeControlBranch(): void {
    const technologies: CosmicTechnology[] = [
      {
        id: 'alcubierre_drive_mastery',
        name: 'Warp Drive Technology',
        description: 'Bend spacetime for faster-than-light travel without violating relativity',
        category: 'spacetime_control',
        tier: 5,
        prerequisites: ['gravitational_wave_control', 'exotic_matter_synthesis'],
        researchCost: {
          cosmicInformation: 2000,
          practicalExperience: 1000,
          theoreticalKnowledge: ['General Relativity', 'Exotic Matter Physics'],
          cosmicInfluence: 200
        },
        unlockEffects: [
          {
            type: 'new_ability',
            target: 'ftl_travel',
            magnitude: 1,
            description: 'Can travel faster than light without time paradoxes'
          }
        ],
        ongoingEffects: [
          {
            type: 'cosmic_law_modification',
            target: 'effective_lightspeed',
            magnitude: 1000,
            description: 'Effective speed limit increased by factor of 1000'
          }
        ],
        cosmicImpact: {
          universeScale: 'galactic',
          timeHorizon: 'galactic',
          reversibility: 'difficult',
          cascadeEffects: ['Galactic exploration acceleration', 'Causality complications', 'Space-time distortions'],
          moralWeight: 6
        },
        realWorldBasis: 'Miguel Alcubierre\'s theoretical warp drive solution to Einstein\'s field equations'
      },
      
      {
        id: 'temporal_manipulation',
        name: 'Time Control Mastery',
        description: 'Manipulate the flow of time itself - accelerate, slow, or reverse temporal processes',
        category: 'spacetime_control',
        tier: 8,
        prerequisites: ['alcubierre_drive_mastery', 'closed_timelike_curves'],
        exclusiveWith: ['causality_preservation'],
        researchCost: {
          cosmicInformation: 8000,
          practicalExperience: 3000,
          theoreticalKnowledge: ['General Relativity', 'Quantum Gravity', 'Causal Dynamics'],
          cosmicInfluence: 1000,
          ethicalAlignment: 'temporal_responsibility'
        },
        unlockEffects: [
          {
            type: 'temporal_control',
            target: 'cosmic_timeline',
            magnitude: 1,
            description: 'Can alter the flow of time across cosmic scales',
            permanentChange: true
          }
        ],
        ongoingEffects: [
          {
            type: 'new_ability',
            target: 'temporal_engineering',
            magnitude: 1,
            description: 'Can accelerate stellar evolution, reverse entropy, manipulate causality'
          }
        ],
        cosmicImpact: {
          universeScale: 'multiversal',
          timeHorizon: 'cosmic',
          reversibility: 'impossible',
          cascadeEffects: ['Causality paradoxes', 'Timeline branching', 'Reality instability'],
          moralWeight: 10
        },
        realWorldBasis: 'Theoretical work on closed timelike curves and general relativistic time travel',
        ethicalDilemma: {
          dilemma: 'Time manipulation could create paradoxes that unravel causality itself',
          options: [
            {
              id: 'novikov_self_consistency',
              choice: 'Only allow self-consistent time manipulation',
              philosophy: 'Deterministic Consistency',
              shortTermEffect: 'Limited temporal abilities, no paradoxes',
              longTermEffect: 'Stable timeline with restricted temporal engineering'
            },
            {
              id: 'many_worlds_exploitation',
              choice: 'Use many-worlds interpretation to prevent paradoxes',
              philosophy: 'Quantum Multiverse',
              shortTermEffect: 'Unlimited temporal power, reality branching',
              longTermEffect: 'Infinite timelines created, reality becomes unstable'
            }
          ],
          consequences: {
            'novikov_self_consistency': ['Limited time powers', 'Stable single timeline'],
            'many_worlds_exploitation': ['Unlimited time control', 'Multiverse chaos risk']
          }
        }
      }
    ];
    
    const branch: TechTreeBranch = {
      id: 'spacetime_control',
      name: 'Spacetime Mastery',
      description: 'Control the fundamental structure of space and time',
      philosophy: 'Bend reality\'s fabric to your will',
      technologies,
      branchConflicts: ['quantum_consciousness'],
      ultimateTech: 'temporal_manipulation'
    };
    
    this.techBranches.set('spacetime_control', branch);
    technologies.forEach(tech => this.availableTechs.set(tech.id, tech));
  }
  
  /**
   * Consciousness Studies Branch - Understand and enhance consciousness
   */
  private createConsciousnessStudiesBranch(): void {
    const technologies: CosmicTechnology[] = [
      {
        id: 'consciousness_detection',
        name: 'Consciousness Sensors',
        description: 'Detect and measure consciousness in cosmic entities',
        category: 'consciousness_studies',
        tier: 3,
        prerequisites: ['quantum_entanglement_networks'],
        researchCost: {
          cosmicInformation: 500,
          practicalExperience: 300,
          theoreticalKnowledge: ['Consciousness Studies', 'Information Integration Theory'],
          cosmicInfluence: 50
        },
        unlockEffects: [
          {
            type: 'new_ability',
            target: 'consciousness_mapping',
            magnitude: 1,
            description: 'Can detect consciousness in stars, planets, and cosmic structures'
          }
        ],
        ongoingEffects: [
          {
            type: 'civilization_influence',
            target: 'consciousness_based_diplomacy',
            magnitude: 2,
            description: 'Enhanced communication with conscious cosmic entities'
          }
        ],
        cosmicImpact: {
          universeScale: 'galactic',
          timeHorizon: 'stellar',
          reversibility: 'reversible',
          cascadeEffects: ['Discovery of cosmic consciousness', 'New ethical frameworks needed'],
          moralWeight: 8
        },
        realWorldBasis: 'Based on Integrated Information Theory and panpsychist theories'
      }
    ];
    
    const branch: TechTreeBranch = {
      id: 'consciousness_studies',
      name: 'Consciousness Mastery',
      description: 'Understand and enhance consciousness throughout the cosmos',
      philosophy: 'Consciousness is the fundamental aspect of reality',
      technologies,
      branchConflicts: ['purely_materialist'],
      ultimateTech: 'cosmic_consciousness_network'
    };
    
    this.techBranches.set('consciousness_studies', branch);
    technologies.forEach(tech => this.availableTechs.set(tech.id, tech));
  }
  
  /**
   * Check if technology can be researched
   */
  canResearch(techId: string): { possible: boolean; missing: string[] } {
    const tech = this.availableTechs.get(techId);
    if (!tech) return { possible: false, missing: ['Technology not found'] };
    
    if (this.researchedTechs.has(techId)) {
      return { possible: false, missing: ['Already researched'] };
    }
    
    const missing: string[] = [];
    
    // Check prerequisites
    for (const prereq of tech.prerequisites) {
      if (!this.researchedTechs.has(prereq)) {
        missing.push(`Missing prerequisite: ${prereq}`);
      }
    }
    
    // Check exclusive technologies
    if (tech.exclusiveWith) {
      for (const exclusive of tech.exclusiveWith) {
        if (this.researchedTechs.has(exclusive)) {
          missing.push(`Conflicts with already researched: ${exclusive}`);
        }
      }
    }
    
    // Check resources
    const cost = tech.researchCost;
    if (this.cosmicInformation < cost.cosmicInformation) {
      missing.push(`Need ${cost.cosmicInformation - this.cosmicInformation} more cosmic information`);
    }
    if (this.practicalExperience < cost.practicalExperience) {
      missing.push(`Need ${cost.practicalExperience - this.practicalExperience} more practical experience`);
    }
    if (this.cosmicInfluence < cost.cosmicInfluence) {
      missing.push(`Need ${cost.cosmicInfluence - this.cosmicInfluence} more cosmic influence`);
    }
    
    // Check theoretical knowledge
    for (const knowledge of cost.theoreticalKnowledge) {
      if (!this.theoreticalKnowledge.has(knowledge)) {
        missing.push(`Missing theoretical knowledge: ${knowledge}`);
      }
    }
    
    return { possible: missing.length === 0, missing };
  }
  
  /**
   * Research a technology with meaningful choice consequences
   */
  researchTechnology(techId: string, ethicalChoice?: string): { 
    success: boolean; 
    message: string; 
    cosmicConsequences: string[] 
  } {
    const canResearchResult = this.canResearch(techId);
    if (!canResearchResult.possible) {
      return { 
        success: false, 
        message: `Cannot research: ${canResearchResult.missing.join(', ')}`,
        cosmicConsequences: []
      };
    }
    
    const tech = this.availableTechs.get(techId)!;
    
    // Handle ethical dilemma if present
    if (tech.ethicalDilemma && !ethicalChoice) {
      return {
        success: false,
        message: 'This technology requires an ethical choice. Choose your approach carefully.',
        cosmicConsequences: []
      };
    }
    
    // Consume resources
    this.cosmicInformation -= tech.researchCost.cosmicInformation;
    this.practicalExperience -= tech.researchCost.practicalExperience;
    this.cosmicInfluence -= tech.researchCost.cosmicInfluence;
    
    // Apply research
    this.researchedTechs.add(techId);
    
    // Handle ethical choice consequences
    let ethicalConsequences: string[] = [];
    if (tech.ethicalDilemma && ethicalChoice) {
      this.ethicalChoices.set(techId, ethicalChoice);
      ethicalConsequences = tech.ethicalDilemma.consequences[ethicalChoice] || [];
    }
    
    // Apply permanent cosmic changes
    const cosmicChanges: string[] = [];
    for (const effect of tech.unlockEffects) {
      if (effect.permanentChange) {
        cosmicChanges.push(`${effect.description} - This change is permanent and will affect the entire universe.`);
        this.cosmicConsequences.push(`${tech.name}: ${effect.description}`);
      }
    }
    
    return {
      success: true,
      message: `Successfully researched ${tech.name}! ${tech.description}`,
      cosmicConsequences: [...cosmicChanges, ...ethicalConsequences]
    };
  }
  
  /**
   * Get available technologies for research
   */
  getAvailableTechnologies(): CosmicTechnology[] {
    return Array.from(this.availableTechs.values())
      .filter(tech => {
        const canRes = this.canResearch(tech.id);
        return canRes.possible || canRes.missing.length <= 2; // Show nearly available techs
      })
      .sort((a, b) => a.tier - b.tier);
  }
  
  /**
   * Get researched technologies
   */
  getResearchedTechnologies(): CosmicTechnology[] {
    return Array.from(this.researchedTechs)
      .map(id => this.availableTechs.get(id)!)
      .filter(tech => tech !== undefined);
  }
  
  /**
   * Get technology branches with progress
   */
  getTechnologyBranches(): { branch: TechTreeBranch; progress: number; available: boolean }[] {
    return Array.from(this.techBranches.values()).map(branch => {
      const totalTechs = branch.technologies.length;
      const researchedCount = branch.technologies.filter(tech => 
        this.researchedTechs.has(tech.id)
      ).length;
      
      const progress = totalTechs > 0 ? researchedCount / totalTechs : 0;
      const available = !branch.branchConflicts.some(conflict => 
        this.activeBranches.has(conflict)
      );
      
      return { branch, progress, available };
    });
  }
  
  /**
   * Get current cosmic consequences from technology choices
   */
  getCosmicConsequences(): string[] {
    return [...this.cosmicConsequences];
  }
  
  // Placeholder methods for other branches
  private createRealityProgrammingBranch(): void { /* Implementation */ }
  private createTemporalMechanicsBranch(): void { /* Implementation */ }
  private createDimensionalPhysicsBranch(): void { /* Implementation */ }
  
  // Resource management
  addCosmicInformation(amount: number): void { this.cosmicInformation += amount; }
  addPracticalExperience(amount: number): void { this.practicalExperience += amount; }
  addCosmicInfluence(amount: number): void { this.cosmicInfluence += amount; }
  addTheoreticalKnowledge(knowledge: string): void { this.theoreticalKnowledge.add(knowledge); }
  
  getResources(): { 
    cosmicInformation: number; 
    practicalExperience: number; 
    cosmicInfluence: number;
    theoreticalKnowledge: string[]
  } {
    return {
      cosmicInformation: this.cosmicInformation,
      practicalExperience: this.practicalExperience,
      cosmicInfluence: this.cosmicInfluence,
      theoreticalKnowledge: Array.from(this.theoreticalKnowledge)
    };
  }
}