import { Plant } from './Plant';

/**
 * CosmicExplorer - A simple class that manages cosmic body exploration
 * This allows players to enter and explore different celestial bodies
 */
export class CosmicExplorer {
  private focusedObject: Plant | null = null;
  private onEnterCallback: ((object: Plant) => void) | null = null;
  private onExitCallback: (() => void) | null = null;
  private scientificTheories: Map<string, string> = new Map(); // Store scientific theories for cosmic bodies

  constructor() {
    // Initialize scientific theories with key quantum physics and astrophysics concepts
    this.initializeScientificTheories();
  }
  
  /**
   * Initialize scientific theories that can be discovered during exploration
   */
  private initializeScientificTheories(): void {
    // Quantum Physics Theories
    this.scientificTheories.set('quantum_entanglement', 'Quantum entanglement occurs when pairs of particles interact in ways such that the quantum state of each particle cannot be described independently of the others, regardless of distance separating them.');
    this.scientificTheories.set('quantum_superposition', 'Quantum superposition is the ability of a quantum system to exist in multiple states simultaneously until measured or observed.');
    this.scientificTheories.set('uncertainty_principle', 'The Heisenberg Uncertainty Principle states that the position and momentum of a particle cannot both be measured with arbitrarily high precision simultaneously.');
    this.scientificTheories.set('quantum_tunneling', 'Quantum tunneling allows particles to pass through energy barriers that would be impossible in classical physics, enabling nuclear fusion in stars.');
    this.scientificTheories.set('quantum_field_theory', 'Quantum field theory describes fundamental particles as excitations of underlying quantum fields, explaining how forces and matter interact.');
    this.scientificTheories.set('quantum_decoherence', 'Quantum decoherence explains how quantum systems lose their coherence when interacting with their environment, appearing to behave classically.');
    
    // Astrophysics Theories
    this.scientificTheories.set('dark_energy', 'Dark energy is a hypothetical form of energy that permeates all of space and tends to accelerate the expansion of the universe.');
    this.scientificTheories.set('dark_matter', 'Dark matter is a form of matter thought to account for approximately 85% of the matter in the universe and about 27% of its total mass–energy content.');
    this.scientificTheories.set('string_theory', 'String theory proposes that elementary particles are actually one-dimensional vibrating strings, with different vibrational modes representing different particle types.');
    this.scientificTheories.set('cosmic_inflation', 'Cosmic inflation theory suggests the universe underwent exponential expansion shortly after the Big Bang, explaining its uniformity and flatness.');
    this.scientificTheories.set('stellar_nucleosynthesis', 'Stellar nucleosynthesis is the process by which heavier elements are created within stars through nuclear fusion reactions.');
    this.scientificTheories.set('gravitational_waves', 'Gravitational waves are ripples in spacetime caused by violent cosmic events, confirming a major prediction of Einstein\'s general relativity.');
    
    // Planetary Science Theories
    this.scientificTheories.set('plate_tectonics', 'Plate tectonics describes how Earth\'s lithosphere is divided into plates that move over the asthenosphere, creating mountains, volcanoes, and earthquakes.');
    this.scientificTheories.set('planetary_differentiation', 'Planetary differentiation is the process where denser materials sink to the center while lighter materials rise to the surface, creating layered structures.');
    this.scientificTheories.set('magnetic_dynamo', 'The magnetic dynamo theory explains how rotating, convecting, and electrically conducting fluid generates a magnetic field around planets like Earth.');
    
    // Black Hole Phenomena
    this.scientificTheories.set('hawking_radiation', 'Hawking radiation is the theoretical black body radiation emitted by black holes due to quantum effects near the event horizon.');
    this.scientificTheories.set('event_horizon', 'The event horizon is the boundary around a black hole beyond which nothing, not even light, can escape its gravitational pull.');
    this.scientificTheories.set('singularity', 'A singularity is a point at the center of a black hole where gravity is infinitely strong and spacetime curvature becomes infinite.');
    this.scientificTheories.set('spaghettification', 'Spaghettification is the vertical stretching and horizontal compression of objects into long thin shapes in a strong gravitational field near black holes.');
    
    // Star Phenomena
    this.scientificTheories.set('solar_flares', 'Solar flares are sudden flashes of increased brightness on stars, caused by magnetic energy released from the corona.');
    this.scientificTheories.set('stellar_evolution', 'Stellar evolution describes the changes a star undergoes during its lifetime, from formation in a molecular cloud to final stages as white dwarfs, neutron stars, or black holes.');
    this.scientificTheories.set('stellar_wind', 'Stellar wind is the continuous flow of charged particles ejected from the upper atmosphere of stars, creating spectacular aurorae when interacting with planetary magnetic fields.');
    this.scientificTheories.set('nuclear_fusion', 'Nuclear fusion in star cores converts hydrogen into helium and heavier elements, releasing enormous energy that counters gravitational collapse.');
    
    // Nebula Phenomena
    this.scientificTheories.set('supernova_remnant', 'Supernova remnants are expanding shells of gas and dust ejected at high velocity from a supernova explosion, enriching space with heavy elements.');
    this.scientificTheories.set('planetary_nebula', 'Planetary nebulae form when dying stars shed their outer layers, creating colorful shells of ionized gas while the core becomes a white dwarf.');
    this.scientificTheories.set('star_formation', 'Star formation occurs in molecular clouds when dense regions collapse under gravity, heating until nuclear fusion begins.');
    
    // Galaxy Phenomena
    this.scientificTheories.set('galactic_halo', 'The galactic halo is a spherical component extending beyond the main visible part of galaxies, containing stars, globular clusters, and dark matter.');
    this.scientificTheories.set('active_galactic_nucleus', 'Active galactic nuclei are compact regions at galaxy centers with much higher than normal luminosity, powered by supermassive black holes.');
    this.scientificTheories.set('galactic_rotation', 'Galactic rotation curves reveal that stars in galaxies orbit at speeds inconsistent with visible mass, providing evidence for dark matter.');
    this.scientificTheories.set('galactic_merger', 'Galactic mergers occur when galaxies collide and join together, triggering starbursts and reshaping the involved galaxies.');
  }

  /**
   * Enter a cosmic body to explore its interior
   */
  enterCosmicBody(cosmicBody: Plant): void {
    console.log(`Entering ${cosmicBody.type}: ${cosmicBody.id}`);
    
    // Set as the current focused object
    this.focusedObject = cosmicBody;
    
    // Generate interior elements if they don't exist yet
    if (!cosmicBody.interior || cosmicBody.interior.length === 0) {
      this.generateInteriorElements(cosmicBody);
    }
    
    // Mark as expanded
    cosmicBody.isExpanded = true;
    
    // Fire callback if defined
    if (this.onEnterCallback) {
      this.onEnterCallback(cosmicBody);
    }
  }
  
  /**
   * Exit the current cosmic body
   */
  exitCurrentBody(): void {
    if (!this.focusedObject) return;
    
    console.log(`Exiting ${this.focusedObject.type}`);
    
    // Set focused object to its parent if it has one
    const parent = this.focusedObject.parent;
    this.focusedObject.isExpanded = false;
    this.focusedObject = null;
    
    // Fire callback if defined
    if (this.onExitCallback) {
      this.onExitCallback();
    }
    
    // If the object had a parent, enter that parent
    if (parent) {
      this.enterCosmicBody(parent);
    }
  }
  
  /**
   * Get the currently focused cosmic body
   */
  getFocusedObject(): Plant | null {
    return this.focusedObject;
  }
  
  /**
   * Set callbacks for enter/exit events
   */
  setCallbacks(
    onEnter: (object: Plant) => void, 
    onExit: () => void
  ): void {
    this.onEnterCallback = onEnter;
    this.onExitCallback = onExit;
  }
  
  /**
   * Generate interior elements for a cosmic body
   * This creates all the objects inside a galaxy, star, planet, etc.
   */
  private generateInteriorElements(cosmicBody: Plant): void {
    // Clear any existing interior elements
    cosmicBody.interior = [];
    
    switch(cosmicBody.type) {
      case 'galaxy':
        this.generateGalaxyInterior(cosmicBody);
        break;
        
      case 'star':
        this.generateStarInterior(cosmicBody);
        break;
        
      case 'planet':
        this.generatePlanetInterior(cosmicBody);
        break;
        
      case 'blackhole':
        this.generateBlackholeInterior(cosmicBody);
        break;
        
      case 'nebula':
        this.generateNebulaInterior(cosmicBody);
        break;
        
      case 'protostar':
        this.generateProtostarInterior(cosmicBody);
        break;
        
      case 'neutron_star':
        this.generateNeutronStarInterior(cosmicBody);
        break;
    }
    
    // Add random cosmic events and phenomena for more interactivity
    this.addCosmicEvents(cosmicBody);
  }
  
  /**
   * Add random cosmic events and phenomena to any cosmic body
   * This enhances interactivity and adds scientific concepts
   */
  private addCosmicEvents(cosmicBody: Plant): void {
    // Probability of having cosmic events depends on body type
    let eventProbability = 0.3; // Base probability
    
    switch(cosmicBody.type) {
      case 'galaxy':
        eventProbability = 0.7; // Galaxies have many events
        break;
      case 'star':
        eventProbability = 0.5; // Stars have moderate events
        break;
      case 'blackhole':
        eventProbability = 0.8; // Black holes have frequent events
        break;
      case 'nebula':
        eventProbability = 0.6; // Nebulae have several events
        break;
    }
    
    // Check if we should add events
    if (Math.random() > eventProbability) return;
    
    // Pick random events based on cosmic body type
    const possibleEvents: string[] = [];
    
    switch(cosmicBody.type) {
      case 'galaxy':
        possibleEvents.push(
          'galaxy_merger', 'starburst', 'active_galactic_nucleus', 
          'dark_matter_halo', 'supercluster', 'void_region', 'cosmic_filament'
        );
        break;
      case 'star':
        possibleEvents.push(
          'solar_flare', 'coronal_mass_ejection', 'stellar_wind', 
          'stellar_nursery', 'binary_system', 'variable_star'
        );
        break;
      case 'planet':
        possibleEvents.push(
          'meteor_shower', 'aurora', 'volcanic_activity', 
          'plate_tectonics', 'atmospheric_storms', 'magnetic_field_reversal'
        );
        break;
      case 'blackhole':
        possibleEvents.push(
          'event_horizon_fluctuation', 'hawking_radiation', 'gravitational_lensing', 
          'spaghettification', 'frame_dragging', 'ergosphere'
        );
        break;
      case 'nebula':
        possibleEvents.push(
          'stellar_formation', 'dust_pillar', 'bow_shock', 
          'planetary_nebula_ring', 'supernova_remnant'
        );
        break;
    }
    
    // Pick 1-2 random events
    const eventCount = 1 + (Math.random() < 0.3 ? 1 : 0);
    for (let i = 0; i < eventCount; i++) {
      if (possibleEvents.length === 0) break;
      
      // Pick a random event
      const eventIndex = Math.floor(Math.random() * possibleEvents.length);
      const eventType = possibleEvents[eventIndex];
      
      // Create the event
      this.createCosmicEvent(cosmicBody, eventType);
      
      // Remove this event from possible events to avoid duplicates
      possibleEvents.splice(eventIndex, 1);
    }
  }
  
  /**
   * Create a specific cosmic event inside a cosmic body
   * Enhanced with more detailed phenomena and scientific attributes
   */
  
  /**
   * Create the stellar core of a star
   */
  private createStellarCore(star: Plant): void {
    // Create stellar core at the center
    const offset = 5 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    const x = star.x + Math.cos(angle) * offset;
    const y = star.y + Math.sin(angle) * offset;
    
    const core = new Plant(
      x, y,
      0.2 + Math.random() * 0.2,
      star.universePhase
    );
    
    core.type = 'stellar_core';
    core.isInteractable = true;
    core.parent = star;
    
    // Core properties based on star type
    const starType = star.cosmicProperties.starType || 'main_sequence';
    const temperature = star.cosmicProperties.temperature || 5800; // Default similar to our Sun
    
    // Different core appearance based on star type
    if (starType === 'blue_giant') {
      core.color = '#FFFFFF'; // Extremely hot and bright
      core.description = 'The core of a blue giant star reaches temperatures of 40+ million Kelvin, fusing hydrogen at an incredible rate. These massive stars burn through their fuel rapidly, leading to shorter lifespans despite their enormous energy output.';
    } else if (starType === 'red_giant') {
      core.color = '#FF4500'; // OrangeRed
      core.description = 'The core of a red giant has depleted its hydrogen and is now fusing helium into carbon and oxygen. The core itself has contracted while the outer layers have expanded enormously, creating the characteristic red coloration.';
    } else if (starType === 'white_dwarf') {
      core.color = '#E6E6FA'; // Lavender
      core.description = 'This white dwarf core is the exposed remnant of a star that has shed its outer layers. No longer undergoing fusion, it consists primarily of electron-degenerate matter and will slowly cool over billions of years.';
    } else if (starType === 'red_dwarf') {
      core.color = '#CD5C5C'; // IndianRed
      core.description = 'The core of a red dwarf star maintains a relatively low temperature, allowing hydrogen fusion to proceed slowly through the proton-proton chain. This efficient use of fuel gives red dwarfs extraordinarily long lifespans of trillions of years.';
    } else {
      // Main sequence star like our sun
      core.color = '#FFFF00'; // Yellow
      core.description = 'The core of this main sequence star is where hydrogen fuses into helium through nuclear fusion, releasing the energy that powers the star. The tremendous pressure and temperature (15 million Kelvin) overcome the electromagnetic repulsion between protons.';
    }
    
    // Core activity (pulsation) is higher for more massive, hotter stars
    core.pulsateSpeed = 0.3 + (temperature / 10000) * 0.5;
    core.pulsateAmount = 0.1 + Math.random() * 0.1;
    
    star.interior.push(core);
  }
  
  /**
   * Create the stellar layers (photosphere, chromosphere, corona)
   */
  private createStellarLayers(star: Plant): void {
    const layerCount = 3; // Three main layers: photosphere, chromosphere, corona
    const starType = star.cosmicProperties.starType || 'main_sequence';
    
    for (let i = 0; i < layerCount; i++) {
      const layerDistance = 30 + i * 30; // Increasing distance for each layer
      const particlesInLayer = 10 + i * 5;
      
      for (let j = 0; j < particlesInLayer; j++) {
        const angle = (j / particlesInLayer) * Math.PI * 2;
        
        // Add some variation to make it less perfectly circular
        const distanceVariation = (Math.random() * 10) - 5;
        const x = star.x + Math.cos(angle) * (layerDistance + distanceVariation);
        const y = star.y + Math.sin(angle) * (layerDistance + distanceVariation);
        
        const layer = new Plant(
          x, y,
          0.1 + Math.random() * 0.15,
          star.universePhase
        );
        
        layer.isInteractable = (j % (3 + i) === 0); // Make some particles interactive
        layer.parent = star;
        
        // Different layers have different properties
        if (i === 0) {
          // Photosphere - the visible "surface" of the star
          layer.type = 'photosphere';
          
          if (starType === 'blue_giant') {
            layer.color = '#AAAAFF'; // Bluish
          } else if (starType === 'red_giant' || starType === 'red_dwarf') {
            layer.color = '#FF6347'; // Tomato
          } else if (starType === 'white_dwarf') {
            layer.color = '#F8F8FF'; // GhostWhite
          } else {
            layer.color = '#FFD700'; // Gold (for Sun-like stars)
          }
          
          if (layer.isInteractable) {
            layer.description = 'The photosphere is the visible surface of the star where light can finally escape into space. Despite appearing solid from a distance, this is a layer of plasma with a thickness of hundreds of kilometers and temperature around 5,800K for a sun-like star.';
          }
        } else if (i === 1) {
          // Chromosphere - middle layer of stellar atmosphere
          layer.type = 'chromosphere';
          
          if (starType === 'blue_giant') {
            layer.color = 'rgba(100, 100, 255, 0.6)'; // Translucent blue
          } else if (starType === 'red_giant' || starType === 'red_dwarf') {
            layer.color = 'rgba(255, 99, 71, 0.6)'; // Translucent tomato
          } else {
            layer.color = 'rgba(255, 69, 0, 0.6)'; // Translucent orange-red
          }
          
          if (layer.isInteractable) {
            layer.description = 'The chromosphere sits above the photosphere and is normally invisible due to the brightness of the photosphere below. Its temperature counterintuitively rises with altitude, reaching up to 20,000K, giving it a characteristic red color visible during solar eclipses.';
          }
        } else {
          // Corona - outermost layer of stellar atmosphere
          layer.type = 'corona';
          
          layer.color = 'rgba(255, 255, 255, 0.3)'; // Very translucent white
          
          if (layer.isInteractable) {
            layer.description = 'The corona is the outermost layer of the stellar atmosphere, extending millions of kilometers into space. With temperatures of 1-2 million Kelvin, the corona is much hotter than the stellar surface below it—a phenomenon still not fully explained by science.';
          }
        }
        
        // Layers have different movement patterns
        const layerFactor = (i + 1) / layerCount;
        layer.pulsateSpeed = 0.2 + layerFactor * 0.4;
        layer.pulsateAmount = 0.05 + layerFactor * 0.1;
        
        star.interior.push(layer);
      }
    }
  }
  
  /**
   * Create dramatic stellar phenomena like solar flares, prominences, etc.
   */
  private createStellarPhenomena(star: Plant): void {
    const starType = star.cosmicProperties.starType || 'main_sequence';
    const stellarActivity = Math.random(); // Random activity level for this star
    
    // More active stars have more phenomena
    const phenomenaCount = 2 + Math.floor(stellarActivity * 5);
    
    for (let i = 0; i < phenomenaCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 80;
      
      const x = star.x + Math.cos(angle) * distance;
      const y = star.y + Math.sin(angle) * distance;
      
      const phenomenon = new Plant(
        x, y,
        0.2 + Math.random() * 0.3,
        star.universePhase
      );
      
      phenomenon.isInteractable = true;
      phenomenon.parent = star;
      
      // Different stellar phenomena
      const phenomenonType = Math.random();
      
      if (phenomenonType < 0.2) {
        // Solar flares
        phenomenon.type = 'solar_flare';
        phenomenon.color = '#FFFF00'; // Yellow
        phenomenon.description = 'A solar flare is a sudden flash of increased brightness on the star, caused by magnetic energy released from the corona. These eruptions can accelerate particles to nearly the speed of light and release electromagnetic radiation across the spectrum.';
        
        // Flares pulse rapidly and dramatically
        phenomenon.pulsateSpeed = 1.0 + Math.random() * 0.5;
        phenomenon.pulsateAmount = 0.3 + Math.random() * 0.2;
        
      } else if (phenomenonType < 0.4) {
        // Coronal mass ejections
        phenomenon.type = 'coronal_mass_ejection';
        phenomenon.color = '#FF4500'; // OrangeRed
        phenomenon.description = 'A coronal mass ejection (CME) is a significant release of plasma and magnetic field from the stellar corona. These massive bursts can eject billions of tons of coronal material and carry an embedded magnetic field stronger than the background solar wind interplanetary field.';
        
        // CMEs expand outward
        phenomenon.pulsateSpeed = 0.5 + Math.random() * 0.3;
        phenomenon.pulsateAmount = 0.2 + Math.random() * 0.2;
        
      } else if (phenomenonType < 0.6) {
        // Prominences
        phenomenon.type = 'prominence';
        phenomenon.color = '#FF6347'; // Tomato
        phenomenon.description = 'A prominence is a large, bright, gaseous feature extending outward from the star\'s surface, often in a loop shape. Anchored in the photosphere, these structures extend outward into the corona and can persist for weeks or months, supported against gravity by magnetic fields.';
        
        // Prominences are more stable, pulse slowly
        phenomenon.pulsateSpeed = 0.3 + Math.random() * 0.2;
        phenomenon.pulsateAmount = 0.1 + Math.random() * 0.1;
        
      } else if (phenomenonType < 0.8) {
        // Sunspots
        phenomenon.type = 'sunspot';
        phenomenon.color = '#8B0000'; // DarkRed
        phenomenon.description = 'Sunspots are temporary phenomena on the photosphere that appear as dark spots compared to surrounding regions. They are areas of reduced surface temperature caused by concentrations of magnetic flux that inhibit convection. Sunspots often appear in pairs or groups with specific magnetic polarity.';
        
        // Sunspots are fairly stable
        phenomenon.pulsateSpeed = 0.1 + Math.random() * 0.1;
        phenomenon.pulsateAmount = 0.05 + Math.random() * 0.05;
        
      } else {
        // Stellar wind
        phenomenon.type = 'stellar_wind';
        phenomenon.color = 'rgba(173, 216, 230, 0.5)'; // Light blue, transparent
        phenomenon.description = 'Stellar wind is a continuous flow of charged particles ejected from the upper atmosphere of a star, consisting mostly of electrons and protons. This constant stream of particles carries about 0.01% of the star\'s mass per billion years, yet plays a crucial role in stellar evolution and planetary system formation.';
        
        // Stellar wind has gentle, flowing movement
        phenomenon.pulsateSpeed = 0.4 + Math.random() * 0.4;
        phenomenon.pulsateAmount = 0.15 + Math.random() * 0.1;
      }
      
      star.interior.push(phenomenon);
    }
    
    // Add special phenomena based on star type
    if (starType === 'red_giant' && Math.random() < 0.7) {
      this.createHeliumFlash(star);
    } else if (starType === 'blue_giant' && Math.random() < 0.5) {
      this.createStellarFusionLayers(star);
    } else if (starType === 'white_dwarf' && Math.random() < 0.6) {
      this.createDegenerateMatter(star);
    }
  }
  
  /**
   * Create a helium flash event for red giants
   */
  private createHeliumFlash(star: Plant): void {
    const angle = Math.random() * Math.PI * 2;
    const distance = 25 + Math.random() * 15;
    const x = star.x + Math.cos(angle) * distance;
    const y = star.y + Math.sin(angle) * distance;
    
    const heliumFlash = new Plant(
      x, y,
      0.25 + Math.random() * 0.15,
      star.universePhase
    );
    
    heliumFlash.type = 'helium_flash';
    heliumFlash.isInteractable = true;
    heliumFlash.parent = star;
    heliumFlash.color = '#FFD700'; // Gold
    heliumFlash.description = 'A helium flash is a dramatic event occurring in the core of a red giant star when helium fusion suddenly ignites. The degenerate core doesn\'t expand when heated, causing a runaway reaction that releases energy equivalent to a trillion stars in just minutes before the core finally expands and stabilizes.';
    
    // Helium flashes pulse dramatically
    heliumFlash.pulsateSpeed = 1.5 + Math.random() * 0.5;
    heliumFlash.pulsateAmount = 0.4 + Math.random() * 0.2;
    
    star.interior.push(heliumFlash);
  }
  
  /**
   * Create degenerate matter for white dwarfs
   */
  private createDegenerateMatter(star: Plant): void {
    const particleCount = 15 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 10 + Math.random() * 40;
      const x = star.x + Math.cos(angle) * distance;
      const y = star.y + Math.sin(angle) * distance;
      
      const degenerateMatter = new Plant(
        x, y,
        0.05 + Math.random() * 0.1,
        star.universePhase
      );
      
      degenerateMatter.type = 'degenerate_matter';
      degenerateMatter.isInteractable = i % 3 === 0; // Every third particle is interactive
      degenerateMatter.parent = star;
      degenerateMatter.color = '#F0FFFF'; // Azure
      
      if (degenerateMatter.isInteractable) {
        degenerateMatter.description = 'Degenerate matter is the ultra-dense state of matter in white dwarfs, where electron degeneracy pressure supports the star against gravitational collapse. A teaspoon of this material would weigh several tons on Earth, yet the entire star is cooling and no longer producing energy through fusion.';
      }
      
      // Degenerate matter particles move very little
      degenerateMatter.pulsateSpeed = 0.1 + Math.random() * 0.1;
      degenerateMatter.pulsateAmount = 0.02 + Math.random() * 0.04;
      
      star.interior.push(degenerateMatter);
    }
  }
  
  /**
   * Create fusion layer visualization for massive stars
   */
  private createStellarFusionLayers(star: Plant): void {
    const layerCount = 4; // H, He, C, O/Si fusion shells
    
    for (let i = 0; i < layerCount; i++) {
      const layerRadius = 20 + i * 15;
      
      const shellLayer = new Plant(
        star.x,
        star.y,
        0.2 + i * 0.1,
        star.universePhase
      );
      
      shellLayer.type = 'fusion_layer';
      shellLayer.isInteractable = true;
      shellLayer.parent = star;
      
      // Different fusion shells have different colors and descriptions
      switch(i) {
        case 0: // Core - Silicon/Iron
          shellLayer.color = '#C0C0C0'; // Silver
          shellLayer.description = 'The innermost core of a massive star, where silicon fusion creates iron. This marks the end of the fusion chain, as iron fusion absorbs rather than releases energy. Once the core becomes primarily iron, the star is doomed to collapse into a supernova.';
          break;
        case 1: // Oxygen/Neon fusion
          shellLayer.color = '#4682B4'; // SteelBlue
          shellLayer.description = 'In this layer, oxygen and neon undergo fusion to produce heavier elements. This only occurs in very massive stars with core temperatures exceeding 1 billion Kelvin, as the higher Coulomb barrier requires extreme conditions to overcome.';
          break;
        case 2: // Carbon fusion
          shellLayer.color = '#8B4513'; // SaddleBrown
          shellLayer.description = 'The carbon fusion shell requires temperatures around 600 million Kelvin. Here, carbon nuclei fuse to produce neon, sodium, and magnesium. This process powers the star for only a few hundred years in a massive star\'s lifecycle.';
          break;
        case 3: // Helium fusion (outer)
          shellLayer.color = '#FFD700'; // Gold
          shellLayer.description = 'The helium fusion shell of a massive star converts helium into carbon and oxygen through the triple-alpha process. This layer surrounds a hydrogen-depleted core and marks a mature phase in stellar evolution.';
          break;
      }
      
      // Fusion shells have subtle pulsation
      shellLayer.pulsateSpeed = 0.2 + i * 0.1;
      shellLayer.pulsateAmount = 0.05 + i * 0.02;
      
      star.interior.push(shellLayer);
    }
  }

  private createCosmicEvent(cosmicBody: Plant, eventType: string, position?: {x: number, y: number, size?: number}): void {
    let x = position?.x || cosmicBody.x;
    let y = position?.y || cosmicBody.y;
    
    // For events without specified position, position them away from center
    if (!position && eventType !== 'event_horizon_fluctuation' && eventType !== 'hawking_radiation' && eventType !== 'singularity') {
      // Position differently based on event type - some phenomena should be in specific locations
      if (eventType === 'planetary_core') {
        // Core should be almost at the center
        const angle = Math.random() * Math.PI * 2;
        const distance = 10 + Math.random() * 20;
        x += Math.cos(angle) * distance;
        y += Math.sin(angle) * distance;
      } else if (eventType === 'active_galactic_nucleus' || eventType === 'supermassive_black_hole') {
        // Central phenomena should be close to center
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;
        x += Math.cos(angle) * distance;
        y += Math.sin(angle) * distance;
      } else if (eventType.includes('atmosphere') || eventType === 'magnetic_field' || eventType === 'auroras') {
        // Outer phenomena should be near the edge
        const angle = Math.random() * Math.PI * 2;
        // Distance near edge but not quite at the edge
        const distance = (cosmicBody.size * 0.3) + Math.random() * (cosmicBody.size * 0.15);
        x += Math.cos(angle) * distance;
        y += Math.sin(angle) * distance;
      } else {
        // Random position within the body for other phenomena
        const angle = Math.random() * Math.PI * 2;
        const distanceFactor = Math.random() * 0.8; // 0-80% from center
        const distance = cosmicBody.size * 0.4 * distanceFactor;
        x += Math.cos(angle) * distance;
        y += Math.sin(angle) * distance;
      }
    }
    
    // Size based on event type - some phenomena should be larger/smaller than others
    let eventSize = position?.size || (0.25 + Math.random() * 0.35);
    if (eventType === 'supermassive_black_hole' || eventType === 'galactic_rotation') {
      eventSize = 0.5 + Math.random() * 0.3; // Larger
    } else if (eventType === 'quantum_fluctuation' || eventType === 'hawking_radiation') {
      eventSize = 0.1 + Math.random() * 0.2; // Smaller
    }
    
    const event = new Plant(
      x, y,
      eventSize,
      cosmicBody.universePhase
    );
    event.parent = cosmicBody;
    
    // Generate a unique ID for each event
    event.id = `${eventType}_${Math.floor(Math.random() * 10000)}`;
    
    // All events should pulsate slightly to show they're interactive
    event.pulsateSpeed = 0.5 + Math.random() * 1.5;
    event.pulsateAmount = 0.05 + Math.random() * 0.15;
    
    // Configure event properties based on type
    switch(eventType) {
      // ---- GALAXY PHENOMENA ----
      case 'galactic_halo':
        event.type = 'nebula';
        event.isInteractable = true;
        event.color = 'rgba(120, 130, 255, 0.4)';
        event.resources = new Map([['dark_matter', 300], ['stellar_population', 150]]);
        break;
        
      case 'active_galactic_nucleus':
        event.type = 'blackhole';
        event.isInteractable = true;
        event.color = 'rgba(255, 100, 100, 0.9)';
        event.resources = new Map([['radiation', 400], ['accretion_energy', 300]]);
        event.pulsateSpeed = 3.0; // Fast pulsating
        event.pulsateAmount = 0.2; // More pronounced pulsating
        break;
        
      case 'galactic_rotation':
        event.type = 'nebula';
        event.isInteractable = true;
        event.color = 'rgba(150, 150, 220, 0.5)';
        event.resources = new Map([['rotational_energy', 250], ['dark_matter_evidence', 200]]);
        break;
        
      case 'galactic_merger':
        event.type = 'galaxy';
        event.isInteractable = true;
        event.color = 'rgba(200, 130, 255, 0.7)';
        event.resources = new Map([['tidal_forces', 350], ['star_formation_burst', 250]]);
        break;
        
      case 'spiral_arm_formation':
        event.type = 'nebula';
        event.isInteractable = true;
        event.color = 'rgba(200, 180, 255, 0.6)';
        event.resources = new Map([['density_wave', 200], ['star_formation_region', 150]]);
        break;
        
      case 'star_formation_region':
        event.type = 'nebula';
        event.isInteractable = true;
        event.color = 'rgba(255, 200, 150, 0.7)';
        event.resources = new Map([['molecular_cloud', 180], ['protostar_formation', 220]]);
        break;
        
      case 'supermassive_black_hole':
        event.type = 'blackhole';
        event.isInteractable = true;
        event.color = 'rgba(20, 20, 30, 0.95)';
        event.resources = new Map([['spacetime_curvature', 500], ['event_horizon', 400]]);
        event.pulsateSpeed = 0.3; // Slow, ominous pulsating
        break;
        
      case 'intergalactic_medium':
        event.type = 'nebula';
        event.isInteractable = false;
        event.color = 'rgba(100, 100, 180, 0.3)';
        event.resources = new Map([['diffuse_gas', 120], ['ionized_hydrogen', 100]]);
        break;
      
      // ---- BLACK HOLE PHENOMENA ----
      case 'event_horizon':
        event.type = 'blackhole';
        event.isInteractable = true;
        event.color = 'rgba(10, 10, 20, 0.95)';
        event.resources = new Map([['point_of_no_return', 300], ['spacetime_boundary', 250]]);
        break;
        
      case 'hawking_radiation':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(100, 255, 200, 0.6)';
        event.resources = new Map([['virtual_particles', 150], ['quantum_tunneling', 200]]);
        event.pulsateSpeed = 4.0; // Very fast pulsating for quantum phenomena
        event.pulsateAmount = 0.25; // Highly variable
        break;
        
      case 'singularity':
        event.type = 'blackhole';
        event.isInteractable = true;
        event.color = 'rgba(0, 0, 0, 1.0)';
        event.resources = new Map([['infinite_density', 500], ['spacetime_tear', 400]]);
        event.pulsateSpeed = 0.1; // Almost imperceptible pulsation
        event.pulsateAmount = 0.05;
        break;
        
      case 'accretion_disk':
        event.type = 'nebula';
        event.isInteractable = true;
        event.color = 'rgba(255, 150, 100, 0.8)';
        event.resources = new Map([['infalling_matter', 250], ['x_ray_emission', 200]]);
        break;
        
      case 'spaghettification':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(230, 180, 255, 0.7)';
        event.resources = new Map([['tidal_force', 280], ['stretched_matter', 220]]);
        break;
        
      case 'gravitational_lensing':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(200, 200, 255, 0.5)';
        event.resources = new Map([['light_bending', 180], ['einstein_ring', 150]]);
        break;
        
      case 'ergosphere':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(150, 100, 200, 0.6)';
        event.resources = new Map([['frame_dragging', 220], ['negative_energy', 180]]);
        break;
      
      // ---- STAR PHENOMENA ----
      case 'nuclear_fusion':
        event.type = 'star';
        event.isInteractable = true;
        event.color = 'rgba(255, 240, 150, 0.9)';
        event.resources = new Map([['energy_production', 300], ['element_formation', 220]]);
        event.pulsateSpeed = 2.0;
        event.pulsateAmount = 0.15;
        break;
        
      case 'stellar_wind':
        event.type = 'nebula';
        event.isInteractable = false;
        event.color = 'rgba(200, 220, 255, 0.6)';
        event.resources = new Map([['particle_stream', 150], ['heliosphere', 120]]);
        break;
        
      case 'solar_flares':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(255, 200, 50, 0.8)';
        event.resources = new Map([['magnetic_reconnection', 180], ['radiation_burst', 150]]);
        event.pulsateSpeed = 3.5;
        event.pulsateAmount = 0.2;
        break;
        
      case 'photosphere':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(255, 220, 100, 0.85)';
        event.resources = new Map([['visible_surface', 120], ['sunspots', 100]]);
        break;
        
      case 'chromosphere':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(255, 180, 120, 0.7)';
        event.resources = new Map([['temperature_rise', 140], ['spicules', 110]]);
        break;
        
      case 'corona':
        event.type = 'nebula';
        event.isInteractable = false;
        event.color = 'rgba(220, 220, 255, 0.5)';
        event.resources = new Map([['extreme_heat', 200], ['coronal_loops', 160]]);
        break;
        
      case 'sunspots':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(120, 120, 150, 0.8)';
        event.resources = new Map([['magnetic_activity', 130], ['cool_regions', 100]]);
        break;
        
      case 'prominence_eruption':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(255, 150, 80, 0.8)';
        event.resources = new Map([['plasma_arc', 170], ['magnetic_field_lines', 140]]);
        event.pulsateSpeed = 1.5;
        event.pulsateAmount = 0.18;
        break;
      
      // ---- PLANET PHENOMENA ----
      case 'plate_tectonics':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(180, 120, 80, 0.8)';
        event.resources = new Map([['crustal_movement', 150], ['mountain_formation', 120]]);
        event.pulsateSpeed = 0.3; // Slow geological processes
        break;
        
      case 'magnetic_dynamo':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(100, 150, 255, 0.7)';
        event.resources = new Map([['core_convection', 160], ['field_generation', 140]]);
        break;
        
      case 'atmospheric_phenomenon':
        event.type = 'nebula';
        event.isInteractable = false;
        event.color = 'rgba(180, 230, 255, 0.5)';
        event.resources = new Map([['weather_patterns', 130], ['climate_regulation', 110]]);
        break;
        
      case 'oceanic_current':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(50, 150, 220, 0.7)';
        event.resources = new Map([['heat_transport', 140], ['nutrient_circulation', 120]]);
        break;
        
      case 'volcanic_activity':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(255, 80, 30, 0.8)';
        event.resources = new Map([['magma_flow', 170], ['new_crust_formation', 150]]);
        event.pulsateSpeed = 1.0;
        event.pulsateAmount = 0.15;
        break;
        
      case 'planetary_core':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(255, 150, 50, 0.85)';
        event.resources = new Map([['inner_heat', 200], ['heavy_elements', 180]]);
        break;
        
      case 'magnetic_field':
        event.type = 'nebula';
        event.isInteractable = false;
        event.color = 'rgba(120, 170, 255, 0.4)';
        event.resources = new Map([['radiation_shield', 160], ['charged_particle_deflection', 140]]);
        break;
        
      case 'auroras':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(100, 255, 150, 0.7)';
        event.resources = new Map([['atmospheric_ionization', 120], ['solar_wind_interaction', 150]]);
        event.pulsateSpeed = 2.0;
        event.pulsateAmount = 0.2;
        break;
      
      // ---- NEBULA PHENOMENA ----
      case 'supernova_remnant':
        event.type = 'nebula';
        event.isInteractable = true;
        event.color = 'rgba(255, 150, 200, 0.7)';
        event.resources = new Map([['heavy_elements', 220], ['shock_waves', 180]]);
        break;
        
      case 'planetary_nebula':
        event.type = 'nebula';
        event.isInteractable = true;
        event.color = 'rgba(150, 255, 200, 0.6)';
        event.resources = new Map([['stellar_envelope', 160], ['white_dwarf', 140]]);
        break;
        
      case 'star_formation':
        event.type = 'protostar';
        event.isInteractable = true;
        event.color = 'rgba(255, 220, 180, 0.7)';
        event.resources = new Map([['accretion_disk', 170], ['protostellar_jet', 150]]);
        event.pulsateSpeed = 1.5;
        event.pulsateAmount = 0.15;
        break;
        
      case 'shock_waves':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(255, 130, 180, 0.6)';
        event.resources = new Map([['compression_heating', 140], ['triggered_collapse', 120]]);
        break;
        
      case 'emission_nebula':
        event.type = 'nebula';
        event.isInteractable = false;
        event.color = 'rgba(255, 100, 150, 0.5)';
        event.resources = new Map([['ionized_gas', 130], ['fluorescence', 110]]);
        break;
      
      // ---- NEUTRON STAR PHENOMENA ----
      case 'pulsar_beam':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(200, 255, 255, 0.8)';
        event.resources = new Map([['radio_emission', 200], ['lighthouse_effect', 170]]);
        event.pulsateSpeed = 5.0; // Very fast pulsation like real pulsars
        event.pulsateAmount = 0.25;
        break;
        
      case 'magnetar_flare':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(255, 200, 255, 0.9)';
        event.resources = new Map([['magnetic_energy_release', 250], ['gamma_ray_burst', 220]]);
        event.pulsateSpeed = 3.0;
        event.pulsateAmount = 0.3; // Very dramatic pulsation
        break;
        
      case 'extreme_density':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(150, 150, 200, 0.85)';
        event.resources = new Map([['neutron_degenerate_matter', 230], ['nuclear_density', 200]]);
        break;
      
      // ---- GENERAL/QUANTUM PHENOMENA ----
      case 'quantum_fluctuation':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(180, 255, 220, 0.7)';
        event.resources = new Map([['virtual_particles', 120], ['vacuum_energy', 100]]);
        event.pulsateSpeed = 4.0; // Very fast quantum fluctuations
        event.pulsateAmount = 0.3; // Highly variable
        break;
        
      case 'time_dilation':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(200, 200, 255, 0.6)';
        event.resources = new Map([['relativistic_effect', 180], ['gravitational_time_shift', 160]]);
        break;
        
      case 'gravity_wave':
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(180, 180, 220, 0.5)';
        event.resources = new Map([['spacetime_ripple', 150], ['massive_object_merger', 130]]);
        event.pulsateSpeed = 2.0;
        event.pulsateAmount = 0.15;
        break;
        
      case 'quantum_entanglement':
        event.type = 'plant';
        event.isInteractable = true;
        event.color = 'rgba(220, 220, 255, 0.8)';
        event.resources = new Map([['nonlocal_correlation', 160], ['quantum_information', 140]]);
        event.pulsateSpeed = 3.0;
        event.pulsateAmount = 0.2;
        break;
        
      default:
        event.type = 'plant';
        event.isInteractable = false;
        event.color = 'rgba(180, 180, 180, 0.7)';
        event.resources = new Map([['unknown_phenomenon', 100]]);
    }
    
    // Add scientific descriptions to event
    event.description = this.getScientificDescription(eventType);
    
    // Add interactive behavior flag based on type
    event.canBeInteractedWith = event.isInteractable;
    
    // Add to the cosmic body's interior
    cosmicBody.interior.push(event);
  }
  
  /**
   * Get scientific description for cosmic events
   * This adds more theoretical depth to the exploration
   */
  private getScientificDescription(eventType: string): string {
    switch(eventType) {
      // ---- GALAXY PHENOMENA ----
      case 'galactic_halo':
        return "The galactic halo is a spherical component extending far beyond the main visible part of galaxies. It contains sparse populations of old stars, globular clusters, and vast amounts of dark matter, which can be detected only by its gravitational effects. Studying halos provides clues about galaxy formation and evolution.";
        
      case 'active_galactic_nucleus':
        return "This incredibly energetic central region of a galaxy is powered by a supermassive black hole accreting matter. As material spirals inward, it forms an accretion disk that heats to millions of degrees through friction, releasing energy across the electromagnetic spectrum. Some AGNs produce relativistic jets extending thousands of light-years.";
        
      case 'galactic_rotation':
        return "The orbital motion of stars and gas around a galaxy's center. Rotation curves show that outer stars orbit at speeds too fast for visible mass alone, providing compelling evidence for dark matter. These rotation patterns create the stunning spiral structures seen in many galaxies and transport angular momentum throughout stellar systems.";
        
      case 'galaxy_merger':
        return "When galaxies collide, their stars rarely impact due to vast distances between them. However, gas clouds compress, triggering intense star formation. Mergers redistribute matter, alter galactic structures, and can activate central black holes. Our Milky Way is currently merging with several dwarf galaxies and will eventually collide with Andromeda.";
        
      case 'spiral_arm_formation':
        return "Spiral arms are regions of increased density in disk galaxies, explained by density wave theory. These waves compress gas as they move through the galaxy, triggering star formation that illuminates the spiral pattern. The arms aren't solid structures but patterns that persist while individual stars move through them, similar to traffic jams on highways.";
        
      case 'star_formation_region':
        return "These stellar nurseries are dense molecular clouds where gas collapses under gravity to form new stars. The process begins when turbulence, supernovae, or galactic collisions compress hydrogen gas. As protostars form, their radiation and stellar winds sculpt the surrounding gas, creating breathtaking structures visible in regions like the Orion Nebula.";
        
      case 'supermassive_black_hole':
        return "These cosmic giants at galaxy centers contain millions to billions of solar masses. Their formation remains mysterious but they profoundly influence galactic evolution. Recent breakthroughs include imaging the shadow of M87's black hole and detecting gravitational waves from supermassive black hole mergers, confirming Einstein's predictions about spacetime's extreme curvature.";
        
      case 'dark_matter_halo':
        return "Dark matter halos are spherical regions of invisible matter surrounding galaxies. Detected only through gravitational effects, these structures provide most of a galaxy's mass and explain galactic rotation curves that defy Newtonian physics. Computer simulations show these halos formed the universe's large-scale structure.";
        
      case 'starburst':
        return "Starbursts are periods of exceptionally rapid star formation, often triggered by galaxy mergers or dense gas clouds. This phenomenon creates hot, young stars at rates hundreds of times faster than normal galactic evolution. The intense radiation and stellar winds from these events can create 'superwinds' that eject material from the galaxy.";
        
      case 'intergalactic_medium':
        return "The vast, extremely tenuous gas filling the space between galaxies. Primarily composed of hydrogen and helium, this medium is heated to millions of degrees in galaxy clusters. It contains most of the universe's baryonic (ordinary) matter and serves as both a fossil record of cosmic evolution and the reservoir from which future galaxies will form.";
        
      // ---- BLACK HOLE PHENOMENA ----
      case 'event_horizon':
        return "The boundary surrounding a black hole beyond which nothing, not even light, can escape. It's not a physical surface but a one-way causal boundary in spacetime. Although we cannot see beyond it, the 2019 Event Horizon Telescope image of M87's black hole confirmed its existence by capturing the shadow it casts against glowing background material.";
        
      case 'hawking_radiation':
        return "Stephen Hawking theorized that quantum effects near black hole horizons cause radiation emission. Virtual particle pairs appear spontaneously, and if one falls into the black hole while the other escapes, the black hole loses a tiny amount of mass. Over enormously long timescales (10^67 years for stellar-mass black holes), this process could lead to complete evaporation.";
        
      case 'singularity':
        return "At a black hole's center lies a singularity where matter is compressed to infinite density and spacetime curvature becomes infinite. General relativity breaks down here, suggesting quantum gravity theories are needed. Cosmic censorship hypothesis proposes that singularities are always hidden behind event horizons, preventing their observation from the outside universe.";
        
      case 'accretion_disk':
        return "A rotating disk of gas, dust, and stellar debris spiraling into a black hole. Friction within the disk heats material to millions of degrees, causing it to emit X-rays and other high-energy radiation. These disks are among the most efficient energy-conversion engines in the universe, transforming up to 40% of infalling matter's rest mass into radiation.";
        
      case 'spaghettification':
        return "The extreme stretching of objects in a strong gravitational gradient near black holes. As an object approaches, the difference in gravitational pull between its near and far sides becomes so great that it's vertically stretched and horizontally compressed into a thin stream. For stellar-mass black holes, this occurs outside the event horizon; for supermassive ones, it happens safely inside.";
        
      case 'gravitational_lensing':
        return "The bending of light by a black hole's gravity. This effect creates multiple or distorted images of background objects, and can magnify distant galaxies that would otherwise be unobservable. Einstein rings, perfect circles of light, form when the observer, lens, and source are perfectly aligned. This phenomenon provides a powerful tool for mapping dark matter and measuring cosmic expansion.";
        
      case 'ergosphere':
        return "A region outside a rotating black hole's event horizon where space-time is dragged along by the black hole's rotation at speeds exceeding light speed. Objects here can still escape, unlike at the event horizon. The ergosphere enables the Penrose process, where particles splitting inside this region can extract rotational energy from the black hole.";
        
      case 'event_horizon_fluctuation':
        return "Quantum theory suggests that black hole event horizons aren't smooth but fluctuate at microscopic scales. These fluctuations arise from uncertainty in the boundary's position and may be crucial for resolving the black hole information paradox. Studying these effects requires uniting quantum mechanics with general relativity—a primary goal of modern theoretical physics.";
        
      case 'frame_dragging':
        return "Frame dragging is the twisting of spacetime caused by rotating massive objects. Near spinning black holes, this Lense-Thirring effect drags everything into rotation, creating ergospheres where space itself rotates faster than light. This phenomenon has been measured for Earth using sophisticated satellite experiments, confirming another prediction of Einstein's relativity.";
        
      // ---- STAR PHENOMENA ----
      case 'nuclear_fusion':
        return "The process powering stars, where atomic nuclei combine to form heavier elements, releasing enormous energy. In main sequence stars like our Sun, hydrogen fuses into helium at temperatures of 15 million degrees Celsius. As stars age, they fuse progressively heavier elements, creating most elements in the periodic table and distributing them throughout the universe when the stars die.";
        
      case 'stellar_wind':
        return "The continuous flow of charged particles ejected from a star's upper atmosphere at speeds up to 2000 km/s. These winds shape planetary nebulae, create astrospheres around stars, and influence exoplanet atmospheres. The solar wind fills our heliosphere, interacting with planetary magnetic fields to create phenomena like auroras and cometary tails.";
        
      case 'solar_flares':
        return "Sudden explosive releases of magnetic energy from a star's surface that accelerate charged particles and heat plasma to tens of millions of degrees. These events release energy equivalent to billions of hydrogen bombs in minutes and can disrupt radio communications, damage satellites, and threaten power grids when directed at Earth. They're often accompanied by coronal mass ejections.";
        
      case 'photosphere':
        return "The visible 'surface' of a star where photons can finally escape into space. This layer is only a few hundred kilometers thick in our Sun and has a temperature of about 5,700°C. The granular appearance of the photosphere reveals convection cells where hot plasma rises, cools, and sinks again, transporting energy from the star's interior.";
        
      case 'chromosphere':
        return "The layer above a star's photosphere, visible as a red rim during solar eclipses. Here, the temperature paradoxically rises with altitude, reaching 20,000°C. This 'temperature inversion' is likely caused by magnetic waves transferring energy from below. The chromosphere contains spicules—dynamic jets of plasma that shoot material upward for several minutes.";
        
      case 'corona':
        return "The outermost layer of a star's atmosphere, extending millions of kilometers into space. Mysteriously heated to over 1 million degrees Celsius (much hotter than the surface below), the corona is only visible during eclipses or with special instruments. The mechanism behind this extreme heating remains one of solar physics' greatest unsolved problems.";
        
      case 'sunspots':
        return "Dark, temporary regions on a star's photosphere caused by intense magnetic fields. These fields inhibit convection, making the areas cooler (about 3,700°C) and darker than their surroundings. Sunspots often appear in pairs or groups and follow an approximately 11-year cycle. They're associated with increased solar activity including flares and coronal mass ejections.";
        
      case 'prominence_eruption':
        return "Enormous arcs of plasma suspended in a star's corona by magnetic fields, sometimes extending hundreds of thousands of kilometers. When these magnetic structures become unstable, they can erupt dramatically, sending billions of tons of stellar material into space. Some fall back to the star's surface in spectacular displays, while others escape completely as coronal mass ejections.";
        
      case 'coronal_mass_ejection':
        return "Massive eruptions of plasma and magnetic field from a star's corona, ejecting billions of tons of material at speeds of hundreds to thousands of kilometers per second. When directed at Earth, these events can trigger geomagnetic storms, disrupting satellite operations, navigation systems, and power grids while creating spectacular auroras at high latitudes.";
        
      case 'stellar_nursery':
        return "Dense molecular clouds where stars are born. Gravity causes denser regions to collapse, forming protostars surrounded by protoplanetary disks. These nurseries contain hundreds to thousands of young stars at various evolutionary stages, along with gas pillars, Herbig-Haro objects, and young stellar jets that help astronomers understand star formation processes.";
        
      // ---- PLANET PHENOMENA ----
      case 'plate_tectonics':
        return "The movement of large sections of a planet's lithosphere over its asthenosphere. This geological process drives mountain formation, volcanic activity, and earthquakes. Earth is the only known planet with active plate tectonics, which recycles surface materials, regulates atmospheric composition through volcanic emissions, and might be essential for maintaining a habitable environment over geological timescales.";
        
      case 'magnetic_dynamo':
        return "The mechanism generating a planet's magnetic field through the motion of electrically conducting fluid in its core. Earth's magnetic field is produced by the flow of liquid iron in the outer core, driven by both convection and the planet's rotation. This self-sustaining geodynamo produces a dipolar field that shields the planet from harmful solar radiation and cosmic rays.";
        
      case 'atmospheric_phenomenon':
        return "Weather systems and climate patterns emerging from complex interactions between a planet's atmosphere, surface, and incoming stellar radiation. On Earth, these include cyclones, jet streams, and global circulation patterns. The dynamics of these systems involve fluid mechanics, thermodynamics, and radiation physics, creating the rich diversity of planetary climates observed in our solar system.";
        
      case 'oceanic_current':
        return "Large-scale movements of water that transport heat, nutrients, and dissolved gases around a planet. Earth's ocean currents form a global conveyor belt driven by wind, temperature, salinity differences, and the Coriolis effect. These currents profoundly influence climate by redistributing heat from equatorial to polar regions and help support marine ecosystems by transporting nutrients.";
        
      case 'volcanic_activity':
        return "The eruption of molten rock, ash, and gases from beneath a planet's surface. Beyond reshaping landscapes, volcanism recycles elements between a planet's interior and surface, releases greenhouse gases that affect climate, and can trigger mass extinctions. On other bodies, cryovolcanism (erupting water, ammonia, or methane) occurs on icy moons like Europa and Enceladus.";
        
      case 'planetary_core':
        return "The dense central region of a planet, typically composed of iron-nickel alloy. Earth's core consists of a solid inner core surrounded by a liquid outer core. The temperature here exceeds 5,000°C—as hot as the Sun's surface. The core's formation released gravitational potential energy that melted the early Earth, and its ongoing solidification continues to power our magnetic field.";
        
      case 'magnetic_field':
        return "The protective shield generated by conducting fluid movement in a planet's core. Earth's magnetosphere extends tens of thousands of kilometers into space, deflecting charged particles from the solar wind. This protection is crucial for preventing atmospheric erosion and maintaining conditions suitable for life. Magnetic field reversals recorded in rocks provide insights into Earth's geological history.";
        
      case 'auroras':
        return "Spectacular light displays that occur when charged particles from a star interact with a planet's magnetic field and atmosphere. These particles follow magnetic field lines toward the poles, exciting atmospheric gases that emit photons when returning to their ground state. Earth's auroras (Northern and Southern Lights) primarily display green and red from oxygen and blue from nitrogen.";
        
      case 'atmospheric_storms':
        return "Violent weather systems driven by temperature differentials and planetary rotation. On gas giants like Jupiter, storms can persist for centuries due to the absence of solid surfaces to create friction. The Great Red Spot on Jupiter is a massive anticyclonic storm larger than Earth that has existed for at least 400 years, revealing fundamental principles of fluid dynamics on a planetary scale.";
        
      case 'magnetic_field_reversal':
        return "The process where a planet's magnetic poles swap positions. Earth's field has reversed hundreds of times throughout its history, with the last major reversal occurring 780,000 years ago. During transitions, which can take thousands of years, the field weakens significantly. These events are recorded in magnetic minerals in rock layers, providing a geological timeline.";
        
      // ---- NEBULA PHENOMENA ----
      case 'supernova_remnant':
        return "The structure resulting from a stellar explosion, consisting of ejected material expanding at velocities up to 30,000 km/s. These remnants enrich the interstellar medium with heavy elements forged in the star's core and during the explosion itself. Shock waves from supernovae compress gas clouds, triggering new star formation. The Crab Nebula is one of the most famous examples, formed by a supernova observed in 1054 CE.";
        
      case 'planetary_nebula':
        return "Despite their name, these have nothing to do with planets. They form when dying low-mass stars shed their outer layers, creating colorful shells of ionized gas. At the center lies the original star's core—a white dwarf whose intense ultraviolet radiation causes the ejected gas to fluoresce. Each planetary nebula lives for only about 10,000 years before dispersing into the interstellar medium.";
        
      case 'star_formation':
        return "The process by which dense regions within molecular clouds collapse under gravity to form stars. As the cloud contracts, it heats up and fragments into smaller clumps that become individual stars. Conservation of angular momentum causes the gas to form a spinning disk, which can eventually give rise to planets. This complex process involves magnetic fields, turbulence, and radiation pressure.";
        
      case 'shock_waves':
        return "Pressure waves that propagate faster than the speed of sound in the interstellar medium. Produced by supernovae, stellar winds, or colliding clouds, these waves compress and heat the gas they travel through. Shock fronts are sites of intense energy release, molecule formation, and can trigger gravitational collapse, initiating star formation in previously stable gas clouds.";
        
      case 'emission_nebula':
        return "Clouds of ionized gas that glow in distinctive colors when energized by the radiation from nearby hot stars. The characteristic red hue in many nebulae comes from hydrogen atoms emitting H-alpha light (656.3 nm) when electrons recombine with protons. Different elements produce different colors—oxygen creates greenish-blue regions, while nitrogen contributes red and pink hues in complex patterns.";
        
      case 'dust_pillar':
        return "Towering columns of interstellar dust and gas within star-forming regions, sculpted by the radiation pressure and stellar winds from nearby massive stars. The most famous examples are the 'Pillars of Creation' in the Eagle Nebula. These structures are often sites of active star formation, with the dense dust shielding protostellar cores from destructive radiation.";
        
      case 'planetary_nebula_ring':
        return "Ring-shaped structures formed when aging stars eject their outer layers in spherical shells. From our perspective, the edges of these shells appear brighter because we're looking through more material, creating the illusion of a ring. The Ring Nebula (M57) is a classic example, showcasing different emission colors from various ionized elements at different temperatures.";
        
      // ---- NEUTRON STAR PHENOMENA ----
      case 'pulsar_beam':
        return "Highly focused streams of radiation emitted from a neutron star's magnetic poles. As the star rotates, these beams sweep across space like cosmic lighthouses. When aligned with Earth, we detect regular pulses of radiation, from which pulsars derive their name. The precise timing of these pulses rivals atomic clocks, allowing scientists to test theories of gravity and detect gravitational waves.";
        
      case 'magnetar_flare':
        return "Extraordinarily powerful eruptions from neutron stars with the most extreme magnetic fields known—quadrillions of times stronger than Earth's. These fields can stress and crack the star's crust, releasing tremendous energy bursts that briefly outshine all other gamma-ray sources combined. A magnetar flare in 2004 from 50,000 light-years away affected Earth's ionosphere, demonstrating their astounding power.";
        
      case 'extreme_density':
        return "The matter in neutron stars is compressed to densities of approximately 10^17 kg/m³—comparable to cramming Mount Everest into a sugar cube. Under such conditions, atomic nuclei break down and protons combine with electrons to form neutrons. The outer layers crystallize into an exotic solid, while deeper regions may contain superfluids, strange quarks, and other exotic states of matter impossible to recreate in laboratories.";
        
      // ---- QUANTUM/GENERAL PHENOMENA ----
      case 'quantum_fluctuation':
        return "According to quantum field theory, the vacuum isn't empty but seethes with virtual particles popping in and out of existence on extremely short timescales. These fluctuations are thought to have seeded the universe's large-scale structure and cause the Casimir effect—a measurable force between closely spaced materials. During the inflationary period after the Big Bang, some fluctuations may have grown into entire universes.";
        
      case 'time_dilation':
        return "The slowing of time in regions of strong gravity or for objects moving at high speeds, as predicted by Einstein's relativity theories. GPS satellites must compensate for this effect, as they experience time marginally faster than Earth's surface. Near black holes, time dilation becomes extreme—what appears as milliseconds to an outside observer could be years for someone nearing the event horizon.";
        
      case 'gravity_wave':
        return "Ripples in spacetime caused by accelerating massive objects, traveling at light speed. First directly detected in 2015 from merging black holes, these waves compress and stretch space perpendicular to their direction of travel. The signals from these cosmic cataclysms are incredibly faint by the time they reach Earth, changing the length of LIGO's 4km detector arms by just 1/10,000th the width of a proton.";
        
      case 'quantum_entanglement':
        return "A quantum mechanical phenomenon where pairs or groups of particles are generated or interact in ways such that the quantum state of each particle cannot be described independently. Measuring one instantly determines properties of its partners, regardless of separation distance. Einstein called this 'spooky action at a distance,' but experiments consistently confirm this cornerstone of quantum mechanics.";
        
      case 'dark_matter':
        return "An invisible form of matter that doesn't interact with the electromagnetic force but exerts gravitational pull. Making up approximately 85% of the universe's matter, its existence is inferred from galactic rotation curves, gravitational lensing, and cosmic microwave background patterns. Leading candidates include weakly interacting massive particles (WIMPs) and axions, but direct detection remains elusive.";
        
      case 'dark_energy':
        return "The mysterious force driving the accelerating expansion of the universe, discovered in 1998 through observations of distant supernovae. Constituting about 68% of the universe's total energy content, its nature remains one of physics' greatest puzzles. It may be the energy of the vacuum itself, a dynamic scalar field called quintessence, or indicate that our understanding of gravity needs revision at cosmic scales.";
        
      // For any other events, provide a generic but scientifically accurate description
      default:
        return "A fascinating cosmic phenomenon worthy of scientific investigation. Its properties reveal deeper mechanics of our universe and may hold answers to fundamental questions about matter, energy, and the nature of reality itself.";
    }
  }
  
  /**
   * Generate interior elements for a galaxy
   */
  private generateGalaxyInterior(galaxy: Plant): void {
    // Galaxies contain stars, nebulae, and potentially black holes
    const starCount = 10 + Math.floor(Math.random() * 15);
    const nebulaCount = 2 + Math.floor(Math.random() * 3);
    const hasBlackHole = Math.random() < 0.3; // 30% chance of having a central black hole
    
    // Add a central black hole for many galaxies
    if (hasBlackHole) {
      const blackHole = new Plant(
        galaxy.x, 
        galaxy.y, 
        0.8 + Math.random() * 0.2,
        Math.max(6, galaxy.universePhase)
      );
      blackHole.type = 'blackhole';
      blackHole.isInteractable = true;
      blackHole.parent = galaxy;
      
      // Set scientific properties for the black hole
      const stellarMass = 1000000 + Math.random() * 9000000; // Supermassive black hole
      blackHole.cosmicProperties = {
        stellarMass,
        eventHorizonRadius: stellarMass * 0.000001, // Simplified calculation
        accretionDisk: true
      };
      
      galaxy.interior.push(blackHole);
    }
    
    // Add stars throughout the galaxy
    for (let i = 0; i < starCount; i++) {
      // Stars are distributed based on galaxy type
      let x = 0, y = 0;
      const galaxyType = galaxy.cosmicProperties.galaxyType || 'spiral';
      
      if (galaxyType === 'spiral') {
        // Stars follow spiral arms
        const spiralArms = galaxy.cosmicProperties.spiralArms || 4;
        const arm = i % spiralArms;
        const distanceFromCenter = Math.random() * 200;
        const angle = (arm / spiralArms) * Math.PI * 2 + (distanceFromCenter * 0.02);
        
        x = galaxy.x + Math.cos(angle) * distanceFromCenter;
        y = galaxy.y + Math.sin(angle) * distanceFromCenter;
      } else if (galaxyType === 'elliptical') {
        // Elliptical galaxies have more centrally concentrated stars
        const angle = Math.random() * Math.PI * 2;
        const distance = (Math.random() * Math.random()) * 200; // More stars near center
        
        x = galaxy.x + Math.cos(angle) * distance;
        y = galaxy.y + Math.sin(angle) * distance;
      } else {
        // Irregular galaxies have random star distribution
        x = galaxy.x + (Math.random() * 400 - 200);
        y = galaxy.y + (Math.random() * 400 - 200);
      }
      
      // Create the star with realistic properties
      const star = new Plant(
        x, y, 
        0.3 + Math.random() * 0.7,
        Math.max(6, galaxy.universePhase)
      );
      star.type = 'star';
      star.isInteractable = true;
      star.parent = galaxy;
      
      // Set star scientific properties based on stellar classification
      const stellarMass = 0.1 + Math.random() * 50; // 0.1 to 50 solar masses
      
      // Determine star type based on mass
      let starType: 'main_sequence' | 'red_giant' | 'white_dwarf' | 'neutron' | 'yellow_dwarf' | 'red_dwarf' | 'blue_giant';
      if (stellarMass > 15) {
        starType = 'blue_giant';
      } else if (stellarMass > 8) {
        starType = Math.random() < 0.05 ? 'neutron' : 'blue_giant';
      } else if (stellarMass > 1.5) {
        starType = 'main_sequence';
      } else if (stellarMass > 0.5) {
        starType = 'yellow_dwarf';
      } else {
        starType = 'red_dwarf';
      }
      
      // Calculate temperature based on star type
      let temperature = 0;
      switch (starType) {
        case 'blue_giant':
          temperature = 15000 + Math.random() * 15000;
          break;
        case 'main_sequence':
          temperature = 6000 + Math.random() * 4000;
          break;
        case 'yellow_dwarf':
          temperature = 5000 + Math.random() * 1000;
          break;
        case 'red_dwarf':
          temperature = 2500 + Math.random() * 1000;
          break;
        case 'neutron':
          temperature = 500000 + Math.random() * 500000;
          break;
      }
      
      // Luminosity roughly scales with mass^3.5
      const luminosity = Math.pow(stellarMass, 3.5);
      
      star.cosmicProperties = {
        starType,
        temperature,
        stellarMass,
        luminosity
      };
      
      // Add some planets for the star
      const planetCount = 2 + Math.floor(Math.random() * 6);
      
      for (let j = 0; j < planetCount; j++) {
        // Use Titus-Bode law (approximation) for planet spacing
        const distance = 0.4 + 0.3 * Math.pow(2, j - 1);
        const angle = Math.random() * Math.PI * 2;
        
        star.satellites.push({
          distance: distance * 30,  // Scale to pixel distance
          angle,
          size: 0.1 + Math.random() * 0.3,
          orbitSpeed: 0.05 + Math.random() * 0.1,
          color: this.getPlanetColor(j, planetCount),
          type: this.getPlanetType(j, planetCount), 
          hasRings: Math.random() < 0.2,
          ringColor: '#D2B48C',
          ringSize: 5 + Math.random() * 5,
          orbitPeriod: distance * 365, // Days to orbit (approximation)
          orbitEccentricity: Math.random() * 0.2, // Most planets have low eccentricity
          
          getPosition(centerX: number, centerY: number) {
            return {
              x: centerX + Math.cos(this.angle) * this.distance,
              y: centerY + Math.sin(this.angle) * this.distance
            };
          },
          
          update(deltaTime: number) {
            this.angle += this.orbitSpeed * deltaTime;
          }
        });
      }
      
      galaxy.interior.push(star);
    }
    
    // Add nebulae
    for (let i = 0; i < nebulaCount; i++) {
      const x = galaxy.x + (Math.random() * 400 - 200);
      const y = galaxy.y + (Math.random() * 400 - 200);
      
      const nebula = new Plant(
        x, y,
        0.5 + Math.random() * 0.5,
        Math.max(5, galaxy.universePhase)
      );
      nebula.type = 'nebula';
      nebula.isInteractable = true;
      nebula.parent = galaxy;
      
      galaxy.interior.push(nebula);
    }
  }
  
  /**
   * Generate interior elements for a star
   */
  private generateStarInterior(star: Plant): void {
    // Create the stellar core - the source of the star's energy
    this.createStellarCore(star);
    
    // Create the various stellar layers
    this.createStellarLayers(star);
    
    // Create stellar phenomena like flares, prominences, etc.
    this.createStellarPhenomena(star);
    
    // Stars have orbiting planets that can be visited
    const planetCount = 2 + Math.floor(Math.random() * 6); // 2-7 planets
    
    // Determine habitable zone based on star type
    const starType = star.cosmicProperties.starType || 'main_sequence';
    const stellarMass = star.cosmicProperties.stellarMass || 1;
    const luminosity = star.cosmicProperties.luminosity || 1;
    
    // Calculate the habitable zone (where liquid water can exist)
    const habitableZoneMin = 0.95 * Math.sqrt(luminosity); // Inner edge in AU
    const habitableZoneMax = 1.37 * Math.sqrt(luminosity); // Outer edge in AU
    
    // Convert AU to pixel distances for visualization
    const auScale = 30; // Pixels per AU
    const habitableZoneMinPixels = habitableZoneMin * auScale;
    const habitableZoneMaxPixels = habitableZoneMax * auScale;
    
    // Generate planets with proper spacing
    for (let i = 0; i < planetCount; i++) {
      // Calculate distance using an approximation of Titus-Bode law
      let distance = (0.4 + 0.3 * Math.pow(2, i - 1)) * auScale;
      distance *= (1 + (Math.random() * 0.2 - 0.1)); // Add some variation
      
      // Place planet at calculated distance and random angle
      const angle = Math.random() * Math.PI * 2;
      const x = star.x + Math.cos(angle) * distance;
      const y = star.y + Math.sin(angle) * distance;
      
      // Create the planet
      const planet = new Plant(
        x, y,
        0.2 + Math.random() * 0.4,
        Math.max(8, star.universePhase)
      );
      
      // Determine planet type based on distance from star
      let isInHabitableZone = false;
      let planetType: 'rocky' | 'gas_giant' | 'ice_giant' | 'dwarf' | 'habitable';
      
      if (distance < habitableZoneMinPixels * 0.5) {
        // Inner planets tend to be small and rocky
        planet.type = 'planet';
        planetType = 'rocky';
      } else if (distance > habitableZoneMaxPixels * 2) {
        // Outer planets tend to be gas giants or ice giants
        planet.type = distance > habitableZoneMaxPixels * 4 ? 'dwarf_planet' : 'gas_giant';
        planetType = distance > habitableZoneMaxPixels * 4 ? 'dwarf' : 'gas_giant';
      } else {
        // Middle zone planets are mixed
        planet.type = 'planet';
        planetType = Math.random() < 0.6 ? 'rocky' : 'gas_giant';
        
        // Check if the planet is in the habitable zone
        if (distance >= habitableZoneMinPixels && distance <= habitableZoneMaxPixels &&
            planetType === 'rocky') {
          isInHabitableZone = true;
          planetType = 'habitable';
        }
      }
      
      // Set properties based on planet type
      const mass = planetType === 'gas_giant' ? 
        50 + Math.random() * 250 :  // Gas giants are 50-300 Earth masses
        0.1 + Math.random() * 3;    // Rocky planets are 0.1-3 Earth masses
      
      const atmosphere = planetType === 'gas_giant' ? 
        0.8 + Math.random() * 0.2 :  // Gas giants have thick atmospheres
        (isInHabitableZone ? 0.3 + Math.random() * 0.7 : Math.random() * 0.2); // Some rocky planets have atmospheres
      
      const hydrosphere = isInHabitableZone ? 
        0.3 + Math.random() * 0.7 : // Habitable planets have water
        Math.random() * 0.1;        // Non-habitable rarely have liquid water
      
      // Set planet properties
      planet.cosmicProperties = {
        planetType,
        mass,
        atmosphere,
        hydrosphere,
        dayLength: 10 + Math.random() * 40, // Hours per day
        yearLength: Math.sqrt(Math.pow(distance / auScale, 3)) * 365, // Kepler's third law
        magneticField: Math.random() * 0.8,
        moons: Math.floor(Math.random() * 
          (planetType === 'gas_giant' ? 20 : 3)) // Gas giants have more moons
      };
      
      // Planets in habitable zone have a chance for habitability if star type is suitable
      if (isInHabitableZone && 
          (starType === 'main_sequence' || starType === 'yellow_dwarf' || starType === 'red_dwarf') &&
          star.universePhase >= 9) {
        planet.habitability = 0.3 + Math.random() * 0.7;
        
        // Some habitable planets may develop life in later phases
        if (star.universePhase >= 11 && Math.random() < 0.5) {
          planet.lifeComplexity = 0.1 + Math.random() * 0.4;
        }
      }
      
      planet.isInteractable = true;
      planet.parent = star;
      
      star.interior.push(planet);
    }
  }
  
  /**
   * Generate interior elements for a planet
   */
  private generatePlanetInterior(planet: Plant): void {
    // Number of surface features based on planet properties
    const featureCount = planet.habitability > 0 ?
      20 + Math.floor(Math.random() * 25) : // More features on habitable planets
      10 + Math.floor(Math.random() * 15);   // Fewer on barren planets
    
    // Create planetary core - common to all planets
    this.createPlanetaryCore(planet);
    
    // Generate atmosphere if present
    if (planet.cosmicProperties.atmosphere && planet.cosmicProperties.atmosphere > 0.1) {
      this.createPlanetaryAtmosphere(planet);
    }
    
    // Create tectonic features and geological activities
    this.createTectonicFeatures(planet);
    
    // If the planet has habitability, show more detailed features
    if (planet.habitability > 0) {
      // Generate geographic features: mountains, lakes, forests, etc.
      for (let i = 0; i < featureCount; i++) {
        // Distribute features across planet surface
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150;
        const x = planet.x + Math.cos(angle) * distance;
        const y = planet.y + Math.sin(angle) * distance;
        
        // Create different geographic feature types
        const featureTypeProbability = Math.random();
        
        const feature = new Plant(
          x, y,
          0.1 + Math.random() * 0.2,
          planet.universePhase
        );
        feature.isInteractable = true;
        feature.parent = planet;
        
        // Set feature type and color
        if (featureTypeProbability < 0.25) {
          // Water bodies with varying properties
          feature.type = 'water_body';
          if (planet.cosmicProperties.hydrosphere && planet.cosmicProperties.hydrosphere > 0.2) {
            // Different types of water bodies
            if (Math.random() < 0.3) {
              feature.color = '#104E8B'; // Deep ocean
              feature.description = 'A deep oceanic trench, where pressure reaches hundreds of atmospheres. Extreme environments like these can harbor unique life forms adapted to high pressure and low light.';
            } else if (Math.random() < 0.6) {
              feature.color = '#1E90FF'; // Regular water
              feature.description = 'A large body of water, home to complex aquatic ecosystems and a vital component in the planet\'s climate regulation system.';
            } else {
              feature.color = '#87CEEB'; // Shallow water
              feature.description = 'A shallow coastal region where sunlight penetrates to the bottom, creating ideal conditions for coral reefs and diverse marine ecosystems.';
            }
          } else {
            feature.color = '#A9A9A9'; // Dry lake bed
            feature.description = 'An ancient dried-up lake bed, evidence of past hydrological activity. The minerals deposited here tell the story of the planet\'s changing climate.';
          }
        } else if (featureTypeProbability < 0.5) {
          // Mountains/terrain with different geological characteristics
          feature.type = 'mountain';
          if (Math.random() < 0.4) {
            feature.color = '#8B4513'; // Brown mountains
            feature.description = 'A massive mountain range formed by tectonic plate collision, featuring folded rock layers that record millions of years of geological history.';
          } else if (Math.random() < 0.7) {
            feature.color = '#A0522D'; // Volcanic mountains
            feature.description = 'An active volcanic region where magma from the mantle reaches the surface, building new land and releasing gases that affect the planet\'s atmosphere.';
          } else {
            feature.color = '#708090'; // Eroded mountains
            feature.description = 'Ancient, weathered mountains that have been shaped by millions of years of erosion, revealing geological layers that date back to the planet\'s formation.';
          }
        } else if (featureTypeProbability < 0.75) {
          // Special geological features
          feature.type = 'geological_feature';
          if (Math.random() < 0.3) {
            feature.color = '#FFD700'; // Impact crater
            feature.description = 'A massive impact crater from an ancient meteorite collision. Such impacts can trigger mass extinctions but also bring valuable minerals and potentially life-supporting compounds.';
          } else if (Math.random() < 0.6) {
            feature.color = '#D2691E'; // Canyon system
            feature.description = 'A vast canyon system carved by ancient rivers, exposing billions of years of the planet\'s geological history in its stratified walls.';
          } else {
            feature.color = '#FFF8DC'; // Salt flats
            feature.description = 'Vast mineral flats formed by the evaporation of mineral-rich water bodies. These areas can preserve ancient microbial fossils and provide insights into early life forms.';
          }
        } else {
          // Vegetation if life complexity is high enough
          if (planet.lifeComplexity > 0.1) {
            feature.type = 'biome';
            if (Math.random() < 0.3) {
              feature.color = '#006400'; // Dark green forests
              feature.description = 'A dense forest ecosystem teeming with biodiversity, acting as a carbon sink and stabilizing the planet\'s climate through complex feedback systems.';
            } else if (Math.random() < 0.6) {
              feature.color = '#7CFC00'; // Light green grasslands
              feature.description = 'Expansive grasslands supporting diverse herbivores and predators. These ecosystems are highly adaptable to seasonal changes and can rapidly recover from disturbances.';
            } else {
              feature.color = '#228B22'; // Mixed vegetation
              feature.description = 'A transitional ecosystem where multiple biomes intersect, creating unique ecological niches that foster evolutionary innovation and high biodiversity.';
            }
          } else {
            feature.type = 'plains';
            feature.color = '#DAA520'; // Goldenrod (plains)
            feature.description = 'Barren plains with minimal vegetation, where only the most resilient life forms can survive the harsh conditions. These areas could be the first to show signs of emerging life.';
          }
        }
        
        planet.interior.push(feature);
      }
      
      // Add weather systems and atmospheric phenomena
      this.createWeatherSystems(planet);
      
      // If the planet has advanced life, add some primitive structures
      if (planet.lifeComplexity > 0.5 && planet.universePhase >= 12) {
        this.createAdvancedLifeForms(planet);
      }
    } else {
      // Barren planets have craters, mountains, etc.
      for (let i = 0; i < featureCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150;
        const x = planet.x + Math.cos(angle) * distance;
        const y = planet.y + Math.sin(angle) * distance;
        
        const feature = new Plant(
          x, y,
          0.1 + Math.random() * 0.2,
          planet.universePhase
        );
        feature.isInteractable = true;
        feature.parent = planet;
        
        // More diverse features for barren planets
        const featureType = Math.random();
        const planetType = planet.cosmicProperties.planetType || 'rocky';
        
        if (featureType < 0.25) {
          // Impact craters
          feature.type = 'crater';
          feature.color = '#696969'; // Dim gray for craters
          feature.description = 'A massive impact crater revealing layers of the planet\'s crust. The mineralogy shows evidence of ' + 
                                (planetType === 'rocky' ? 'ancient lava flows and tectonic activity.' : 
                                 planetType === 'ice_giant' ? 'frozen volatiles and complex hydrocarbons.' : 
                                 'unique composition unlike anything in our solar system.');
        } else if (featureType < 0.5) {
          // Geological formations based on planet type
          feature.type = 'formation';
          if (planetType === 'rocky') {
            feature.color = '#8B4513'; // Brown for rocky features
            feature.description = 'A striking geological formation shaped by ancient tectonic forces. The exposed minerals suggest this area experienced significant volcanic activity in the past.';
          } else if (planetType === 'ice_giant') {
            feature.color = '#ADD8E6'; // Light blue for ice features
            feature.description = 'A frozen methane glacier slowly flowing across the surface. The crystalline structure creates spectacular light diffraction patterns visible from orbit.';
          } else if (planetType === 'gas_giant') {
            feature.color = '#F4A460'; // Sandy brown for gas giant features
            feature.description = 'A massive storm system in the upper atmosphere, similar to Jupiter\'s Great Red Spot. High-speed winds create turbulent flow patterns that can persist for centuries.';
          } else {
            feature.color = '#A9A9A9'; // Gray for generic features
            feature.description = 'An unusual terrain formation of unknown origin. Its composition doesn\'t match the surrounding landscape, suggesting it might be the result of an ancient cataclysmic event.';
          }
        } else if (featureType < 0.75) {
          // Canyons or trenches
          feature.type = 'canyon';
          if (planetType === 'rocky') {
            feature.color = '#8B0000'; // Dark red for canyons
            feature.description = 'A vast canyon system that could have been carved by ancient water flows. The exposed strata provide a timeline of the planet\'s geological history.';
          } else {
            feature.color = '#696969'; // Dim gray
            feature.description = 'A deep tectonic rift revealing the planet\'s internal structure. The unusual formations suggest significant past geological activity despite the current barren appearance.';
          }
        } else {
          // Unique features based on planet type
          feature.type = 'unique_feature';
          if (planetType === 'rocky') {
            feature.color = '#CD853F'; // Peru color for desert-like features
            feature.description = 'An ancient dried-up seabed containing mineral deposits that indicate this planet once had significant surface water before it was lost to space or subsurface reservoirs.';
          } else if (planetType === 'ice_giant') {
            feature.color = '#87CEFA'; // Light sky blue
            feature.description = 'A region of nitrogen geysers erupting from subsurface pressure, creating spectacular plumes visible from space and depositing fresh material on the surface regularly.';
          } else if (planetType === 'gas_giant') {
            feature.color = '#BDB76B'; // Dark khaki
            feature.description = 'A band of unprecedented atmospheric stability in the chaotic upper atmosphere. The unique chemical composition creates distinctive coloration visible from great distances.';
          } else {
            feature.color = '#778899'; // Light slate gray
            feature.description = 'A mysterious terrain feature unlike anything cataloged in known planetary science. Its origins remain unexplained, challenging our understanding of planetary formation.';
          }
        }
        
        planet.interior.push(feature);
      }
      
      // Add extreme weather phenomena for gas giants
      if (planet.cosmicProperties.planetType === 'gas_giant') {
        this.createGasGiantStorms(planet);
      }
    }
  }
  
  /**
   * Create a planetary core for any planet type
   */
  private createPlanetaryCore(planet: Plant): void {
    // Create planetary core at center with slight offset
    const offset = 10 + Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    const x = planet.x + Math.cos(angle) * offset;
    const y = planet.y + Math.sin(angle) * offset;
    
    const core = new Plant(
      x, y,
      0.25 + Math.random() * 0.15,
      planet.universePhase
    );
    
    core.type = 'planetary_core';
    core.isInteractable = true;
    core.parent = planet;
    
    // Different core types based on planet type
    const planetType = planet.cosmicProperties.planetType || 'rocky';
    
    if (planetType === 'rocky') {
      core.color = '#FF4500'; // Orange-red for iron/nickel core
      core.description = 'The planet\'s iron-nickel core generates a magnetic field through convection currents in the liquid outer layer, protecting the surface from harmful radiation and solar wind.';
    } else if (planetType === 'gas_giant') {
      core.color = '#FFD700'; // Gold for metallic hydrogen
      core.description = 'A core of metallic hydrogen under extreme pressure, possibly surrounding a rocky center. The enormous pressure creates exotic states of matter not reproducible in laboratories.';
    } else if (planetType === 'ice_giant') {
      core.color = '#4682B4'; // Steel blue for water/ammonia core
      core.description = 'A high-pressure core of water, ammonia, and methane ices surrounding a rocky center. The ionic conductivity of these compressed ices generates the planet\'s magnetic field.';
    } else {
      core.color = '#B22222'; // Firebrick for generic core
      core.description = 'The dense planetary core where gravity compresses matter to extreme pressures, creating temperature conditions that maintain a partially molten state for billions of years.';
    }
    
    core.pulsateSpeed = 0.2;
    core.pulsateAmount = 0.05;
    
    planet.interior.push(core);
  }
  
  /**
   * Create atmospheric features for a planet
   */
  private createPlanetaryAtmosphere(planet: Plant): void {
    const atmosphericLayerCount = 2 + Math.floor(Math.random() * 3);
    const atmosphereType = planet.cosmicProperties.atmosphereType || 'unknown';
    
    for (let i = 0; i < atmosphericLayerCount; i++) {
      // Position atmospheric phenomena near the "edges" of the planet
      const angle = (i / atmosphericLayerCount) * Math.PI * 2;
      const distance = 140 + Math.random() * 30;
      const x = planet.x + Math.cos(angle) * distance;
      const y = planet.y + Math.sin(angle) * distance;
      
      const atmosphericLayer = new Plant(
        x, y,
        0.15 + Math.random() * 0.2,
        planet.universePhase
      );
      
      atmosphericLayer.type = 'atmosphere';
      atmosphericLayer.isInteractable = true;
      atmosphericLayer.parent = planet;
      
      // Set color and properties based on atmosphere type
      if (atmosphereType === 'oxygen_nitrogen') {
        atmosphericLayer.color = 'rgba(135, 206, 250, 0.6)'; // Light blue
        atmosphericLayer.description = 'A nitrogen-oxygen atmosphere similar to Earth\'s, capable of supporting aerobic life and providing protection from cosmic radiation and small meteorites.';
      } else if (atmosphereType === 'carbon_dioxide') {
        atmosphericLayer.color = 'rgba(169, 169, 169, 0.6)'; // Dark gray
        atmosphericLayer.description = 'A thick carbon dioxide atmosphere creating a strong greenhouse effect. This traps heat and significantly raises the planet\'s surface temperature.';
      } else if (atmosphereType === 'hydrogen_helium') {
        atmosphericLayer.color = 'rgba(255, 255, 224, 0.5)'; // Light yellow
        atmosphericLayer.description = 'A vast hydrogen-helium atmosphere extending thousands of kilometers above the surface, with distinctive banding caused by differential rotation rates.';
      } else if (atmosphereType === 'methane') {
        atmosphericLayer.color = 'rgba(0, 128, 128, 0.6)'; // Teal
        atmosphericLayer.description = 'A methane-rich atmosphere that absorbs red light and reflects blue, giving the planet its distinctive cyan appearance. Methane can be produced by both biological and geological processes.';
      } else {
        atmosphericLayer.color = 'rgba(211, 211, 211, 0.5)'; // Light gray
        atmosphericLayer.description = 'An atmosphere of unknown composition with unique spectral signatures not matching any known planetary atmospheres in our solar system.';
      }
      
      planet.interior.push(atmosphericLayer);
    }
    
    // Add auroras if the planet has a magnetic field
    if (planet.cosmicProperties.magneticField && planet.cosmicProperties.magneticField > 0.3) {
      this.createPlanetaryAuroras(planet);
    }
  }
  
  /**
   * Create aurora effects near the poles of planets with magnetic fields
   */
  private createPlanetaryAuroras(planet: Plant): void {
    // Create 2-4 aurora features near the "poles"
    const auroraCount = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < auroraCount; i++) {
      // Position auroras near the poles (top and bottom of the visualization)
      const polarPosition = i % 2 === 0 ? -1 : 1;
      const angle = (Math.random() * 0.5 - 0.25) * Math.PI;
      const distance = 150 + Math.random() * 20;
      const x = planet.x + Math.cos(angle) * distance;
      const y = planet.y + (polarPosition * distance * 0.8);
      
      const aurora = new Plant(
        x, y,
        0.2 + Math.random() * 0.3,
        planet.universePhase
      );
      
      aurora.type = 'aurora';
      aurora.isInteractable = true;
      aurora.parent = planet;
      
      // Auroras with different colors
      const colorOption = Math.random();
      if (colorOption < 0.33) {
        aurora.color = 'rgba(0, 255, 127, 0.7)'; // Green aurora
        aurora.description = 'A beautiful green aurora caused by oxygen atoms excited by solar wind particles guided along magnetic field lines. The patterns continuously shift as the solar wind intensity varies.';
      } else if (colorOption < 0.66) {
        aurora.color = 'rgba(138, 43, 226, 0.7)'; // Purple aurora
        aurora.description = 'A rare purple aurora resulting from a mix of blue and red emissions at high altitudes. These occur during intense solar storms when highly energetic particles penetrate deeper into the atmosphere.';
      } else {
        aurora.color = 'rgba(255, 69, 0, 0.7)'; // Red aurora
        aurora.description = 'A spectacular red aurora from high-altitude oxygen interactions, typically seen during strong geomagnetic storms. These rare displays are visible at lower latitudes than the common green auroras.';
      }
      
      aurora.pulsateSpeed = 0.5 + Math.random();
      aurora.pulsateAmount = 0.15 + Math.random() * 0.2;
      
      planet.interior.push(aurora);
    }
  }
  
  /**
   * Create tectonic activities for rocky planets
   */
  private createTectonicFeatures(planet: Plant): void {
    // Only add tectonic features to rocky planets with some geological activity
    if (planet.cosmicProperties.planetType !== 'rocky' || !planet.cosmicProperties.geologicalActivity) return;
    
    const geologicalActivity = planet.cosmicProperties.geologicalActivity;
    
    // More geological features for more active planets
    const featureCount = Math.floor(geologicalActivity * 10);
    if (featureCount === 0) return;
    
    for (let i = 0; i < featureCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 110;
      const x = planet.x + Math.cos(angle) * distance;
      const y = planet.y + Math.sin(angle) * distance;
      
      const tectonicFeature = new Plant(
        x, y,
        0.15 + Math.random() * 0.15,
        planet.universePhase
      );
      
      tectonicFeature.isInteractable = true;
      tectonicFeature.parent = planet;
      
      // Different tectonic features
      const featureType = Math.random();
      
      if (featureType < 0.3 && geologicalActivity > 0.5) {
        // Volcanoes for geologically active planets
        tectonicFeature.type = 'volcano';
        tectonicFeature.color = '#FF4500'; // OrangeRed
        tectonicFeature.description = 'An active volcano ejecting magma from the planet\'s interior. Volcanic activity is a major mechanism for atmospheric gas replenishment and can dramatically alter climate conditions.';
      } else if (featureType < 0.6) {
        // Fault lines
        tectonicFeature.type = 'fault_line';
        tectonicFeature.color = '#8B4513'; // SaddleBrown
        tectonicFeature.description = 'A major tectonic fault where plates move relative to each other, building stress that periodically releases as earthquakes. These boundaries are where most of the planet\'s geological activity occurs.';
      } else if (featureType < 0.8) {
        // Hot spots
        tectonicFeature.type = 'hot_spot';
        tectonicFeature.color = '#CD5C5C'; // IndianRed
        tectonicFeature.description = 'A geological hot spot where a mantle plume creates above-average heat flow, often resulting in volcanic island chains as tectonic plates move across the fixed plume.';
      } else {
        // Rift valleys
        tectonicFeature.type = 'rift_valley';
        tectonicFeature.color = '#A0522D'; // Sienna
        tectonicFeature.description = 'A linear lowland region created by the rifting or pulling apart of the planet\'s crust. These are sites of new crust formation and often contain mineral deposits of economic importance.';
      }
      
      // Active features pulsate slightly
      if (geologicalActivity > 0.7) {
        tectonicFeature.pulsateSpeed = 0.3 + Math.random() * 0.3;
        tectonicFeature.pulsateAmount = 0.05 + Math.random() * 0.1;
      }
      
      planet.interior.push(tectonicFeature);
    }
  }
  
  /**
   * Create weather systems for planets with atmospheres
   */
  private createWeatherSystems(planet: Plant): void {
    // Only create weather for planets with substantial atmospheres
    if (!planet.cosmicProperties.atmosphere || planet.cosmicProperties.atmosphere < 0.3) return;
    
    const weatherSystemCount = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < weatherSystemCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 90;
      const x = planet.x + Math.cos(angle) * distance;
      const y = planet.y + Math.sin(angle) * distance;
      
      const weatherSystem = new Plant(
        x, y,
        0.2 + Math.random() * 0.2,
        planet.universePhase
      );
      
      weatherSystem.isInteractable = true;
      weatherSystem.parent = planet;
      
      // Different weather phenomena
      const weatherType = Math.random();
      
      if (weatherType < 0.25) {
        weatherSystem.type = 'storm_system';
        weatherSystem.color = 'rgba(169, 169, 169, 0.7)'; // Dark gray, semi-transparent
        weatherSystem.description = 'A powerful storm system driven by temperature differentials in the atmosphere. These systems redistribute heat across the planet and are essential components of the global climate.';
      } else if (weatherType < 0.5) {
        weatherSystem.type = 'jet_stream';
        weatherSystem.color = 'rgba(135, 206, 250, 0.6)'; // Light blue, semi-transparent
        weatherSystem.description = 'A high-altitude, fast-flowing air current that influences weather patterns below. These streams can meander and create persistent weather systems that last for weeks.';
      } else if (weatherType < 0.75) {
        weatherSystem.type = 'pressure_system';
        weatherSystem.color = 'rgba(255, 255, 255, 0.5)'; // White, semi-transparent
        weatherSystem.description = 'A large-scale pressure system that creates characteristic weather patterns. High-pressure systems typically bring clear skies, while low-pressure systems often bring precipitation.';
      } else {
        weatherSystem.type = 'climate_zone';
        weatherSystem.color = 'rgba(152, 251, 152, 0.5)'; // Pale green, semi-transparent
        weatherSystem.description = 'A distinct climate zone shaped by latitude, altitude, and ocean currents. The diversity of climate zones on a planet significantly influences biodiversity and ecosystem distribution.';
      }
      
      // Weather systems should have some motion/animation
      weatherSystem.pulsateSpeed = 0.2 + Math.random() * 0.4;
      weatherSystem.pulsateAmount = 0.1 + Math.random() * 0.15;
      
      planet.interior.push(weatherSystem);
    }
  }
  
  /**
   * Create advanced life forms for habitable planets
   */
  private createAdvancedLifeForms(planet: Plant): void {
    const structureCount = 3 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < structureCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 130;
      const x = planet.x + Math.cos(angle) * distance;
      const y = planet.y + Math.sin(angle) * distance;
      
      const structure = new Plant(
        x, y,
        0.15 + Math.random() * 0.2,
        planet.universePhase
      );
      
      structure.isInteractable = true;
      structure.parent = planet;
      
      // Different types of advanced life structures
      const structureType = Math.random();
      
      if (structureType < 0.3) {
        structure.type = 'settlement';
        structure.color = '#C0C0C0'; // Silver
        structure.description = 'A settlement of intelligent life forms. The architectural style reflects adaptation to the local environment and suggests a society with advanced technology and cultural development.';
      } else if (structureType < 0.6) {
        structure.type = 'ecosystem';
        structure.color = '#32CD32'; // Lime Green
        structure.description = 'A complex ecosystem with diverse life forms interacting in a sustainable web. The evolutionary adaptations demonstrate the planet\'s long history of stable conditions favorable to life.';
      } else if (structureType < 0.8) {
        structure.type = 'megafauna';
        structure.color = '#FFA500'; // Orange
        structure.description = 'Large animal species that dominate their environment. These creatures have evolved specialized adaptations to thrive in their ecological niches and play crucial roles in shaping the ecosystem.';
      } else {
        structure.type = 'alien_artifact';
        structure.color = '#9370DB'; // Medium Purple
        structure.description = 'A mysterious structure of unknown origin and purpose. Its advanced technology suggests it was created by a civilization far more developed than any currently inhabiting the planet.';
      }
      
      // Life forms should have some animation
      structure.pulsateSpeed = 0.3 + Math.random() * 0.7;
      structure.pulsateAmount = 0.1 + Math.random() * 0.1;
      
      planet.interior.push(structure);
    }
  }
  
  /**
   * Create giant storms for gas giant planets
   */
  private createGasGiantStorms(planet: Plant): void {
    const stormCount = 2 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < stormCount; i++) {
      // Storms tend to form in bands around gas giants
      const latitudeBand = (i / stormCount) * Math.PI - (Math.PI / 2);
      const longitudeVariation = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      
      const x = planet.x + Math.cos(longitudeVariation) * Math.cos(latitudeBand) * distance;
      const y = planet.y + Math.sin(latitudeBand) * distance;
      
      const storm = new Plant(
        x, y,
        0.25 + Math.random() * 0.3,
        planet.universePhase
      );
      
      storm.isInteractable = true;
      storm.parent = planet;
      storm.type = 'storm';
      
      // Different types of storms
      const stormType = Math.random();
      
      if (stormType < 0.3) {
        // Great spot type storms
        storm.color = '#CD5C5C'; // Indian Red
        storm.description = 'A massive anticyclonic storm similar to Jupiter\'s Great Red Spot. This high-pressure system has remained stable for centuries, driven by the planet\'s rapid rotation and atmospheric dynamics.';
      } else if (stormType < 0.6) {
        // Banded clouds
        storm.color = '#F4A460'; // Sandy Brown
        storm.description = 'A distinctive atmospheric band created by differential rotation rates at various latitudes. The boundaries between bands often feature turbulent eddies and complex flow patterns.';
      } else if (stormType < 0.8) {
        // Polar hexagon
        storm.color = '#5F9EA0'; // Cadet Blue
        storm.description = 'A hexagonal cloud pattern similar to Saturn\'s north polar vortex. This geometric anomaly arises from complex interactions between atmospheric waves and the planet\'s rotation.';
      } else {
        // Lightning storm
        storm.color = '#FFD700'; // Gold
        storm.description = 'An intense electrical storm system generating lightning thousands of times more powerful than Earth\'s. These discharge events provide crucial energy for atmospheric chemistry and potential exotic life forms.';
      }
      
      // Storms are dynamic systems
      storm.pulsateSpeed = 0.3 + Math.random() * 0.5;
      storm.pulsateAmount = 0.1 + Math.random() * 0.2;
      
      planet.interior.push(storm);
    }
  }
  
  /**
   * Generate interior elements for a black hole
   */
  private generateBlackholeInterior(blackhole: Plant): void {
    // Black holes are among the most extreme objects in the universe
    // We'll simulate various phenomena associated with black holes
    
    // Create the event horizon - the boundary of no return
    this.createEventHorizon(blackhole);
    
    // Create accretion disk if the black hole has one
    if (blackhole.cosmicProperties.accretionDisk) {
      this.createAccretionDisk(blackhole);
    }
    
    // Create relativistic jets if the black hole is active
    if (blackhole.cosmicProperties.isActive) {
      this.createRelativisticJets(blackhole);
    }
    
    // Create gravitational lensing effects
    this.createGravitationalLensing(blackhole);
    
    // Create quantum phenomena near the event horizon
    this.createQuantumEffects(blackhole);
    
    // Create spacetime distortion visualization
    this.createSpacetimeDistortion(blackhole);
  }
  
  /**
   * Create the event horizon of a black hole
   */
  private createEventHorizon(blackhole: Plant): void {
    // The event horizon is a spherical boundary around the black hole
    // Nothing, not even light, can escape once it crosses this boundary
    
    const eventHorizon = new Plant(
      blackhole.x,
      blackhole.y,
      0.3 + Math.random() * 0.1, // Slightly larger for visibility
      blackhole.universePhase
    );
    
    eventHorizon.type = 'event_horizon';
    eventHorizon.isInteractable = true;
    eventHorizon.parent = blackhole;
    eventHorizon.color = '#000000'; // Perfect black
    eventHorizon.description = 'The event horizon marks the boundary where the escape velocity exceeds the speed of light. Beyond this point, spacetime is so curved that all paths lead inward to the singularity. No information from inside can ever reach outside observers.';
    
    // Event horizons have a subtle pulsating effect due to Hawking radiation and quantum fluctuations
    eventHorizon.pulsateSpeed = 0.1;
    eventHorizon.pulsateAmount = 0.03;
    
    blackhole.interior.push(eventHorizon);
    
    // Create the central singularity
    const singularity = new Plant(
      blackhole.x + (Math.random() * 10 - 5),
      blackhole.y + (Math.random() * 10 - 5),
      0.1,
      blackhole.universePhase
    );
    
    singularity.type = 'singularity';
    singularity.isInteractable = true;
    singularity.parent = blackhole;
    singularity.color = '#FFFFFF'; // White at the center
    singularity.description = 'The singularity is a point of infinite density where spacetime curvature becomes infinite. General relativity breaks down here, and quantum gravity would be needed to describe what truly happens. This represents the theoretical limit of our current understanding of physics.';
    
    // Singularities don't pulsate - they're theoretically stable in classical GR
    // But we'll add some effects for visualization
    singularity.pulsateSpeed = 0.5;
    singularity.pulsateAmount = 0.1;
    
    blackhole.interior.push(singularity);
  }
  
  /**
   * Create the accretion disk around a black hole
   */
  private createAccretionDisk(blackhole: Plant): void {
    // Accretion disks are superheated matter spiraling into the black hole
    // They emit intense radiation across the electromagnetic spectrum
    
    const particleCount = 40 + Math.floor(Math.random() * 20);
    const stellarMass = blackhole.cosmicProperties.stellarMass || 10;
    
    // Create spiraling particles representing the intense energy
    for (let i = 0; i < particleCount; i++) {
      // Create a spiral pattern
      const spiralTightness = 0.1 + Math.random() * 0.2;
      const distanceFromCenter = 40 + (i / particleCount) * 100;
      const angle = (i / particleCount) * Math.PI * 10; // Multiple revolutions
      
      const x = blackhole.x + Math.cos(angle) * distanceFromCenter;
      const y = blackhole.y + Math.sin(angle) * distanceFromCenter;
      
      const particle = new Plant(
        x, y,
        0.05 + Math.random() * 0.15,
        blackhole.universePhase
      );
      
      particle.type = 'accretion_material';
      particle.isInteractable = Math.random() > 0.7; // Only some particles are interactive
      particle.parent = blackhole;
      
      // Different regions of the accretion disk have different temperatures and colors
      if (distanceFromCenter < 60) {
        // Inner disk - hottest (blue/white)
        particle.color = '#FFFFFF';
        if (particle.isInteractable) {
          particle.description = 'The inner accretion disk reaches temperatures of millions of degrees, emitting primarily X-rays. Matter here orbits at a significant fraction of the speed of light, with relativistic effects becoming prominent.';
        }
      } else if (distanceFromCenter < 100) {
        // Middle disk - hot (yellow/orange)
        particle.color = '#FFA500';
        if (particle.isInteractable) {
          particle.description = 'The middle region of the accretion disk emits primarily in ultraviolet and visible light. Intense magnetic fields channel some material away from the disk plane, potentially forming jets.';
        }
      } else {
        // Outer disk - cooler (red)
        particle.color = '#FF4500';
        if (particle.isInteractable) {
          particle.description = 'The outer accretion disk is cooler but still extremely hot by normal standards. This region emits primarily in infrared and radio waves. Material here is slowly spiraling inward, losing angular momentum through viscous interactions.';
        }
      }
      
      // Particles closer to the black hole move faster
      const speedFactor = 1 - (distanceFromCenter - 40) / 100;
      particle.pulsateSpeed = 0.5 + speedFactor * 2;
      particle.pulsateAmount = 0.1 + Math.random() * 0.15;
      
      blackhole.interior.push(particle);
    }
    
    // Add some X-ray flares
    const flareCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < flareCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 60;
      
      const x = blackhole.x + Math.cos(angle) * distance;
      const y = blackhole.y + Math.sin(angle) * distance;
      
      const flare = new Plant(
        x, y,
        0.15 + Math.random() * 0.2,
        blackhole.universePhase
      );
      
      flare.type = 'xray_flare';
      flare.isInteractable = true;
      flare.parent = blackhole;
      flare.color = '#00FFFF'; // Cyan
      flare.description = 'An intense X-ray flare caused by magnetic reconnection in the accretion disk. These energetic events can briefly outshine the entire disk and provide clues about the extreme physics near the event horizon.';
      
      // Flares pulse rapidly
      flare.pulsateSpeed = 1.5 + Math.random() * 1.0;
      flare.pulsateAmount = 0.3 + Math.random() * 0.2;
      
      blackhole.interior.push(flare);
    }
  }
  
  /**
   * Create relativistic jets for active black holes
   */
  private createRelativisticJets(blackhole: Plant): void {
    // Relativistic jets are narrow beams of energetic particles
    // ejected along the rotation axis of the black hole
    
    // Create two jets in opposite directions
    const jetLength = 150 + Math.random() * 100;
    const jetAngles = [Math.PI/4, Math.PI + Math.PI/4]; // Slightly off-axis for visual effect
    
    for (let jetIndex = 0; jetIndex < 2; jetIndex++) {
      const jetAngle = jetAngles[jetIndex];
      const particleCount = 10 + Math.floor(Math.random() * 10);
      
      for (let i = 0; i < particleCount; i++) {
        const distanceRatio = i / particleCount;
        const distance = 50 + distanceRatio * jetLength;
        
        // Add some wobble to the jet
        const wobble = Math.sin(distanceRatio * Math.PI * 4) * 15;
        const angle = jetAngle + wobble * 0.01;
        
        const x = blackhole.x + Math.cos(angle) * distance;
        const y = blackhole.y + Math.sin(angle) * distance;
        
        const jetParticle = new Plant(
          x, y,
          0.1 + (1 - distanceRatio) * 0.2, // Particles get smaller further from the source
          blackhole.universePhase
        );
        
        jetParticle.type = 'jet_material';
        jetParticle.isInteractable = i % 3 === 0; // Every third particle is interactive
        jetParticle.parent = blackhole;
        
        // Jets are typically blue due to Cherenkov radiation
        const brightness = 150 + Math.floor((1 - distanceRatio) * 100);
        jetParticle.color = `rgb(100, 100, ${brightness})`;
        
        if (jetParticle.isInteractable) {
          jetParticle.description = 'A relativistic jet of particles accelerated to nearly the speed of light. These jets can extend for thousands of light years and are powered by the black hole\'s rotation and magnetic fields extracting energy from the accretion process.';
        }
        
        // Jet particles move rapidly away from the source
        jetParticle.pulsateSpeed = 1.0 + Math.random() * 0.5;
        jetParticle.pulsateAmount = 0.2 + Math.random() * 0.2;
        
        blackhole.interior.push(jetParticle);
      }
      
      // Add a termination shock where the jet interacts with surrounding medium
      if (Math.random() > 0.5) {
        const shockDistance = jetLength + 20;
        const x = blackhole.x + Math.cos(jetAngle) * shockDistance;
        const y = blackhole.y + Math.sin(jetAngle) * shockDistance;
        
        const shock = new Plant(
          x, y,
          0.3 + Math.random() * 0.2,
          blackhole.universePhase
        );
        
        shock.type = 'jet_shock';
        shock.isInteractable = true;
        shock.parent = blackhole;
        shock.color = '#4169E1'; // Royal Blue
        shock.description = 'A termination shock where the relativistic jet impacts the surrounding intergalactic medium. This region emits synchrotron radiation and can accelerate cosmic rays to enormous energies.';
        
        shock.pulsateSpeed = 0.3 + Math.random() * 0.3;
        shock.pulsateAmount = 0.2 + Math.random() * 0.1;
        
        blackhole.interior.push(shock);
      }
    }
  }
  
  /**
   * Create gravitational lensing effects around the black hole
   */
  private createGravitationalLensing(blackhole: Plant): void {
    // Gravitational lensing occurs when light from a background object is bent around the black hole
    
    const lensingEffectCount = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < lensingEffectCount; i++) {
      const angle = (i / lensingEffectCount) * Math.PI * 2;
      const distance = 80 + Math.random() * 70;
      
      const x = blackhole.x + Math.cos(angle) * distance;
      const y = blackhole.y + Math.sin(angle) * distance;
      
      const lensingEffect = new Plant(
        x, y,
        0.15 + Math.random() * 0.15,
        blackhole.universePhase
      );
      
      lensingEffect.type = 'gravitational_lensing';
      lensingEffect.isInteractable = true;
      lensingEffect.parent = blackhole;
      
      // Different types of lensing effects
      const effectType = Math.random();
      
      if (effectType < 0.33) {
        // Einstein ring
        lensingEffect.color = 'rgba(255, 255, 255, 0.5)';
        lensingEffect.description = 'An Einstein ring formed when light from a distant object is bent into a perfect ring by the black hole\'s gravity. This occurs when the observer, black hole, and light source are perfectly aligned.';
      } else if (effectType < 0.66) {
        // Multiple images
        lensingEffect.color = 'rgba(200, 200, 255, 0.6)';
        lensingEffect.description = 'Multiple images of the same background object created by light taking different paths around the black hole. This phenomenon allows astronomers to calculate the black hole\'s mass with high precision.';
      } else {
        // Arc
        lensingEffect.color = 'rgba(170, 170, 220, 0.7)';
        lensingEffect.description = 'An arc-shaped distortion of background light caused by the extreme curvature of spacetime near the black hole. These distortions can magnify distant objects, acting as a natural cosmic telescope.';
      }
      
      // Lensing effects are stable but have subtle variations
      lensingEffect.pulsateSpeed = 0.1 + Math.random() * 0.2;
      lensingEffect.pulsateAmount = 0.05 + Math.random() * 0.1;
      
      blackhole.interior.push(lensingEffect);
    }
  }
  
  /**
   * Create quantum effects near the event horizon
   */
  private createQuantumEffects(blackhole: Plant): void {
    // Quantum effects become important near black holes, especially Hawking radiation
    
    const quantumEffectCount = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < quantumEffectCount; i++) {
      // Position these very close to the event horizon
      const angle = Math.random() * Math.PI * 2;
      const distance = 25 + Math.random() * 15;
      
      const x = blackhole.x + Math.cos(angle) * distance;
      const y = blackhole.y + Math.sin(angle) * distance;
      
      const quantumEffect = new Plant(
        x, y,
        0.05 + Math.random() * 0.1, // Very small
        blackhole.universePhase
      );
      
      quantumEffect.isInteractable = Math.random() > 0.5;
      quantumEffect.parent = blackhole;
      
      // Different quantum phenomena
      const effectType = Math.random();
      
      if (effectType < 0.4) {
        // Hawking radiation
        quantumEffect.type = 'hawking_radiation';
        quantumEffect.color = '#FFFACD'; // Lemon chiffon (pale yellow)
        if (quantumEffect.isInteractable) {
          quantumEffect.description = 'Hawking radiation, a quantum effect where virtual particle pairs near the event horizon are separated. One falls in while the other escapes, giving the appearance that the black hole is emitting radiation and slowly evaporating.';
        }
      } else if (effectType < 0.7) {
        // Quantum fluctuation
        quantumEffect.type = 'quantum_fluctuation';
        quantumEffect.color = '#E6E6FA'; // Lavender
        if (quantumEffect.isInteractable) {
          quantumEffect.description = 'Quantum fluctuations amplified by the black hole\'s gravity. Near the event horizon, the extreme gravitational gradient amplifies quantum effects, potentially revealing aspects of quantum gravity.';
        }
      } else {
        // Information paradox visualization
        quantumEffect.type = 'information_paradox';
        quantumEffect.color = '#7B68EE'; // Medium slate blue
        if (quantumEffect.isInteractable) {
          quantumEffect.description = 'A visualization of the black hole information paradox. Quantum mechanics suggests information cannot be destroyed, yet anything falling into a black hole seems lost forever. Resolving this paradox remains one of physics\' greatest challenges.';
        }
      }
      
      // Quantum effects should flicker rapidly
      quantumEffect.pulsateSpeed = 1.5 + Math.random() * 2.0;
      quantumEffect.pulsateAmount = 0.3 + Math.random() * 0.3;
      
      blackhole.interior.push(quantumEffect);
    }
  }
  
  /**
   * Create spacetime distortion visualization
   */
  private createSpacetimeDistortion(blackhole: Plant): void {
    // Visualize how spacetime is warped around the black hole
    
    const distortionRingCount = 4 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < distortionRingCount; i++) {
      const ringRadius = 30 + i * 30;
      const particlesInRing = 10 + i * 5;
      
      for (let j = 0; j < particlesInRing; j++) {
        const angle = (j / particlesInRing) * Math.PI * 2;
        
        // Distort the ring more severely closer to the black hole
        const distortionFactor = 1 - 0.7 * Math.exp(-i / 2);
        const x = blackhole.x + Math.cos(angle) * ringRadius * distortionFactor;
        const y = blackhole.y + Math.sin(angle) * ringRadius * distortionFactor;
        
        const gridPoint = new Plant(
          x, y,
          0.03 + (distortionRingCount - i) * 0.01, // Points get smaller further out
          blackhole.universePhase
        );
        
        gridPoint.type = 'spacetime_grid';
        gridPoint.isInteractable = (j % (4 + i) === 0); // Fewer interactive points in outer rings
        gridPoint.parent = blackhole;
        
        // Grid becomes more distorted (red) closer to the black hole
        const redValue = 100 + Math.floor((distortionRingCount - i) / distortionRingCount * 155);
        const blueValue = 100 + Math.floor(i / distortionRingCount * 155);
        gridPoint.color = `rgb(${redValue}, 100, ${blueValue})`;
        
        if (gridPoint.isInteractable) {
          gridPoint.description = 'A visualization of spacetime curvature around the black hole. General relativity describes gravity not as a force but as a curvature of 4-dimensional spacetime, with massive objects like black holes creating deep "gravitational wells."';
        }
        
        // Grid points pulse gently to indicate spacetime is dynamic
        gridPoint.pulsateSpeed = 0.2 + (distortionRingCount - i) * 0.1;
        gridPoint.pulsateAmount = 0.05 + (distortionRingCount - i) * 0.02;
        
        blackhole.interior.push(gridPoint);
      }
    }
    
    // Add frame dragging effect for rotating black holes
    if (blackhole.cosmicProperties.isRotating) {
      this.createFrameDragging(blackhole);
    }
  }
  
  /**
   * Create frame dragging effect for rotating black holes
   */
  private createFrameDragging(blackhole: Plant): void {
    // Frame dragging (Lense-Thirring effect) is when a rotating black hole
    // drags spacetime around with it
    
    const particleCount = 15 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 40 + Math.random() * 30;
      
      // Create a spiral distortion effect
      const spiralFactor = 0.3;
      const modifiedAngle = angle + distance * spiralFactor * 0.01;
      
      const x = blackhole.x + Math.cos(modifiedAngle) * distance;
      const y = blackhole.y + Math.sin(modifiedAngle) * distance;
      
      const frameDraggingEffect = new Plant(
        x, y,
        0.1 + Math.random() * 0.1,
        blackhole.universePhase
      );
      
      frameDraggingEffect.type = 'frame_dragging';
      frameDraggingEffect.isInteractable = Math.random() > 0.7;
      frameDraggingEffect.parent = blackhole;
      frameDraggingEffect.color = '#9370DB'; // Medium Purple
      
      if (frameDraggingEffect.isInteractable) {
        frameDraggingEffect.description = 'Frame dragging or the Lense-Thirring effect, where a rotating black hole literally drags spacetime around with it. This creates an ergosphere outside the event horizon where space itself is forced to rotate, allowing energy extraction through the Penrose process.';
      }
      
      // Frame dragging effects rotate slowly
      frameDraggingEffect.pulsateSpeed = 0.3 + Math.random() * 0.3;
      frameDraggingEffect.pulsateAmount = 0.1 + Math.random() * 0.1;
      
      blackhole.interior.push(frameDraggingEffect);
    }
    
    // Add the ergosphere - a region where spacetime is dragged so severely that
    // nothing can remain stationary
    const ergosphere = new Plant(
      blackhole.x,
      blackhole.y,
      0.35 + Math.random() * 0.1,
      blackhole.universePhase
    );
    
    ergosphere.type = 'ergosphere';
    ergosphere.isInteractable = true;
    ergosphere.parent = blackhole;
    ergosphere.color = 'rgba(148, 0, 211, 0.3)'; // Dark Violet, transparent
    ergosphere.description = 'The ergosphere is a region outside the event horizon of a rotating black hole where spacetime is dragged around so severely that nothing can remain stationary. This region allows for the theoretical extraction of energy from the black hole through the Penrose process.';
    
    ergosphere.pulsateSpeed = 0.15;
    ergosphere.pulsateAmount = 0.05;
    
    blackhole.interior.push(ergosphere);
  }
  
  /**
   * Generate interior for protostar cosmic bodies
   * Protostars are stars in the process of forming
   */
  private generateProtostarInterior(protostar: Plant): void {
    // Protostars have accretion disks of gas and dust
    const particleCount = 15 + Math.floor(Math.random() * 20);
    
    // Generate gas and dust particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 150;
      const x = protostar.x + Math.cos(angle) * distance;
      const y = protostar.y + Math.sin(angle) * distance;
      
      const gasCloud = new Plant(
        x, y,
        0.1 + Math.random() * 0.3,
        protostar.universePhase
      );
      gasCloud.type = 'nebula';
      gasCloud.parent = protostar;
      
      // Different colors for gases, mostly hydrogen and helium
      gasCloud.color = Math.random() < 0.7 ? 
        `rgba(${150 + Math.random() * 50}, ${100 + Math.random() * 50}, ${200 + Math.random() * 55}, 0.7)` : 
        `rgba(${200 + Math.random() * 55}, ${150 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.7)`;
      
      protostar.interior.push(gasCloud);
    }
    
    // Add jetting material (bipolar outflows) common in protostars
    const jetCount = 2;
    const jetParticlesPerJet = 5;
    
    for (let jet = 0; jet < jetCount; jet++) {
      const jetAngle = jet * Math.PI; // Jets in opposite directions
      
      for (let i = 0; i < jetParticlesPerJet; i++) {
        const distance = 100 + i * 40;
        const x = protostar.x + Math.cos(jetAngle) * distance;
        const y = protostar.y + Math.sin(jetAngle) * distance;
        
        const jetParticle = new Plant(
          x, y,
          0.2 + Math.random() * 0.2,
          protostar.universePhase
        );
        jetParticle.type = 'plant';
        jetParticle.parent = protostar;
        jetParticle.color = 'rgba(200, 220, 255, 0.8)';
        
        protostar.interior.push(jetParticle);
      }
    }
  }
  
  /**
   * Generate interior for neutron star cosmic bodies
   * Neutron stars are extremely dense remnants of massive stars
   */
  private generateNeutronStarInterior(neutronStar: Plant): void {
    // Neutron stars have extremely strong magnetic fields that create pulsar jets
    // and can have intense radiation zones
    
    // Add pulsar jets
    const jetCount = 2;
    const particlesPerJet = 8;
    
    for (let jet = 0; jet < jetCount; jet++) {
      const jetAngle = jet * Math.PI; // Jets in opposite directions along magnetic poles
      
      for (let i = 0; i < particlesPerJet; i++) {
        const distance = 30 + i * 25;
        const x = neutronStar.x + Math.cos(jetAngle) * distance;
        const y = neutronStar.y + Math.sin(jetAngle) * distance;
        
        const radiation = new Plant(
          x, y,
          0.15 + Math.random() * 0.15,
          neutronStar.universePhase
        );
        radiation.type = 'plant';
        radiation.parent = neutronStar;
        radiation.color = 'rgba(100, 180, 255, 0.9)';
        
        neutronStar.interior.push(radiation);
      }
    }
    
    // Add radiation zones around the neutron star
    const radiationZones = 3;
    for (let zone = 0; zone < radiationZones; zone++) {
      const zoneParticles = 8 + Math.floor(Math.random() * 6);
      const zoneRadius = 50 + zone * 40;
      
      for (let i = 0; i < zoneParticles; i++) {
        const angle = (i / zoneParticles) * Math.PI * 2;
        const x = neutronStar.x + Math.cos(angle) * zoneRadius;
        const y = neutronStar.y + Math.sin(angle) * zoneRadius;
        
        const radiationParticle = new Plant(
          x, y,
          0.1 + Math.random() * 0.2,
          neutronStar.universePhase
        );
        radiationParticle.type = 'plant';
        radiationParticle.parent = neutronStar;
        
        // Different radiation types have different colors
        if (zone === 0) {
          radiationParticle.color = 'rgba(200, 100, 255, 0.7)'; // X-rays
        } else if (zone === 1) {
          radiationParticle.color = 'rgba(100, 200, 255, 0.6)'; // Gamma rays
        } else {
          radiationParticle.color = 'rgba(255, 220, 100, 0.5)'; // Radio waves
        }
        
        neutronStar.interior.push(radiationParticle);
      }
    }
  }
  
  /**
   * Generate interior elements for a nebula
   */
  private generateNebulaInterior(nebula: Plant): void {
    // Nebulae contain gas clouds and protostars
    const cloudCount = 10 + Math.floor(Math.random() * 15);
    const protostarCount = 1 + Math.floor(Math.random() * 3);
    
    // Create gas clouds
    for (let i = 0; i < cloudCount; i++) {
      const distance = Math.random() * 150;
      const angle = Math.random() * Math.PI * 2;
      
      const x = nebula.x + Math.cos(angle) * distance;
      const y = nebula.y + Math.sin(angle) * distance;
      
      const cloud = new Plant(
        x, y,
        0.2 + Math.random() * 0.3,
        Math.max(5, nebula.universePhase)
      );
      cloud.type = 'plant';
      
      // Random nebula colors
      const hue = Math.random() * 60 + 200; // Blues/purples
      cloud.color = `hsl(${hue}, 80%, 70%)`;
      
      cloud.parent = nebula;
      
      nebula.interior.push(cloud);
    }
    
    // Create protostars (young stars being formed)
    for (let i = 0; i < protostarCount; i++) {
      const distance = 20 + Math.random() * 130;
      const angle = Math.random() * Math.PI * 2;
      
      const x = nebula.x + Math.cos(angle) * distance;
      const y = nebula.y + Math.sin(angle) * distance;
      
      const protostar = new Plant(
        x, y,
        0.3 + Math.random() * 0.4,
        Math.max(5, nebula.universePhase)
      );
      protostar.type = 'protostar';
      protostar.isInteractable = true;
      protostar.parent = nebula;
      
      // Set properties for the protostar
      protostar.cosmicProperties = {
        starType: 'main_sequence',
        temperature: 2000 + Math.random() * 3000, // Young stars are cooler
        stellarMass: 0.5 + Math.random() * 2,
        luminosity: 0.2 + Math.random() * 0.5
      };
      
      nebula.interior.push(protostar);
    }
  }
  
  /**
   * Get a color for a planet based on its position
   */
  private getPlanetColor(index: number, totalPlanets: number): string {
    // Inner planets tend to be rocky and reddish/gray
    // Middle planets tend to be Earth-like or gas giants
    // Outer planets tend to be icy or gas giants
    
    const position = index / totalPlanets; // 0 = closest to star, 1 = furthest
    
    if (position < 0.3) {
      // Inner rocky planets (Mercury, Venus, Mars-like)
      return ['#A67F5D', '#D4C5B1', '#CD853F'][index % 3];
    } else if (position < 0.6) {
      // Middle zone (Earth-like or gas giants)
      return Math.random() < 0.5 ? 
        '#4B6F8C' : // Blue/green for Earth-like
        '#C9AE5D'; // Yellowish for gas giants
    } else {
      // Outer zone (ice giants, gas giants)
      return Math.random() < 0.5 ?
        '#5B5FDA' : // Blue for ice giants
        '#E3C278'; // Lighter yellow for cold gas giants
    }
  }
  
  /**
   * Get a planet type based on its position
   */
  private getPlanetType(index: number, totalPlanets: number): string {
    const position = index / totalPlanets;
    
    if (position < 0.3) {
      return 'rocky';
    } else if (position < 0.6) {
      return Math.random() < 0.4 ? 'habitable' : 'gas_giant';
    } else {
      return Math.random() < 0.7 ? 'gas_giant' : 'ice_giant';
    }
  }
}