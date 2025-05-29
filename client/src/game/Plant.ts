export type CosmicBodyType = 'plant' | 'protostar' | 'star' | 'galaxy' | 'planet' | 'lifeForm' | 'dwarf_planet' | 
  'gas_giant' | 'neutron_star' | 'blackhole' | 'nebula' | 'asteroid' | 'comet' | 'water_body' | 'mountain' | 'geological_feature' | 'biome' | 
  'plains' | 'crater' | 'formation' | 'canyon' | 'unique_feature' | 'planetary_core' | 'atmosphere' | 'aurora' | 
  'volcano' | 'fault_line' | 'hot_spot' | 'rift_valley' | 'storm_system' | 'jet_stream' | 'pressure_system' | 
  'climate_zone' | 'settlement' | 'ecosystem' | 'megafauna' | 'alien_artifact' | 'storm' | 'event_horizon' | 
  'singularity' | 'accretion_material' | 'xray_flare' | 'jet_material' | 'jet_shock' | 'gravitational_lensing' | 
  'hawking_radiation' | 'quantum_fluctuation' | 'information_paradox' | 'spacetime_grid' | 'frame_dragging' | 'ergosphere' | 
  'stellar_core' | 'photosphere' | 'chromosphere' | 'corona' | 'solar_flare' | 'coronal_mass_ejection' | 'prominence' | 
  'sunspot' | 'stellar_wind' | 'helium_flash' | 'degenerate_matter' | 'fusion_layer';

export type GalaxyType = 'spiral' | 'elliptical' | 'irregular' | 'lenticular';
export type StarType = 'main_sequence' | 'red_giant' | 'white_dwarf' | 'neutron' | 'yellow_dwarf' | 'red_dwarf' | 'blue_giant';
export type PlanetType = 'rocky' | 'gas_giant' | 'ice_giant' | 'dwarf' | 'habitable';

export interface CosmicProperties {
  // Galaxy properties
  galaxyType?: GalaxyType;
  starDensity?: number; // 0-1 density of stars
  darkMatterRatio?: number; // 0-1 ratio of dark matter
  spiralArms?: number; // for spiral galaxies
  
  // Star properties
  starType?: StarType;
  temperature?: number; // Kelvin
  luminosity?: number; // 0-1 relative to our sun
  stellarMass?: number; // Solar masses
  stellarClass?: string; // Spectral classification (O, B, A, F, G, K, M)
  stellarAge?: number; // Age in billions of years
  
  // Planet properties
  planetType?: PlanetType;
  mass?: number; // Earth masses
  atmosphere?: number; // 0-1 atmosphere density
  atmosphereType?: string; // Type of atmosphere (oxygen_nitrogen, carbon_dioxide, hydrogen_helium, methane, etc.)
  hydrosphere?: number; // 0-1 water coverage
  magneticField?: number; // 0-1 strength
  dayLength?: number; // Rotational period (hours)
  yearLength?: number; // Orbital period (days)
  surfaceTemperature?: number; // Celsius
  atmosphericComposition?: Map<string, number>; // Gas type to percentage
  moons?: number; // Number of moons
  surfaceGravity?: number; // Surface gravity in g (Earth = 1)
  geologicalActivity?: number; // 0-1 level of geological activity (plate tectonics, volcanism)
  
  // Black hole properties
  eventHorizonRadius?: number; // Radius in km
  spinRate?: number; // 0-1 rotational rate
  accretionDisk?: boolean; // Whether the black hole has an accretion disk
  isActive?: boolean; // Whether the black hole is actively feeding and producing jets
  isRotating?: boolean; // Whether the black hole is rotating (has angular momentum)
  
  // Nebula properties
  nebulaType?: string; // Type of nebula (emission, reflection, dark, planetary)
  elementComposition?: string; // Chemical composition
  starFormationRate?: string; // Rate of star formation (high, medium, low)
  
  // Life properties
  biodiversity?: number; // 0-1 ecosystem complexity
  techLevel?: number; // 0-1 technological advancement
  speciesCount?: number; // Number of species
  dominantSpecies?: string; // Name of dominant species
  
  // Physics and interaction properties
  collisionEffects?: Array<{
    type: string;      // Type of collision effect (e.g., 'stellar_formation', 'planetary_destruction')
    x: number;         // X position of the effect
    y: number;         // Y position of the effect
    size: number;      // Size scale of the effect
    startTime: number; // When the effect started (for animation timing)
    duration?: number; // How long the effect lasts in milliseconds
    particles?: number; // Number of particles to emit for the effect
    color?: string;    // Primary color of the effect
  }>;
  
  // Scanning properties (for the scanning mechanic)
  isScanned?: boolean; // Whether this body has been scanned by the player
  scanProgress?: number; // 0-1 progress of current scan
  discoveredFeatures?: string[]; // Special features discovered during scanning
  scanData?: {
    composition?: Map<string, number>; // Element composition percentages
    anomalies?: string[]; // Unusual features detected
    lifeSignals?: number; // 0-1 indication of potential life
    resources?: Map<string, number>; // Resources available for extraction
  };
}

export class Plant {
  public x: number;
  public y: number;
  public energy: number;
  public size: number;
  public age: number = 0;
  public branches: Branch[] = [];
  public oscillation: number = 0;
  public color: string = '';
  public type: CosmicBodyType = 'plant';
  public universePhase: number = 0;
  public rotation: number = 0;
  public satellites: Satellite[] = [];
  public habitability: number = 0; // 0-1 rating of how habitable for life (planets only)
  public lifeComplexity: number = 0; // 0-1 rating of life complexity (planets only)
  public evolutionProgress: number = 0; // For life forms, progress towards next evolution
  public name: string = ''; // Name of the cosmic body
  
  // New properties for more scientific simulation
  public cosmicProperties: CosmicProperties = {}; // Advanced properties for realistic simulation
  public id: string = `cosmic-${Date.now()}-${Math.floor(Math.random() * 100000)}`; // Unique identifier for each cosmic body
  public parent: Plant | null = null; // Parent cosmic body (e.g., star for a planet)
  public children: Plant[] = []; // Child cosmic bodies (e.g., planets for a star)
  public isInteractable: boolean = false; // Whether the player can interact with/enter this body
  public isExpanded: boolean = false; // Whether this body is currently expanded (player is inside it)
  public interior: Plant[] = []; // Interior elements when inside this cosmic body
  public resources: Map<string, number> = new Map(); // Resources available in this cosmic body
  public description: string = ''; // Scientific description of the cosmic body
  public pulsateSpeed: number = 0; // Speed of visual pulsation effect
  public pulsateAmount: number = 0; // Magnitude of visual pulsation
  public canBeInteractedWith: boolean = false; // Whether this object supports direct interaction
  
  constructor(x: number, y: number, initialEnergy: number, universePhase: number = 0) {
    this.x = x;
    this.y = y;
    this.energy = initialEnergy;
    this.universePhase = universePhase;
    
    // Determine type based on universe phase
    if (universePhase <= 4) {
      this.type = 'plant'; // Just energy clusters in early universe
    } else if (universePhase === 5) {
      this.type = 'protostar'; // Early star formation
    } else if (universePhase === 6 || universePhase === 7) {
      this.type = 'star'; // Stars form
    } else if (universePhase === 8) {
      this.type = Math.random() < 0.3 ? 'galaxy' : 'star'; // Galaxies begin to form
    } else if (universePhase >= 9 && universePhase <= 10) {
      // Mix of galaxies, stars and planets
      const randType = Math.random();
      if (randType < 0.2) this.type = 'galaxy';
      else if (randType < 0.6) this.type = 'star';
      else this.type = 'planet';
    } else if (universePhase >= 11) {
      // Life-bearing planets possible in final phases
      const randType = Math.random();
      if (randType < 0.1) this.type = 'galaxy';
      else if (randType < 0.4) this.type = 'star';
      else {
        this.type = 'planet';
        // Some planets may develop life in the final phase
        if (universePhase >= 12 && Math.random() < 0.4) {
          this.habitability = 0.3 + Math.random() * 0.7;
          this.lifeComplexity = Math.random() * 0.5;
          
          if (this.lifeComplexity > 0.3) {
            this.type = 'lifeForm';
          }
        }
      }
    }
    
    // Set specific cosmic properties based on type
    this.setupCosmicProperties();
    
    // Size depends on type and energy
    switch(this.type) {
      case 'galaxy':
        this.size = 20 + initialEnergy * 15;
        break;
      case 'star':
        this.size = 8 + initialEnergy * 7;
        break;
      case 'protostar':
        this.size = 6 + initialEnergy * 5;
        break;
      case 'planet':
        this.size = 4 + initialEnergy * 3;
        break;
      case 'lifeForm':
        this.size = 3 + initialEnergy * 2;
        break;
      default: // plant/energy cluster
        this.size = 5 + initialEnergy * 4;
    }
    
    // Create color based on type
    this.generateColor();
    
    // Create branches or satellites based on type
    if (this.type === 'plant' || this.type === 'protostar') {
      // Energy clusters and protostars have branch-like emissions
      const branchCount = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < branchCount; i++) {
        const angle = (i * Math.PI * 2) / branchCount;
        this.branches.push(new Branch(0, 0, angle, this.size * 0.5));
      }
    } else if (this.type === 'star') {
      // Stars may have planets
      if (Math.random() < 0.5) {
        const planetCount = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < planetCount; i++) {
          this.satellites.push(new Satellite(
            this.size * 1.5 + i * this.size * 0.8,
            Math.random() * Math.PI * 2,
            this.size * 0.2 + Math.random() * this.size * 0.2
          ));
        }
      }
    } else if (this.type === 'galaxy') {
      // Galaxies have stars as satellites
      const starCount = 3 + Math.floor(Math.random() * 8);
      for (let i = 0; i < starCount; i++) {
        const distance = this.size * (0.3 + Math.random() * 0.7);
        this.satellites.push(new Satellite(
          distance,
          Math.random() * Math.PI * 2,
          this.size * 0.1 + Math.random() * this.size * 0.15
        ));
      }
    } else if (this.type === 'planet') {
      // Planets might have moons
      if (Math.random() < 0.4) {
        const moonCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < moonCount; i++) {
          this.satellites.push(new Satellite(
            this.size * 1.8 + i * this.size * 0.5,
            Math.random() * Math.PI * 2,
            this.size * 0.2 + Math.random() * this.size * 0.1
          ));
        }
      }
    }
  }
  
  private generateColor() {
    let hue, saturation, lightness;
    
    switch(this.type) {
      case 'protostar':
        // Protostars are reddish-orange
        hue = 10 + Math.floor(Math.random() * 20);
        saturation = 80 + Math.floor(Math.random() * 20);
        lightness = 50 + Math.floor(Math.random() * 30);
        break;
      case 'star':
        // Stars range from red to blue-white
        // Temperature classes: O (blue), B (blue-white), A (white), F (yellow-white), G (yellow), K (orange), M (red)
        const starClass = Math.floor(Math.random() * 7); // 0-6
        if (starClass === 0) { // O - hot blue
          hue = 230 + Math.floor(Math.random() * 20);
          saturation = 80 + Math.floor(Math.random() * 20);
          lightness = 70 + Math.floor(Math.random() * 20);
        } else if (starClass === 1) { // B - blue-white
          hue = 210 + Math.floor(Math.random() * 20);
          saturation = 70 + Math.floor(Math.random() * 20);
          lightness = 80 + Math.floor(Math.random() * 15);
        } else if (starClass === 2) { // A - white
          hue = 180 + Math.floor(Math.random() * 40);
          saturation = 30 + Math.floor(Math.random() * 20);
          lightness = 85 + Math.floor(Math.random() * 15);
        } else if (starClass === 3) { // F - yellow-white
          hue = 60 + Math.floor(Math.random() * 20);
          saturation = 70 + Math.floor(Math.random() * 30);
          lightness = 80 + Math.floor(Math.random() * 15);
        } else if (starClass === 4) { // G - yellow (sun-like)
          hue = 50 + Math.floor(Math.random() * 15);
          saturation = 80 + Math.floor(Math.random() * 20);
          lightness = 70 + Math.floor(Math.random() * 20);
        } else if (starClass === 5) { // K - orange
          hue = 30 + Math.floor(Math.random() * 15);
          saturation = 90 + Math.floor(Math.random() * 10);
          lightness = 60 + Math.floor(Math.random() * 15);
        } else { // M - red
          hue = 0 + Math.floor(Math.random() * 15);
          saturation = 90 + Math.floor(Math.random() * 10);
          lightness = 50 + Math.floor(Math.random() * 15);
        }
        break;
      case 'galaxy':
        // Galaxies have blue-white to yellow-white hues
        hue = 180 + Math.floor(Math.random() * 60);
        saturation = 50 + Math.floor(Math.random() * 30);
        lightness = 70 + Math.floor(Math.random() * 20);
        break;
      case 'planet':
        // Planets can be various colors - earthy tones, blues, reds
        const planetType = Math.floor(Math.random() * 6); // Different planet types
        if (planetType === 0) { // Earth-like
          hue = 180 + Math.floor(Math.random() * 30);
          saturation = 60 + Math.floor(Math.random() * 30);
          lightness = 40 + Math.floor(Math.random() * 20);
          this.habitability = 0.7 + Math.random() * 0.3; // High habitability
        } else if (planetType === 1) { // Mars-like
          hue = 10 + Math.floor(Math.random() * 20);
          saturation = 70 + Math.floor(Math.random() * 30);
          lightness = 40 + Math.floor(Math.random() * 20);
          this.habitability = 0.2 + Math.random() * 0.3; // Low-mid habitability
        } else if (planetType === 2) { // Gas giant, Jupiter-like
          hue = 40 + Math.floor(Math.random() * 30);
          saturation = 80 + Math.floor(Math.random() * 20);
          lightness = 50 + Math.floor(Math.random() * 20);
          this.habitability = 0.0 + Math.random() * 0.1; // Very low habitability
        } else if (planetType === 3) { // Ice giant, Neptune-like
          hue = 200 + Math.floor(Math.random() * 40);
          saturation = 80 + Math.floor(Math.random() * 20);
          lightness = 60 + Math.floor(Math.random() * 20);
          this.habitability = 0.0 + Math.random() * 0.05; // Extremely low habitability
        } else if (planetType === 4) { // Venus-like
          hue = 50 + Math.floor(Math.random() * 30);
          saturation = 40 + Math.floor(Math.random() * 30);
          lightness = 70 + Math.floor(Math.random() * 20);
          this.habitability = 0.0 + Math.random() * 0.2; // Very low habitability
        } else { // Other exotic
          hue = Math.floor(Math.random() * 360);
          saturation = 60 + Math.floor(Math.random() * 40);
          lightness = 30 + Math.floor(Math.random() * 40);
          this.habitability = Math.random() * 0.5; // Variable habitability
        }
        break;
      case 'lifeForm':
        // Life forms are greenish or bluish
        hue = Math.random() < 0.7 ? 
              120 + Math.floor(Math.random() * 60) : // Green to blue-green
              200 + Math.floor(Math.random() * 40);  // Blue to purple-blue
        saturation = 60 + Math.floor(Math.random() * 40);
        lightness = 40 + Math.floor(Math.random() * 30);
        break;
      default: // Plant/energy cluster
        // Random color for basic energy structures
        hue = Math.floor(Math.random() * 360);
        saturation = 70 + Math.floor(Math.random() * 30);
        lightness = 40 + Math.floor(Math.random() * 20);
    }
    
    this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  // Physics-based collision effects between celestial bodies
  private checkCollisions(plants: Plant[], deltaTime: number) {
    // Skip if this is an interior element or not collidable
    if (this.parent || this.type === 'atmosphere' || this.type === 'planetary_core') {
      return;
    }
    
    const collisionRadius = this.size * 10; // Collision radius for detection
    
    for (const other of plants) {
      // Skip collisions with self, parent objects, or interior elements
      if (other === this || other === this.parent || other.parent === this || other.parent) {
        continue;
      }
      
      // Calculate distance between the two bodies
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const combinedRadius = collisionRadius + (other.size * 10);
      
      // Check if bodies are close enough for gravitational influence
      const gravitationalRange = combinedRadius * 5;
      if (distance < gravitationalRange) {
        // Apply gravitational effects for nearby bodies
        this.applyGravitationalEffects(other, distance, dx, dy, deltaTime);
      }
      
      // Check for actual collision
      if (distance < combinedRadius) {
        this.handleCollision(other, distance, dx, dy);
      }
    }
  }
  
  // Apply gravitational influence between celestial bodies
  private applyGravitationalEffects(other: Plant, distance: number, dx: number, dy: number, deltaTime: number) {
    // Calculate gravitational force based on masses (size) and distance
    // Simplified version of Newton's gravitational formula: F = G * (m1 * m2) / r²
    const G = 0.05; // Gravitational constant (adjusted for game scale)
    const forceMagnitude = G * (this.size * other.size) / (distance * distance);
    
    // Don't move massive objects like stars and galaxies much
    let massRatio = this.size / (this.size + other.size);
    if (this.type === 'star' || this.type === 'galaxy' || this.type === 'blackhole') {
      massRatio *= 0.1; // Stars/galaxies move less
    }
    if (other.type === 'star' || other.type === 'galaxy' || other.type === 'blackhole') {
      massRatio *= 10; // Smaller objects move more toward massive ones
    }
    
    // Calculate force components
    const forceX = (forceMagnitude * dx / distance) * massRatio;
    const forceY = (forceMagnitude * dy / distance) * massRatio;
    
    // Apply gravitational pull (smaller bodies move more)
    this.x -= forceX * deltaTime * 10;
    this.y -= forceY * deltaTime * 10;
  }
  
  // Handle collision between celestial bodies
  private handleCollision(other: Plant, distance: number, dx: number, dy: number) {
    // Determine what happens when different cosmic bodies collide
    
    // 1. Protostar + Protostar = Star formation
    if ((this.type === 'protostar' && other.type === 'protostar') ||
        (this.type === 'plant' && other.type === 'protostar') || 
        (this.type === 'protostar' && other.type === 'plant')) {
      
      // Transform into a star if enough mass is accumulated
      if (this.size + other.size > 10) {
        this.type = 'star';
        this.size = Math.min(this.size + other.size * 0.7, 20);
        this.color = '#FFF9E5'; // Star color
        
        // Setup stellar properties
        this.cosmicProperties.starType = 'main_sequence';
        this.cosmicProperties.temperature = 5000 + Math.random() * 3000;
        
        // Create visual effect for star formation
        this.createCollisionEffect('stellar_formation');
      } else {
        // Just grow in size if not enough for star formation
        this.size = Math.min(this.size + other.size * 0.5, 15);
      }
      
      // Mark the other object for removal
      other.energy = -1;
    }
    
    // 2. Planet + Planet = Larger planet or planetary destruction
    else if (this.type === 'planet' && other.type === 'planet') {
      const collisionVelocity = Math.abs(dx) + Math.abs(dy);
      
      // High velocity = destructive collision
      if (collisionVelocity > 10) {
        // Create debris field from collision
        this.createCollisionEffect('planetary_destruction');
        
        // Both planets are destroyed in violent collision
        this.energy = -1;
        other.energy = -1;
      } else {
        // Merger - the larger planet absorbs the smaller one
        if (this.size >= other.size) {
          this.size = Math.min(this.size + other.size * 0.4, 12);
          other.energy = -1;
          
          // Chance to develop atmosphere or water from impact
          if (!this.cosmicProperties.atmosphere && Math.random() > 0.5) {
            this.cosmicProperties.atmosphere = 0.2 + Math.random() * 0.3;
          }
          
          this.createCollisionEffect('planetary_merger');
        }
      }
    }
    
    // 3. Star + Planet = Planet gets consumed
    else if ((this.type === 'star' && other.type === 'planet') ||
            (this.type === 'planet' && other.type === 'star')) {
      
      const star = this.type === 'star' ? this : other;
      const planet = this.type === 'planet' ? this : other;
      
      // Star grows slightly from consuming the planet
      star.size = Math.min(star.size + planet.size * 0.1, 25);
      
      // Create solar flare effect
      this.createCollisionEffect('stellar_flare');
      
      // Planet is destroyed
      planet.energy = -1;
    }
    
    // 4. Blackhole collisions - blackholes consume everything
    else if (this.type === 'blackhole' || other.type === 'blackhole') {
      const blackhole = this.type === 'blackhole' ? this : other;
      const consumed = this.type === 'blackhole' ? other : this;
      
      // Blackhole grows based on what it consumes
      blackhole.size = Math.min(blackhole.size + consumed.size * 0.3, 30);
      
      // Create accretion effect
      this.createCollisionEffect('accretion_event');
      
      // The consumed object is destroyed
      consumed.energy = -1;
      
      // Chance to create relativistic jets if consuming a star
      if (consumed.type === 'star' && !blackhole.cosmicProperties.isActive) {
        blackhole.cosmicProperties.isActive = true;
      }
    }
    
    // 5. Other collisions just push objects apart (elastic collision)
    else {
      // Calculate the unit vector of the collision
      const nx = dx / distance;
      const ny = dy / distance;
      
      // Calculate the overlap amount
      const combinedRadius = this.size * 10 + other.size * 10;
      const overlap = combinedRadius - distance;
      
      // Move objects apart based on their relative masses
      const totalMass = this.size + other.size;
      const thisRatio = other.size / totalMass;
      const otherRatio = this.size / totalMass;
      
      // Apply the positional correction
      this.x += nx * overlap * thisRatio;
      this.y += ny * overlap * thisRatio;
      other.x -= nx * overlap * otherRatio;
      other.y -= ny * overlap * otherRatio;
      
      // Create minor collision effect
      this.createCollisionEffect('minor_impact');
    }
  }
  
  // Create visual effects for different collision types
  private createCollisionEffect(effectType: string) {
    // This will be used by the renderer to show explosion, debris, etc.
    // For now, just store the effect info for the renderer to use
    const effect = {
      type: effectType,
      x: this.x,
      y: this.y,
      size: this.size,
      startTime: Date.now()
    };
    
    // Store the effect (we'll implement this in the renderer)
    if (!this.cosmicProperties.collisionEffects) {
      this.cosmicProperties.collisionEffects = [];
    }
    this.cosmicProperties.collisionEffects.push(effect);
  }
  
  update(deltaTime: number, field: number[][], plants: Plant[] = []) {
    // Age the cosmic body
    this.age += deltaTime;
    
    // Update rotation
    this.rotation += deltaTime * (0.2 + Math.random() * 0.1);
    
    // Update oscillation for energy patterns
    this.oscillation += deltaTime * 2;
    
    // Check for collision with other cosmic bodies if we have a list
    if (plants.length > 0) {
      this.checkCollisions(plants, deltaTime);
    }
    
    // Type-specific updates
    switch(this.type) {
      case 'plant': // Energy clusters in early universe
      case 'protostar': // Proto-stars
        // Energy formations grow over time 
        if (this.age % 10 < deltaTime && this.branches.length < 8) {
          this.grow(0.1);
        }
        
        // Update energy branches
        for (const branch of this.branches) {
          branch.update(deltaTime, this.oscillation);
        }
        break;
        
      case 'star':
        // Stars gradually change over time
        // Some stars may grow or shrink based on their lifecycle
        if (this.age > 100 && Math.random() < 0.001 * deltaTime) {
          // Small chance for stellar evolution events
          const evolutionRoll = Math.random();
          
          if (evolutionRoll < 0.1 && this.size > 10) {
            // Red giant expansion
            this.size *= 1.2;
            this.color = `hsl(30, 90%, 60%)`; // Shift to orange-red
          } else if (evolutionRoll > 0.95 && this.size > 12) {
            // Supernova potential for large stars
            this.size *= 0.8;
            this.color = `hsl(220, 80%, 80%)`; // Shift to white-blue
          }
        }
        break;
        
      case 'galaxy':
        // Galaxies rotate more dramatically
        this.rotation += deltaTime * 0.3;
        
        // Galaxies may spawn new stars occasionally
        if (this.age > 50 && Math.random() < 0.005 * deltaTime && this.satellites.length < 20) {
          const distance = this.size * (0.3 + Math.random() * 0.7);
          this.satellites.push(new Satellite(
            distance,
            Math.random() * Math.PI * 2,
            this.size * 0.1 + Math.random() * this.size * 0.15
          ));
        }
        break;
        
      case 'planet':
        // Planets may develop more habitability over time in later phases
        if (this.universePhase >= 11 && this.habitability > 0.2) {
          // Small chance for habitability to increase
          if (Math.random() < 0.001 * deltaTime) {
            this.habitability = Math.min(1.0, this.habitability + 0.05);
            
            // If planet becomes highly habitable, life may form
            if (this.habitability > 0.7 && this.lifeComplexity === 0 && Math.random() < 0.5) {
              this.lifeComplexity = 0.1; // Simple life begins
              
              // Shift color slightly to reflect presence of life
              const oldColor = this.color;
              this.color = oldColor.replace(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/, 
                (_, h, s, l) => `hsl(${h}, ${Math.min(parseInt(s) + 10, 100)}%, ${l}%)`);
            }
          }
        }
        break;
        
      case 'lifeForm':
        // Life forms evolve over time
        if (Math.random() < 0.002 * deltaTime) {
          this.evolutionProgress += 0.05;
          
          // Major evolutionary leaps
          if (this.evolutionProgress >= 1.0) {
            this.evolutionProgress = 0;
            this.lifeComplexity = Math.min(1.0, this.lifeComplexity + 0.1);
            
            // Visual changes based on new complexity
            if (this.lifeComplexity > 0.5) {
              // More complex life gets more distinct coloration
              const hue = 120 + Math.floor(Math.random() * 40); // Greens to teals
              const saturation = 60 + Math.floor(this.lifeComplexity * 30);
              const lightness = 40 + Math.floor(Math.random() * 20);
              this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            }
          }
        }
        break;
    }
    
    // Update all satellites
    for (const satellite of this.satellites) {
      satellite.update(deltaTime);
    }
    
    // All cosmic bodies interact with the quantum field
    const fieldX = Math.floor(this.x / 10);
    const fieldY = Math.floor(this.y / 10);
    
    if (fieldX >= 0 && fieldX < field.length && 
        fieldY >= 0 && fieldY < field[0].length) {
        
      // Different interaction based on type
      let absorptionRate = 0.01;
      let fieldEffectRate = 0.99;
      
      if (this.type === 'star') {
        absorptionRate = 0.02; // Stars absorb more energy
        fieldEffectRate = 0.97; // And affect field more strongly
      } else if (this.type === 'galaxy') {
        absorptionRate = 0.03; // Galaxies have strongest effect
        fieldEffectRate = 0.95;
      }
      
      const fieldEnergy = Math.abs(field[fieldX][fieldY]);
      this.energy += fieldEnergy * absorptionRate * deltaTime;
      
      // Bodies reduce field energy as they absorb it
      field[fieldX][fieldY] *= fieldEffectRate;
    }
  }
  
  grow(amount: number) {
    // Increase size
    this.size += amount * 2;
    
    // Potentially add a new branch
    if (this.branches.length < 8 && Math.random() < 0.3) {
      const angle = Math.random() * Math.PI * 2;
      this.branches.push(new Branch(0, 0, angle, this.size * 0.3));
    }
    
    // Grow existing branches
    for (const branch of this.branches) {
      branch.grow(amount);
    }
  }
  
  getFieldStrength(): number {
    // How much this plant affects the quantum field
    return 0.05 * this.size;
  }
  
  /**
   * Sets up specific cosmic properties based on the cosmic body type
   * This adds scientific depth to the simulation
   */
  setupCosmicProperties(): void {
    switch (this.type) {
      case 'galaxy':
        // Galaxy properties
        const galaxyTypes: GalaxyType[] = ['spiral', 'elliptical', 'irregular', 'lenticular'];
        const galaxyType = galaxyTypes[Math.floor(Math.random() * galaxyTypes.length)];
        
        this.cosmicProperties.galaxyType = galaxyType;
        this.cosmicProperties.starDensity = 0.2 + Math.random() * 0.8;
        this.cosmicProperties.darkMatterRatio = 0.7 + Math.random() * 0.2; // Most galaxies have 70-90% dark matter
        
        if (galaxyType === 'spiral') {
          this.cosmicProperties.spiralArms = 2 + Math.floor(Math.random() * 6); // 2-7 spiral arms
        }
        
        // Set galaxy's scientific description
        if (galaxyType === 'spiral') {
          this.description = `A ${this.cosmicProperties.spiralArms}-armed spiral galaxy with a dark matter halo comprising ${Math.floor(this.cosmicProperties.darkMatterRatio * 100)}% of its mass. Contains various stellar populations, nebulae, and potentially a supermassive black hole at its center.`;
        } else if (galaxyType === 'elliptical') {
          this.description = `An elliptical galaxy composed primarily of older stars with minimal star formation. Contains approximately ${Math.floor(this.cosmicProperties.starDensity * 100000)} billion stars and is dominated by a dark matter halo.`;
        } else if (galaxyType === 'lenticular') {
          this.description = `A lenticular galaxy with properties between spiral and elliptical galaxies. Features a disk without spiral arms and a prominent central bulge with older stellar populations.`;
        } else {
          this.description = `An irregular galaxy without defined structure. Shows signs of intense star formation activity and possible recent gravitational interactions with other galaxies.`;
        }
        break;
        
      case 'star':
        // Star properties based on mass and spectral class
        const starMass = 0.1 + Math.random() * 50; // Solar masses (0.1 to 50)
        this.cosmicProperties.stellarMass = starMass;
        
        // Determine star type and properties based on mass
        let starType: StarType;
        let temperature: number;
        
        if (starMass > 15) {
          starType = 'blue_giant';
          temperature = 15000 + Math.random() * 15000;
        } else if (starMass > 8) {
          starType = Math.random() < 0.05 ? 'neutron' : 'blue_giant';
          temperature = starType === 'neutron' ? 500000 + Math.random() * 500000 : 10000 + Math.random() * 10000;
        } else if (starMass > 4) {
          starType = 'main_sequence';
          temperature = 6000 + Math.random() * 4000;
        } else if (starMass > 0.8) {
          starType = 'yellow_dwarf';
          temperature = 5000 + Math.random() * 1000;
        } else {
          starType = 'red_dwarf';
          temperature = 2500 + Math.random() * 1000;
        }
        
        this.cosmicProperties.starType = starType;
        this.cosmicProperties.temperature = temperature;
        
        // Luminosity roughly scales with mass^3.5 for main sequence stars
        this.cosmicProperties.luminosity = Math.pow(starMass, 3.5);
        
        // Set star's scientific description
        if (starType === 'blue_giant') {
          this.description = `A massive blue giant star ${Math.floor(starMass)} times more massive than our Sun. Surface temperature of ${Math.floor(temperature)} K makes it appear blue-white. Its high luminosity and strong stellar winds dramatically affect its surroundings.`;
        } else if (starType === 'neutron') {
          this.description = `A neutron star formed from the collapsed core of a massive supergiant. Despite being only about 20km in diameter, it contains ${Math.floor(starMass)} solar masses of material. Its extreme density creates intense gravitational and magnetic fields.`;
        } else if (starType === 'yellow_dwarf') {
          this.description = `A yellow dwarf star similar to our Sun. With a surface temperature of ${Math.floor(temperature)} K, it fuses hydrogen into helium in its core and will remain stable for billions of years.`;
        } else if (starType === 'red_dwarf') {
          this.description = `A small, cool red dwarf star with a mass ${starMass.toFixed(1)} times that of our Sun. With low luminosity but extremely long lifespan, stars like these constitute the majority of stars in the universe.`;
        } else {
          this.description = `A main sequence star with ${starMass.toFixed(1)} solar masses and surface temperature of ${Math.floor(temperature)} K. Currently in the stable phase of its life, converting hydrogen to helium through nuclear fusion.`;
        }
        break;
        
      case 'planet':
        // Planet properties
        let planetType: PlanetType;
        let mass: number;
        let atmosphere: number;
        let hydrosphere: number;
        
        // Determine planet type based on previous properties or randomization
        if (this.habitability > 0.5) {
          planetType = 'habitable';
          mass = 0.5 + Math.random() * 2; // Earth masses (0.5-2.5)
          atmosphere = 0.4 + Math.random() * 0.6; // Substantial atmosphere
          hydrosphere = 0.3 + Math.random() * 0.7; // Significant water
        } else if (Math.random() < 0.4) {
          planetType = 'rocky';
          mass = 0.1 + Math.random() * 3; // Earth masses
          atmosphere = Math.random() * 0.5; // Thin/no atmosphere
          hydrosphere = Math.random() * 0.2; // Little/no liquid water
        } else if (Math.random() < 0.7) {
          planetType = 'gas_giant';
          mass = 50 + Math.random() * 300; // Earth masses
          atmosphere = 0.8 + Math.random() * 0.2; // Very thick atmosphere
          hydrosphere = 0; // No surface water
        } else {
          planetType = 'ice_giant';
          mass = 10 + Math.random() * 40; // Earth masses
          atmosphere = 0.6 + Math.random() * 0.4; // Thick atmosphere
          hydrosphere = 0.4 + Math.random() * 0.4; // Frozen water/ammonia
        }
        
        this.cosmicProperties.planetType = planetType;
        this.cosmicProperties.mass = mass;
        this.cosmicProperties.atmosphere = atmosphere;
        this.cosmicProperties.hydrosphere = hydrosphere;
        
        // Calculate day/year lengths
        this.cosmicProperties.dayLength = 10 + Math.random() * 40; // Hours
        
        // Magnetic field - important for habitability
        this.cosmicProperties.magneticField = Math.random() * (planetType === 'habitable' ? 0.5 : 1) + 
                                             (planetType === 'habitable' ? 0.5 : 0);
        
        // Atmosphere composition
        const atmosphericComposition = new Map<string, number>();
        if (planetType === 'habitable') {
          atmosphericComposition.set('nitrogen', 65 + Math.random() * 15);
          atmosphericComposition.set('oxygen', 15 + Math.random() * 10);
          atmosphericComposition.set('argon', 0.5 + Math.random() * 1);
          atmosphericComposition.set('carbon dioxide', 0.1 + Math.random() * 0.5);
          atmosphericComposition.set('water vapor', 0.5 + Math.random() * 3);
        } else if (planetType === 'rocky') {
          atmosphericComposition.set('carbon dioxide', 80 + Math.random() * 15);
          atmosphericComposition.set('nitrogen', 2 + Math.random() * 5);
          atmosphericComposition.set('argon', 1 + Math.random() * 2);
        } else if (planetType === 'gas_giant') {
          atmosphericComposition.set('hydrogen', 75 + Math.random() * 15);
          atmosphericComposition.set('helium', 15 + Math.random() * 10);
          atmosphericComposition.set('methane', 1 + Math.random() * 2);
          atmosphericComposition.set('ammonia', 0.1 + Math.random() * 0.5);
        } else { // ice giant
          atmosphericComposition.set('hydrogen', 50 + Math.random() * 15);
          atmosphericComposition.set('helium', 10 + Math.random() * 10);
          atmosphericComposition.set('methane', 5 + Math.random() * 5);
          atmosphericComposition.set('water', 5 + Math.random() * 5);
          atmosphericComposition.set('ammonia', 5 + Math.random() * 5);
        }
        
        this.cosmicProperties.atmosphericComposition = atmosphericComposition;
        
        // Number of moons based on planet type
        this.cosmicProperties.moons = Math.floor(
          Math.random() * (
            planetType === 'gas_giant' ? 20 : 
            planetType === 'ice_giant' ? 15 : 
            3
          )
        );
        
        // Set planet's scientific description
        if (planetType === 'habitable') {
          this.description = `A habitable ${mass.toFixed(1)} Earth-mass planet with substantial atmosphere (${Math.floor(atmosphere * 100)}% Earth density) and hydrosphere (${Math.floor(hydrosphere * 100)}% surface coverage). Magnetic field and atmospheric composition suggest potential for complex life.`;
        } else if (planetType === 'rocky') {
          this.description = `A rocky terrestrial planet with ${mass.toFixed(1)} Earth masses. Has ${atmosphere < 0.1 ? 'minimal' : 'thin'} atmosphere composed primarily of carbon dioxide and shows ${hydrosphere > 0.1 ? 'evidence of past water activity' : 'no signs of liquid water'}.`;
        } else if (planetType === 'gas_giant') {
          this.description = `A gas giant approximately ${Math.floor(mass)} times Earth's mass. Composed primarily of hydrogen and helium with a possible rocky/metallic core. Features ${this.cosmicProperties.moons} moons and complex atmospheric dynamics including storm systems.`;
        } else {
          this.description = `An ice giant with ${Math.floor(mass)} Earth masses. Upper atmosphere contains significant methane giving it a blue-green appearance. Has ${this.cosmicProperties.moons} moons and possibly rings composed of ice particles.`;
        }
        break;
        
      case 'blackhole':
        // Black hole properties
        const blackholeMass = 4 + Math.random() * 996; // Solar masses (4-1000)
        const hasAccretionDisk = Math.random() < 0.7; // 70% chance
        
        // Schwarzschild radius calculation (simplified): Rs = 2GM/c^2
        // For our visualization purposes, we use a simplified conversion
        const eventHorizonRadius = blackholeMass * 0.0001; // Simplified for visualization
        
        this.cosmicProperties.stellarMass = blackholeMass;
        this.cosmicProperties.eventHorizonRadius = eventHorizonRadius;
        this.cosmicProperties.accretionDisk = hasAccretionDisk;
        
        // Black hole description
        this.description = `A ${blackholeMass > 100 ? 'supermassive' : 'stellar'} black hole with mass equivalent to ${Math.floor(blackholeMass)} Suns. Event horizon radius approximately ${(eventHorizonRadius * 3000).toFixed(1)} kilometers. ${hasAccretionDisk ? 'Surrounded by a luminous accretion disk of matter spiraling inward.' : 'Currently inactive with no significant accretion disk.'}`;
        break;
        
      case 'nebula':
        // Type of nebula - emission, reflection, dark, planetary, or supernova remnant
        const nebulaTypes = ['emission', 'reflection', 'dark', 'planetary', 'supernova_remnant'];
        const nebulaType = nebulaTypes[Math.floor(Math.random() * nebulaTypes.length)];
        
        // Nebula description
        if (nebulaType === 'emission') {
          this.description = "An emission nebula glowing with ionized gases, primarily hydrogen. The intense radiation from nearby hot stars causes the gas to emit its own light. A site of active star formation.";
        } else if (nebulaType === 'reflection') {
          this.description = "A reflection nebula consisting of dust that reflects the light from nearby stars. The blue color is due to the same scattering effect that makes Earth's sky blue.";
        } else if (nebulaType === 'dark') {
          this.description = "A dark nebula composed of dense dust clouds that block light from objects behind them. These regions are often molecular clouds where new stars may eventually form.";
        } else if (nebulaType === 'planetary') {
          this.description = "A planetary nebula formed from the ejected outer layers of a dying star. Despite the name, it has no connection to planets but represents a phase in stellar evolution.";
        } else {
          this.description = "A supernova remnant expanding through space, the aftermath of a massive stellar explosion. Contains heavy elements synthesized during the supernova and shock waves that may trigger new star formation.";
        }
        break;
        
      case 'protostar':
        // Protostar properties
        const protostarMass = 0.5 + Math.random() * 10; // Solar masses
        const protostarAge = Math.random() * 500000; // Age in years
        const tempClass = Math.floor(protostarAge / 100000); // 0-4 developmental stage
        
        this.description = `A protostar in stage ${tempClass} of formation, with approximately ${protostarMass.toFixed(1)} solar masses of material accreting. Surrounded by a dense disk of gas and dust, with bipolar jets ejecting material along magnetic field lines as the core contracts.`;
        break;
        
      case 'neutron_star':
        const neutronStarMass = 1.4 + Math.random() * 0.6; // Typical range for neutron stars
        const rotationPeriod = 0.001 + Math.random() * 5; // Seconds per rotation (from milliseconds to seconds)
        const magneticFieldStrength = Math.pow(10, 8 + Math.random() * 4); // From 10^8 to 10^12 times Earth's
        const isPulsar = rotationPeriod < 0.1; // Fast rotating neutron stars are pulsars
        
        this.description = `A neutron star with ${neutronStarMass.toFixed(2)} solar masses compressed into a sphere approximately 20km in diameter. ${isPulsar ? `Rotates every ${(rotationPeriod * 1000).toFixed(2)} milliseconds, creating regular pulses of radiation as a pulsar.` : `Rotates every ${rotationPeriod.toFixed(2)} seconds.`} Magnetic field strength approximately ${(magneticFieldStrength / 1e8).toFixed(0)} hundred million times Earth's.`;
        break;
        
      default:
        // Basic energy formations
        this.description = "A quantum energy formation in the early universe, exhibiting wave-particle duality and entanglement effects. May eventually condense into more structured cosmic bodies.";
    }
    
    // All cosmic bodies become interactable after a certain phase
    if (this.universePhase >= 5) {
      this.isInteractable = 
        this.type === 'galaxy' || 
        this.type === 'star' || 
        this.type === 'planet' || 
        this.type === 'blackhole' || 
        this.type === 'nebula' ||
        this.type === 'protostar' ||
        this.type === 'neutron_star';
    }
  }
}

class Branch {
  public x: number;
  public y: number;
  public angle: number;
  public length: number;
  public width: number;
  public segments: Segment[] = [];
  
  constructor(x: number, y: number, angle: number, length: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.width = length * 0.2;
    
    // Create initial segment
    this.segments.push(new Segment(0, 0, angle, length));
  }
  
  update(deltaTime: number, oscillation: number) {
    // Gently sway in the quantum field
    this.angle += Math.sin(oscillation) * 0.01;
    
    // Update segments
    let prevX = 0;
    let prevY = 0;
    
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      
      // Add some movement to each segment
      segment.angle = this.angle + Math.sin(oscillation + i) * 0.1;
      
      // Update segment position (relative to previous segment)
      segment.x = prevX;
      segment.y = prevY;
      
      // Calculate end point for next segment
      prevX = segment.x + Math.cos(segment.angle) * segment.length;
      prevY = segment.y + Math.sin(segment.angle) * segment.length;
    }
  }
  
  grow(amount: number) {
    // Extend existing segments
    for (const segment of this.segments) {
      segment.length += amount;
    }
    
    // Possibility to add a new segment (branch off)
    if (Math.random() < 0.2 && this.segments.length < 5) {
      const lastSegment = this.segments[this.segments.length - 1];
      const newAngle = lastSegment.angle + (Math.random() < 0.5 ? -1 : 1) * (Math.PI / 4);
      
      const endX = lastSegment.x + Math.cos(lastSegment.angle) * lastSegment.length;
      const endY = lastSegment.y + Math.sin(lastSegment.angle) * lastSegment.length;
      
      this.segments.push(new Segment(
        endX, endY, newAngle, lastSegment.length * 0.7
      ));
    }
  }
}

class Segment {
  public x: number;
  public y: number;
  public angle: number;
  public length: number;
  
  constructor(x: number, y: number, angle: number, length: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
  }
}

// Satellites represent planets orbiting stars, moons orbiting planets, or stars orbiting galaxies
export class Satellite {
  public distance: number; // Semi-major axis
  public angle: number;    // Mean anomaly (orbital position)
  public size: number;     // Size of satellite
  public orbitSpeed: number = 0.1 + Math.random() * 0.3; // Angular velocity
  public color: string = ''; // Satellite color
  public type: string = ''; // Type of satellite (planet, moon, star)
  public hasRings: boolean = false; // For planets like Saturn
  public ringColor: string = '';
  public ringSize: number = 0;
  public orbitPeriod: number = 0; // Time to complete one orbit (seconds)
  public orbitEccentricity: number = 0; // 0-1 measure of orbital ellipticity
  public orbitInclination: number = 0; // Orbital tilt (radians)
  public periapsis: number = 0; // Angle of closest approach
  public trueAnomaly: number = 0; // Actual position in orbit
  public rotationAngle: number = 0; // Current rotation angle
  public rotationSpeed: number = 0; // Rotation speed in radians/second
  public evolutionAge: number = 0; // Age for time-lapse evolution effects
  public evolutionStage: number = 0; // Current stage of evolution
  public evolutionTimer: number = 0; // Timer for evolution events
  public atmosphere: {density: number, color: string} | null = null; // Atmospheric properties
  public surfaceFeatures: string[] = []; // Surface features that appear over time
  public geologicalActivity: number = 0; // Level of geological activity
  public timelapseData: {
    originalSize: number;
    ageThresholds: number[];
    surfaceChanges: boolean;
    weatherEffects: boolean;
  } = {
    originalSize: 0,
    ageThresholds: [30, 60, 100],
    surfaceChanges: false,
    weatherEffects: false
  };
  
  constructor(distance: number, startingAngle: number, size: number) {
    this.distance = distance;
    this.angle = startingAngle;
    this.size = size;
    this.timelapseData.originalSize = size;
    
    // Enhanced orbital parameters for more realistic mechanics
    this.orbitEccentricity = Math.random() * 0.2; // Most planetary orbits have low eccentricity
    this.orbitInclination = Math.random() * Math.PI * 0.1; // Random orbital tilt (in radians)
    this.periapsis = Math.random() * Math.PI * 2; // Random orientation of elliptical orbit
    
    // Calculate realistic orbital speed based on Kepler's third law
    // The further from the center, the slower the orbit (T² ∝ a³)
    this.orbitSpeed = 0.2 / Math.sqrt(distance) * (0.8 + Math.random() * 0.4);
    this.orbitPeriod = (Math.PI * 2) / this.orbitSpeed; // Time for one orbit
    
    // Set rotation (day length) independent of orbit (year length)
    this.rotationSpeed = 0.5 + Math.random() * 1.5; // Random rotation speed
    this.rotationAngle = Math.random() * Math.PI * 2;
    this.trueAnomaly = this.angle; // Start with true anomaly = mean anomaly
    
    // Geological activity - younger bodies have more activity
    this.geologicalActivity = Math.random();
    
    // Randomly determine if this is a ringed planet (small chance)
    if (Math.random() < 0.2) {
      this.hasRings = true;
      this.ringSize = size * (1.5 + Math.random() * 0.5);
      
      // Ring color based on composition (icy, rocky, etc)
      const ringHue = Math.random() < 0.5 ? 
        30 + Math.floor(Math.random() * 30) : // Yellowish (Saturn-like)
        180 + Math.floor(Math.random() * 40); // Blueish (Neptune-like)
      const ringSaturation = 30 + Math.floor(Math.random() * 30);
      const ringLightness = 60 + Math.floor(Math.random() * 20);
      
      this.ringColor = `hsla(${ringHue}, ${ringSaturation}%, ${ringLightness}%, 0.6)`;
    }
    
    // Generate random color for the satellite
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 40);
    const lightness = 40 + Math.floor(Math.random() * 30);
    this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Type of satellite (more descriptive than functional)
    const types = ['rocky', 'gaseous', 'icy', 'molten', 'barren', 'oceanic'];
    this.type = types[Math.floor(Math.random() * types.length)];
    
    // Setup for time-lapse effects
    // Different types of celestial bodies evolve differently
    if (this.type === 'rocky' || this.type === 'oceanic') {
      this.timelapseData.surfaceChanges = true;
      
      // Start with basic surface features
      this.surfaceFeatures = ['barren'];
      
      // Rocky planets might develop atmospheres
      if (Math.random() > 0.5) {
        const atmDensity = Math.random() * 0.8;
        const atmHue = Math.random() < 0.7 ? 
          200 + Math.floor(Math.random() * 40) : // Blue atmosphere (Earth-like)
          20 + Math.floor(Math.random() * 30);   // Reddish atmosphere (Mars-like)
        
        this.atmosphere = {
          density: atmDensity,
          color: `hsla(${atmHue}, 70%, 70%, ${atmDensity * 0.3})`
        };
        
        // Planets with atmospheres can have weather
        this.timelapseData.weatherEffects = atmDensity > 0.4;
      }
    }
    else if (this.type === 'gaseous') {
      // Gas giants have different evolution - bands develop and change
      this.timelapseData.surfaceChanges = true;
      this.surfaceFeatures = ['uniform'];
      
      // All gas giants have atmospheres
      const atmHue = 30 + Math.floor(Math.random() * 60); // Yellowish to orangish
      this.atmosphere = {
        density: 0.9 + Math.random() * 0.1,
        color: `hsla(${atmHue}, 80%, 70%, 0.4)`
      };
      this.timelapseData.weatherEffects = true;
    }
  }
  
  update(deltaTime: number) {
    // Update mean anomaly (orbital position)
    this.angle += this.orbitSpeed * deltaTime;
    
    // Keep angle within [0, 2π] range
    if (this.angle > Math.PI * 2) {
      this.angle -= Math.PI * 2;
    }
    
    // Update rotation angle (day cycle)
    this.rotationAngle += this.rotationSpeed * deltaTime;
    if (this.rotationAngle > Math.PI * 2) {
      this.rotationAngle -= Math.PI * 2;
    }
    
    // Convert mean anomaly to true anomaly for elliptical orbits
    // This is a simplified approximation of Kepler's equation
    this.trueAnomaly = this.angle + 
      2 * this.orbitEccentricity * Math.sin(this.angle) +
      1.25 * Math.pow(this.orbitEccentricity, 2) * Math.sin(2 * this.angle);
    
    // Update time-lapse evolution
    this.evolutionAge += deltaTime;
    this.evolutionTimer += deltaTime;
    
    // Check for evolution events at random intervals
    if (this.evolutionTimer > 20 + Math.random() * 30) {
      this.evolutionTimer = 0;
      this.processEvolution();
    }
  }
  
  // Process time-lapse planetary evolution effects
  private processEvolution() {
    // Different evolution effects based on body type and age
    if (this.timelapseData.surfaceChanges) {
      // Young bodies - active geology
      if (this.evolutionAge < this.timelapseData.ageThresholds[0]) {
        if (Math.random() < 0.3 * this.geologicalActivity) {
          // Geological events for young planets
          if (this.type === 'rocky' || this.type === 'molten') {
            // Volcanic activity
            if (!this.surfaceFeatures.includes('volcanic')) {
              this.surfaceFeatures.push('volcanic');
            }
            
            // Chance to slightly modify color to reflect surface changes
            const currentHsl = this.parseHsl(this.color);
            const newLightness = Math.max(20, Math.min(60, currentHsl.l + (Math.random() * 10 - 5)));
            this.color = `hsl(${currentHsl.h}, ${currentHsl.s}%, ${newLightness}%)`;
          }
        }
      }
      // Middle-aged bodies - stabilizing
      else if (this.evolutionAge < this.timelapseData.ageThresholds[1]) {
        if (Math.random() < 0.2) {
          // Orbital stabilization
          this.orbitEccentricity *= 0.95; // Orbit becomes more circular
          
          // For rocky planets, water might appear
          if (this.type === 'rocky' && Math.random() < 0.3 && !this.surfaceFeatures.includes('water')) {
            this.surfaceFeatures.push('water');
            // Shift color slightly toward blue
            const currentHsl = this.parseHsl(this.color);
            const newHue = Math.max(currentHsl.h, currentHsl.h + (Math.random() * 20 - 10));
            const newSaturation = Math.min(100, currentHsl.s + 10);
            this.color = `hsl(${newHue}, ${newSaturation}%, ${currentHsl.l}%)`;
          }
        }
      }
      // Mature bodies - complex systems
      else if (this.evolutionAge < this.timelapseData.ageThresholds[2]) {
        if (Math.random() < 0.15) {
          // Weather patterns develop
          if (this.timelapseData.weatherEffects && this.atmosphere && !this.surfaceFeatures.includes('weather')) {
            this.surfaceFeatures.push('weather');
          }
          
          // Erosion on rocky planets
          if (this.type === 'rocky' && this.surfaceFeatures.includes('water') && !this.surfaceFeatures.includes('eroded')) {
            this.surfaceFeatures.push('eroded');
          }
        }
      }
      // Old bodies - slow decay
      else {
        if (Math.random() < 0.1) {
          // Cooling effects for rocky planets
          if (this.type === 'rocky' || this.type === 'molten') {
            this.geologicalActivity *= 0.9; // Reduced geological activity
            
            // Color shifts toward gray as planet cools
            const currentHsl = this.parseHsl(this.color);
            const newSaturation = Math.max(20, currentHsl.s - 5);
            this.color = `hsl(${currentHsl.h}, ${newSaturation}%, ${currentHsl.l}%)`;
          }
          
          // Gas giants slowly contract
          if (this.type === 'gaseous' && Math.random() < 0.3) {
            this.size = Math.max(this.timelapseData.originalSize * 0.8, this.size * 0.99);
          }
        }
      }
    }
  }
  
  // Helper to parse HSL color strings
  private parseHsl(hslStr: string): {h: number, s: number, l: number} {
    const matches = hslStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (matches && matches.length === 4) {
      return {
        h: parseInt(matches[1], 10),
        s: parseInt(matches[2], 10),
        l: parseInt(matches[3], 10)
      };
    }
    // Default values if parsing fails
    return { h: 0, s: 0, l: 0 };
  }
  
  getPosition(centerX: number, centerY: number): {x: number, y: number} {
    // Calculate position based on elliptical orbital parameters
    // Distance from focus varies with true anomaly in an elliptical orbit
    const currentDistance = this.distance * (1 - this.orbitEccentricity * Math.cos(this.trueAnomaly));
    
    // Calculate position on orbital plane
    let x = centerX + Math.cos(this.trueAnomaly + this.periapsis) * currentDistance;
    let y = centerY + Math.sin(this.trueAnomaly + this.periapsis) * currentDistance;
    
    // Apply orbital inclination (tilt)
    // This is a simplified 2D projection of a 3D tilted orbit
    y = centerY + (y - centerY) * Math.cos(this.orbitInclination);
    
    return {x, y};
  }
}
