/**
 * AtmosphericEntry - Realistic atmospheric entry effects and physics
 * Simulates the dramatic experience of entering planetary atmospheres
 */

import { Plant } from './Plant';

export interface EntryEffect {
  type: 'heat_buildup' | 'plasma_trail' | 'sonic_boom' | 'turbulence' | 'pressure_wave' | 'ionization';
  intensity: number;
  duration: number;
  color: string;
  particles: EntryParticle[];
}

export interface EntryParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  temperature: number;
}

export interface EntryData {
  velocity: number;
  angle: number;
  altitude: number;
  heatShield: number;
  structuralIntegrity: number;
  temperature: number;
  gForces: number;
  entryPhase: EntryPhase;
  effects: EntryEffect[];
}

export enum EntryPhase {
  APPROACH = 'Atmospheric Approach',
  INTERFACE = 'Atmosphere Interface',
  HEATING = 'Maximum Heating',
  DECELERATION = 'Rapid Deceleration',
  STABILIZATION = 'Flight Stabilization',
  DESCENT = 'Controlled Descent'
}

export class AtmosphericEntry {
  private entryData: EntryData | null = null;
  private isActive: boolean = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private effectParticles: EntryParticle[] = [];
  private shakeIntensity: number = 0;
  
  private onEntryPhaseChange: ((phase: EntryPhase) => void) | null = null;
  private onEntryComplete: (() => void) | null = null;
  private onCriticalHeat: (() => void) | null = null;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  
  /**
   * Begin atmospheric entry sequence
   */
  beginEntry(target: Plant, entryVelocity: number, entryAngle: number): void {
    this.isActive = true;
    
    // Calculate entry parameters based on target atmosphere
    const atmosphere = target.cosmicProperties?.atmosphere || 0.1;
    const mass = target.cosmicProperties?.mass || 1.0;
    
    this.entryData = {
      velocity: entryVelocity,
      angle: entryAngle,
      altitude: 100000, // Start at 100km altitude
      heatShield: 100,
      structuralIntegrity: 100,
      temperature: 300, // Starting at room temperature
      gForces: 0,
      entryPhase: EntryPhase.APPROACH,
      effects: []
    };
    
    this.generateInitialEffects(atmosphere, mass);
  }
  
  /**
   * Update atmospheric entry simulation
   */
  update(deltaTime: number): void {
    if (!this.isActive || !this.entryData) return;
    
    this.updateEntryPhysics(deltaTime);
    this.updateEffects(deltaTime);
    this.updateParticles(deltaTime);
    this.checkEntryPhase();
    this.updateCameraShake(deltaTime);
  }
  
  /**
   * Update entry physics and environmental conditions
   */
  private updateEntryPhysics(deltaTime: number): void {
    if (!this.entryData) return;
    
    const dt = deltaTime / 1000; // Convert to seconds
    
    // Altitude decrease based on velocity and angle
    this.entryData.altitude -= this.entryData.velocity * Math.sin(this.entryData.angle) * dt;
    
    // Calculate atmospheric density (exponential decay with altitude)
    const atmosphericDensity = Math.exp(-this.entryData.altitude / 8500); // Scale height ~8.5km
    
    // Drag force increases with atmospheric density
    const dragCoefficient = 0.5;
    const dragForce = 0.5 * atmosphericDensity * this.entryData.velocity * this.entryData.velocity * dragCoefficient;
    
    // Deceleration due to drag
    const deceleration = dragForce / 1000; // Simplified mass
    this.entryData.velocity = Math.max(0, this.entryData.velocity - deceleration * dt);
    
    // Calculate G-forces
    this.entryData.gForces = deceleration / 9.81;
    
    // Heat buildup from atmospheric friction
    const heatRate = dragForce * this.entryData.velocity * 0.001;
    this.entryData.temperature += heatRate * dt;
    
    // Heat shield degradation
    if (this.entryData.temperature > 1500) {
      this.entryData.heatShield -= (this.entryData.temperature - 1500) * 0.01 * dt;
    }
    
    // Structural integrity under extreme conditions
    if (this.entryData.gForces > 20 || this.entryData.temperature > 2000) {
      this.entryData.structuralIntegrity -= Math.max(this.entryData.gForces - 20, this.entryData.temperature - 2000) * 0.005 * dt;
    }
    
    // Clamp values
    this.entryData.heatShield = Math.max(0, this.entryData.heatShield);
    this.entryData.structuralIntegrity = Math.max(0, this.entryData.structuralIntegrity);
    
    // Update shake intensity based on conditions
    this.shakeIntensity = Math.min(20, this.entryData.gForces * 2 + (this.entryData.temperature - 1000) * 0.01);
  }
  
  /**
   * Check and update entry phase
   */
  private checkEntryPhase(): void {
    if (!this.entryData) return;
    
    const previousPhase = this.entryData.entryPhase;
    
    if (this.entryData.altitude > 80000) {
      this.entryData.entryPhase = EntryPhase.APPROACH;
    } else if (this.entryData.altitude > 60000) {
      this.entryData.entryPhase = EntryPhase.INTERFACE;
    } else if (this.entryData.temperature > 1500) {
      this.entryData.entryPhase = EntryPhase.HEATING;
    } else if (this.entryData.gForces > 10) {
      this.entryData.entryPhase = EntryPhase.DECELERATION;
    } else if (this.entryData.velocity > 1000) {
      this.entryData.entryPhase = EntryPhase.STABILIZATION;
    } else {
      this.entryData.entryPhase = EntryPhase.DESCENT;
    }
    
    if (previousPhase !== this.entryData.entryPhase && this.onEntryPhaseChange) {
      this.onEntryPhaseChange(this.entryData.entryPhase);
    }
    
    // Check for critical conditions
    if (this.entryData.temperature > 2500 && this.onCriticalHeat) {
      this.onCriticalHeat();
    }
    
    // Check for entry completion
    if (this.entryData.altitude <= 1000 && this.entryData.velocity < 500) {
      this.completeEntry();
    }
  }
  
  /**
   * Generate visual effects based on entry conditions
   */
  private generateInitialEffects(atmosphere: number, mass: number): void {
    if (!this.entryData) return;
    
    // Plasma trail effect
    this.entryData.effects.push({
      type: 'plasma_trail',
      intensity: atmosphere * 0.8,
      duration: 5000,
      color: '#FF6600',
      particles: []
    });
    
    // Heat buildup effect
    this.entryData.effects.push({
      type: 'heat_buildup',
      intensity: 0.5,
      duration: 8000,
      color: '#FF0000',
      particles: []
    });
    
    // Pressure wave effect for dense atmospheres
    if (atmosphere > 0.5) {
      this.entryData.effects.push({
        type: 'pressure_wave',
        intensity: atmosphere,
        duration: 3000,
        color: '#00AAFF',
        particles: []
      });
    }
  }
  
  /**
   * Update visual effects
   */
  private updateEffects(deltaTime: number): void {
    if (!this.entryData) return;
    
    for (const effect of this.entryData.effects) {
      effect.duration -= deltaTime;
      
      // Generate new particles for active effects
      if (effect.duration > 0) {
        this.generateEffectParticles(effect);
      }
    }
    
    // Remove expired effects
    this.entryData.effects = this.entryData.effects.filter(effect => effect.duration > 0);
    
    // Add dynamic effects based on current conditions
    this.addDynamicEffects();
  }
  
  /**
   * Generate particles for specific effects
   */
  private generateEffectParticles(effect: EntryEffect): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    for (let i = 0; i < effect.intensity * 3; i++) {
      let particle: EntryParticle;
      
      switch (effect.type) {
        case 'plasma_trail':
          particle = {
            x: centerX + (Math.random() - 0.5) * 100,
            y: centerY + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 200,
            vy: Math.random() * 300 + 100,
            life: 2000,
            maxLife: 2000,
            size: Math.random() * 8 + 4,
            color: effect.color,
            alpha: 0.8,
            temperature: 3000 + Math.random() * 2000
          };
          break;
          
        case 'heat_buildup':
          particle = {
            x: centerX + (Math.random() - 0.5) * 50,
            y: centerY + (Math.random() - 0.5) * 50,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            life: 1500,
            maxLife: 1500,
            size: Math.random() * 12 + 6,
            color: this.getHeatColor(this.entryData?.temperature || 1000),
            alpha: 0.6,
            temperature: this.entryData?.temperature || 1000
          };
          break;
          
        case 'pressure_wave':
          particle = {
            x: centerX + (Math.random() - 0.5) * 200,
            y: centerY + (Math.random() - 0.5) * 200,
            vx: (Math.random() - 0.5) * 400,
            vy: (Math.random() - 0.5) * 400,
            life: 500,
            maxLife: 500,
            size: Math.random() * 6 + 3,
            color: effect.color,
            alpha: 0.4,
            temperature: 300
          };
          break;
          
        default:
          continue;
      }
      
      this.effectParticles.push(particle);
    }
  }
  
  /**
   * Add dynamic effects based on current entry conditions
   */
  private addDynamicEffects(): void {
    if (!this.entryData) return;
    
    // Sonic boom effect at high speeds
    if (this.entryData.velocity > 340 && Math.random() < 0.1) {
      this.entryData.effects.push({
        type: 'sonic_boom',
        intensity: 1.0,
        duration: 100,
        color: '#FFFFFF',
        particles: []
      });
    }
    
    // Ionization effects at extreme temperatures
    if (this.entryData.temperature > 2000 && Math.random() < 0.2) {
      this.entryData.effects.push({
        type: 'ionization',
        intensity: (this.entryData.temperature - 2000) / 1000,
        duration: 200,
        color: '#8800FF',
        particles: []
      });
    }
  }
  
  /**
   * Update particle physics
   */
  private updateParticles(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    for (let i = this.effectParticles.length - 1; i >= 0; i--) {
      const particle = this.effectParticles[i];
      
      // Update position
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      
      // Update life
      particle.life -= deltaTime;
      particle.alpha = particle.life / particle.maxLife;
      
      // Gravity and drag effects
      particle.vy += 98 * dt; // Gravity
      particle.vx *= 0.98; // Air resistance
      particle.vy *= 0.98;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.effectParticles.splice(i, 1);
      }
    }
  }
  
  /**
   * Update camera shake effects
   */
  private updateCameraShake(deltaTime: number): void {
    if (this.shakeIntensity > 0) {
      this.shakeIntensity = Math.max(0, this.shakeIntensity - deltaTime * 0.01);
    }
  }
  
  /**
   * Get heat-based color
   */
  private getHeatColor(temperature: number): string {
    if (temperature < 800) return '#FF4400';
    if (temperature < 1200) return '#FF6600';
    if (temperature < 1800) return '#FF8800';
    if (temperature < 2500) return '#FFAA00';
    return '#FFFFFF';
  }
  
  /**
   * Render atmospheric entry effects
   */
  render(): void {
    if (!this.isActive || !this.entryData) return;
    
    this.ctx.save();
    
    // Apply camera shake
    if (this.shakeIntensity > 0) {
      const shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.ctx.translate(shakeX, shakeY);
    }
    
    // Render atmospheric distortion
    this.renderAtmosphericDistortion();
    
    // Render particles
    this.renderParticles();
    
    // Render heat shield glow
    this.renderHeatShieldGlow();
    
    // Render entry HUD
    this.renderEntryHUD();
    
    this.ctx.restore();
  }
  
  /**
   * Render atmospheric distortion effects
   */
  private renderAtmosphericDistortion(): void {
    if (!this.entryData) return;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Create heat haze effect
    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, 50,
      centerX, centerY, 200
    );
    
    const alpha = Math.min(0.3, this.entryData.temperature / 5000);
    gradient.addColorStop(0, `rgba(255, 100, 0, ${alpha})`);
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Render effect particles
   */
  private renderParticles(): void {
    for (const particle of this.effectParticles) {
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
  
  /**
   * Render heat shield glow effect
   */
  private renderHeatShieldGlow(): void {
    if (!this.entryData || this.entryData.heatShield <= 0) return;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    const glowIntensity = Math.min(1, this.entryData.temperature / 2000);
    const glowRadius = 30 + glowIntensity * 50;
    
    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, 10,
      centerX, centerY, glowRadius
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, ${glowIntensity * 0.8})`);
    gradient.addColorStop(0.5, `rgba(255, 150, 0, ${glowIntensity * 0.4})`);
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Render entry telemetry HUD
   */
  private renderEntryHUD(): void {
    if (!this.entryData) return;
    
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 100, 200, 0.8)';
    this.ctx.fillRect(10, 10, 300, 180);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '14px Arial';
    
    let y = 30;
    this.ctx.fillText(`ENTRY PHASE: ${this.entryData.entryPhase}`, 20, y);
    y += 20;
    this.ctx.fillText(`Altitude: ${Math.round(this.entryData.altitude).toLocaleString()} m`, 20, y);
    y += 20;
    this.ctx.fillText(`Velocity: ${Math.round(this.entryData.velocity)} m/s`, 20, y);
    y += 20;
    this.ctx.fillText(`Temperature: ${Math.round(this.entryData.temperature)} K`, 20, y);
    y += 20;
    this.ctx.fillText(`G-Forces: ${this.entryData.gForces.toFixed(1)} g`, 20, y);
    y += 20;
    this.ctx.fillText(`Heat Shield: ${Math.round(this.entryData.heatShield)}%`, 20, y);
    y += 20;
    this.ctx.fillText(`Hull Integrity: ${Math.round(this.entryData.structuralIntegrity)}%`, 20, y);
    
    // Warning indicators
    if (this.entryData.temperature > 2000) {
      this.ctx.fillStyle = '#FF0000';
      this.ctx.fillText('⚠ CRITICAL HEAT', 200, 50);
    }
    
    if (this.entryData.gForces > 15) {
      this.ctx.fillStyle = '#FF0000';
      this.ctx.fillText('⚠ EXTREME G-FORCE', 200, 70);
    }
    
    this.ctx.restore();
  }
  
  /**
   * Complete atmospheric entry
   */
  private completeEntry(): void {
    this.isActive = false;
    this.effectParticles = [];
    this.shakeIntensity = 0;
    
    if (this.onEntryComplete) {
      this.onEntryComplete();
    }
  }
  
  /**
   * Set callback functions
   */
  setCallbacks(
    onPhaseChange: (phase: EntryPhase) => void,
    onComplete: () => void,
    onCriticalHeat: () => void
  ): void {
    this.onEntryPhaseChange = onPhaseChange;
    this.onEntryComplete = onComplete;
    this.onCriticalHeat = onCriticalHeat;
  }
  
  /**
   * Get current entry data
   */
  getEntryData(): EntryData | null {
    return this.entryData;
  }
  
  /**
   * Check if entry is active
   */
  isEntryActive(): boolean {
    return this.isActive;
  }
  
  /**
   * Emergency abort entry
   */
  abortEntry(): void {
    this.isActive = false;
    this.entryData = null;
    this.effectParticles = [];
    this.shakeIntensity = 0;
  }
}