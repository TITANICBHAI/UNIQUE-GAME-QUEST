import { Particle } from './Particle';
import { Plant, Satellite } from './Plant';
import { Renderer } from './Renderer';
import { InputHandler } from './InputHandler';
import { GameState } from './GameState';
import { AudioManager } from './AudioManager';
import { CosmicExplorer } from './CosmicExplorer';
import { generatePerlinNoise, distance } from './utils';

interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onEnergyUpdate: (energy: number) => void;
  onPlantCountUpdate: (count: number) => void;
  onLevelUp?: (level: number) => void;
  onComboUpdate?: (multiplier: number) => void;
  onAchievementUnlocked?: (achievement: any) => void;
  onChallengeUpdated?: (challenges: any[]) => void;
  onChallengeCompleted?: (challenge: any) => void;
  onUniversePhaseChanged?: (phase: any) => void;
  onCosmicElementDiscovered?: (element: any) => void;
  onCosmicParametersUpdated?: (params: {
    cosmicAge: number;
    expansionRate: number;
    matterDensity: number;
    energyDensity: number;
  }) => void;
}

export class QuantumGarden {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private inputHandler: InputHandler;
  private gameState: GameState;
  private audioManager: AudioManager;
  private cosmicExplorer: CosmicExplorer;
  
  private particles: Particle[] = [];
  private plants: Plant[] = [];
  private fieldPotential: number[][] = [];
  
  // Advanced gameplay features for strategic mechanics
  private gravityWells: {x: number, y: number, strength: number, radius: number, life: number, color: string}[] = [];
  private particleStreams: {startX: number, startY: number, endX: number, endY: number, strength: number, duration: number, particleRate: number, timeToNextParticle: number, color: string}[] = [];
  private activeFusions: {x: number, y: number, particles: Particle[], progress: number, maxProgress: number, radius: number, color: string}[] = [];
  private cosmicEvents: {type: string, x: number, y: number, radius: number, timeLeft: number, effect: string, color: string}[] = [];
  private activeMode: string = 'create'; // 'create', 'gravity', 'fusion', 'channel', 'explore'
  private dragStart: {x: number, y: number} | null = null;
  private dragEnd: {x: number, y: number} | null = null;
  private isDragging: boolean = false;
  private selectedParticles: Particle[] = [];
  private modeButtonsVisible: boolean = true;  // Show mode buttons by default
  
  private width = 0;
  private height = 0;
  private isRunning = true;
  private lastTimestamp = 0;
  private callbacks: GameCallbacks;
  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Initialize subsystems
    this.renderer = new Renderer(canvas);
    this.inputHandler = new InputHandler(canvas);
    this.gameState = new GameState();
    this.audioManager = new AudioManager();
    this.cosmicExplorer = new CosmicExplorer();
    
    // Set up cosmic explorer callbacks
    this.cosmicExplorer.setCallbacks(
      // When entering a cosmic body
      (object) => {
        console.log(`Entered ${object.type}`);
        // Play a sound effect
        this.audioManager.playSuccess();
        // Could add UI notifications here
      },
      // When exiting a cosmic body
      () => {
        console.log("Exited cosmic body");
        // Play a sound effect
        this.audioManager.playHit();
      }
    );
    
    // Initialize quantum field
    this.initField();
    
    // Start listeners
    this.setupEventListeners();
    
    // Start game loop
    this.lastTimestamp = performance.now();
    this.gameLoop(this.lastTimestamp);
  }
  
  // Create initial quantum field
  private initField() {
    // Generate perlin noise for the field
    this.fieldPotential = generatePerlinNoise(
      Math.ceil(this.width / 10), 
      Math.ceil(this.height / 10),
      0.1
    );
    
    // Create initial particles
    const particleCount = Math.min(20, Math.floor((this.width * this.height) / 30000));
    for (let i = 0; i < particleCount; i++) {
      this.createParticle(
        Math.random() * this.width,
        Math.random() * this.height,
        Math.random() * 2 * Math.PI
      );
    }
  }
  
  private setupEventListeners() {
    this.inputHandler.onClick((x, y, isDragStart) => {
      if (isDragStart === true) {
        // Handle start of drag operation based on mode
        this.handleDragStart(x, y);
      } else {
        // Handle normal click based on active mode
        this.handleClick(x, y);
      }
    });
    
    this.inputHandler.onDrag((x, y) => {
      if (this.activeMode === 'create') {
        // Only spawn new particles occasionally during drag to prevent too many
        if (Math.random() < 0.2) {
          this.handleClick(x, y);
        }
      } else if (this.activeMode === 'stream' && this.dragStart) {
        // When in stream mode, show a preview of the stream
        this.dragEnd = { x, y };
      } else if (this.activeMode === 'gravity') {
        // In gravity mode, show preview of well size
        if (this.dragStart) {
          const dx = x - this.dragStart.x;
          const dy = y - this.dragStart.y;
          const radius = Math.sqrt(dx * dx + dy * dy);
          this.dragEnd = { x: radius, y: 0 }; // Store radius in dragEnd.x
        }
      }
    });
    
    this.inputHandler.onMove((x, y) => {
      // Movement creates subtle wave patterns in the field
      if (this.activeMode === 'create') {
        this.createWaveDisturbance(x, y, 20, 0.5);
      }
      
      // Update hover state for buttons
      if (this.isMouseOverModeButton(x, y)) {
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'default';
      }
    });
    
    // Game mechanics keyboard shortcuts
    this.inputHandler.onKeyPress('q', () => {
      this.toggleEntanglement();
    });
    
    this.inputHandler.onKeyPress('w', () => {
      this.collapseWaveFunction();
    });
    
    this.inputHandler.onKeyPress('e', () => {
      this.increaseFieldEnergy();
    });
    
    // Game control keyboard shortcuts
    this.inputHandler.onKeyPress(' ', () => {
      this.togglePause();
    });
    
    // Mode switching keyboard shortcuts
    this.inputHandler.onKeyPress('1', () => {
      this.setActiveMode('create');
      console.log('Mode changed to: create');
    });
    
    this.inputHandler.onKeyPress('2', () => {
      this.setActiveMode('gravity');
      console.log('Mode changed to: gravity');
    });
    
    this.inputHandler.onKeyPress('3', () => {
      this.setActiveMode('stream');
      console.log('Mode changed to: stream');
    });
    
    this.inputHandler.onKeyPress('4', () => {
      this.setActiveMode('fusion');
      console.log('Mode changed to: fusion');
    });
    
    this.inputHandler.onKeyPress('5', () => {
      this.setActiveMode('explore');
      console.log('Mode changed to: explore');
    });
    
    this.inputHandler.onKeyPress('m', () => {
      this.toggleModeButtons();
      console.log('Mode buttons toggled');
    });
  }
  
  // Check if the mouse is over a mode button
  private isMouseOverModeButton(x: number, y: number): boolean {
    if (!this.modeButtonsVisible) return false;
    
    const buttonSize = 40;
    const spacing = 10;
    const startY = 60;
    const startX = 20;
    
    const modes = ['create', 'gravity', 'channel', 'fusion', 'explore'];
    
    for (let i = 0; i < modes.length; i++) {
      const buttonY = startY + (buttonSize + spacing) * i;
      
      if (x >= startX && x <= startX + buttonSize && 
          y >= buttonY && y <= buttonY + buttonSize) {
        return true;
      }
    }
    
    return false;
  }
  
  // Toggle mode buttons visibility
  private toggleModeButtons() {
    this.modeButtonsVisible = !this.modeButtonsVisible;
  }
  
  // Set the active interaction mode
  /**
   * Set the active interaction mode
   * This is called by keyboard shortcuts and the mode selection panel
   */
  public setInteractionMode(mode: string) {
    // Reset any in-progress operations
    this.dragStart = null;
    this.dragEnd = null;
    this.selectedParticles = [];
    
    // Set the new mode
    this.activeMode = mode;
    
    // Play sound to confirm mode change
    this.audioManager.playHit();
    
    // Update UI with current mode indicator
    this.updateModeIndicator();
  }
  
  /**
   * Internal method to set active mode
   * Used by keyboard shortcuts
   */
  private setActiveMode(mode: string) {
    // Delegate to the public method
    this.setInteractionMode(mode);
  }
  
  /**
   * Update UI indicator for current mode
   */
  private updateModeIndicator() {
    // We'll use console logs for now, but could update UI elements in the future
    console.log(`Active mode: ${this.activeMode}`);
    
    // Different cursor or visual indicator could be set here
    switch(this.activeMode) {
      case 'create':
        // Standard cursor for creation
        document.body.style.cursor = 'default';
        break;
      case 'gravity':
        // Special cursor for gravity well creation
        document.body.style.cursor = 'cell';
        break;
      case 'stream':
        // Special cursor for particle streams
        document.body.style.cursor = 'crosshair';
        break;
      case 'fusion':
        // Selection cursor for fusion
        document.body.style.cursor = 'pointer';
        break;
      case 'explore':
        // Exploration cursor
        document.body.style.cursor = 'zoom-in';
        break;
    }
  }
  
  // Main game loop
  private gameLoop(timestamp: number) {
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    
    if (this.isRunning) {
      this.update(deltaTime);
    }
    
    this.render();
    
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  private update(deltaTime: number) {
    // Restore energy over time
    this.gameState.regenerateEnergy(deltaTime);
    
    // Update cosmic evolution
    if (this.gameState.updateCosmos) {
      this.gameState.updateCosmos(deltaTime);
      
      // Update renderer's universe phase to match current game state
      if (this.renderer.setUniversePhase) {
        this.renderer.setUniversePhase(this.gameState.getCurrentPhase?.() || 0);
      }
      
      // Report cosmic parameters
      if (this.callbacks.onCosmicParametersUpdated) {
        this.callbacks.onCosmicParametersUpdated({
          cosmicAge: this.gameState.getCosmicAge?.() || 0,
          expansionRate: this.gameState.getExpansionRate?.() || 1.0,
          matterDensity: this.gameState.getMatterDensity?.() || 0,
          energyDensity: this.gameState.getEnergyDensity?.() || 1.0
        });
      }
    }
    
    // Update quantum field
    this.updateField(deltaTime);
    
    // Update strategic mechanics
    this.updateGravityWells(deltaTime);
    this.updateParticleStreams(deltaTime);
    this.updateFusionEvents(deltaTime);
    
    // Update all particles
    this.updateParticles(deltaTime);
    
    // Update all plants (stars and galaxies in later phases)
    this.updatePlants(deltaTime);
    
    // Check for growth opportunities (stars and galaxies in later phases)
    this.checkPlantGrowth();
    
    // Report state to UI
    this.callbacks.onScoreUpdate(this.gameState.getScore());
    this.callbacks.onEnergyUpdate(this.gameState.getEnergy());
    this.callbacks.onPlantCountUpdate(this.plants.length);
    
    // Report combo multiplier if supported
    if (this.callbacks.onComboUpdate && this.gameState.getComboMultiplier) {
      this.callbacks.onComboUpdate(this.gameState.getComboMultiplier());
    }
  }
  
  // Update gravity wells
  private updateGravityWells(deltaTime: number) {
    for (let i = this.gravityWells.length - 1; i >= 0; i--) {
      const well = this.gravityWells[i];
      
      // Decrease lifetime
      well.life -= deltaTime;
      
      // Remove expired gravity wells
      if (well.life <= 0) {
        this.gravityWells.splice(i, 1);
        continue;
      }
      
      // Gravity wells affect the quantum field
      this.applyGravityWellToField(well, deltaTime);
    }
  }
  
  // Apply gravity well effects to the quantum field
  private applyGravityWellToField(well: {x: number, y: number, strength: number, radius: number, life: number, color: string}, deltaTime: number) {
    // Calculate field cell size
    const cellSize = 10;
    const fieldX = Math.floor(well.x / cellSize);
    const fieldY = Math.floor(well.y / cellSize);
    const fieldRadius = Math.ceil(well.radius / cellSize);
    
    // Apply gravitation effect to quantum field in area
    for (let y = Math.max(0, fieldY - fieldRadius); y < Math.min(this.fieldPotential.length, fieldY + fieldRadius); y++) {
      for (let x = Math.max(0, fieldX - fieldRadius); x < Math.min(this.fieldPotential[0].length, fieldX + fieldRadius); x++) {
        const dx = (x - fieldX) * cellSize;
        const dy = (y - fieldY) * cellSize;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < well.radius * well.radius) {
          // Intensity decreases with distance from center
          const distFactor = 1 - Math.sqrt(distSq) / well.radius;
          
          // Apply gravitational distortion to field
          this.fieldPotential[y][x] += well.strength * distFactor * deltaTime * 0.1;
          
          // Cap field values
          this.fieldPotential[y][x] = Math.max(0, Math.min(1, this.fieldPotential[y][x]));
        }
      }
    }
  }
  
  // Update particle streams
  private updateParticleStreams(deltaTime: number) {
    for (let i = this.particleStreams.length - 1; i >= 0; i--) {
      const stream = this.particleStreams[i];
      
      // Decrease duration
      stream.duration -= deltaTime;
      
      // Remove expired streams
      if (stream.duration <= 0) {
        this.particleStreams.splice(i, 1);
        continue;
      }
      
      // Update time to next particle
      stream.timeToNextParticle -= deltaTime;
      
      // Spawn new particles in the stream
      if (stream.timeToNextParticle <= 0) {
        // Reset timer
        stream.timeToNextParticle = 1 / stream.particleRate;
        
        // Create a particle at the start, heading toward the end
        const angle = Math.atan2(
          stream.endY - stream.startY,
          stream.endX - stream.startX
        );
        
        // Create particle with enhanced properties
        const particle = this.createParticle(
          stream.startX, 
          stream.startY, 
          angle
        );
        
        // Increase particle energy and speed based on stream strength
        particle.energy += stream.strength;
        particle.speed *= 1.5;
        
        // Give particle a special color to match the stream
        particle.wavelength = 400 + Math.random() * 200; // Variable wavelength for visual effect
      }
      
      // Streams also affect the quantum field
      this.applyStreamToField(stream, deltaTime);
    }
  }
  
  // Apply stream effects to the quantum field
  private applyStreamToField(stream: {startX: number, startY: number, endX: number, endY: number, strength: number, duration: number, particleRate: number, timeToNextParticle: number, color: string}, deltaTime: number) {
    const cellSize = 10;
    const steps = 10; // How many points along the stream to affect
    
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1); // 0 to 1
      const x = Math.floor((stream.startX + (stream.endX - stream.startX) * t) / cellSize);
      const y = Math.floor((stream.startY + (stream.endY - stream.startY) * t) / cellSize);
      
      // Skip if outside field bounds
      if (x < 0 || x >= this.fieldPotential[0].length || y < 0 || y >= this.fieldPotential.length) {
        continue;
      }
      
      // Apply energy to field along the stream path
      this.fieldPotential[y][x] += stream.strength * 0.05 * deltaTime;
      
      // Cap field values
      this.fieldPotential[y][x] = Math.max(0, Math.min(1, this.fieldPotential[y][x]));
    }
  }
  
  // Update fusion events
  private updateFusionEvents(deltaTime: number) {
    for (let i = this.activeFusions.length - 1; i >= 0; i--) {
      const fusion = this.activeFusions[i];
      
      // Increase progress
      fusion.progress += deltaTime;
      
      // Check if fusion is complete
      if (fusion.progress >= fusion.maxProgress) {
        // Fusion complete - create explosion
        this.createFusionExplosion(fusion);
        
        // Remove fusion event
        this.activeFusions.splice(i, 1);
        continue;
      }
      
      // Fusion affects nearby particles and the quantum field
      this.applyFusionEffects(fusion, deltaTime);
    }
  }
  
  // Apply fusion effects to the environment
  private applyFusionEffects(fusion: {x: number, y: number, particles: Particle[], progress: number, maxProgress: number, radius: number, color: string}, deltaTime: number) {
    // Calculate progress percentage
    const progressPct = fusion.progress / fusion.maxProgress;
    
    // Affect quantum field
    const cellSize = 10;
    const fieldX = Math.floor(fusion.x / cellSize);
    const fieldY = Math.floor(fusion.y / cellSize);
    const fieldRadius = Math.ceil(fusion.radius / cellSize);
    
    // Apply fusion energy to quantum field in area
    for (let y = Math.max(0, fieldY - fieldRadius); y < Math.min(this.fieldPotential.length, fieldY + fieldRadius); y++) {
      for (let x = Math.max(0, fieldX - fieldRadius); x < Math.min(this.fieldPotential[0].length, fieldX + fieldRadius); x++) {
        const dx = (x - fieldX) * cellSize;
        const dy = (y - fieldY) * cellSize;
        const distSq = dx * dx + dy * dy;
        
        if (distSq < fusion.radius * fusion.radius) {
          // Intensity increases with fusion progress
          const distFactor = 1 - Math.sqrt(distSq) / fusion.radius;
          
          // Apply fusion energy to field
          this.fieldPotential[y][x] += progressPct * distFactor * deltaTime * 0.3;
          
          // Cap field values
          this.fieldPotential[y][x] = Math.max(0, Math.min(1, this.fieldPotential[y][x]));
        }
      }
    }
    
    // Affect nearby particles
    for (const particle of this.particles) {
      const dist = distance(fusion.x, fusion.y, particle.x, particle.y);
      
      if (dist < fusion.radius * 2) {
        // Particles are drawn toward fusion as it progresses
        const angle = Math.atan2(fusion.y - particle.y, fusion.x - particle.x);
        const force = 0.1 * progressPct * (1 - dist / (fusion.radius * 2));
        
        // Adjust particle direction
        const turnRate = 0.05;
        
        // Calculate angle difference
        let angleDiff = angle - particle.direction;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        // Turn particle toward fusion center
        particle.direction += angleDiff * turnRate * force;
        
        // Increase particle energy
        particle.energy += force * 0.1;
      }
    }
  }
  
  // Create explosion when fusion completes
  private createFusionExplosion(fusion: {x: number, y: number, particles: Particle[], progress: number, maxProgress: number, radius: number, color: string}) {
    // Create wave disturbance
    this.createWaveDisturbance(fusion.x, fusion.y, fusion.radius * 3, 2.0);
    
    // Create new particles in all directions
    const particleCount = 8 + Math.floor(fusion.particles.length * 1.5);
    const totalEnergy = fusion.particles.reduce((sum, p) => sum + p.energy, 0);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const particle = this.createParticle(fusion.x, fusion.y, angle);
      
      // Enhanced particles from fusion
      particle.energy = (totalEnergy / particleCount) * 1.5;
      particle.speed *= 1.5;
      particle.lifespan *= 1.2;
    }
    
    // Play explosion sound
    this.audioManager.playSuccess();
    
    // Add score based on fusion size
    this.gameState.addScore(50 * fusion.particles.length);
    
    // Chance to create a new plant from fusion
    if (Math.random() < 0.3) {
      this.createPlant(fusion.x, fusion.y, totalEnergy / 2);
    }
  }
  
  private render() {
    // Clear canvas
    this.renderer.clear();
    
    // Render quantum field
    this.renderer.renderField(this.fieldPotential);
    
    // Render gravity wells
    this.renderGravityWells();
    
    // Render particle streams
    this.renderParticleStreams();
    
    // Render fusion events
    this.renderFusionEvents();
    
    // Render all plants
    for (const plant of this.plants) {
      this.renderer.renderPlant(plant);
    }
    
    // Render all particles
    for (const particle of this.particles) {
      this.renderer.renderParticle(particle);
    }
    
    // Render mode buttons if visible
    if (this.modeButtonsVisible) {
      this.renderModeButtons();
    }
    
    // Render currently active mode indicator
    this.renderActiveModeIndicator();
    
    // Render selected particles for fusion
    if (this.activeMode === 'fusion' && this.selectedParticles.length > 0) {
      this.renderSelectedParticles();
    }
    
    // Render drag line for particle stream
    if (this.activeMode === 'channel' && this.dragStart && this.dragEnd) {
      this.renderDragLine();
    }
  }
  
  // Render selected particles for fusion
  private renderSelectedParticles() {
    const ctx = this.renderer.getContext();
    if (!ctx) return;
    
    // Draw connections between selected particles
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < this.selectedParticles.length; i++) {
      const p1 = this.selectedParticles[i];
      
      // Highlight selected particles
      ctx.beginPath();
      ctx.strokeStyle = 'orange';
      ctx.lineWidth = 2;
      ctx.arc(p1.x, p1.y, 12, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw lines connecting the particles
      if (i < this.selectedParticles.length - 1) {
        const p2 = this.selectedParticles[i + 1];
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
    
    // Draw text showing how many more particles needed
    if (this.selectedParticles.length < 3) {
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Select ${3 - this.selectedParticles.length} more particle${this.selectedParticles.length === 2 ? '' : 's'}`, 
        this.width / 2, 
        this.height - 20
      );
    }
  }
  
  // Render drag line for particle stream
  private renderDragLine() {
    if (!this.dragStart || !this.dragEnd) return;
    
    const ctx = this.renderer.getContext();
    if (!ctx) return;
    
    // Draw the line from start to end point
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(156, 39, 176, 0.6)';
    ctx.lineWidth = 3;
    ctx.moveTo(this.dragStart.x, this.dragStart.y);
    ctx.lineTo(this.dragEnd.x, this.dragEnd.y);
    ctx.stroke();
    
    // Draw start point
    ctx.beginPath();
    ctx.fillStyle = 'rgba(156, 39, 176, 0.8)';
    ctx.arc(this.dragStart.x, this.dragStart.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw end point
    ctx.beginPath();
    ctx.fillStyle = 'rgba(156, 39, 176, 0.8)';
    ctx.arc(this.dragEnd.x, this.dragEnd.y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Show instruction text
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click again to create stream', this.width / 2, this.height - 20);
  }
  
  // Render gravity wells with visual effects
  private renderGravityWells() {
    const ctx = this.renderer.getContext();
    if (!ctx) return;
    
    for (const well of this.gravityWells) {
      // Create gradient for well
      const gradient = ctx.createRadialGradient(
        well.x, well.y, 0,
        well.x, well.y, well.radius
      );
      
      // Add color stops
      gradient.addColorStop(0, `${well.color}`);
      gradient.addColorStop(0.7, `${well.color}80`); // 50% opacity
      gradient.addColorStop(1, `${well.color}00`); // 0% opacity
      
      // Draw gravity well
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(well.x, well.y, well.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw ripple effect
      const rippleSize = well.radius * (1 + 0.2 * Math.sin(Date.now() / 500));
      ctx.beginPath();
      ctx.strokeStyle = `${well.color}60`; // 40% opacity
      ctx.lineWidth = 2;
      ctx.arc(well.x, well.y, rippleSize, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  // Render particle streams with visual effects
  private renderParticleStreams() {
    const ctx = this.renderer.getContext();
    if (!ctx) return;
    
    for (const stream of this.particleStreams) {
      // Draw line for stream path
      ctx.beginPath();
      ctx.strokeStyle = `${stream.color}80`; // 50% opacity
      ctx.lineWidth = 4;
      ctx.moveTo(stream.startX, stream.startY);
      ctx.lineTo(stream.endX, stream.endY);
      ctx.stroke();
      
      // Draw glow effect
      ctx.beginPath();
      ctx.strokeStyle = `${stream.color}40`; // 25% opacity
      ctx.lineWidth = 8;
      ctx.moveTo(stream.startX, stream.startY);
      ctx.lineTo(stream.endX, stream.endY);
      ctx.stroke();
      
      // Draw particles flowing along the stream
      const particleCount = 5;
      const streamLength = Math.sqrt(
        Math.pow(stream.endX - stream.startX, 2) + 
        Math.pow(stream.endY - stream.startY, 2)
      );
      
      for (let i = 0; i < particleCount; i++) {
        const progress = ((Date.now() / 300) + i * 0.2) % 1;
        const x = stream.startX + (stream.endX - stream.startX) * progress;
        const y = stream.startY + (stream.endY - stream.startY) * progress;
        
        ctx.beginPath();
        ctx.fillStyle = stream.color;
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Add trail effect
        ctx.beginPath();
        ctx.fillStyle = `${stream.color}60`; // 40% opacity
        ctx.arc(
          x - (stream.endX - stream.startX) * 0.05, 
          y - (stream.endY - stream.startY) * 0.05, 
          2, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
  
  // Render fusion events with visual effects
  private renderFusionEvents() {
    const ctx = this.renderer.getContext();
    if (!ctx) return;
    
    for (const fusion of this.activeFusions) {
      // Calculate progress percentage
      const progress = fusion.progress / fusion.maxProgress;
      
      // Create pulsing effect based on progress
      const pulseSize = fusion.radius * (0.8 + 0.4 * Math.sin(Date.now() / 200));
      
      // Draw main fusion circle
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        fusion.x, fusion.y, 0,
        fusion.x, fusion.y, pulseSize
      );
      
      // Gradient colors change as fusion progresses
      gradient.addColorStop(0, `hsl(${280 + progress * 60}, 100%, 70%)`);
      gradient.addColorStop(0.6, `hsla(${280 + progress * 60}, 80%, 50%, 0.5)`);
      gradient.addColorStop(1, `hsla(${280 + progress * 60}, 80%, 50%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.arc(fusion.x, fusion.y, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw energy rays radiating outward
      const rayCount = 8;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + Date.now() / 1000;
        const rayLength = pulseSize * (0.5 + 0.5 * progress);
        
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${280 + progress * 60}, 90%, 60%)`;
        ctx.lineWidth = 2;
        ctx.moveTo(fusion.x, fusion.y);
        ctx.lineTo(
          fusion.x + Math.cos(angle) * rayLength,
          fusion.y + Math.sin(angle) * rayLength
        );
        ctx.stroke();
      }
      
      // Draw progress ring
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.arc(fusion.x, fusion.y, pulseSize + 5, 0, Math.PI * 2 * progress);
      ctx.stroke();
    }
  }
  
  // Render mode selection buttons
  private renderModeButtons() {
    const ctx = this.renderer.getContext();
    if (!ctx) return;
    
    const buttonSize = 40;
    const spacing = 10;
    const startY = 60;
    const startX = 20;
    
    const modes = [
      { mode: 'create', label: 'Create', color: '#4CAF50', icon: '✚' },
      { mode: 'gravity', label: 'Gravity', color: '#2196F3', icon: '◉' },
      { mode: 'channel', label: 'Stream', color: '#9C27B0', icon: '⇢' },
      { mode: 'fusion', label: 'Fusion', color: '#FF9800', icon: '⚛' },
      { mode: 'explore', label: 'Explore', color: '#009688', icon: '🔍' }
    ];
    
    modes.forEach((modeInfo, index) => {
      const y = startY + (buttonSize + spacing) * index;
      
      // Draw button background
      ctx.beginPath();
      ctx.fillStyle = modeInfo.mode === this.activeMode 
        ? `${modeInfo.color}` 
        : `${modeInfo.color}80`;
      ctx.roundRect(startX, y, buttonSize, buttonSize, 8);
      ctx.fill();
      
      // Draw button border
      ctx.beginPath();
      ctx.strokeStyle = modeInfo.mode === this.activeMode 
        ? 'white' 
        : `${modeInfo.color}`;
      ctx.lineWidth = 2;
      ctx.roundRect(startX, y, buttonSize, buttonSize, 8);
      ctx.stroke();
      
      // Draw icon
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(modeInfo.icon, startX + buttonSize / 2, y + buttonSize / 2);
      
      // Draw label
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(modeInfo.label, startX + buttonSize + spacing, y + buttonSize / 2);
    });
  }
  
  // Render indicator for active mode
  private renderActiveModeIndicator() {
    const ctx = this.renderer.getContext();
    if (!ctx) return;
    
    // Draw active mode indicator at the top of the screen
    let modeName = 'Create Particles';
    let modeColor = '#4CAF50';
    
    switch (this.activeMode) {
      case 'gravity':
        modeName = 'Gravity Wells';
        modeColor = '#2196F3';
        break;
      case 'channel':
        modeName = 'Particle Streams';
        modeColor = '#9C27B0';
        break;
      case 'fusion':
        modeName = 'Fusion Reactor';
        modeColor = '#FF9800';
        break;
      case 'explore':
        modeName = 'Cosmic Explorer';
        modeColor = '#009688';
        break;
    }
    
    // Draw indicator background
    ctx.beginPath();
    ctx.fillStyle = `${modeColor}80`;
    ctx.roundRect(this.width / 2 - 100, 10, 200, 30, 15);
    ctx.fill();
    
    // Draw border
    ctx.beginPath();
    ctx.strokeStyle = modeColor;
    ctx.lineWidth = 2;
    ctx.roundRect(this.width / 2 - 100, 10, 200, 30, 15);
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(modeName, this.width / 2, 25);
  }
  
  private updateField(deltaTime: number) {
    // Diffusion - smooth out the field
    const diffusionRate = 0.01;
    const newField = this.fieldPotential.map((row, i) => 
      row.map((cell, j) => {
        let sum = 0;
        let count = 0;
        
        // Check surrounding cells
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            
            if (ni >= 0 && ni < this.fieldPotential.length && 
                nj >= 0 && nj < this.fieldPotential[0].length) {
              sum += this.fieldPotential[ni][nj];
              count++;
            }
          }
        }
        
        const avg = sum / count;
        return cell * (1 - diffusionRate) + avg * diffusionRate;
      })
    );
    
    this.fieldPotential = newField;
  }
  
  private updateParticles(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Apply gravity well effects
      this.applyGravityWellsToParticle(particle, deltaTime);
      
      // Update particle movement
      particle.update(deltaTime, this.fieldPotential);
      
      // Remove dead particles
      if (particle.isDead()) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Check boundaries
      if (particle.x < 0 || particle.x >= this.width || 
          particle.y < 0 || particle.y >= this.height) {
        // Bounce off edges or wrap around
        if (Math.random() < 0.5) {
          // Bounce
          if (particle.x < 0 || particle.x >= this.width) {
            particle.direction = Math.PI - particle.direction;
          } else {
            particle.direction = -particle.direction;
          }
          
          // Keep in bounds
          particle.x = Math.max(0, Math.min(this.width - 1, particle.x));
          particle.y = Math.max(0, Math.min(this.height - 1, particle.y));
        } else {
          // Wrap around
          particle.x = (particle.x + this.width) % this.width;
          particle.y = (particle.y + this.height) % this.height;
        }
      }
    }
  }
  
  // Apply gravity well effects to a particle
  private applyGravityWellsToParticle(particle: Particle, deltaTime: number) {
    for (const well of this.gravityWells) {
      // Calculate distance to gravity well
      const dx = well.x - particle.x;
      const dy = well.y - particle.y;
      const distSq = dx * dx + dy * dy;
      
      // If within influence range of the well
      if (distSq < well.radius * well.radius) {
        const dist = Math.sqrt(distSq);
        
        // Skip if too close to prevent extreme acceleration
        if (dist < 5) continue;
        
        // Calculate force (stronger when closer, and proportional to well strength)
        const forceMagnitude = well.strength * (1.0 - dist / well.radius) * 200 * deltaTime;
        
        // Calculate direction toward gravity well center
        const angle = Math.atan2(dy, dx);
        
        // Apply force toward gravity well by adjusting particle direction
        const currentDirection = particle.direction;
        const influenceFactor = forceMagnitude * 0.05; // How strongly the well affects direction
        
        // Blend current direction with pull direction
        particle.direction = (1 - influenceFactor) * currentDirection + influenceFactor * angle;
        
        // Also increase speed slightly when in a gravity well
        particle.speed += forceMagnitude * 0.2;
        
        // Change particle direction gradually
        const turnRate = 0.1; // How quickly the particle turns toward the well
        const targetDirection = angle;
        
        // Calculate the shortest angle to turn
        let angleDiff = targetDirection - particle.direction;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        // Adjust direction
        particle.direction += angleDiff * turnRate * force;
        
        // Adjust speed based on gravity (speed up when falling in)
        particle.speed += force * 0.5;
        
        // Cap speed to prevent excessive acceleration
        particle.speed = Math.min(particle.speed, 120);
      }
    }
  }
  
  private updatePlants(deltaTime: number) {
    for (let i = 0; i < this.plants.length; i++) {
      const plant = this.plants[i];
      plant.update(deltaTime, this.fieldPotential);
      
      // Plants affect the quantum field
      const fieldX = Math.floor(plant.x / 10);
      const fieldY = Math.floor(plant.y / 10);
      
      if (fieldX >= 0 && fieldX < this.fieldPotential.length &&
          fieldY >= 0 && fieldY < this.fieldPotential[0].length) {
        // Plants enhance the field strength
        this.fieldPotential[fieldX][fieldY] += plant.getFieldStrength() * deltaTime;
      }
    }
  }
  
  private checkPlantGrowth() {
    // Check if plants can grow based on particle proximity
    for (const particle of this.particles) {
      // See if there are already plants nearby
      let nearbyPlant = false;
      for (const plant of this.plants) {
        if (distance(particle.x, particle.y, plant.x, plant.y) < 30) {
          nearbyPlant = true;
          break;
        }
      }
      
      // If no nearby plants, chance to create new plant
      if (!nearbyPlant && Math.random() < 0.001) {
        this.createPlant(particle.x, particle.y, particle.energy);
        // Remove the particle that became a plant
        this.particles = this.particles.filter(p => p !== particle);
        
        // Play growth sound
        this.audioManager.playSuccess();
        
        // Increase score
        this.gameState.addScore(100);
      }
    }
  }
  
  // Create a new particle
  private createParticle(x: number, y: number, direction: number = Math.random() * Math.PI * 2): Particle {
    // Create particle with phase-appropriate properties
    const currentPhase = this.gameState.getCurrentPhase?.() || 0;
    
    // Higher energy particles in later cosmic phases
    let energy = 0.5 + Math.random() * 0.5;
    let lifespan = 10 + Math.random() * 20;
    
    // Adjust particle properties based on universe phase
    if (currentPhase >= 2) { // After Big Bang
      energy *= 1.5; // More energetic particles
      lifespan *= 1.2; // Longer-lasting
    }
    if (currentPhase >= 4) { // Particle formation phase
      energy *= 1.2; // Even more energy
    }
    
    const particle = new Particle(x, y, direction, energy, lifespan);
    this.particles.push(particle);
    
    // Add some randomness to the field where particle appears
    // Stronger disturbances in early universe phases
    const disturbanceIntensity = currentPhase <= 3 ? 0.5 : 0.2;
    this.createWaveDisturbance(x, y, 5, disturbanceIntensity);
    
    return particle;
  }
  
  // Create a new cosmic body (plant, star, galaxy, planet, etc.) with scientific accuracy
  private createPlant(x: number, y: number, energy: number): Plant {
    // Get current universe phase to determine what type of cosmic body to create
    const currentPhase = this.gameState.getCurrentPhase?.() || 0;
    
    // Create appropriate cosmic body based on universe phase
    const plant = new Plant(x, y, energy, currentPhase);
    
    // Make cosmic bodies interactable in later phases
    if (currentPhase >= 6) {
      plant.isInteractable = true;
    }
    
    this.plants.push(plant);
    
    // Register with game state
    this.gameState.registerPlantGrowth();
    
    return plant;
  }
  
  // Create a gravity well at the specified location
  private createGravityWell(x: number, y: number) {
    // Create a new gravity well
    const currentPhase = this.gameState.getCurrentPhase?.() || 0;
    
    // Determine gravity well strength based on universe phase
    let strength = 20;
    let radius = 80;
    let life = 12;
    
    // Later universe phases have stronger gravity
    if (currentPhase >= 5) strength += 10;
    if (currentPhase >= 8) strength += 15;
    
    // Add some randomness to the parameters
    strength *= (0.8 + Math.random() * 0.4); // 80-120% of base strength
    radius *= (0.8 + Math.random() * 0.4); // 80-120% of base radius
    
    // Different colors based on universe phase
    let color = '#2196F3'; // Default blue
    
    if (currentPhase >= 8) {
      color = '#9C27B0'; // Purple for advanced phases
    } else if (currentPhase >= 4) {
      color = '#3F51B5'; // Deep blue for middle phases
    }
    
    // Add the gravity well to the list
    this.gravityWells.push({
      x, y, strength, radius, life, color
    });
    
    // Play sound
    this.audioManager.playSuccess();
    
    // Create a wave disturbance
    this.createWaveDisturbance(x, y, radius * 0.5, 1.0);
  }
  
  // Find the nearest particle to a position
  private findNearestParticle(x: number, y: number, maxDistance: number): Particle | null {
    let nearest: Particle | null = null;
    let minDist = maxDistance;
    
    for (const particle of this.particles) {
      const dist = distance(x, y, particle.x, particle.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = particle;
      }
    }
    
    return nearest;
  }
  
  // Create a particle stream between two points
  private createParticleStream(startX: number, startY: number, endX: number, endY: number) {
    // Calculate duration based on length
    const length = Math.sqrt(
      Math.pow(endX - startX, 2) + 
      Math.pow(endY - startY, 2)
    );
    
    // Longer streams last longer
    const duration = 5 + length / 50;
    
    // Strength based on current phase
    const currentPhase = this.gameState.getCurrentPhase?.() || 0;
    let strength = 5 + currentPhase * 0.5;
    
    // Particle rate (particles per second)
    const particleRate = 2 + Math.floor(currentPhase / 3);
    
    // Color based on phase
    let color = '#9C27B0'; // Purple default
    
    if (currentPhase >= 8) {
      color = '#FF9800'; // Orange for advanced phases
    } else if (currentPhase >= 4) {
      color = '#E91E63'; // Pink for middle phases
    }
    
    // Add the stream
    this.particleStreams.push({
      startX, startY, endX, endY, 
      strength, duration, 
      particleRate,
      timeToNextParticle: 1 / particleRate,
      color
    });
    
    // Play sound
    this.audioManager.playSuccess();
  }
  
  // Create a fusion event with selected particles
  private createFusionEvent(particles: Particle[]) {
    if (particles.length < 2) return;
    
    // Calculate center position of all particles
    let centerX = 0;
    let centerY = 0;
    
    for (const p of particles) {
      centerX += p.x;
      centerY += p.y;
    }
    
    centerX /= particles.length;
    centerY /= particles.length;
    
    // Determine fusion properties based on particles
    let totalEnergy = 0;
    for (const p of particles) {
      totalEnergy += p.energy;
    }
    
    // More particles = longer fusion time
    const maxProgress = 5 + particles.length * 2;
    const radius = 30 + particles.length * 5;
    
    // Color varies based on energy
    const colorHue = Math.min(300, 200 + totalEnergy * 10);
    const color = `hsl(${colorHue}, 80%, 50%)`;
    
    // Add the fusion event
    this.activeFusions.push({
      x: centerX,
      y: centerY,
      particles: [...particles], // Copy the array
      progress: 0,
      maxProgress,
      radius,
      color
    });
    
    // Play sound
    this.audioManager.playSuccess();
    
    // Create wave disturbance
    this.createWaveDisturbance(centerX, centerY, radius, 2.0);
  }
  
  // Create a disturbance in the quantum field (ripple effect)
  private createWaveDisturbance(x: number, y: number, radius: number, intensity: number) {
    const cellSize = 10;
    const fieldX = Math.floor(x / cellSize);
    const fieldY = Math.floor(y / cellSize);
    const fieldRadius = Math.ceil(radius / cellSize);
    
    // Affect field in circular area
    for (let i = Math.max(0, fieldY - fieldRadius); i < Math.min(this.fieldPotential.length, fieldY + fieldRadius); i++) {
      for (let j = Math.max(0, fieldX - fieldRadius); j < Math.min(this.fieldPotential[0].length, fieldX + fieldRadius); j++) {
        // Calculate distance from center point
        const dx = (j - fieldX) * cellSize;
        const dy = (i - fieldY) * cellSize;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Only affect points within radius
        if (dist > radius) continue;
        
        // Calculate falloff based on distance from center
        const factor = 1 - dist / radius;
        
        // Create a wave-like pattern
        this.fieldPotential[i][j] += Math.sin(dist * 2) * intensity * factor;
      }
    }
  }
  
  /**
   * Handle drag start based on the active mode
   */
  private handleDragStart(x: number, y: number) {
    if (!this.isRunning) return;
    
    // Store drag start position
    this.dragStart = { x, y };
    this.isDragging = true;
    
    console.log(`Drag started at (${x}, ${y}) in mode: ${this.activeMode}`);
    
    // Mode-specific behavior
    switch(this.activeMode) {
      case 'create':
        // In create mode, immediately create a particle
        this.handleClick(x, y);
        break;
      
      case 'gravity':
        // In gravity mode, we'll wait for drag end to determine size
        // But we can also show a preview
        this.createWaveDisturbance(x, y, 30, 0.5);
        break;
        
      case 'stream':
        // In stream mode, we'll wait for drag end to determine direction
        // But we can show a small effect at the start point
        this.createWaveDisturbance(x, y, 20, 0.3);
        break;
        
      case 'fusion':
        // In fusion mode, try to select a particle to start fusion
        this.selectParticleAtPosition(x, y);
        break;
    }
  }
  
  /**
   * Handle drag end based on the active mode
   * This creates gravity wells, particle streams, etc.
   */
  private handleDragEnd(x: number, y: number) {
    if (!this.isDragging || !this.dragStart) return;
    
    console.log(`Drag ended at (${x}, ${y}) in mode: ${this.activeMode}`);
    
    // Calculate drag vector
    const dx = x - this.dragStart.x;
    const dy = y - this.dragStart.y;
    const dragLength = Math.sqrt(dx * dx + dy * dy);
    
    // Only process drag if it's long enough (to avoid accidental drags)
    if (dragLength > 10) {
      // Take action based on active mode
      switch(this.activeMode) {
        case 'gravity':
          this.createGravityWellFromDrag(this.dragStart.x, this.dragStart.y, dragLength);
          break;
          
        case 'stream':
          this.createStreamFromDrag(this.dragStart.x, this.dragStart.y, x, y);
          break;
      }
    }
    
    // Clear drag state
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
  }
  
  /**
   * Create a gravity well based on drag distance
   * With enhanced types based on universe phase and size
   */
  private createGravityWellFromDrag(x: number, y: number, radius: number) {
    // Limit maximum size
    const maxRadius = 200;
    const wellRadius = Math.min(maxRadius, radius);
    
    // Get current universe phase to determine well properties
    const phase = this.gameState.getCurrentPhase?.() || 0;
    
    // Calculate strength based on size (but with diminishing returns)
    const strength = 1.0 + Math.min(2.0, radius / 100);
    
    // Base energy cost scales with size
    let baseCost = 10 + Math.floor(wellRadius / 20);
    
    // Different well types based on universe phase and size
    let wellType = "standard";
    let color = '#8A2BE2'; // Default purple
    let lifespan = 15; // Default lifespan in seconds
    let finalCost = baseCost;
    
    // Determine well type based on size and phase
    if (wellRadius > 150) {
      if (phase >= 3) {
        wellType = "black_hole";
        color = '#000000';
        finalCost = Math.floor(baseCost * 1.5);
        lifespan = 25;
      } else if (phase >= 2) {
        wellType = "neutron";
        color = '#4B0082';
        finalCost = Math.floor(baseCost * 1.3);
        lifespan = 20;
      }
    } else if (wellRadius > 80) {
      if (phase >= 2) {
        wellType = "pulsar";
        color = '#9932CC';
        finalCost = Math.floor(baseCost * 1.2);
        lifespan = 18;
      } else if (phase >= 1) {
        wellType = "magnetic";
        color = '#800080';
        finalCost = Math.floor(baseCost * 1.1);
        lifespan = 16;
      }
    }
    
    // Only create if we have enough energy
    if (this.gameState.useEnergy(finalCost)) {
      // Create the gravity well with special properties based on type
      this.createGravityWell(x, y, wellRadius, strength, wellType, color, lifespan);
      
      // Special effects based on well type
      this.createWaveDisturbance(x, y, wellRadius * 0.8, strength);
      
      if (wellType !== "standard") {
        // Create additional visual effects for special wells
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const distX = Math.cos(angle) * wellRadius * 0.5;
          const distY = Math.sin(angle) * wellRadius * 0.5;
          this.createWaveDisturbance(x + distX, y + distY, wellRadius * 0.3, strength * 0.5);
        }
      }
      
      this.audioManager.playSuccess();
      
      // Important discoveries can happen when creating special wells
      if (wellType === "black_hole" && Math.random() < 0.3) {
        // Chance to discover cosmic element during black hole creation
        if (this.gameState.discoverElement) {
          if (phase >= 3) {
            this.gameState.discoverElement("dark_matter");
          } else if (phase >= 2) {
            this.gameState.discoverElement("neutronium");
          }
        }
      }
    }
  }
  
  /**
   * Create a gravity well at the specified position
   */
  /**
   * Enhanced implementation of gravity well creation
   */
  private createGravityWell(
    x: number, 
    y: number, 
    radius: number, 
    strength: number, 
    wellType: string = "standard", 
    color: string = '#8A2BE2', 
    lifespan: number = 15
  ) {
    console.log(`Creating ${wellType} gravity well at (${x}, ${y}) with radius ${radius} and strength ${strength}`);
    
    // Add to active gravity wells with type-specific properties
    this.gravityWells.push({
      x, 
      y, 
      radius, 
      strength,
      life: lifespan,
      color: color
    });
  }
  
  /**
   * Create a particle stream based on drag
   * Enhanced with different stream types based on universe phase
   */
  private createStreamFromDrag(startX: number, startY: number, endX: number, endY: number) {
    // Calculate length
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Minimum length required
    if (length < 30) return;
    
    // Get current universe phase to determine stream capabilities
    const phase = this.gameState.getCurrentPhase?.() || 0;
    
    // Calculate stream strength based on length
    const baseStrength = 0.5 + Math.min(1.5, length / 200);
    
    // Base energy cost scales with length
    let energyCost = 15 + Math.floor(length / 30);
    
    // Different stream types based on phase and length
    let streamType = "standard";
    let streamStrength = baseStrength;
    let streamDuration = 10;
    let streamRate = 0.2;
    let streamColor = '#00BFFF'; // Default blue
    
    // Advanced streams in later phases
    if (length > 150) {
      if (phase >= 3) {
        // Stellar plasma streams in star formation phase
        streamType = "stellar_plasma";
        streamStrength = baseStrength * 2.0;
        streamDuration = 15;
        streamRate = 0.4;
        streamColor = '#FFD700'; // Gold
        energyCost = Math.floor(energyCost * 1.5);
      } else if (phase >= 2) {
        // Ionized matter streams in element formation phase
        streamType = "ionized";
        streamStrength = baseStrength * 1.7;
        streamDuration = 12;
        streamRate = 0.3;
        streamColor = '#4B0082'; // Indigo
        energyCost = Math.floor(energyCost * 1.3);
      }
    } else if (length > 80) {
      if (phase >= 2) {
        // Quantum streams in element formation phase
        streamType = "quantum";
        streamStrength = baseStrength * 1.5;
        streamDuration = 11;
        streamRate = 0.25;
        streamColor = '#9932CC'; // Dark orchid
        energyCost = Math.floor(energyCost * 1.2);
      } else if (phase >= 1) {
        // Photon streams in post-big-bang phase
        streamType = "photon";
        streamStrength = baseStrength * 1.3;
        streamDuration = 10;
        streamRate = 0.22;
        streamColor = '#1E90FF'; // Dodger blue
        energyCost = Math.floor(energyCost * 1.1);
      }
    }
    
    console.log(`Creating ${streamType} stream with strength ${streamStrength.toFixed(1)}`);
    
    // Only create if we have enough energy
    if (this.gameState.useEnergy(energyCost)) {
      this.createParticleStream(
        startX, 
        startY, 
        endX, 
        endY, 
        streamStrength,
        streamType,
        streamColor,
        streamDuration,
        streamRate
      );
      
      // Create visual effect
      this.createWaveDisturbance(startX, startY, 20, streamStrength * 0.5);
      
      // Special streams have special effects
      if (streamType !== "standard") {
        // Add visual effect at the end point too
        this.createWaveDisturbance(endX, endY, 15, streamStrength * 0.4);
        
        // Chance to discover new elements with special streams
        if (Math.random() < 0.15 && this.gameState.discoverElement) {
          if (streamType === "stellar_plasma" && phase >= 3) {
            this.gameState.discoverElement("plasma_current");
          } else if (streamType === "ionized" && phase >= 2) {
            this.gameState.discoverElement("charged_flow");
          } else if (streamType === "quantum" && phase >= 2) {
            this.gameState.discoverElement("quantum_tunnel");
          }
        }
      }
      
      this.audioManager.playHit();
    }
  }
  
  /**
   * Create a particle stream between two points
   * Enhanced with special properties based on stream type
   */
  private createParticleStream(
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    strength: number,
    streamType: string = "standard",
    color: string = '#00BFFF',
    duration: number = 10,
    particleRate: number = 0.2
  ) {
    console.log(`Creating ${streamType} particle stream from (${startX}, ${startY}) to (${endX}, ${endY})`);
    
    // Add to active streams with all properties
    this.particleStreams.push({
      startX,
      startY,
      endX,
      endY,
      strength,
      duration,
      particleRate,
      timeToNextParticle: 0,
      color
    });
  }
  
  // This method has been reimplemented above
  
  // Implementation is already provided elsewhere in the class
  
  /**
   * Creates a particle with energy at the specified position
   * Enhanced with particle types based on universe phase
   */
  private createParticleWithEnergy(x: number, y: number) {
    // Base energy cost
    const baseCost = 2;
    
    // Get current universe phase to determine particle properties
    const phase = this.gameState.getCurrentPhase?.() || 0;
    
    // Advanced particles in later phases cost more but have special properties
    let energyCost = baseCost;
    let particleType = "standard";
    
    // Adjust based on cosmic phase
    if (phase >= 3) {
      // In star formation phase, can create higher-energy particles
      if (Math.random() < 0.2) {
        particleType = "stellar";
        energyCost = 5;
      }
    } else if (phase >= 2) {
      // In element formation phase, can create heavier particles
      if (Math.random() < 0.15) {
        particleType = "heavy";
        energyCost = 4;
      }
    } else if (phase >= 1) {
      // In post-big-bang phase, can create charged particles 
      if (Math.random() < 0.1) {
        particleType = "charged";
        energyCost = 3;
      }
    }
    
    if (this.gameState.useEnergy(energyCost)) {
      // Create base particle
      const particle = this.createParticle(x, y, Math.random() * Math.PI * 2);
      
      // Enhance particle based on type
      switch (particleType) {
        case "charged":
          particle.energy *= 1.5;
          particle.wavelength = 0.7;
          particle.lifespan *= 1.2;
          break;
        case "heavy":
          particle.energy *= 2.0;
          particle.speed *= 0.7;
          particle.lifespan *= 1.5;
          break;
        case "stellar":
          particle.energy *= 3.0;
          particle.wavelength = 0.3;
          particle.lifespan *= 2.0;
          break;
      }
      
      this.gameState.registerParticleCreated();
      this.audioManager.playHit();
      
      // Enhanced visual feedback for special particles
      if (particleType !== "standard") {
        this.createWaveDisturbance(x, y, 15 + particle.energy * 2, 0.5);
      }
    }
  }
  
  /**
   * Select a particle at the given position for fusion
   */
  private selectParticleAtPosition(x: number, y: number) {
    // Check if we have enough energy
    if (!this.gameState.useEnergy(1)) return;
    
    // Find the closest particle within selection range
    const selectionRadius = 30;
    let closestParticle: Particle | null = null;
    let closestDistance = selectionRadius;
    
    for (const particle of this.particles) {
      const dx = particle.x - x;
      const dy = particle.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestParticle = particle;
      }
    }
    
    // If we found a particle to select
    if (closestParticle) {
      // Check if this particle is already selected (to deselect it)
      const existingIndex = this.selectedParticles.indexOf(closestParticle);
      if (existingIndex >= 0) {
        // Deselect the particle
        this.selectedParticles.splice(existingIndex, 1);
        this.audioManager.playHit();
      } else {
        // Select the particle
        this.selectedParticles.push(closestParticle);
        this.audioManager.playHit();
        
        // If we have 3 or more particles selected, attempt fusion
        if (this.selectedParticles.length >= 3) {
          this.attemptFusion();
        }
      }
    }
  }
  
  /**
   * Attempt to fuse selected particles with advanced cosmic mechanics
   * Different particle combinations yield different results based on universe phase
   */
  private attemptFusion() {
    if (this.selectedParticles.length < 3) return;
    
    // Calculate center position of fusion (average of all selected particles)
    let centerX = 0;
    let centerY = 0;
    let totalEnergy = 0;
    let totalParticleAge = 0;
    
    // Calculate properties based on selected particles
    for (const particle of this.selectedParticles) {
      centerX += particle.x;
      centerY += particle.y;
      totalEnergy += particle.energy;
      totalParticleAge += particle.age;
    }
    
    centerX /= this.selectedParticles.length;
    centerY /= this.selectedParticles.length;
    
    // Get current universe phase to determine fusion capabilities
    const phase = this.gameState.getCurrentPhase?.() || 0;
    
    // Determine fusion type based on particle properties and universe phase
    let fusionType = "standard";
    let fusionPower = 1.0;
    let fusionStability = 1.0;
    let fusionSuccess = true;
    let fusionReward = this.selectedParticles.length * 10;
    
    // Calculate average wavelength and total energy
    const avgWavelength = this.selectedParticles.reduce((total, p) => total + (p.wavelength || 0.5), 0) 
      / this.selectedParticles.length;
    
    // Calculate radius based on number and energy of particles
    const baseRadius = 20 + this.selectedParticles.length * 5;
    let radius = baseRadius;
    
    // Calculate fusion color based on energy and wavelength
    const energyLevel = Math.min(1, totalEnergy / (100 * this.selectedParticles.length));
    const hue = Math.floor(280 - energyLevel * 200); // High energy = blues, low energy = reds
    const saturation = Math.floor(70 + energyLevel * 30);
    const lightness = Math.floor(50 + energyLevel * 20);
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // More advanced fusion types in later universe phases
    if (phase >= 3) {
      // Star formation phase allows for stellar fusion
      if (this.selectedParticles.length >= 5 && totalEnergy > 50) {
        fusionType = "stellar";
        fusionPower = 2.5;
        radius = baseRadius * 1.5;
        fusionReward *= 3;
      }
    } else if (phase >= 2) {
      // Element formation phase allows for nuclear fusion
      if (this.selectedParticles.length >= 4 && avgWavelength < 0.6) {
        fusionType = "nuclear";
        fusionPower = 2.0;
        radius = baseRadius * 1.2;
        fusionReward *= 2;
      }
    } else if (phase >= 1) {
      // Post-big-bang allows for atomic fusion
      if (this.selectedParticles.length >= 3 && avgWavelength < 0.8) {
        fusionType = "atomic";
        fusionPower = 1.5;
        radius = baseRadius * 1.1;
        fusionReward *= 1.5;
      }
    }
    
    // Risk of fusion failure increases with more unstable configurations
    if (this.selectedParticles.length > 7 && Math.random() < 0.3) {
      fusionSuccess = false;
      this.audioManager.playHit();
      this.createWaveDisturbance(centerX, centerY, radius * 0.7, 0.5);
      
      // Only consume some of the particles in failed fusion
      const failedParticles = Math.floor(this.selectedParticles.length * 0.7);
      this.selectedParticles.splice(0, failedParticles);
      
      // Show feedback
      console.log("Fusion failed - configuration too unstable!");
      return;
    }
    
    console.log(`Creating ${fusionType} fusion with power ${fusionPower.toFixed(1)} and reward ${fusionReward}`);
    
    // Create fusion event with max progress based on particle count and type
    const maxProgress = (3 + this.selectedParticles.length * 0.5) / fusionPower;
    
    // Add to active fusions
    this.activeFusions.push({
      x: centerX,
      y: centerY,
      particles: [...this.selectedParticles], // Copy the array
      progress: 0,
      maxProgress: maxProgress,
      radius: radius,
      color: color
    });
    
    // Create visual effect based on fusion type
    this.createWaveDisturbance(centerX, centerY, radius, fusionPower);
    
    // Special effects for advanced fusion types
    if (fusionType !== "standard") {
      // Create pulsing energy waves
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          this.createWaveDisturbance(
            centerX, 
            centerY, 
            radius * (0.5 + i * 0.3), 
            fusionPower * 0.5
          );
        }, i * 200);
      }
      
      // Chance to discover new elements in advanced fusions
      if (Math.random() < 0.2 && this.gameState.discoverElement) {
        if (fusionType === "stellar" && phase >= 3) {
          this.gameState.discoverElement("stellar_plasma");
        } else if (fusionType === "nuclear" && phase >= 2) {
          this.gameState.discoverElement("heavy_elements");
        } else if (fusionType === "atomic" && phase >= 1) {
          this.gameState.discoverElement("stable_isotopes");
        }
      }
    }
    
    this.audioManager.playSuccess();
    
    // Award immediate score for successful fusion
    this.gameState.addScore(Math.floor(fusionReward));
    
    // Clear selected particles
    this.selectedParticles = [];
  }
  
  /**
   * Explore a cosmic body at the given position
   * Enhanced with phase-specific exploration features and rewards
   */
  private exploreCosmicBodyAt(x: number, y: number) {
    // Get current phase for exploration capabilities
    const phase = this.gameState.getCurrentPhase?.() || 0;
    
    // Check if we're clicking on a plant (cosmic body)
    for (const plant of this.plants) {
      const distance = Math.sqrt(
        Math.pow(plant.x - x, 2) + 
        Math.pow(plant.y - y, 2)
      );
      
      // Energy cost and ability to explore depends on cosmic body size and type
      let canExplore = false;
      let explorationEnergyCost = 5; // Base cost
      
      // Determine if this body can be explored based on phase
      if (plant.size > 40) {
        if (plant.type === "galaxy" && phase >= 3) {
          canExplore = true;
          explorationEnergyCost = 25;
        } else if (plant.type === "star" && phase >= 2) {
          canExplore = true;
          explorationEnergyCost = 15;
        } else if (plant.type === "planet" && phase >= 1) {
          canExplore = true;
          explorationEnergyCost = 10;
        } else if (phase >= 1) {
          // In post-big-bang phase, smaller cosmic bodies can be explored
          canExplore = true;
        }
      }
      
      // If we're close enough to the cosmic body
      if (distance < plant.size / 2) {
        console.log(`Attempting to explore cosmic body: ${plant.type}`);
        
        // Special feedback for bodies that can't be explored yet
        if (!canExplore) {
          console.log(`Cannot explore ${plant.type} yet - phase too early or object too small`);
          this.audioManager.playHit();
          
          // Create small visual effect to indicate it's not explorable
          this.createWaveDisturbance(plant.x, plant.y, plant.size * 0.3, 0.3);
          return;
        }
        
        // Pay energy cost for exploration
        if (!this.gameState.useEnergy(explorationEnergyCost)) {
          console.log(`Not enough energy to explore ${plant.type}`);
          this.audioManager.playHit();
          return;
        }
        
        // Use the cosmic explorer to enter the plant
        if (this.cosmicExplorer) {
          // Prepare exploration with visual effects
          this.createWaveDisturbance(plant.x, plant.y, plant.size, 1.0);
          
          // Create expanding ring effect
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              this.createWaveDisturbance(
                plant.x, 
                plant.y, 
                plant.size * (0.5 + i * 0.3), 
                0.7 - i * 0.2
              );
            }, i * 200);
          }
          
          // Enter the cosmic body
          this.cosmicExplorer.enterCosmicBody(plant);
          this.audioManager.playSuccess();
          
          // Award score for exploration
          const explorationReward = Math.floor(10 + plant.size / 2);
          this.gameState.addScore(explorationReward);
          
          // Chance to discover elements based on cosmic body type
          if (Math.random() < 0.25 && this.gameState.discoverElement) {
            if (plant.type === "galaxy" && phase >= 3) {
              this.gameState.discoverElement("galactic_core");
            } else if (plant.type === "star" && phase >= 2) {
              this.gameState.discoverElement("solar_fusion");
            } else if (plant.type === "planet" && phase >= 1) {
              this.gameState.discoverElement("planetary_minerals");
            } else if (plant.type === "nebula") {
              this.gameState.discoverElement("stellar_dust");
            }
          }
        }
        
        return;
      }
    }
    
    // If we didn't click on a cosmic body, exit exploration mode if active
    if (this.cosmicExplorer && this.cosmicExplorer.getFocusedObject()) {
      // Exit current cosmic body with visual effect
      const currentBody = this.cosmicExplorer.getFocusedObject();
      if (currentBody) {
        this.createWaveDisturbance(currentBody.x, currentBody.y, currentBody.size * 0.8, 0.6);
      }
      
      this.cosmicExplorer.exitCurrentBody();
      this.audioManager.playHit();
    }
  }
  
  /**
   * Handle mouse clicks with scientific accuracy based on universe phase
   */
  private handleClick(x: number, y: number) {
    if (!this.isRunning) return;
    
    // Handle click based on active mode
    switch(this.activeMode) {
      case 'create':
        // Create a new particle
        this.createParticleWithEnergy(x, y);
        break;
        
      case 'gravity':
        // In gravity mode, small clicks create small gravity wells
        if (this.gameState.useEnergy(10)) {
          this.createGravityWell(x, y, 50, 1.0);
        }
        break;
        
      case 'fusion':
        // In fusion mode, select or deselect particles
        this.selectParticleAtPosition(x, y);
        break;
        
      case 'explore':
        // In explore mode, try to enter cosmic objects
        this.exploreCosmicBodyAt(x, y);
        break;
        
      case 'scan':
        // In scan mode, analyze cosmic objects
        this.scanCosmicBodyAt(x, y);
        break;
    }
    
    // Check if we're clicking on mode buttons
    if (this.modeButtonsVisible) {
      const buttonSize = 40;
      const spacing = 10;
      const startY = 60;
      const startX = 20;
      
      const modes = ['create', 'gravity', 'channel', 'fusion', 'explore'];
      
      for (let i = 0; i < modes.length; i++) {
        const buttonY = startY + (buttonSize + spacing) * i;
        
        if (x >= startX && x <= startX + buttonSize && 
            y >= buttonY && y <= buttonY + buttonSize) {
          this.setActiveMode(modes[i]);
          return;
        }
      }
    }
    
    // Check if we're currently exploring a cosmic body
    const focusedObject = this.cosmicExplorer.getFocusedObject();
    if (focusedObject) {
      // Check if exit button was clicked (top-right corner)
      if (x >= this.width - 80 && x <= this.width - 10 && y >= 10 && y <= 40) {
        // Exit current cosmic body
        this.cosmicExplorer.exitCurrentBody();
        return;
      }
      
      // Check if we're clicking on an object inside the current cosmic body
      if (focusedObject.interior && focusedObject.interior.length > 0) {
        for (const interiorObject of focusedObject.interior) {
          if (distance(x, y, interiorObject.x, interiorObject.y) < interiorObject.size * 50) {
            if (interiorObject.isInteractable) {
              // Enter this cosmic body
              this.cosmicExplorer.enterCosmicBody(interiorObject);
              return;
            } else {
              // Just interact with it (regular plant behavior)
              interiorObject.grow(5);
              this.gameState.registerPlantGrowth();
              this.audioManager.playHit();
              return;
            }
          }
        }
      }
      return;
    }
    
    // Handle different interaction modes
    switch (this.activeMode) {
      case 'gravity':
        // Create a gravity well if we have enough energy
        if (this.gameState.useEnergy(25)) {
          this.createGravityWell(x, y);
          this.gameState.addScore(25);
        }
        break;
        
      case 'channel':
        // Start or end a particle stream
        if (this.dragStart === null) {
          this.dragStart = { x, y };
        } else {
          this.dragEnd = { x, y };
          // Create a particle stream between points
          if (this.gameState.useEnergy(35)) {
            this.createParticleStream(
              this.dragStart.x, this.dragStart.y, 
              this.dragEnd.x, this.dragEnd.y
            );
            this.gameState.addScore(40);
          }
          // Reset drag points
          this.dragStart = null;
          this.dragEnd = null;
        }
        break;
        
      case 'fusion':
        // Select particles for fusion
        const selectedParticle = this.findNearestParticle(x, y, 30);
        if (selectedParticle) {
          if (!this.selectedParticles.includes(selectedParticle)) {
            this.selectedParticles.push(selectedParticle);
            this.audioManager.playHit();
            
            // If we have enough particles, create fusion
            if (this.selectedParticles.length >= 3) {
              if (this.gameState.useEnergy(45)) {
                this.createFusionEvent(this.selectedParticles);
                this.gameState.addScore(75);
              }
              this.selectedParticles = [];
            }
          }
        }
        break;

      case 'explore':
        // Check if we're clicking on a cosmic body that we can enter
        for (const plant of this.plants) {
          if (distance(x, y, plant.x, plant.y) < plant.size * 50) {
            if (plant.isInteractable) {
              // Enter this cosmic body if it's interactable (galaxy, star, planet)
              this.cosmicExplorer.enterCosmicBody(plant);
              return;
            }
          }
        }
        break;
        
      case 'create':
      default:
        // Get the current universe phase to determine behavior
        const currentPhase = this.gameState.getCurrentPhase?.() || 0;
        
        // Different interaction behavior based on universe phase - scientifically accurate
        if (currentPhase <= 1) {
          // Quantum Void/Foam phase - Energy injection creates quantum fluctuations
          if (this.gameState.useEnergy(5)) {
            // Create vacuum energy fluctuation
            this.createWaveDisturbance(x, y, 40, 0.7);
            this.audioManager.playHit();
            
            // In early phases, clicking represents creating quantum fluctuations
            // These are probabilistic events that follow quantum field principles
            if (Math.random() < 0.7) { // Quantum probability
              // Create virtual particle-antiparticle pairs (scientifically accurate)
              const angle = Math.random() * Math.PI * 2;
              // Particle
              const particle1 = this.createParticle(x, y, angle);
              particle1.wavelength = 5 + Math.random() * 10;
              particle1.phase = 0;
              
              // Antiparticle (opposite phase/direction)
              const particle2 = this.createParticle(x, y, angle + Math.PI);
              particle2.wavelength = particle1.wavelength;
              particle2.phase = Math.PI;
              
              // These are entangled particles
              particle1.entangled = true;
              particle2.entangled = true;
              
              this.gameState.registerParticleCreated();
            }
          }
        } else if (currentPhase === 2) {
          // Big Bang phase - Massive energy release
          if (this.gameState.useEnergy(8)) {
            // Create a powerful disturbance with high energy (Big Bang)
            this.createWaveDisturbance(x, y, 70, 1.2);
            this.audioManager.playHit();
            
            // Create multiple high-energy particles expanding outward (cosmic inflation)
            const particleCount = 4 + Math.floor(Math.random() * 4);
            for (let i = 0; i < particleCount; i++) {
              const angle = (i / particleCount) * Math.PI * 2;
              const particle = this.createParticle(x, y, angle);
              particle.energy = 15 + Math.random() * 10;
            }
            
            this.gameState.registerParticleCreated();
            this.gameState.addScore(20);
          }
        } else {
          // Later universe phases - Normal particle creation
          if (this.gameState.useEnergy(10)) {
            this.createParticle(x, y);
            this.gameState.registerParticleCreated();
            this.audioManager.playHit();
            this.gameState.addScore(10);
          }
        }
        break;
    }
  }
  
  // Toggle entanglement of nearby particles
  private toggleEntanglement() {
    if (!this.gameState.useEnergy(20)) return;
    
    // Find close pairs of particles that can be entangled
    const maxEntanglements = 3;
    let entanglementCount = 0;
    
    // Group particles by proximity
    for (let i = 0; i < this.particles.length && entanglementCount < maxEntanglements; i++) {
      if (this.particles[i].entangled) continue;
      
      for (let j = i + 1; j < this.particles.length && entanglementCount < maxEntanglements; j++) {
        if (this.particles[j].entangled) continue;
        
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const dist = distance(p1.x, p1.y, p2.x, p2.y);
        
        // Only entangle particles that are relatively close
        if (dist < 100) {
          // Entangle these particles
          p1.entangled = true;
          p2.entangled = true;
          p1.entangledWith = p2;
          p2.entangledWith = p1;
          
          // Match wavelengths - quantum entangled particles share properties
          const sharedWavelength = (p1.wavelength + p2.wavelength) / 2;
          p1.wavelength = sharedWavelength;
          p2.wavelength = sharedWavelength;
          
          // Set opposite phases (180 degrees out of phase)
          p1.phase = 0;
          p2.phase = Math.PI;
          
          // Visual effect at entanglement locations
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          this.createWaveDisturbance(midX, midY, 5, 0.5);
          
          entanglementCount++;
        }
      }
    }
    
    if (entanglementCount > 0) {
      this.audioManager.playSuccess();
      
      // Add score and register entanglement with game state
      this.gameState.addScore(entanglementCount * 15);
      this.gameState.registerEntanglement?.(entanglementCount);
    }
  }
  
  // Collapse the wave function (quantum measurement)
  private collapseWaveFunction() {
    if (!this.gameState.useEnergy(30)) return;
    
    // This represents a quantum measurement, which collapses the wavefunctions
    // of all particles, potentially creating new plants from the collapse
    
    let plantsCreated = 0;
    let particlesRemoved = 0;
    
    // Process all particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Entangled particles have a higher chance of collapsing into something
      if (p.entangled && Math.random() < 0.4) {
        // Create wave collapse effect
        this.createWaveDisturbance(p.x, p.y, 15, 2.0);
        
        // 25% chance to create a plant from collapse
        if (Math.random() < 0.25) {
          this.createPlant(p.x, p.y, p.energy * 1.5);
          plantsCreated++;
        }
        
        // Remove the particle (it collapsed)
        this.particles.splice(i, 1);
        particlesRemoved++;
      }
      // Non-entangled particles have a lower chance
      else if (Math.random() < 0.1) {
        // Create wave collapse effect
        this.createWaveDisturbance(p.x, p.y, 15, 1.0);
        
        // 10% chance to create a plant from collapse
        if (Math.random() < 0.1) {
          this.createPlant(p.x, p.y, p.energy);
          plantsCreated++;
        }
        
        // Remove the particle (it collapsed)
        this.particles.splice(i, 1);
        particlesRemoved++;
      }
    }
    
    // For each plant, there's a small chance of growth from the collapse
    for (const plant of this.plants) {
      if (Math.random() < 0.2) {
        plant.grow(2.0);
        
        // Visual effect
        this.createWaveDisturbance(plant.x, plant.y, 30, 1.5);
      }
    }
    
    // Play collapse sound
    this.audioManager.playSuccess();
    
    // Add score based on results
    this.gameState.addScore(particlesRemoved * 5 + plantsCreated * 50);
  }
  
  // Increase energy in the quantum field
  private increaseFieldEnergy() {
    if (!this.gameState.useEnergy(40)) return;
    
    // Boost energy levels across the entire field
    for (let i = 0; i < this.fieldPotential.length; i++) {
      for (let j = 0; j < this.fieldPotential[i].length; j++) {
        this.fieldPotential[i][j] = Math.min(1.0, this.fieldPotential[i][j] + 0.2);
      }
    }
    
    // Boost particle energy
    for (const p of this.particles) {
      p.energy *= 1.5;
      p.lifespan *= 1.2;
      
      // Visual effect
      this.createWaveDisturbance(p.x, p.y, 10, 1.0);
    }
    
    // Chance to spawn new high-energy particles
    const newParticleCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < newParticleCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const p = this.createParticle(x, y);
      p.energy *= 2;
    }
    
    // Play energy boost sound
    this.audioManager.playSuccess();
    
    // Add score
    this.gameState.addScore(50);
  }
  
  // Reset the game
  public reset() {
    // Clear all game objects
    this.particles = [];
    this.plants = [];
    this.gravityWells = [];
    this.particleStreams = [];
    this.activeFusions = [];
    
    // Reset field
    this.initField();
    
    // Reset game state
    this.gameState.reset();
    
    // Play sound
    this.audioManager.playHit();
  }
  
  // Pause the game
  public pause() {
    this.isRunning = false;
  }
  
  // Resume the game
  public resume() {
    this.isRunning = true;
    this.lastTimestamp = performance.now();
  }
  
  // Toggle paused state
  public togglePause() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.lastTimestamp = performance.now();
    }
  }
  
  // Make functions accessible from outside
  public triggerEntanglement() {
    this.toggleEntanglement();
  }
  
  public triggerWaveCollapse() {
    this.collapseWaveFunction();
  }
  
  public triggerEnergyBoost() {
    this.increaseFieldEnergy();
  }
  
  public startRandomChallenge() {
    this.gameState.startRandomChallenge?.();
  }
  
  public takeScreenshot(): string {
    // Return canvas as data URL
    return this.canvas.toDataURL('image/png');
  }
  
  // Getters for UI access
  get getAllPhases() {
    return this.gameState.getAllPhases;
  }
  
  get getCosmicElements() {
    return this.gameState.getCosmicElements;
  }
  
  // Resize the canvas and update internal dimensions
  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Regenerate the field with new dimensions if needed
    if (this.fieldPotential.length === 0) {
      this.fieldPotential = generatePerlinNoise(
        Math.ceil(width / 10),
        Math.ceil(height / 10),
        0.1
      );
    } else if (this.fieldPotential[0].length !== Math.ceil(width / 10) ||
      this.fieldPotential.length !== Math.ceil(height / 10)) {
      // Only regenerate if dimensions changed significantly
      this.fieldPotential = generatePerlinNoise(
        Math.ceil(width / 10),
        Math.ceil(height / 10),
        0.1
      );
    }
    
    // Update renderer dimensions
    if (this.renderer) {
      // Direct property update instead of method call
      this.renderer.width = width;
      this.renderer.height = height;
    }
  }
  
  // Stop and clean up
  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove event listeners
    this.inputHandler.destroy();
  }
}
