/**
 * ProceduralPlanetGenerator - Creates unique planet surfaces with diverse biomes
 * Generates Earth-like progression and other known planetary types
 */

export interface BiomeData {
  name: string;
  color: string;
  temperature: number; // Celsius
  humidity: number; // 0-1
  coverage: number; // Percentage of planet surface
  evolutionStage: number; // 0-10 (Earth progression scale)
  lifeComplexity: number; // 0-1
  atmosphericComposition: string[];
  uniqueFeatures: string[];
}

export interface PlanetSurface {
  planetType: string;
  biomes: BiomeData[];
  surfaceFeatures: SurfaceFeature[];
  atmosphericEffects: AtmosphericEffect[];
  geologicalActivity: number;
  magneticField: number;
  dayNightCycle: number; // Hours
  seasonalVariation: number; // 0-1
  progressionStage: ProgressionStage;
}

export interface SurfaceFeature {
  type: 'mountain' | 'ocean' | 'desert' | 'forest' | 'tundra' | 'volcano' | 'crater' | 'city' | 'ice_cap';
  x: number;
  y: number;
  size: number;
  height: number;
  age: number; // Millions of years
  activity: number; // 0-1 for geological activity
}

export interface AtmosphericEffect {
  type: 'aurora' | 'storm' | 'clouds' | 'dust' | 'aurora_borealis' | 'cyclone';
  intensity: number;
  location: { x: number; y: number };
  duration: number;
  color: string;
}

export enum ProgressionStage {
  PRIMORDIAL = 'Primordial Formation',
  EARLY_EARTH = 'Early Earth (4.5-4.0 Ga)',
  HADEAN = 'Hadean Eon (4.0-3.8 Ga)',
  ARCHEAN = 'Archean Eon (3.8-2.5 Ga)', 
  PROTEROZOIC = 'Proterozoic Era (2.5-0.54 Ga)',
  PALEOZOIC = 'Paleozoic Era (540-250 Ma)',
  MESOZOIC = 'Mesozoic Era (250-65 Ma)',
  CENOZOIC = 'Cenozoic Era (65 Ma-Present)',
  MODERN = 'Modern Earth',
  ADVANCED = 'Advanced Civilization'
}

export class ProceduralPlanetGenerator {
  private noiseSeeds: number[] = [];
  private planetCounter: number = 0;
  
  constructor() {
    this.generateNoiseSeeds();
  }
  
  private generateNoiseSeeds(): void {
    for (let i = 0; i < 100; i++) {
      this.noiseSeeds.push(Math.random() * 1000);
    }
  }
  
  /**
   * Generate a unique planet surface with procedural biomes
   */
  generatePlanetSurface(planetId: string, habitability: number, mass: number): PlanetSurface {
    const seed = this.stringToSeed(planetId);
    const rng = this.createSeededRandom(seed);
    
    // Determine planet type based on habitability and mass
    const planetType = this.determinePlanetType(habitability, mass, rng);
    
    // Generate progression stage (Earth-like evolution)
    const progressionStage = this.determineProgressionStage(habitability, rng);
    
    // Generate biomes based on planet type and progression
    const biomes = this.generateBiomes(planetType, progressionStage, habitability, rng);
    
    // Generate surface features
    const surfaceFeatures = this.generateSurfaceFeatures(planetType, biomes, rng);
    
    // Generate atmospheric effects
    const atmosphericEffects = this.generateAtmosphericEffects(planetType, rng);
    
    return {
      planetType,
      biomes,
      surfaceFeatures,
      atmosphericEffects,
      geologicalActivity: rng() * (planetType === 'volcanic' ? 1.0 : 0.5),
      magneticField: rng() * (mass > 0.5 ? 1.0 : 0.3),
      dayNightCycle: 12 + rng() * 36, // 12-48 hours
      seasonalVariation: rng(),
      progressionStage
    };
  }
  
  /**
   * Determine planet type based on parameters
   */
  private determinePlanetType(habitability: number, mass: number, rng: () => number): string {
    if (habitability > 0.8 && mass > 0.5) return 'earth_like';
    if (habitability > 0.6) return 'habitable';
    if (mass > 10) return 'gas_giant';
    if (mass < 0.1) return 'asteroid';
    if (rng() < 0.3 && mass > 2) return 'volcanic';
    if (rng() < 0.2) return 'ice_world';
    if (rng() < 0.15) return 'desert_world';
    if (rng() < 0.1) return 'toxic';
    return 'barren';
  }
  
  /**
   * Determine evolutionary progression stage
   */
  private determineProgressionStage(habitability: number, rng: () => number): ProgressionStage {
    if (habitability < 0.1) return ProgressionStage.PRIMORDIAL;
    
    const stageRoll = rng();
    const stages = Object.values(ProgressionStage);
    
    // Higher habitability increases chance of advanced stages
    const progressionBonus = habitability * 0.3;
    const adjustedRoll = Math.min(0.99, stageRoll + progressionBonus);
    
    const stageIndex = Math.floor(adjustedRoll * stages.length);
    return stages[stageIndex] as ProgressionStage;
  }
  
  /**
   * Generate diverse biomes for the planet
   */
  private generateBiomes(
    planetType: string, 
    progressionStage: ProgressionStage, 
    habitability: number, 
    rng: () => number
  ): BiomeData[] {
    const biomes: BiomeData[] = [];
    
    // Base biomes by planet type
    const baseBiomes = this.getBaseBiomes(planetType);
    
    // Add biomes based on progression stage
    const evolutionaryBiomes = this.getEvolutionaryBiomes(progressionStage, habitability);
    
    // Combine and generate unique variations
    const allPossibleBiomes = [...baseBiomes, ...evolutionaryBiomes];
    
    // Select 2-6 biomes for diversity (can be 0 for barren worlds)
    const biomeCount = planetType === 'barren' ? 
      (rng() < 0.3 ? 1 : 0) : // 30% chance of 1 biome on barren worlds
      Math.floor(rng() * 5) + 2; // 2-6 biomes otherwise
    
    let remainingCoverage = 100;
    
    for (let i = 0; i < biomeCount && remainingCoverage > 0; i++) {
      const biomeTemplate = allPossibleBiomes[Math.floor(rng() * allPossibleBiomes.length)];
      
      // Generate coverage (ensure last biome gets remaining coverage)
      const coverage = i === biomeCount - 1 ? 
        remainingCoverage : 
        Math.min(remainingCoverage, rng() * (remainingCoverage / (biomeCount - i)));
      
      remainingCoverage -= coverage;
      
      // Create unique biome variation
      const biome: BiomeData = {
        ...biomeTemplate,
        coverage,
        temperature: biomeTemplate.temperature + (rng() - 0.5) * 20,
        humidity: Math.max(0, Math.min(1, biomeTemplate.humidity + (rng() - 0.5) * 0.4)),
        lifeComplexity: Math.max(0, Math.min(1, biomeTemplate.lifeComplexity * habitability)),
        uniqueFeatures: this.generateUniqueFeatures(biomeTemplate.name, rng)
      };
      
      biomes.push(biome);
    }
    
    return biomes;
  }
  
  /**
   * Get base biomes for planet type
   */
  private getBaseBiomes(planetType: string): BiomeData[] {
    const biomeLibrary: { [key: string]: BiomeData[] } = {
      earth_like: [
        {
          name: 'Temperate Forest',
          color: '#228B22',
          temperature: 15,
          humidity: 0.7,
          coverage: 0,
          evolutionStage: 6,
          lifeComplexity: 0.8,
          atmosphericComposition: ['Oxygen', 'Nitrogen'],
          uniqueFeatures: ['Ancient trees', 'Rich biodiversity']
        },
        {
          name: 'Ocean',
          color: '#006994',
          temperature: 10,
          humidity: 1.0,
          coverage: 0,
          evolutionStage: 3,
          lifeComplexity: 0.9,
          atmosphericComposition: ['Water vapor', 'Oxygen'],
          uniqueFeatures: ['Deep trenches', 'Coral reefs', 'Marine life']
        },
        {
          name: 'Grasslands',
          color: '#9ACD32',
          temperature: 20,
          humidity: 0.5,
          coverage: 0,
          evolutionStage: 7,
          lifeComplexity: 0.6,
          atmosphericComposition: ['Oxygen', 'Nitrogen'],
          uniqueFeatures: ['Vast plains', 'Migratory animals']
        }
      ],
      
      volcanic: [
        {
          name: 'Lava Fields',
          color: '#FF4500',
          temperature: 200,
          humidity: 0.1,
          coverage: 0,
          evolutionStage: 1,
          lifeComplexity: 0.1,
          atmosphericComposition: ['Sulfur dioxide', 'Carbon dioxide'],
          uniqueFeatures: ['Active volcanoes', 'Geysers', 'Mineral deposits']
        },
        {
          name: 'Volcanic Ash Plains',
          color: '#696969',
          temperature: 80,
          humidity: 0.2,
          coverage: 0,
          evolutionStage: 2,
          lifeComplexity: 0.2,
          atmosphericComposition: ['Ash particles', 'Carbon dioxide'],
          uniqueFeatures: ['Ash storms', 'Extremophile bacteria']
        }
      ],
      
      ice_world: [
        {
          name: 'Frozen Ocean',
          color: '#E0FFFF',
          temperature: -40,
          humidity: 0.9,
          coverage: 0,
          evolutionStage: 2,
          lifeComplexity: 0.3,
          atmosphericComposition: ['Water vapor', 'Nitrogen'],
          uniqueFeatures: ['Ice caves', 'Subsurface ocean', 'Cryovolcanoes']
        },
        {
          name: 'Polar Ice Caps',
          color: '#F0F8FF',
          temperature: -60,
          humidity: 0.1,
          coverage: 0,
          evolutionStage: 1,
          lifeComplexity: 0.1,
          atmosphericComposition: ['Nitrogen', 'Methane'],
          uniqueFeatures: ['Glacier formations', 'Ice storms']
        }
      ],
      
      desert_world: [
        {
          name: 'Sand Dunes',
          color: '#F4A460',
          temperature: 45,
          humidity: 0.1,
          coverage: 0,
          evolutionStage: 3,
          lifeComplexity: 0.2,
          atmosphericComposition: ['Nitrogen', 'Argon'],
          uniqueFeatures: ['Massive dunes', 'Sand storms', 'Oasis rare']
        }
      ],
      
      barren: [] // Empty array for barren worlds
    };
    
    return biomeLibrary[planetType] || [];
  }
  
  /**
   * Get biomes based on evolutionary stage
   */
  private getEvolutionaryBiomes(stage: ProgressionStage, habitability: number): BiomeData[] {
    const evolutionBiomes: BiomeData[] = [];
    
    // Add civilization biomes for advanced stages
    if (stage === ProgressionStage.MODERN || stage === ProgressionStage.ADVANCED) {
      evolutionBiomes.push({
        name: 'Urban Centers',
        color: '#708090',
        temperature: 25,
        humidity: 0.4,
        coverage: 0,
        evolutionStage: 9,
        lifeComplexity: 1.0,
        atmosphericComposition: ['Oxygen', 'Nitrogen', 'Pollutants'],
        uniqueFeatures: ['Megacities', 'Transportation networks', 'Industrial zones']
      });
    }
    
    // Add complex ecosystems for later stages
    if (stage === ProgressionStage.CENOZOIC || stage === ProgressionStage.MODERN) {
      evolutionBiomes.push({
        name: 'Complex Ecosystem',
        color: '#32CD32',
        temperature: 18,
        humidity: 0.8,
        coverage: 0,
        evolutionStage: 8,
        lifeComplexity: 0.9,
        atmosphericComposition: ['Oxygen', 'Nitrogen'],
        uniqueFeatures: ['Biodiversity hotspots', 'Food webs', 'Apex predators']
      });
    }
    
    return evolutionBiomes;
  }
  
  /**
   * Generate unique features for biomes
   */
  private generateUniqueFeatures(biomeName: string, rng: () => number): string[] {
    const features: string[] = [];
    const featureLibrary = [
      'Crystal formations', 'Underground rivers', 'Ancient ruins', 'Rare minerals',
      'Bioluminescent organisms', 'Thermal vents', 'Magnetic anomalies', 'Time crystals',
      'Floating islands', 'Energy storms', 'Living rock formations', 'Quantum flora'
    ];
    
    const featureCount = Math.floor(rng() * 3) + 1; // 1-3 features
    
    for (let i = 0; i < featureCount; i++) {
      const feature = featureLibrary[Math.floor(rng() * featureLibrary.length)];
      if (!features.includes(feature)) {
        features.push(feature);
      }
    }
    
    return features;
  }
  
  /**
   * Generate surface features based on biomes
   */
  private generateSurfaceFeatures(planetType: string, biomes: BiomeData[], rng: () => number): SurfaceFeature[] {
    const features: SurfaceFeature[] = [];
    const featureCount = Math.floor(rng() * 20) + 10; // 10-30 features
    
    for (let i = 0; i < featureCount; i++) {
      const feature: SurfaceFeature = {
        type: this.selectFeatureType(planetType, biomes, rng),
        x: rng() * 360, // Longitude
        y: (rng() - 0.5) * 180, // Latitude
        size: rng() * 100 + 10, // 10-110 km
        height: rng() * 8000, // 0-8000m height
        age: rng() * 4000, // 0-4000 million years
        activity: rng()
      };
      
      features.push(feature);
    }
    
    return features;
  }
  
  /**
   * Select appropriate feature type for planet
   */
  private selectFeatureType(planetType: string, biomes: BiomeData[], rng: () => number): SurfaceFeature['type'] {
    const baseFeatures: SurfaceFeature['type'][] = ['mountain', 'crater'];
    
    // Add features based on biomes
    for (const biome of biomes) {
      if (biome.name.includes('Ocean')) baseFeatures.push('ocean');
      if (biome.name.includes('Desert')) baseFeatures.push('desert');
      if (biome.name.includes('Forest')) baseFeatures.push('forest');
      if (biome.name.includes('Ice') || biome.name.includes('Frozen')) baseFeatures.push('ice_cap', 'tundra');
      if (biome.name.includes('Volcanic') || biome.name.includes('Lava')) baseFeatures.push('volcano');
      if (biome.name.includes('Urban') || biome.name.includes('City')) baseFeatures.push('city');
    }
    
    return baseFeatures[Math.floor(rng() * baseFeatures.length)];
  }
  
  /**
   * Generate atmospheric effects
   */
  private generateAtmosphericEffects(planetType: string, rng: () => number): AtmosphericEffect[] {
    const effects: AtmosphericEffect[] = [];
    const effectCount = Math.floor(rng() * 5) + 2; // 2-6 effects
    
    for (let i = 0; i < effectCount; i++) {
      const effect: AtmosphericEffect = {
        type: this.selectAtmosphericEffect(planetType, rng),
        intensity: rng(),
        location: { x: rng() * 360, y: (rng() - 0.5) * 180 },
        duration: rng() * 24 * 7, // Up to a week
        color: this.getEffectColor(planetType, rng)
      };
      
      effects.push(effect);
    }
    
    return effects;
  }
  
  /**
   * Select atmospheric effect type
   */
  private selectAtmosphericEffect(planetType: string, rng: () => number): AtmosphericEffect['type'] {
    const baseEffects: AtmosphericEffect['type'][] = ['clouds', 'storm'];
    
    if (planetType === 'ice_world') baseEffects.push('aurora_borealis');
    if (planetType === 'volcanic') baseEffects.push('dust');
    if (planetType === 'earth_like' || planetType === 'habitable') {
      baseEffects.push('aurora', 'cyclone');
    }
    
    return baseEffects[Math.floor(rng() * baseEffects.length)];
  }
  
  /**
   * Get effect color based on planet type
   */
  private getEffectColor(planetType: string, rng: () => number): string {
    const colorSets = {
      earth_like: ['#87CEEB', '#98FB98', '#FFE4E1'],
      volcanic: ['#FF4500', '#DC143C', '#FF6347'],
      ice_world: ['#E0FFFF', '#B0E0E6', '#AFEEEE'],
      default: ['#FFFFFF', '#F0F0F0', '#E6E6FA']
    };
    
    const colors = colorSets[planetType as keyof typeof colorSets] || colorSets.default;
    return colors[Math.floor(rng() * colors.length)];
  }
  
  /**
   * Create seeded random number generator
   */
  private createSeededRandom(seed: number): () => number {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  }
  
  /**
   * Convert string to numeric seed
   */
  private stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}