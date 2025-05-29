/**
 * UltraRealisticStarRenderer - Advanced star surface visualization
 * Creates cinema-quality stellar phenomena and surface details
 */

export interface StellarSurface {
  starType: string;
  temperature: number; // Kelvin
  luminosity: number;
  mass: number; // Solar masses
  age: number; // Billion years
  surfaceFeatures: StellarFeature[];
  magneticField: number;
  rotationRate: number; // Days
  stellarWinds: StellarWind[];
  coronalMass: CoronalMassEjection[];
}

export interface StellarFeature {
  type: 'sunspot' | 'prominence' | 'solar_flare' | 'granulation' | 'coronal_hole' | 'magnetic_loop';
  x: number;
  y: number;
  size: number;
  intensity: number;
  temperature: number;
  magneticStrength: number;
  lifespan: number; // Hours
  age: number; // Current age in hours
  color: string;
  emissionLines: string[];
  activity: number; // 0-1
}

export interface StellarWind {
  velocity: number; // km/s
  density: number;
  temperature: number;
  composition: string[];
  direction: { x: number; y: number };
  strength: number;
}

export interface CoronalMassEjection {
  x: number;
  y: number;
  velocity: number;
  mass: number;
  magneticField: number;
  particles: CMEParticle[];
  shockWave: boolean;
}

export interface CMEParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  type: 'proton' | 'electron' | 'helium' | 'heavy_ion';
  charge: number;
}

export class UltraRealisticStarRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrame: number = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  
  /**
   * Generate realistic stellar surface based on star parameters
   */
  generateStellarSurface(starType: string, temperature: number, mass: number, age: number): StellarSurface {
    const surface: StellarSurface = {
      starType,
      temperature,
      luminosity: this.calculateLuminosity(mass, temperature),
      mass,
      age,
      surfaceFeatures: [],
      magneticField: this.calculateMagneticField(mass, age),
      rotationRate: this.calculateRotationRate(mass, age),
      stellarWinds: [],
      coronalMass: []
    };
    
    // Generate surface features based on star type
    this.generateSurfaceFeatures(surface);
    this.generateStellarWinds(surface);
    this.generateCoronalMassEjections(surface);
    
    return surface;
  }
  
  /**
   * Render ultra-realistic star surface with advanced effects
   */
  renderStellarSurface(surface: StellarSurface, time: number): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    
    // Clear canvas with space background
    this.renderSpaceBackground();
    
    // Render stellar corona
    this.renderCorona(centerX, centerY, radius * 1.5, surface);
    
    // Render main stellar body
    this.renderStellarBody(centerX, centerY, radius, surface);
    
    // Render surface granulation
    this.renderGranulation(centerX, centerY, radius, surface);
    
    // Render surface features
    this.renderSurfaceFeatures(centerX, centerY, radius, surface, time);
    
    // Render magnetic field lines
    this.renderMagneticFieldLines(centerX, centerY, radius, surface);
    
    // Render stellar winds
    this.renderStellarWinds(centerX, centerY, radius, surface, time);
    
    // Render coronal mass ejections
    this.renderCoronalMassEjections(centerX, centerY, radius, surface, time);
    
    // Render chromosphere effects
    this.renderChromosphere(centerX, centerY, radius * 1.1, surface);
    
    // Render prominence arcs
    this.renderProminences(centerX, centerY, radius, surface, time);
    
    // Update animation frame
    this.animationFrame++;
  }
  
  /**
   * Render deep space background
   */
  private renderSpaceBackground(): void {
    // Deep space gradient
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height)
    );
    
    gradient.addColorStop(0, '#000011');
    gradient.addColorStop(0.5, '#000008');
    gradient.addColorStop(1, '#000000');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add distant stars
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const brightness = Math.random() * 0.8 + 0.2;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  /**
   * Render main stellar body with realistic coloring
   */
  private renderStellarBody(centerX: number, centerY: number, radius: number, surface: StellarSurface): void {
    const color = this.getStarColor(surface.temperature);
    
    // Create radial gradient for stellar body
    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    // Core temperature (brighter)
    gradient.addColorStop(0, this.adjustBrightness(color, 1.5));
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(0.7, this.adjustBrightness(color, 0.8));
    gradient.addColorStop(1, this.adjustBrightness(color, 0.4));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add stellar glow
    this.renderStellarGlow(centerX, centerY, radius, surface);
  }
  
  /**
   * Render stellar corona
   */
  private renderCorona(centerX: number, centerY: number, radius: number, surface: StellarSurface): void {
    const coronaGradient = this.ctx.createRadialGradient(
      centerX, centerY, radius * 0.8,
      centerX, centerY, radius
    );
    
    const coronaColor = surface.temperature > 10000 ? '#AAAAFF' : 
                       surface.temperature > 6000 ? '#FFAAAA' : '#FFDDAA';
    
    coronaGradient.addColorStop(0, `${coronaColor}40`);
    coronaGradient.addColorStop(0.5, `${coronaColor}20`);
    coronaGradient.addColorStop(1, `${coronaColor}00`);
    
    this.ctx.fillStyle = coronaGradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Render surface granulation (convection cells)
   */
  private renderGranulation(centerX: number, centerY: number, radius: number, surface: StellarSurface): void {
    const granuleCount = Math.floor(radius / 5); // Density based on size
    
    for (let i = 0; i < granuleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius * 0.9;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const granuleSize = 2 + Math.random() * 4;
      const brightness = 0.3 + Math.random() * 0.4;
      
      const granuleGradient = this.ctx.createRadialGradient(x, y, 0, x, y, granuleSize);
      granuleGradient.addColorStop(0, `rgba(255, 255, 200, ${brightness})`);
      granuleGradient.addColorStop(1, `rgba(255, 200, 150, 0)`);
      
      this.ctx.fillStyle = granuleGradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, granuleSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  /**
   * Render surface features (sunspots, flares, etc.)
   */
  private renderSurfaceFeatures(centerX: number, centerY: number, radius: number, surface: StellarSurface, time: number): void {
    for (const feature of surface.surfaceFeatures) {
      const angle = (feature.x / 360) * Math.PI * 2;
      const distance = (feature.y / 90) * radius * 0.8;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      switch (feature.type) {
        case 'sunspot':
          this.renderSunspot(x, y, feature.size, feature.intensity);
          break;
          
        case 'solar_flare':
          this.renderSolarFlare(x, y, feature.size, feature.intensity, time);
          break;
          
        case 'prominence':
          this.renderProminence(x, y, feature.size, feature.intensity, time);
          break;
          
        case 'coronal_hole':
          this.renderCoronalHole(x, y, feature.size);
          break;
          
        case 'magnetic_loop':
          this.renderMagneticLoop(x, y, feature.size, feature.magneticStrength);
          break;
      }
    }
  }
  
  /**
   * Render sunspot
   */
  private renderSunspot(x: number, y: number, size: number, intensity: number): void {
    const spotGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    spotGradient.addColorStop(0, `rgba(50, 20, 10, ${intensity})`);
    spotGradient.addColorStop(0.6, `rgba(100, 50, 30, ${intensity * 0.7})`);
    spotGradient.addColorStop(1, `rgba(150, 100, 70, ${intensity * 0.3})`);
    
    this.ctx.fillStyle = spotGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Render solar flare with dynamic animation
   */
  private renderSolarFlare(x: number, y: number, size: number, intensity: number, time: number): void {
    const flareIntensity = intensity * (0.5 + 0.5 * Math.sin(time * 0.1));
    
    const flareGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    flareGradient.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity})`);
    flareGradient.addColorStop(0.3, `rgba(255, 200, 100, ${flareIntensity * 0.8})`);
    flareGradient.addColorStop(0.7, `rgba(255, 100, 50, ${flareIntensity * 0.4})`);
    flareGradient.addColorStop(1, `rgba(255, 50, 0, 0)`);
    
    this.ctx.fillStyle = flareGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add flare spikes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const spikeLength = size * (1 + flareIntensity);
      
      this.ctx.strokeStyle = `rgba(255, 255, 200, ${flareIntensity * 0.6})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(
        x + Math.cos(angle) * spikeLength,
        y + Math.sin(angle) * spikeLength
      );
      this.ctx.stroke();
    }
  }
  
  /**
   * Render prominence arc
   */
  private renderProminence(x: number, y: number, size: number, intensity: number, time: number): void {
    const arcHeight = size * 2;
    const waveOffset = Math.sin(time * 0.05) * 5;
    
    this.ctx.strokeStyle = `rgba(255, 150, 100, ${intensity * 0.8})`;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    
    // Create curved prominence arc
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const arcX = x + (t - 0.5) * size * 2;
      const arcY = y - Math.sin(t * Math.PI) * arcHeight + waveOffset * Math.sin(t * Math.PI * 3);
      
      if (i === 0) {
        this.ctx.moveTo(arcX, arcY);
      } else {
        this.ctx.lineTo(arcX, arcY);
      }
    }
    
    this.ctx.stroke();
    
    // Add glow effect
    this.ctx.shadowColor = '#FF9966';
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }
  
  /**
   * Render coronal hole
   */
  private renderCoronalHole(x: number, y: number, size: number): void {
    const holeGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    holeGradient.addColorStop(0, 'rgba(0, 0, 50, 0.8)');
    holeGradient.addColorStop(0.7, 'rgba(0, 0, 30, 0.4)');
    holeGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = holeGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Render magnetic field loop
   */
  private renderMagneticLoop(x: number, y: number, size: number, strength: number): void {
    this.ctx.strokeStyle = `rgba(100, 200, 255, ${strength * 0.6})`;
    this.ctx.lineWidth = 2;
    
    // Draw magnetic field lines as curved loops
    for (let i = 0; i < 3; i++) {
      const offset = (i - 1) * 5;
      this.ctx.beginPath();
      this.ctx.arc(x + offset, y, size, 0, Math.PI);
      this.ctx.stroke();
    }
  }
  
  /**
   * Render magnetic field lines around the star
   */
  private renderMagneticFieldLines(centerX: number, centerY: number, radius: number, surface: StellarSurface): void {
    if (surface.magneticField < 0.3) return;
    
    this.ctx.strokeStyle = `rgba(0, 150, 255, ${surface.magneticField * 0.3})`;
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const startRadius = radius * 1.1;
      const endRadius = radius * 1.8;
      
      // Create curved magnetic field lines
      this.ctx.beginPath();
      for (let r = startRadius; r <= endRadius; r += 5) {
        const fieldAngle = angle + Math.sin(r / 20) * 0.3;
        const x = centerX + Math.cos(fieldAngle) * r;
        const y = centerY + Math.sin(fieldAngle) * r;
        
        if (r === startRadius) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
  }
  
  /**
   * Render stellar winds
   */
  private renderStellarWinds(centerX: number, centerY: number, radius: number, surface: StellarSurface, time: number): void {
    for (const wind of surface.stellarWinds) {
      const particleCount = Math.floor(wind.strength * 50);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = radius * 1.2 + (time * wind.velocity * 0.1) % (radius * 3);
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const alpha = Math.max(0, 1 - (distance - radius * 1.2) / (radius * 2));
        
        this.ctx.fillStyle = `rgba(255, 200, 150, ${alpha * wind.strength * 0.5})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
  
  /**
   * Render coronal mass ejections
   */
  private renderCoronalMassEjections(centerX: number, centerY: number, radius: number, surface: StellarSurface, time: number): void {
    for (const cme of surface.coronalMass) {
      const x = centerX + cme.x;
      const y = centerY + cme.y;
      
      // Render CME particles
      for (const particle of cme.particles) {
        const particleX = x + particle.x + particle.vx * time * 0.1;
        const particleY = y + particle.y + particle.vy * time * 0.1;
        
        const alpha = Math.max(0, 1 - Math.sqrt(particle.x * particle.x + particle.y * particle.y) / (radius * 2));
        
        this.ctx.fillStyle = `rgba(255, 100, 100, ${alpha * particle.energy})`;
        this.ctx.beginPath();
        this.ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Render shock wave if present
      if (cme.shockWave) {
        const shockRadius = (time * cme.velocity * 0.05) % (radius * 4);
        
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * Math.max(0, 1 - shockRadius / (radius * 4))})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, shockRadius, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }
  }
  
  /**
   * Render chromosphere layer
   */
  private renderChromosphere(centerX: number, centerY: number, radius: number, surface: StellarSurface): void {
    const chromosphereGradient = this.ctx.createRadialGradient(
      centerX, centerY, radius * 0.95,
      centerX, centerY, radius
    );
    
    const chromoColor = surface.temperature > 8000 ? '#FF6666' : '#FF9999';
    
    chromosphereGradient.addColorStop(0, `${chromoColor}30`);
    chromosphereGradient.addColorStop(1, `${chromoColor}00`);
    
    this.ctx.fillStyle = chromosphereGradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Render prominence arcs around star limb
   */
  private renderProminences(centerX: number, centerY: number, radius: number, surface: StellarSurface, time: number): void {
    const prominenceCount = Math.floor(surface.magneticField * 8);
    
    for (let i = 0; i < prominenceCount; i++) {
      const angle = (i / prominenceCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const height = 20 + Math.sin(time * 0.02 + i) * 30;
      const endX = centerX + Math.cos(angle) * (radius + height);
      const endY = centerY + Math.sin(angle) * (radius + height);
      
      this.ctx.strokeStyle = `rgba(255, 150, 100, 0.7)`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.quadraticCurveTo(
        x + Math.cos(angle + Math.PI/2) * 15,
        y + Math.sin(angle + Math.PI/2) * 15,
        endX, endY
      );
      this.ctx.stroke();
    }
  }
  
  /**
   * Render stellar glow effect
   */
  private renderStellarGlow(centerX: number, centerY: number, radius: number, surface: StellarSurface): void {
    const glowRadius = radius * 2;
    const glowGradient = this.ctx.createRadialGradient(
      centerX, centerY, radius,
      centerX, centerY, glowRadius
    );
    
    const starColor = this.getStarColor(surface.temperature);
    
    glowGradient.addColorStop(0, `${starColor}60`);
    glowGradient.addColorStop(0.5, `${starColor}20`);
    glowGradient.addColorStop(1, `${starColor}00`);
    
    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Generate surface features based on star parameters
   */
  private generateSurfaceFeatures(surface: StellarSurface): void {
    const featureCount = Math.floor(surface.mass * 10 + surface.magneticField * 20);
    
    for (let i = 0; i < featureCount; i++) {
      const feature: StellarFeature = {
        type: this.selectFeatureType(surface),
        x: Math.random() * 360,
        y: (Math.random() - 0.5) * 180,
        size: 5 + Math.random() * 20,
        intensity: Math.random(),
        temperature: surface.temperature * (0.8 + Math.random() * 0.4),
        magneticStrength: Math.random() * surface.magneticField,
        lifespan: 1 + Math.random() * 24, // 1-24 hours
        age: 0,
        color: this.getStarColor(surface.temperature),
        emissionLines: this.getEmissionLines(surface.temperature),
        activity: Math.random()
      };
      
      surface.surfaceFeatures.push(feature);
    }
  }
  
  /**
   * Select appropriate feature type for star
   */
  private selectFeatureType(surface: StellarSurface): StellarFeature['type'] {
    const types: StellarFeature['type'][] = ['granulation'];
    
    if (surface.magneticField > 0.5) {
      types.push('sunspot', 'magnetic_loop');
    }
    
    if (surface.temperature > 6000) {
      types.push('solar_flare', 'prominence');
    }
    
    if (surface.age < 1) {
      types.push('coronal_hole');
    }
    
    return types[Math.floor(Math.random() * types.length)];
  }
  
  /**
   * Generate stellar winds
   */
  private generateStellarWinds(surface: StellarSurface): void {
    const windCount = Math.floor(surface.luminosity * 3);
    
    for (let i = 0; i < windCount; i++) {
      const wind: StellarWind = {
        velocity: 200 + Math.random() * 800, // 200-1000 km/s
        density: Math.random() * surface.mass,
        temperature: surface.temperature * 0.1,
        composition: ['Hydrogen', 'Helium', 'Heavy ions'],
        direction: {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1
        },
        strength: Math.random() * surface.luminosity
      };
      
      surface.stellarWinds.push(wind);
    }
  }
  
  /**
   * Generate coronal mass ejections
   */
  private generateCoronalMassEjections(surface: StellarSurface): void {
    if (surface.magneticField < 0.3) return;
    
    const cmeCount = Math.floor(surface.magneticField * 3);
    
    for (let i = 0; i < cmeCount; i++) {
      const particles: CMEParticle[] = [];
      const particleCount = Math.floor(Math.random() * 100 + 50);
      
      for (let j = 0; j < particleCount; j++) {
        particles.push({
          x: (Math.random() - 0.5) * 50,
          y: (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          energy: Math.random(),
          type: ['proton', 'electron', 'helium', 'heavy_ion'][Math.floor(Math.random() * 4)] as CMEParticle['type'],
          charge: Math.random() * 2 - 1
        });
      }
      
      const cme: CoronalMassEjection = {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        velocity: 300 + Math.random() * 1200, // 300-1500 km/s
        mass: Math.random() * 1e15, // kg
        magneticField: Math.random() * surface.magneticField,
        particles,
        shockWave: Math.random() > 0.5
      };
      
      surface.coronalMass.push(cme);
    }
  }
  
  /**
   * Calculate luminosity based on mass and temperature
   */
  private calculateLuminosity(mass: number, temperature: number): number {
    // Simplified Stefan-Boltzmann law
    return mass * Math.pow(temperature / 5778, 4);
  }
  
  /**
   * Calculate magnetic field strength
   */
  private calculateMagneticField(mass: number, age: number): number {
    // Younger, more massive stars have stronger magnetic fields
    return (mass * 2) * Math.exp(-age / 5); // Decay over 5 billion years
  }
  
  /**
   * Calculate rotation rate
   */
  private calculateRotationRate(mass: number, age: number): number {
    // Magnetic braking slows rotation with age
    const initialRotation = mass > 1.5 ? 1 : 25; // Days
    return initialRotation * Math.pow(age + 0.1, 0.5);
  }
  
  /**
   * Get realistic star color based on temperature
   */
  private getStarColor(temperature: number): string {
    if (temperature > 30000) return '#9BB0FF'; // O-type: Blue
    if (temperature > 10000) return '#AABFFF'; // B-type: Blue-white
    if (temperature > 7500) return '#CAD7FF';  // A-type: White
    if (temperature > 6000) return '#F8F7FF';  // F-type: Yellow-white
    if (temperature > 5200) return '#FFF4EA';  // G-type: Yellow (Sun-like)
    if (temperature > 3700) return '#FFD2A1';  // K-type: Orange
    return '#FFAD51'; // M-type: Red
  }
  
  /**
   * Get emission lines for spectral analysis
   */
  private getEmissionLines(temperature: number): string[] {
    const lines: string[] = ['Hydrogen', 'Helium'];
    
    if (temperature > 10000) lines.push('Ionized Helium', 'Nitrogen');
    if (temperature > 7500) lines.push('Metal lines', 'Calcium');
    if (temperature < 5000) lines.push('Molecular bands', 'TiO');
    
    return lines;
  }
  
  /**
   * Adjust color brightness
   */
  private adjustBrightness(color: string, factor: number): string {
    // Simple brightness adjustment for hex colors
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
    
    return `rgb(${r}, ${g}, ${b})`;
  }
}