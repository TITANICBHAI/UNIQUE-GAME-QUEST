/**
 * SpaceNavigator - Advanced space navigation and environmental monitoring
 * Integrates scanning, atmospheric entry, and scientific exploration
 */

import { Plant } from './Plant';
import { SpaceScanner, ScanResult } from './SpaceScanner';
import { AtmosphericEntry, EntryPhase } from './AtmosphericEntry';

export interface NavigationTarget {
  object: Plant;
  scanResult?: ScanResult;
  distance: number;
  approachVector: { x: number; y: number };
  estimatedTravelTime: number;
  missionType: MissionType;
}

export interface SpaceEnvironment {
  radiation: number;
  cosmicRays: number;
  solarWind: number;
  magneticField: number;
  gravity: number;
  temperature: number;
  debris: DebrisField[];
}

export interface DebrisField {
  x: number;
  y: number;
  density: number;
  velocity: { x: number; y: number };
  size: number;
  composition: string;
  threat: number;
}

export enum MissionType {
  EXPLORATION = 'Scientific Exploration',
  SURVEY = 'Resource Survey',
  ATMOSPHERIC_STUDY = 'Atmospheric Analysis',
  LIFE_SEARCH = 'Search for Life',
  MINERAL_EXTRACTION = 'Mining Operation',
  GRAVITATIONAL_STUDY = 'Gravitational Research'
}

export class SpaceNavigator {
  private scanner: SpaceScanner;
  private atmosphericEntry: AtmosphericEntry;
  private currentPosition: { x: number; y: number };
  private velocity: { x: number; y: number };
  private targets: NavigationTarget[] = [];
  private environment: SpaceEnvironment;
  private isInSpace: boolean = true;
  
  private onTargetReached: ((target: NavigationTarget) => void) | null = null;
  private onEnvironmentChange: ((env: SpaceEnvironment) => void) | null = null;
  private onHazardDetected: ((hazard: string) => void) | null = null;
  
  constructor(canvas: HTMLCanvasElement) {
    this.scanner = new SpaceScanner();
    this.atmosphericEntry = new AtmosphericEntry(canvas);
    this.currentPosition = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    
    this.environment = {
      radiation: 0.1,
      cosmicRays: 0.05,
      solarWind: 0.3,
      magneticField: 0.0,
      gravity: 0.0,
      temperature: 2.7, // Cosmic microwave background
      debris: []
    };
    
    this.setupCallbacks();
  }
  
  private setupCallbacks(): void {
    this.scanner.setCallbacks(
      (result) => this.handleScanComplete(result),
      (progress, target) => this.handleScanProgress(progress, target)
    );
    
    this.atmosphericEntry.setCallbacks(
      (phase) => this.handleEntryPhaseChange(phase),
      () => this.handleEntryComplete(),
      () => this.handleCriticalHeat()
    );
  }
  
  /**
   * Update navigation system
   */
  update(deltaTime: number, cosmicBodies: Plant[]): void {
    this.updatePosition(deltaTime);
    this.updateEnvironment(cosmicBodies);
    this.scanner.updateScan(deltaTime);
    this.atmosphericEntry.update(deltaTime);
    this.updateDebrisFields(deltaTime);
    this.checkHazards();
    this.updateTargets(cosmicBodies);
  }
  
  /**
   * Update spacecraft position
   */
  private updatePosition(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    this.currentPosition.x += this.velocity.x * dt;
    this.currentPosition.y += this.velocity.y * dt;
    
    // Apply environmental effects to velocity
    if (this.environment.gravity > 0) {
      // Simplified gravitational effects
      const gravityEffect = this.environment.gravity * dt;
      this.velocity.y += gravityEffect;
    }
    
    // Solar wind resistance in space
    if (this.isInSpace) {
      const resistance = 0.99; // Slight deceleration
      this.velocity.x *= resistance;
      this.velocity.y *= resistance;
    }
  }
  
  /**
   * Update space environment based on nearby cosmic bodies
   */
  private updateEnvironment(cosmicBodies: Plant[]): void {
    const prevEnv = { ...this.environment };
    
    // Reset environment to space defaults
    this.environment.radiation = 0.1;
    this.environment.cosmicRays = 0.05;
    this.environment.solarWind = 0.3;
    this.environment.magneticField = 0.0;
    this.environment.gravity = 0.0;
    this.environment.temperature = 2.7;
    
    // Calculate environmental effects from nearby objects
    for (const body of cosmicBodies) {
      const distance = Math.sqrt(
        Math.pow(body.x - this.currentPosition.x, 2) + 
        Math.pow(body.y - this.currentPosition.y, 2)
      );
      
      if (distance < 1000) { // Within influence range
        this.applyBodyEffects(body, distance);
      }
    }
    
    // Generate debris fields near large objects
    this.updateDebrisGeneration(cosmicBodies);
    
    // Notify if environment changed significantly
    if (this.hasSignificantChange(prevEnv, this.environment) && this.onEnvironmentChange) {
      this.onEnvironmentChange(this.environment);
    }
  }
  
  /**
   * Apply environmental effects from a cosmic body
   */
  private applyBodyEffects(body: Plant, distance: number): void {
    const influence = Math.max(0, 1 - distance / 1000);
    
    switch (body.type) {
      case 'star':
        this.environment.radiation += influence * 2.0;
        this.environment.solarWind += influence * 1.5;
        this.environment.temperature += influence * 5000;
        this.environment.magneticField += influence * 0.5;
        break;
        
      case 'planet':
        const mass = body.cosmicProperties?.mass || 1.0;
        this.environment.gravity += influence * mass * 0.1;
        
        if (body.cosmicProperties?.magneticField) {
          this.environment.magneticField += influence * body.cosmicProperties.magneticField;
        }
        
        if (body.cosmicProperties?.atmosphere && body.cosmicProperties.atmosphere > 0.1) {
          // Reduce cosmic rays and radiation near planets with atmospheres
          this.environment.cosmicRays *= (1 - influence * body.cosmicProperties.atmosphere);
          this.environment.radiation *= (1 - influence * 0.3);
        }
        break;
        
      case 'blackhole':
        this.environment.gravity += influence * 10.0;
        this.environment.radiation += influence * 5.0;
        this.environment.temperature += influence * 1000;
        break;
        
      case 'nebula':
        this.environment.radiation += influence * 0.5;
        this.environment.cosmicRays += influence * 0.2;
        this.environment.debris.push({
          x: body.x + (Math.random() - 0.5) * 200,
          y: body.y + (Math.random() - 0.5) * 200,
          density: influence * 0.3,
          velocity: { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 },
          size: Math.random() * 5 + 2,
          composition: 'cosmic_dust',
          threat: 0.1
        });
        break;
    }
  }
  
  /**
   * Generate debris fields near cosmic bodies
   */
  private updateDebrisGeneration(cosmicBodies: Plant[]): void {
    // Clear old debris
    this.environment.debris = this.environment.debris.filter(debris => 
      Math.random() > 0.01 // 1% chance to disappear each frame
    );
    
    // Generate new debris near asteroid belts and damaged planets
    for (const body of cosmicBodies) {
      if (body.type === 'asteroid' && Math.random() < 0.05) {
        this.environment.debris.push({
          x: body.x + (Math.random() - 0.5) * 100,
          y: body.y + (Math.random() - 0.5) * 100,
          density: 0.5 + Math.random() * 0.5,
          velocity: { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20 },
          size: Math.random() * 8 + 3,
          composition: 'rock_metal',
          threat: 0.3 + Math.random() * 0.4
        });
      }
    }
  }
  
  /**
   * Update debris field movement
   */
  private updateDebrisFields(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    for (const debris of this.environment.debris) {
      debris.x += debris.velocity.x * dt;
      debris.y += debris.velocity.y * dt;
      
      // Apply gravitational effects
      debris.velocity.y += this.environment.gravity * dt * 0.1;
    }
  }
  
  /**
   * Check for environmental hazards
   */
  private checkHazards(): void {
    const hazards: string[] = [];
    
    if (this.environment.radiation > 2.0) {
      hazards.push('High radiation levels detected');
    }
    
    if (this.environment.gravity > 5.0) {
      hazards.push('Extreme gravitational forces');
    }
    
    if (this.environment.temperature > 1000) {
      hazards.push('Dangerous thermal conditions');
    }
    
    if (this.environment.debris.length > 10) {
      hazards.push('Dense debris field ahead');
    }
    
    // Check debris collision risks
    for (const debris of this.environment.debris) {
      const distance = Math.sqrt(
        Math.pow(debris.x - this.currentPosition.x, 2) + 
        Math.pow(debris.y - this.currentPosition.y, 2)
      );
      
      if (distance < 50 && debris.threat > 0.5) {
        hazards.push(`Collision risk: ${debris.composition}`);
        break;
      }
    }
    
    if (hazards.length > 0 && this.onHazardDetected) {
      this.onHazardDetected(hazards.join('; '));
    }
  }
  
  /**
   * Update navigation targets
   */
  private updateTargets(cosmicBodies: Plant[]): void {
    for (const target of this.targets) {
      target.distance = Math.sqrt(
        Math.pow(target.object.x - this.currentPosition.x, 2) + 
        Math.pow(target.object.y - this.currentPosition.y, 2)
      );
      
      // Check if target reached
      if (target.distance < 100 && this.onTargetReached) {
        this.onTargetReached(target);
      }
    }
  }
  
  /**
   * Set navigation target
   */
  setTarget(object: Plant, missionType: MissionType): void {
    const distance = Math.sqrt(
      Math.pow(object.x - this.currentPosition.x, 2) + 
      Math.pow(object.y - this.currentPosition.y, 2)
    );
    
    const target: NavigationTarget = {
      object,
      distance,
      approachVector: {
        x: object.x - this.currentPosition.x,
        y: object.y - this.currentPosition.y
      },
      estimatedTravelTime: distance / 100, // Simplified calculation
      missionType
    };
    
    this.targets.push(target);
  }
  
  /**
   * Begin scanning target
   */
  scanTarget(target: Plant): boolean {
    return this.scanner.startScan(target, this.currentPosition.x, this.currentPosition.y);
  }
  
  /**
   * Initiate atmospheric entry
   */
  beginAtmosphericEntry(target: Plant, velocity: number, angle: number): void {
    this.isInSpace = false;
    this.atmosphericEntry.beginEntry(target, velocity, angle);
  }
  
  /**
   * Get optimal mission type for a cosmic body
   */
  getOptimalMission(object: Plant): MissionType {
    switch (object.type) {
      case 'planet':
        if (object.habitability > 0.5) return MissionType.LIFE_SEARCH;
        if (object.cosmicProperties?.atmosphere) return MissionType.ATMOSPHERIC_STUDY;
        return MissionType.SURVEY;
        
      case 'star':
        return MissionType.EXPLORATION;
        
      case 'asteroid':
        return MissionType.MINERAL_EXTRACTION;
        
      case 'blackhole':
        return MissionType.GRAVITATIONAL_STUDY;
        
      default:
        return MissionType.EXPLORATION;
    }
  }
  
  /**
   * Render navigation overlay
   */
  renderNavigationOverlay(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.save();
    
    // Render environment status
    this.renderEnvironmentStatus(ctx);
    
    // Render targets
    this.renderTargets(ctx, canvas);
    
    // Render debris fields
    this.renderDebrisFields(ctx);
    
    // Render scan range
    this.renderScanRange(ctx, canvas);
    
    ctx.restore();
    
    // Render atmospheric entry effects if active
    if (this.atmosphericEntry.isEntryActive()) {
      this.atmosphericEntry.render();
    }
  }
  
  /**
   * Render environment status panel
   */
  private renderEnvironmentStatus(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0, 50, 100, 0.8)';
    ctx.fillRect(10, 200, 280, 140);
    
    ctx.fillStyle = '#00FFFF';
    ctx.font = '12px Arial';
    
    let y = 220;
    ctx.fillText('ENVIRONMENTAL STATUS', 20, y);
    y += 18;
    ctx.fillText(`Radiation: ${this.environment.radiation.toFixed(2)} units`, 20, y);
    y += 15;
    ctx.fillText(`Cosmic Rays: ${this.environment.cosmicRays.toFixed(2)} units`, 20, y);
    y += 15;
    ctx.fillText(`Solar Wind: ${this.environment.solarWind.toFixed(2)} units`, 20, y);
    y += 15;
    ctx.fillText(`Gravity: ${this.environment.gravity.toFixed(2)} g`, 20, y);
    y += 15;
    ctx.fillText(`Magnetic Field: ${this.environment.magneticField.toFixed(2)} T`, 20, y);
    y += 15;
    ctx.fillText(`Temperature: ${this.environment.temperature.toFixed(1)} K`, 20, y);
    y += 15;
    ctx.fillText(`Debris Objects: ${this.environment.debris.length}`, 20, y);
  }
  
  /**
   * Render navigation targets
   */
  private renderTargets(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    for (const target of this.targets) {
      const screenX = canvas.width / 2 + (target.object.x - this.currentPosition.x) * 0.1;
      const screenY = canvas.height / 2 + (target.object.y - this.currentPosition.y) * 0.1;
      
      // Draw target indicator
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screenX, screenY, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw mission type
      ctx.fillStyle = '#00FF00';
      ctx.font = '10px Arial';
      ctx.fillText(target.missionType, screenX + 25, screenY);
    }
  }
  
  /**
   * Render debris fields
   */
  private renderDebrisFields(ctx: CanvasRenderingContext2D): void {
    for (const debris of this.environment.debris) {
      const alpha = Math.min(1, debris.threat);
      ctx.fillStyle = `rgba(255, 165, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(debris.x, debris.y, debris.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  /**
   * Render scanner range
   */
  private renderScanRange(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const range = this.scanner.getScanRange() * 0.1; // Scale for display
    
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, range, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  /**
   * Handle scan completion
   */
  private handleScanComplete(result: ScanResult): void {
    console.log('Scan completed:', result);
    
    // Update target with scan result
    const target = this.targets.find(t => 
      t.object.x === result.distance // Simplified matching
    );
    
    if (target) {
      target.scanResult = result;
    }
  }
  
  /**
   * Handle scan progress
   */
  private handleScanProgress(progress: number, target: string): void {
    console.log(`Scanning ${target}: ${Math.round(progress * 100)}%`);
  }
  
  /**
   * Handle atmospheric entry phase changes
   */
  private handleEntryPhaseChange(phase: EntryPhase): void {
    console.log('Entry phase:', phase);
  }
  
  /**
   * Handle atmospheric entry completion
   */
  private handleEntryComplete(): void {
    this.isInSpace = false;
    console.log('Atmospheric entry completed');
  }
  
  /**
   * Handle critical heat warning
   */
  private handleCriticalHeat(): void {
    if (this.onHazardDetected) {
      this.onHazardDetected('CRITICAL: Heat shield failure imminent');
    }
  }
  
  /**
   * Check if environment has changed significantly
   */
  private hasSignificantChange(prev: SpaceEnvironment, current: SpaceEnvironment): boolean {
    return (
      Math.abs(prev.radiation - current.radiation) > 0.5 ||
      Math.abs(prev.gravity - current.gravity) > 1.0 ||
      Math.abs(prev.temperature - current.temperature) > 100
    );
  }
  
  /**
   * Set callback functions
   */
  setCallbacks(
    onTargetReached: (target: NavigationTarget) => void,
    onEnvironmentChange: (env: SpaceEnvironment) => void,
    onHazardDetected: (hazard: string) => void
  ): void {
    this.onTargetReached = onTargetReached;
    this.onEnvironmentChange = onEnvironmentChange;
    this.onHazardDetected = onHazardDetected;
  }
  
  /**
   * Get current environment
   */
  getEnvironment(): SpaceEnvironment {
    return this.environment;
  }
  
  /**
   * Get navigation targets
   */
  getTargets(): NavigationTarget[] {
    return this.targets;
  }
  
  /**
   * Clear all targets
   */
  clearTargets(): void {
    this.targets = [];
  }
}