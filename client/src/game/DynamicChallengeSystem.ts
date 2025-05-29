/**
 * DynamicChallengeSystem - Adaptive difficulty and emergent cosmic scenarios
 * Creates unique challenges based on player skill, cosmic state, and real astronomy
 */

import { CosmicResources } from './CosmicPhysicsEngine';
import { SkillResult } from './SkillBasedControlSystem';

export interface CosmicChallenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  difficulty: number; // 1-10, adapts to player skill
  timeLimit: number; // seconds, -1 for no limit
  cosmicScenario: CosmicScenario;
  objectives: ChallengeObjective[];
  rewards: ChallengeReward[];
  penalties: ChallengePenalty[];
  emergentFactors: EmergentFactor[];
  realWorldBasis: string;
}

export type ChallengeType = 
  | 'stellar_crisis' | 'galactic_collision' | 'cosmic_anomaly' 
  | 'civilization_emergence' | 'dark_energy_surge' | 'quantum_fluctuation'
  | 'gravitational_wave_event' | 'supernova_chain' | 'black_hole_merger'
  | 'alien_contact' | 'cosmic_string_collision' | 'vacuum_decay_threat';

export interface CosmicScenario {
  setting: string;
  participants: CosmicEntity[];
  initialConditions: { [key: string]: number };
  physicsLaws: string[];
  timeScale: 'seconds' | 'years' | 'millennia' | 'eons';
  scopeScale: 'planetary' | 'stellar' | 'galactic' | 'universal';
}

export interface ChallengeObjective {
  id: string;
  description: string;
  type: 'save' | 'create' | 'prevent' | 'optimize' | 'discover' | 'survive';
  target: string;
  successCriteria: { [metric: string]: number };
  weight: number; // Importance for overall success
}

export interface ChallengeReward {
  type: 'resources' | 'knowledge' | 'abilities' | 'cosmic_influence';
  amount: Partial<CosmicResources> | string[] | number;
  description: string;
}

export interface ChallengePenalty {
  type: 'resource_loss' | 'cosmic_damage' | 'knowledge_corruption' | 'time_penalty';
  severity: number;
  description: string;
}

export interface EmergentFactor {
  trigger: string;
  effect: string;
  probability: number;
  impactLevel: number;
}

export interface CosmicEntity {
  type: 'star' | 'planet' | 'civilization' | 'black_hole' | 'galaxy' | 'dark_matter_clump';
  name: string;
  properties: { [key: string]: number };
  behavior: string;
  relationships: string[];
}

export interface PlayerPerformance {
  skillLevels: Map<string, number>;
  recentSuccessRate: number;
  adaptiveDifficulty: number;
  preferredChallengeTypes: string[];
  masteryProgression: number;
}

export class DynamicChallengeSystem {
  private activeChallenge: CosmicChallenge | null = null;
  private challengeHistory: CosmicChallenge[] = [];
  private playerPerformance: PlayerPerformance;
  private cosmicEventPool: CosmicChallenge[] = [];
  private emergentScenarios: Map<string, () => CosmicChallenge> = new Map();
  
  // Real astronomical data for authentic scenarios
  private realAstronomicalEvents = [
    'Betelgeuse supernova', 'Sagittarius A* feeding', 'Andromeda collision',
    'Alpha Centauri planetary formation', 'Vega pole reversal', 'Proxima flare activity'
  ];
  
  constructor(initialSkillLevels: Map<string, number>) {
    this.playerPerformance = {
      skillLevels: new Map(initialSkillLevels),
      recentSuccessRate: 0.5,
      adaptiveDifficulty: 3,
      preferredChallengeTypes: [],
      masteryProgression: 0
    };
    
    this.initializeChallengePool();
    this.setupEmergentScenarios();
  }
  
  /**
   * Generate dynamic challenge based on current cosmic state and player skill
   */
  generateAdaptiveChallenge(cosmicState: any, playerResources: CosmicResources): CosmicChallenge {
    // Analyze current cosmic conditions
    const cosmicTension = this.analyzeCosmicTensions(cosmicState);
    const playerCapability = this.assessPlayerCapability();
    
    // Select appropriate challenge type
    const challengeType = this.selectChallengeType(cosmicTension, playerCapability);
    
    // Generate challenge based on real astronomical phenomena
    const challenge = this.createCosmicChallenge(challengeType, cosmicState, playerResources);
    
    // Add emergent complications
    this.addEmergentFactors(challenge, cosmicState);
    
    // Adjust difficulty based on player performance
    this.adaptDifficulty(challenge);
    
    return challenge;
  }
  
  /**
   * Analyze cosmic tensions to determine what challenges make sense
   */
  private analyzeCosmicTensions(cosmicState: any): { [key: string]: number } {
    return {
      stellarInstability: this.calculateStellarInstability(cosmicState),
      gravitationalStress: this.calculateGravitationalStress(cosmicState),
      quantumFluctuations: this.calculateQuantumFluctuations(cosmicState),
      darkEnergyPressure: this.calculateDarkEnergyPressure(cosmicState),
      informationEntropy: this.calculateInformationEntropy(cosmicState),
      civilizationDensity: this.calculateCivilizationDensity(cosmicState)
    };
  }
  
  /**
   * Select appropriate challenge type based on cosmic conditions
   */
  private selectChallengeType(tensions: { [key: string]: number }, capability: number): ChallengeType {
    // Weight selection based on cosmic state and player preferences
    const weights: { [key in ChallengeType]: number } = {
      'stellar_crisis': tensions.stellarInstability * 2,
      'galactic_collision': tensions.gravitationalStress * 1.5,
      'cosmic_anomaly': tensions.quantumFluctuations * 3,
      'civilization_emergence': tensions.civilizationDensity * 2,
      'dark_energy_surge': tensions.darkEnergyPressure * 1.8,
      'quantum_fluctuation': tensions.quantumFluctuations * 2.5,
      'gravitational_wave_event': tensions.gravitationalStress * 2,
      'supernova_chain': tensions.stellarInstability * 1.5,
      'black_hole_merger': tensions.gravitationalStress * 2.2,
      'alien_contact': tensions.civilizationDensity * 1.5,
      'cosmic_string_collision': tensions.quantumFluctuations * 1.2,
      'vacuum_decay_threat': tensions.informationEntropy * 0.5 // Rare but catastrophic
    };
    
    // Adjust weights based on player capability
    Object.keys(weights).forEach(type => {
      const difficultyLevel = this.getChallengeBaseDifficulty(type as ChallengeType);
      if (Math.abs(difficultyLevel - capability) > 3) {
        weights[type as ChallengeType] *= 0.3; // Reduce likelihood of mismatched difficulty
      }
    });
    
    // Weighted random selection
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (const [type, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return type as ChallengeType;
      }
    }
    
    return 'stellar_crisis'; // Fallback
  }
  
  /**
   * Create specific cosmic challenge based on real astronomy
   */
  private createCosmicChallenge(
    type: ChallengeType, 
    cosmicState: any, 
    playerResources: CosmicResources
  ): CosmicChallenge {
    
    const challengeFactories: { [key in ChallengeType]: () => CosmicChallenge } = {
      'stellar_crisis': () => this.createStellarCrisisChallenge(),
      'galactic_collision': () => this.createGalacticCollisionChallenge(),
      'cosmic_anomaly': () => this.createCosmicAnomalyChallenge(),
      'civilization_emergence': () => this.createCivilizationEmergenceChallenge(),
      'dark_energy_surge': () => this.createDarkEnergySurgeChallenge(),
      'quantum_fluctuation': () => this.createQuantumFluctuationChallenge(),
      'gravitational_wave_event': () => this.createGravitationalWaveChallenge(),
      'supernova_chain': () => this.createSupernovaChainChallenge(),
      'black_hole_merger': () => this.createBlackHoleMergerChallenge(),
      'alien_contact': () => this.createAlienContactChallenge(),
      'cosmic_string_collision': () => this.createCosmicStringChallenge(),
      'vacuum_decay_threat': () => this.createVacuumDecayChallenge()
    };
    
    return challengeFactories[type]();
  }
  
  /**
   * Stellar Crisis Challenge - Based on real stellar physics
   */
  private createStellarCrisisChallenge(): CosmicChallenge {
    const crisisTypes = [
      'Helium flash in red giant core',
      'Iron core collapse triggering supernova',
      'Solar coronal mass ejection threatening civilization',
      'Wolf-Rayet star losing mass rapidly',
      'Binary star mass transfer instability'
    ];
    
    const selectedCrisis = crisisTypes[Math.floor(Math.random() * crisisTypes.length)];
    
    return {
      id: `stellar_crisis_${Date.now()}`,
      name: `Stellar Emergency: ${selectedCrisis}`,
      description: `A critical stellar event threatens the cosmic ecosystem. Apply your understanding of nuclear physics and stellar evolution to prevent catastrophe.`,
      type: 'stellar_crisis',
      difficulty: 5 + Math.floor(Math.random() * 3),
      timeLimit: 300, // 5 minutes
      cosmicScenario: {
        setting: 'Main sequence star system with developing crisis',
        participants: [
          {
            type: 'star',
            name: 'Crisis Star',
            properties: { mass: 8, temperature: 15000, age: 10, metallicity: 0.02 },
            behavior: 'unstable_fusion',
            relationships: ['threatens_planets', 'affects_space_weather']
          },
          {
            type: 'planet',
            name: 'Endangered World',
            properties: { distance: 2, habitability: 0.8, population: 1e9 },
            behavior: 'defensive_measures',
            relationships: ['orbits_crisis_star', 'hosts_civilization']
          }
        ],
        initialConditions: {
          stellar_luminosity: 1.5,
          core_temperature: 1e8,
          mass_loss_rate: 1e-6,
          magnetic_field_strength: 1000
        },
        physicsLaws: ['Nuclear fusion', 'Stellar structure', 'Radiation pressure', 'Hydrostatic equilibrium'],
        timeScale: 'years',
        scopeScale: 'stellar'
      },
      objectives: [
        {
          id: 'stabilize_fusion',
          description: 'Regulate nuclear fusion to prevent runaway reaction',
          type: 'optimize',
          target: 'stellar_core',
          successCriteria: { core_temperature: 5e7, fusion_rate: 1.0 },
          weight: 0.4
        },
        {
          id: 'protect_civilization',
          description: 'Shield planetary civilization from stellar radiation',
          type: 'save',
          target: 'inhabited_planet',
          successCriteria: { radiation_exposure: 0.1, survival_rate: 0.95 },
          weight: 0.6
        }
      ],
      rewards: [
        {
          type: 'knowledge',
          amount: ['Stellar Engineering', 'Radiation Shielding', 'Crisis Management'],
          description: 'Gain advanced knowledge of stellar manipulation'
        },
        {
          type: 'resources',
          amount: { stellarNeutrinos: 500, heavyElements: 200, cosmicInformation: 100 },
          description: 'Salvage valuable materials from stellar crisis'
        }
      ],
      penalties: [
        {
          type: 'cosmic_damage',
          severity: 8,
          description: 'Stellar explosion damages surrounding space-time'
        }
      ],
      emergentFactors: [
        {
          trigger: 'radiation_spike',
          effect: 'nearby_electronics_failure',
          probability: 0.3,
          impactLevel: 5
        }
      ],
      realWorldBasis: 'Based on observations of Eta Carinae, Betelgeuse variability, and Type IIn supernovae'
    };
  }
  
  /**
   * Galactic Collision Challenge - Based on Milky Way-Andromeda merger
   */
  private createGalacticCollisionChallenge(): CosmicChallenge {
    return {
      id: `galactic_collision_${Date.now()}`,
      name: 'The Great Merger: Galactic Collision Imminent',
      description: 'Two galaxies are approaching collision. Guide the gravitational dance to minimize destruction and maximize star formation.',
      type: 'galactic_collision',
      difficulty: 8,
      timeLimit: 600, // 10 minutes
      cosmicScenario: {
        setting: 'Local Group galaxies approaching merger',
        participants: [
          {
            type: 'galaxy',
            name: 'Primary Galaxy',
            properties: { mass: 1e12, stars: 1e11, dark_matter: 5e12, supermassive_bh: 4e6 },
            behavior: 'gravitational_approach',
            relationships: ['approaching_secondary', 'tidal_disruption']
          },
          {
            type: 'galaxy',
            name: 'Secondary Galaxy',
            properties: { mass: 2e12, stars: 1e12, dark_matter: 8e12, supermassive_bh: 1e8 },
            behavior: 'gravitational_approach',
            relationships: ['approaching_primary', 'stellar_streams']
          }
        ],
        initialConditions: {
          separation_distance: 100, // kpc
          relative_velocity: 120, // km/s
          tidal_force: 1e6,
          merger_probability: 0.95
        },
        physicsLaws: ['N-body dynamics', 'Tidal forces', 'Dark matter dynamics', 'Star formation'],
        timeScale: 'eons',
        scopeScale: 'galactic'
      },
      objectives: [
        {
          id: 'minimize_disruption',
          description: 'Minimize stellar system disruption during merger',
          type: 'optimize',
          target: 'stellar_systems',
          successCriteria: { disruption_rate: 0.2, survivor_systems: 0.8 },
          weight: 0.3
        },
        {
          id: 'enhance_star_formation',
          description: 'Trigger controlled star formation in collision zones',
          target: 'gas_clouds',
          type: 'create',
          successCriteria: { new_star_rate: 2.0, formation_efficiency: 0.6 },
          weight: 0.4
        },
        {
          id: 'preserve_civilizations',
          description: 'Protect advanced civilizations during galactic chaos',
          type: 'save',
          target: 'civilization_worlds',
          successCriteria: { civilization_survival: 0.7 },
          weight: 0.3
        }
      ],
      rewards: [
        {
          type: 'cosmic_influence',
          amount: 1000,
          description: 'Gain influence over galactic-scale structures'
        },
        {
          type: 'resources',
          amount: { darkMatter: 5000, gravitationalWaves: 1000, cosmicInformation: 500 },
          description: 'Harness energy released during galactic merger'
        }
      ],
      penalties: [
        {
          type: 'cosmic_damage',
          severity: 9,
          description: 'Galactic collision creates cosmic-scale devastation'
        }
      ],
      emergentFactors: [
        {
          trigger: 'black_hole_approach',
          effect: 'gravitational_wave_burst',
          probability: 0.6,
          impactLevel: 7
        },
        {
          trigger: 'gas_cloud_collision',
          effect: 'starburst_region',
          probability: 0.8,
          impactLevel: 5
        }
      ],
      realWorldBasis: 'Based on Milky Way-Andromeda collision predicted in 4.5 billion years'
    };
  }
  
  /**
   * Cosmic Anomaly Challenge - Quantum physics mysteries
   */
  private createCosmicAnomalyChallenge(): CosmicChallenge {
    const anomalyTypes = [
      'Quantum vacuum metastability bubble',
      'Exotic matter concentration',
      'Temporal causality loop',
      'Information paradox manifestation',
      'Dark energy density fluctuation'
    ];
    
    const selectedAnomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    
    return {
      id: `cosmic_anomaly_${Date.now()}`,
      name: `Reality Disturbance: ${selectedAnomaly}`,
      description: 'A fundamental anomaly in spacetime threatens the stability of local physics. Apply quantum mechanics and relativity to restore order.',
      type: 'cosmic_anomaly',
      difficulty: 9,
      timeLimit: 180, // 3 minutes - urgent!
      cosmicScenario: {
        setting: 'Region of spacetime with altered physical laws',
        participants: [
          {
            type: 'dark_matter_clump',
            name: 'Anomaly Core',
            properties: { mass_energy: 1e15, quantum_state: 0.5, stability: 0.2 },
            behavior: 'reality_distortion',
            relationships: ['affects_local_physics', 'expanding_influence']
          }
        ],
        initialConditions: {
          spacetime_curvature: 10,
          quantum_coherence: 0.1,
          causality_index: 0.8,
          information_integrity: 0.6
        },
        physicsLaws: ['Quantum mechanics', 'General relativity', 'Information theory', 'Thermodynamics'],
        timeScale: 'seconds',
        scopeScale: 'planetary'
      },
      objectives: [
        {
          id: 'restore_causality',
          description: 'Repair causal structure of spacetime',
          type: 'optimize',
          target: 'spacetime_metric',
          successCriteria: { causality_index: 0.95, temporal_stability: 0.9 },
          weight: 0.5
        },
        {
          id: 'preserve_information',
          description: 'Prevent information loss paradox',
          type: 'save',
          target: 'quantum_information',
          successCriteria: { information_integrity: 0.95 },
          weight: 0.5
        }
      ],
      rewards: [
        {
          type: 'knowledge',
          amount: ['Quantum Gravity', 'Information Theory', 'Anomaly Detection'],
          description: 'Gain deep understanding of fundamental physics'
        }
      ],
      penalties: [
        {
          type: 'knowledge_corruption',
          severity: 10,
          description: 'Reality distortion corrupts understanding of physics'
        }
      ],
      emergentFactors: [
        {
          trigger: 'quantum_tunneling',
          effect: 'paradox_amplification',
          probability: 0.4,
          impactLevel: 8
        }
      ],
      realWorldBasis: 'Based on theoretical work on vacuum metastability and quantum gravity'
    };
  }
  
  /**
   * Add dynamic factors that emerge during challenges
   */
  private addEmergentFactors(challenge: CosmicChallenge, cosmicState: any): void {
    // Dynamic complications based on cosmic state
    const potentialFactors: EmergentFactor[] = [
      {
        trigger: 'unexpected_gravitational_wave',
        effect: 'spacetime_distortion',
        probability: 0.2,
        impactLevel: 6
      },
      {
        trigger: 'civilization_intervention',
        effect: 'resource_assistance_or_hindrance',
        probability: 0.3,
        impactLevel: 4
      },
      {
        trigger: 'quantum_decoherence',
        effect: 'measurement_uncertainty',
        probability: 0.25,
        impactLevel: 5
      },
      {
        trigger: 'dark_matter_interaction',
        effect: 'unexpected_mass_distribution',
        probability: 0.15,
        impactLevel: 7
      }
    ];
    
    // Add 1-3 random emergent factors
    const factorCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < factorCount; i++) {
      const factor = potentialFactors[Math.floor(Math.random() * potentialFactors.length)];
      if (!challenge.emergentFactors.some(f => f.trigger === factor.trigger)) {
        challenge.emergentFactors.push(factor);
      }
    }
  }
  
  /**
   * Adapt challenge difficulty based on player performance
   */
  private adaptDifficulty(challenge: CosmicChallenge): void {
    const performanceModifier = (this.playerPerformance.recentSuccessRate - 0.5) * 2; // -1 to 1
    const skillModifier = (this.playerPerformance.adaptiveDifficulty - 5) * 0.2; // Normalize
    
    const totalModifier = performanceModifier + skillModifier;
    
    // Adjust difficulty
    challenge.difficulty = Math.max(1, Math.min(10, challenge.difficulty + totalModifier));
    
    // Adjust time limits
    if (totalModifier < -0.5) {
      challenge.timeLimit *= 1.3; // More time for struggling players
    } else if (totalModifier > 0.5) {
      challenge.timeLimit *= 0.8; // Less time for experts
    }
    
    // Adjust success criteria
    challenge.objectives.forEach(objective => {
      Object.keys(objective.successCriteria).forEach(metric => {
        const currentValue = objective.successCriteria[metric];
        const adjustedValue = currentValue * (1 + totalModifier * 0.1);
        objective.successCriteria[metric] = Math.max(0.1, Math.min(1.0, adjustedValue));
      });
    });
  }
  
  /**
   * Process challenge completion and update player performance
   */
  processChallenge(completion: { success: boolean; objectives: { [id: string]: number }; timeUsed: number }): void {
    if (!this.activeChallenge) return;
    
    // Calculate overall success rate
    const objectiveSuccess = this.activeChallenge.objectives.reduce((total, obj) => {
      const achieved = completion.objectives[obj.id] || 0;
      return total + (achieved * obj.weight);
    }, 0);
    
    // Update performance tracking
    this.updatePlayerPerformance(objectiveSuccess, completion.timeUsed);
    
    // Add to challenge history
    this.challengeHistory.push({
      ...this.activeChallenge,
      // Add completion data
    });
    
    this.activeChallenge = null;
  }
  
  /**
   * Update player performance metrics for adaptive difficulty
   */
  private updatePlayerPerformance(successRate: number, timeUsed: number): void {
    // Exponential moving average for recent success rate
    this.playerPerformance.recentSuccessRate = 
      0.7 * this.playerPerformance.recentSuccessRate + 0.3 * successRate;
    
    // Adjust adaptive difficulty
    if (successRate > 0.8 && timeUsed < 0.7) {
      this.playerPerformance.adaptiveDifficulty = Math.min(10, this.playerPerformance.adaptiveDifficulty + 0.5);
    } else if (successRate < 0.4) {
      this.playerPerformance.adaptiveDifficulty = Math.max(1, this.playerPerformance.adaptiveDifficulty - 0.3);
    }
    
    // Update mastery progression
    this.playerPerformance.masteryProgression += successRate * 10;
  }
  
  // Helper methods for cosmic tension calculations
  private calculateStellarInstability(cosmicState: any): number {
    // Simplified calculation based on stellar ages and masses
    return Math.random() * 5; // Placeholder
  }
  
  private calculateGravitationalStress(cosmicState: any): number {
    return Math.random() * 7;
  }
  
  private calculateQuantumFluctuations(cosmicState: any): number {
    return Math.random() * 8;
  }
  
  private calculateDarkEnergyPressure(cosmicState: any): number {
    return Math.random() * 6;
  }
  
  private calculateInformationEntropy(cosmicState: any): number {
    return Math.random() * 4;
  }
  
  private calculateCivilizationDensity(cosmicState: any): number {
    return Math.random() * 3;
  }
  
  private getChallengeBaseDifficulty(type: ChallengeType): number {
    const baseDifficulties: { [key in ChallengeType]: number } = {
      'stellar_crisis': 5, 'galactic_collision': 8, 'cosmic_anomaly': 9,
      'civilization_emergence': 4, 'dark_energy_surge': 7, 'quantum_fluctuation': 8,
      'gravitational_wave_event': 6, 'supernova_chain': 7, 'black_hole_merger': 8,
      'alien_contact': 5, 'cosmic_string_collision': 9, 'vacuum_decay_threat': 10
    };
    return baseDifficulties[type];
  }
  
  private assessPlayerCapability(): number {
    const avgSkill = Array.from(this.playerPerformance.skillLevels.values())
      .reduce((sum, skill) => sum + skill, 0) / this.playerPerformance.skillLevels.size;
    return Math.min(10, Math.max(1, avgSkill / 100)); // Normalize to 1-10
  }
  
  private initializeChallengePool(): void {
    // Pre-generate some challenge templates
  }
  
  private setupEmergentScenarios(): void {
    // Set up procedural scenario generation
  }
  
  // Placeholder challenge creation methods
  private createCivilizationEmergenceChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createDarkEnergySurgeChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createQuantumFluctuationChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createGravitationalWaveChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createSupernovaChainChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createBlackHoleMergerChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createAlienContactChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createCosmicStringChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  private createVacuumDecayChallenge(): CosmicChallenge { return {} as CosmicChallenge; }
  
  // Public interface
  getCurrentChallenge(): CosmicChallenge | null {
    return this.activeChallenge;
  }
  
  getPlayerPerformance(): PlayerPerformance {
    return { ...this.playerPerformance };
  }
  
  getChallengeHistory(): CosmicChallenge[] {
    return [...this.challengeHistory];
  }
}