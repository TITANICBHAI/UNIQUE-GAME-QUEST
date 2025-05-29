/**
 * SkillBasedControlSystem - Precision-based cosmic manipulation
 * Replaces clicking with skilled timing, positioning, and cosmic understanding
 */

export interface SkillChallenge {
  type: 'precision_timing' | 'orbital_mechanics' | 'resonance_tuning' | 'gravitational_assist' | 'quantum_calibration';
  difficulty: number; // 1-10
  timeWindow: number; // milliseconds
  tolerance: number; // precision required (0-1)
  cosmicContext: string;
  physicsReasoning: string;
}

export interface ControlInput {
  type: 'mouse_position' | 'timing' | 'sequence' | 'trajectory' | 'harmonic_frequency';
  value: number | { x: number; y: number } | number[];
  timestamp: number;
  precision: number; // How close to perfect
}

export interface SkillResult {
  success: boolean;
  precision: number; // 0-1 (1 = perfect)
  efficiency: number; // Resource multiplier based on skill
  masteryGained: number;
  unlockProgress: number;
}

export class SkillBasedControlSystem {
  private canvas: HTMLCanvasElement;
  private activeChallenge: SkillChallenge | null = null;
  private inputHistory: ControlInput[] = [];
  private masteryLevels: Map<string, number> = new Map();
  private skillMultipliers: Map<string, number> = new Map();
  
  // Precision tracking
  private currentTarget: { x: number; y: number; radius: number } | null = null;
  private timingWindow: { start: number; end: number; optimal: number } | null = null;
  private resonanceFrequency: number = 0;
  private gravitationalField: { x: number; y: number; strength: number }[] = [];
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initializeMasteryLevels();
    this.setupEventListeners();
  }
  
  /**
   * Initialize mastery levels for different cosmic skills
   */
  private initializeMasteryLevels(): void {
    const skills = [
      'stellar_ignition', 'orbital_insertion', 'gravitational_slingshot',
      'quantum_entanglement', 'wormhole_stabilization', 'dark_matter_sculpting',
      'cosmic_string_manipulation', 'neutron_star_engineering', 'black_hole_feeding',
      'galactic_collision_timing', 'supernova_triggering', 'vacuum_decay_control'
    ];
    
    skills.forEach(skill => {
      this.masteryLevels.set(skill, 0);
      this.skillMultipliers.set(skill, 1.0);
    });
  }
  
  /**
   * Setup precision input event listeners
   */
  private setupEventListeners(): void {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handlePrecisionClick.bind(this));
    document.addEventListener('keydown', this.handleKeyTiming.bind(this));
    document.addEventListener('keyup', this.handleKeyRelease.bind(this));
  }
  
  /**
   * Initiate a skill-based cosmic manipulation challenge
   */
  initiateCosmicManipulation(action: string, target: any): SkillChallenge {
    const challenge = this.generateSkillChallenge(action, target);
    this.activeChallenge = challenge;
    this.setupChallengeInterface(challenge);
    return challenge;
  }
  
  /**
   * Generate appropriate skill challenge for cosmic action
   */
  private generateSkillChallenge(action: string, target: any): SkillChallenge {
    const challenges: { [key: string]: SkillChallenge } = {
      'ignite_star': {
        type: 'precision_timing',
        difficulty: 7,
        timeWindow: 2000,
        tolerance: 0.1,
        cosmicContext: 'Nuclear fusion ignition requires precise gravitational collapse timing',
        physicsReasoning: 'Core temperature must reach 10 million K at exact moment when density peaks'
      },
      
      'create_stable_orbit': {
        type: 'orbital_mechanics',
        difficulty: 6,
        timeWindow: 3000,
        tolerance: 0.05,
        cosmicContext: 'Kepler\'s laws govern orbital stability - velocity must match orbital radius',
        physicsReasoning: 'v = √(GM/r) - orbital velocity precisely balances gravitational force'
      },
      
      'gravitational_assist': {
        type: 'gravitational_assist',
        difficulty: 8,
        timeWindow: 1500,
        tolerance: 0.08,
        cosmicContext: 'Slingshot trajectory requires exact approach vector and timing',
        physicsReasoning: 'Conservation of energy and momentum during close planetary encounter'
      },
      
      'quantum_entangle_particles': {
        type: 'quantum_calibration',
        difficulty: 9,
        timeWindow: 500,
        tolerance: 0.02,
        cosmicContext: 'Quantum entanglement requires phase coherence and isolation from decoherence',
        physicsReasoning: 'Bell state preparation needs precise electromagnetic field timing'
      },
      
      'stabilize_wormhole': {
        type: 'resonance_tuning',
        difficulty: 10,
        timeWindow: 1000,
        tolerance: 0.01,
        cosmicContext: 'Wormhole stability requires exotic matter with negative energy density',
        physicsReasoning: 'Einstein-Rosen bridge needs precise spacetime curvature balance'
      },
      
      'galactic_collision_redirect': {
        type: 'gravitational_assist',
        difficulty: 10,
        timeWindow: 5000,
        tolerance: 0.001,
        cosmicContext: 'Redirect galaxy collision using dark matter density waves',
        physicsReasoning: 'N-body gravitational dynamics over cosmic timescales'
      }
    };
    
    return challenges[action] || challenges['ignite_star'];
  }
  
  /**
   * Setup visual interface for skill challenge
   */
  private setupChallengeInterface(challenge: SkillChallenge): void {
    switch (challenge.type) {
      case 'precision_timing':
        this.setupTimingChallenge(challenge);
        break;
      case 'orbital_mechanics':
        this.setupOrbitalChallenge(challenge);
        break;
      case 'gravitational_assist':
        this.setupGravitationalChallenge(challenge);
        break;
      case 'quantum_calibration':
        this.setupQuantumChallenge(challenge);
        break;
      case 'resonance_tuning':
        this.setupResonanceChallenge(challenge);
        break;
    }
  }
  
  /**
   * Setup precision timing challenge (like stellar ignition)
   */
  private setupTimingChallenge(challenge: SkillChallenge): void {
    const now = Date.now();
    const randomDelay = Math.random() * challenge.timeWindow * 0.8;
    
    this.timingWindow = {
      start: now + randomDelay,
      end: now + randomDelay + (challenge.timeWindow * challenge.tolerance),
      optimal: now + randomDelay + (challenge.timeWindow * challenge.tolerance * 0.5)
    };
  }
  
  /**
   * Setup orbital mechanics challenge
   */
  private setupOrbitalChallenge(challenge: SkillChallenge): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const orbitRadius = 150;
    
    // Calculate required orbital velocity for stable orbit
    const gravitationalParameter = 1000; // Simplified GM
    const requiredVelocity = Math.sqrt(gravitationalParameter / orbitRadius);
    
    this.currentTarget = {
      x: centerX + orbitRadius,
      y: centerY,
      radius: challenge.tolerance * 50
    };
    
    // Player must click at precise velocity vector direction
  }
  
  /**
   * Setup gravitational assist challenge
   */
  private setupGravitationalChallenge(challenge: SkillChallenge): void {
    // Create gravitational field from massive object
    this.gravitationalField = [
      { x: this.canvas.width * 0.3, y: this.canvas.height / 2, strength: 1000 },
      { x: this.canvas.width * 0.7, y: this.canvas.height / 2, strength: 800 }
    ];
    
    // Player must trace optimal trajectory
    this.currentTarget = {
      x: this.canvas.width * 0.9,
      y: this.canvas.height * 0.2,
      radius: challenge.tolerance * 100
    };
  }
  
  /**
   * Setup quantum calibration challenge
   */
  private setupQuantumChallenge(challenge: SkillChallenge): void {
    // Quantum state requires precise phase alignment
    this.resonanceFrequency = 440 + Math.random() * 200; // Hz
    
    // Player must maintain mouse position in resonance zone
    this.currentTarget = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: challenge.tolerance * 30
    };
  }
  
  /**
   * Setup resonance tuning challenge
   */
  private setupResonanceChallenge(challenge: SkillChallenge): void {
    // Wormhole stability requires harmonic frequency matching
    const targetFrequencies = [440, 880, 1320]; // Harmonic series
    this.resonanceFrequency = targetFrequencies[Math.floor(Math.random() * targetFrequencies.length)];
  }
  
  /**
   * Handle precision mouse movement
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.activeChallenge) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const input: ControlInput = {
      type: 'mouse_position',
      value: { x: mouseX, y: mouseY },
      timestamp: Date.now(),
      precision: this.calculatePositionPrecision(mouseX, mouseY)
    };
    
    this.inputHistory.push(input);
    this.updateChallengeState(input);
  }
  
  /**
   * Handle precision click timing
   */
  private handlePrecisionClick(event: MouseEvent): void {
    if (!this.activeChallenge) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const timestamp = Date.now();
    
    let precision = 0;
    
    switch (this.activeChallenge.type) {
      case 'precision_timing':
        precision = this.calculateTimingPrecision(timestamp);
        break;
      case 'orbital_mechanics':
        precision = this.calculateOrbitalPrecision(clickX, clickY);
        break;
      case 'gravitational_assist':
        precision = this.calculateTrajectoryPrecision(clickX, clickY);
        break;
      case 'quantum_calibration':
        precision = this.calculateQuantumPrecision(clickX, clickY);
        break;
    }
    
    const result = this.evaluateSkillResult(precision);
    this.completeChallenge(result);
  }
  
  /**
   * Handle keyboard timing for complex sequences
   */
  private handleKeyTiming(event: KeyboardEvent): void {
    if (!this.activeChallenge) return;
    
    const timestamp = Date.now();
    let precision = 0;
    
    switch (event.code) {
      case 'Space':
        precision = this.calculateTimingPrecision(timestamp);
        break;
      case 'Enter':
        if (this.activeChallenge.type === 'resonance_tuning') {
          precision = this.calculateResonancePrecision();
        }
        break;
    }
    
    if (precision > 0) {
      const input: ControlInput = {
        type: 'timing',
        value: timestamp,
        timestamp,
        precision
      };
      
      this.inputHistory.push(input);
      
      if (precision > this.activeChallenge.tolerance) {
        const result = this.evaluateSkillResult(precision);
        this.completeChallenge(result);
      }
    }
  }
  
  private handleKeyRelease(event: KeyboardEvent): void {
    // Handle sustained input challenges
  }
  
  /**
   * Calculate position precision relative to target
   */
  private calculatePositionPrecision(x: number, y: number): number {
    if (!this.currentTarget) return 0;
    
    const distance = Math.sqrt(
      Math.pow(x - this.currentTarget.x, 2) + 
      Math.pow(y - this.currentTarget.y, 2)
    );
    
    const precision = Math.max(0, 1 - (distance / this.currentTarget.radius));
    return precision;
  }
  
  /**
   * Calculate timing precision for time-critical actions
   */
  private calculateTimingPrecision(timestamp: number): number {
    if (!this.timingWindow) return 0;
    
    if (timestamp < this.timingWindow.start || timestamp > this.timingWindow.end) {
      return 0; // Outside timing window
    }
    
    // Perfect timing at optimal point
    const distanceFromOptimal = Math.abs(timestamp - this.timingWindow.optimal);
    const windowSize = this.timingWindow.end - this.timingWindow.start;
    
    const precision = Math.max(0, 1 - (distanceFromOptimal / (windowSize * 0.5)));
    return precision;
  }
  
  /**
   * Calculate orbital mechanics precision
   */
  private calculateOrbitalPrecision(x: number, y: number): number {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Check if click is at correct orbital distance
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const targetDistance = 150; // Target orbital radius
    
    const distanceError = Math.abs(distance - targetDistance) / targetDistance;
    const precision = Math.max(0, 1 - distanceError * 10);
    
    return precision;
  }
  
  /**
   * Calculate gravitational assist trajectory precision
   */
  private calculateTrajectoryPrecision(x: number, y: number): number {
    if (!this.currentTarget) return 0;
    
    // Calculate if trajectory passes through gravitational assist points
    let trajectoryBonus = 0;
    
    for (const field of this.gravitationalField) {
      const fieldDistance = Math.sqrt(
        Math.pow(x - field.x, 2) + Math.pow(y - field.y, 2)
      );
      
      // Bonus for passing near massive objects for gravitational assist
      if (fieldDistance < 50) {
        trajectoryBonus += 0.3;
      }
    }
    
    const targetPrecision = this.calculatePositionPrecision(x, y);
    return Math.min(1, targetPrecision + trajectoryBonus);
  }
  
  /**
   * Calculate quantum calibration precision
   */
  private calculateQuantumPrecision(x: number, y: number): number {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Quantum state requires sustained precision in center
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = 30;
    
    const precision = Math.max(0, 1 - (distance / maxDistance));
    
    // Additional phase coherence requirement
    const phase = (Date.now() % 1000) / 1000; // 0-1
    const phaseAlignment = 1 - Math.abs(phase - 0.5) * 2; // Peak at 0.5
    
    return precision * phaseAlignment;
  }
  
  /**
   * Calculate resonance frequency precision
   */
  private calculateResonancePrecision(): number {
    // In real implementation, this would use audio input or timing patterns
    // For now, use timing precision
    const currentTime = Date.now();
    const lastInput = this.inputHistory[this.inputHistory.length - 1];
    
    if (!lastInput) return 0;
    
    const interval = currentTime - lastInput.timestamp;
    const targetInterval = 1000 / this.resonanceFrequency; // Period in ms
    
    const timingError = Math.abs(interval - targetInterval) / targetInterval;
    return Math.max(0, 1 - timingError * 5);
  }
  
  /**
   * Evaluate overall skill result
   */
  private evaluateSkillResult(precision: number): SkillResult {
    if (!this.activeChallenge) {
      return { success: false, precision: 0, efficiency: 0, masteryGained: 0, unlockProgress: 0 };
    }
    
    const success = precision >= this.activeChallenge.tolerance;
    const difficulty = this.activeChallenge.difficulty;
    
    // Efficiency multiplier based on precision and difficulty
    const efficiency = success ? (1 + precision * difficulty * 0.2) : (precision * 0.3);
    
    // Mastery gained based on difficulty and performance
    const masteryGained = success ? (difficulty * precision * 10) : (difficulty * precision * 2);
    
    // Unlock progress for advanced techniques
    const unlockProgress = (precision * difficulty * 5);
    
    return {
      success,
      precision,
      efficiency,
      masteryGained,
      unlockProgress
    };
  }
  
  /**
   * Complete the skill challenge and apply results
   */
  private completeChallenge(result: SkillResult): void {
    if (!this.activeChallenge) return;
    
    // Update mastery levels
    const skillType = this.getChallengeSkillType(this.activeChallenge);
    const currentMastery = this.masteryLevels.get(skillType) || 0;
    this.masteryLevels.set(skillType, currentMastery + result.masteryGained);
    
    // Update skill multipliers
    const newMastery = this.masteryLevels.get(skillType) || 0;
    const multiplier = 1 + (newMastery / 1000); // 0.1% per mastery point
    this.skillMultipliers.set(skillType, multiplier);
    
    // Clear active challenge
    this.activeChallenge = null;
    this.currentTarget = null;
    this.timingWindow = null;
    this.gravitationalField = [];
    
    // Return result to game system
    this.onChallengeComplete?.(result);
  }
  
  /**
   * Update challenge state based on input
   */
  private updateChallengeState(input: ControlInput): void {
    if (!this.activeChallenge) return;
    
    // For sustained precision challenges like quantum calibration
    if (this.activeChallenge.type === 'quantum_calibration') {
      if (input.precision > this.activeChallenge.tolerance) {
        // Maintain precision for required duration
        const sustainedInputs = this.inputHistory
          .filter(i => i.timestamp > Date.now() - 1000)
          .filter(i => i.precision > this.activeChallenge!.tolerance);
        
        if (sustainedInputs.length > 10) {
          const avgPrecision = sustainedInputs.reduce((sum, i) => sum + i.precision, 0) / sustainedInputs.length;
          const result = this.evaluateSkillResult(avgPrecision);
          this.completeChallenge(result);
        }
      }
    }
  }
  
  /**
   * Get skill type for challenge
   */
  private getChallengeSkillType(challenge: SkillChallenge): string {
    const typeMapping: { [key: string]: string } = {
      'precision_timing': 'stellar_ignition',
      'orbital_mechanics': 'orbital_insertion',
      'gravitational_assist': 'gravitational_slingshot',
      'quantum_calibration': 'quantum_entanglement',
      'resonance_tuning': 'wormhole_stabilization'
    };
    
    return typeMapping[challenge.type] || 'stellar_ignition';
  }
  
  /**
   * Render skill challenge interface
   */
  renderChallengeInterface(ctx: CanvasRenderingContext2D): void {
    if (!this.activeChallenge) return;
    
    switch (this.activeChallenge.type) {
      case 'precision_timing':
        this.renderTimingInterface(ctx);
        break;
      case 'orbital_mechanics':
        this.renderOrbitalInterface(ctx);
        break;
      case 'gravitational_assist':
        this.renderGravitationalInterface(ctx);
        break;
      case 'quantum_calibration':
        this.renderQuantumInterface(ctx);
        break;
      case 'resonance_tuning':
        this.renderResonanceInterface(ctx);
        break;
    }
    
    // Render challenge info
    this.renderChallengeInfo(ctx);
  }
  
  private renderTimingInterface(ctx: CanvasRenderingContext2D): void {
    if (!this.timingWindow) return;
    
    const now = Date.now();
    const progress = (now - this.timingWindow.start) / (this.timingWindow.end - this.timingWindow.start);
    
    // Timing bar
    const barWidth = 400;
    const barHeight = 20;
    const barX = (this.canvas.width - barWidth) / 2;
    const barY = this.canvas.height - 100;
    
    // Background
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Optimal zone
    const optimalStart = 0.4;
    const optimalEnd = 0.6;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(barX + barWidth * optimalStart, barY, barWidth * (optimalEnd - optimalStart), barHeight);
    
    // Current position
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(barX + barWidth * Math.min(1, Math.max(0, progress)) - 2, barY - 5, 4, barHeight + 10);
    
    // Instructions
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE at the optimal moment!', this.canvas.width / 2, barY - 20);
  }
  
  private renderOrbitalInterface(ctx: CanvasRenderingContext2D): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const orbitRadius = 150;
    
    // Draw central mass
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw target orbit
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw target zone
    if (this.currentTarget) {
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.currentTarget.x, this.currentTarget.y, this.currentTarget.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Instructions
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click to set orbital velocity vector', this.canvas.width / 2, 50);
  }
  
  private renderGravitationalInterface(ctx: CanvasRenderingContext2D): void {
    // Draw gravitational fields
    for (const field of this.gravitationalField) {
      const gradient = ctx.createRadialGradient(field.x, field.y, 0, field.x, field.y, 100);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(field.x, field.y, 100, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw field center
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(field.x, field.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw target
    if (this.currentTarget) {
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.currentTarget.x, this.currentTarget.y, this.currentTarget.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Instructions
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Use gravitational assist to reach target', this.canvas.width / 2, 50);
  }
  
  private renderQuantumInterface(ctx: CanvasRenderingContext2D): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Quantum field visualization
    const time = Date.now() * 0.01;
    
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 50 + Math.sin(time + i * 0.1) * 20;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(time + i * 0.2) * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Central target
    if (this.currentTarget) {
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.currentTarget.x, this.currentTarget.y, this.currentTarget.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Instructions
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Maintain quantum coherence in center zone', this.canvas.width / 2, 50);
  }
  
  private renderResonanceInterface(ctx: CanvasRenderingContext2D): void {
    // Frequency visualization
    const time = Date.now() * 0.001;
    const amplitude = 50;
    const centerY = this.canvas.height / 2;
    
    ctx.strokeStyle = '#FF00FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < this.canvas.width; x += 2) {
      const frequency = this.resonanceFrequency * 0.01;
      const y = centerY + Math.sin((x + time * 100) * frequency) * amplitude;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Instructions
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Match resonance frequency: ${this.resonanceFrequency.toFixed(1)} Hz`, this.canvas.width / 2, 50);
    ctx.fillText('Press ENTER in rhythm', this.canvas.width / 2, 80);
  }
  
  private renderChallengeInfo(ctx: CanvasRenderingContext2D): void {
    if (!this.activeChallenge) return;
    
    // Challenge context
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 400, 100);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(this.activeChallenge.cosmicContext, 20, 30);
    ctx.fillText(this.activeChallenge.physicsReasoning, 20, 50);
    
    // Difficulty indicator
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Difficulty: ${this.activeChallenge.difficulty}/10`, 20, 80);
    
    // Tolerance indicator
    const tolerancePercent = (this.activeChallenge.tolerance * 100).toFixed(1);
    ctx.fillText(`Precision Required: ${tolerancePercent}%`, 20, 100);
  }
  
  // Public interface
  onChallengeComplete?: (result: SkillResult) => void;
  
  getMasteryLevel(skill: string): number {
    return this.masteryLevels.get(skill) || 0;
  }
  
  getSkillMultiplier(skill: string): number {
    return this.skillMultipliers.get(skill) || 1.0;
  }
  
  isActive(): boolean {
    return this.activeChallenge !== null;
  }
}