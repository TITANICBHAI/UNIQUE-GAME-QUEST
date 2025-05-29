import { Particle } from './Particle';
import { Plant, CosmicBodyType } from './Plant';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private width: number;
  private height: number;
  private universePhase: number = 0;
  private starField: {x: number, y: number, size: number, brightness: number}[] = [];
  private galaxies: {x: number, y: number, size: number, rotation: number, type: string}[] = [];
  private cosmicDust: {x: number, y: number, size: number, color: string}[] = [];
  private focusedObject: Plant | null = null; // Currently focused object (entered)
  private hoverPlant: Plant | null = null; // Plant currently hovered over
  private zoomLevel: number = 1.0; // Zoom level for camera
  private viewOffsetX: number = 0; // Camera X offset
  private viewOffsetY: number = 0; // Camera Y offset
  
  // Flag to indicate if we need to render interior elements
  private renderingInterior: boolean = false;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
    this.width = canvas.width;
    this.height = canvas.height;
  }
  
  setUniversePhase(phase: number) {
    this.universePhase = phase;
  }
  
  setFocusedObject(object: Plant | null) {
    this.focusedObject = object;
  }
  
  setHoverPlant(plant: Plant | null) {
    this.hoverPlant = plant;
  }
  
  getZoomLevel(): number {
    return this.zoomLevel;
  }
  
  setZoomLevel(zoom: number) {
    this.zoomLevel = Math.max(0.5, Math.min(2.0, zoom));
  }
  
  setViewOffset(x: number, y: number) {
    this.viewOffsetX = x;
    this.viewOffsetY = y;
  }
  
  getViewOffset(): {x: number, y: number} {
    return {x: this.viewOffsetX, y: this.viewOffsetY};
  }
  
  isExploring(): boolean {
    return this.focusedObject !== null;
  }
  
  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw background
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw appropriate background based on universe phase
    this.renderBackground();
  }
  
  getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }
  
  isInFocusedMode(): boolean {
    return this.focusedObject !== null;
  }
  
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Regenerate background elements with new dimensions
    this.initializeBackground();
  }
  
  private initializeBackground() {
    // Create star field for background
    this.starField = [];
    const starCount = this.width * this.height / 2000;
    for (let i = 0; i < starCount; i++) {
      this.starField.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.7
      });
    }
    
    // Create galaxy backgrounds for later phases
    this.galaxies = [];
    if (this.universePhase >= 6) {
      const galaxyCount = Math.min(5, Math.floor(this.width * this.height / 200000));
      for (let i = 0; i < galaxyCount; i++) {
        this.galaxies.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: 50 + Math.random() * 100,
          rotation: Math.random() * Math.PI * 2,
          type: Math.random() < 0.7 ? 'spiral' : 'elliptical'
        });
      }
    }
    
    // Create cosmic dust for nebula phases
    this.cosmicDust = [];
    if (this.universePhase >= 4) {
      const dustCount = Math.floor(this.width * this.height / 10000);
      for (let i = 0; i < dustCount; i++) {
        this.cosmicDust.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: 1 + Math.random() * 3,
          color: `hsl(${Math.random() * 60 + 220}, 50%, 50%)`
        });
      }
    }
  }
  
  // Check if a point is inside the exit button area when exploring
  isInsideExitButton(x: number, y: number): boolean {
    if (!this.focusedObject) return false;
    
    // Exit button in top-right corner
    return x >= this.width - 80 && x <= this.width - 10 && y >= 10 && y <= 40;
  }
  
  // Get the world position from screen position considering zoom and offset
  getWorldPosition(screenX: number, screenY: number): {x: number, y: number} {
    return {
      x: (screenX - this.width / 2) / this.zoomLevel + this.viewOffsetX,
      y: (screenY - this.height / 2) / this.zoomLevel + this.viewOffsetY
    };
  }
  
  // Draw background based on universe phase
  renderBackground() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    
    // If we're in exploration mode, render the cosmic body interior instead
    if (this.focusedObject) {
      this.renderInteriorBackground(this.focusedObject);
      return;
    }
    
    // Default dark space background
    ctx.fillStyle = '#000005';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Render starfield with different intensity based on phase
    let starAlpha = 0.5;
    if (this.universePhase < 2) {
      starAlpha = 0; // No stars in pre-big bang phases
    } else if (this.universePhase === 2) {
      starAlpha = 0.1; // Few early stars in big bang phase
    }
    
    // Apply star field only after certain phases
    if (this.universePhase >= 2) {
      // Draw distant stars
      for (const star of this.starField) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * starAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Cosmic dust clouds appear later
    if (this.universePhase >= 3) {
      // Draw cosmic dust clouds
      for (const dust of this.cosmicDust) {
        ctx.fillStyle = dust.color;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Distant galaxies appear even later
    if (this.universePhase >= 5) {
      // Draw distant galaxies
      for (const galaxy of this.galaxies) {
        // Draw based on galaxy type
        if (galaxy.type === 'spiral') {
          // Spiral galaxy
          ctx.save();
          ctx.translate(galaxy.x, galaxy.y);
          ctx.rotate(galaxy.rotation);
          
          // Draw spiral arms
          for (let arm = 0; arm < 2; arm++) {
            ctx.save();
            ctx.rotate(arm * Math.PI);
            
            ctx.strokeStyle = 'rgba(200, 200, 255, 0.1)';
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let r = 0; r < galaxy.size; r += 2) {
              const angle = r * 0.1;
              const x = r * Math.cos(angle);
              const y = r * Math.sin(angle);
              ctx.lineTo(x, y);
            }
            ctx.stroke();
            
            ctx.restore();
          }
          
          // Galaxy core
          ctx.fillStyle = 'rgba(255, 255, 200, 0.2)';
          ctx.beginPath();
          ctx.arc(0, 0, galaxy.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        } else if (galaxy.type === 'elliptical') {
          // Elliptical galaxy
          ctx.save();
          ctx.translate(galaxy.x, galaxy.y);
          
          ctx.fillStyle = 'rgba(200, 200, 255, 0.1)';
          ctx.beginPath();
          ctx.ellipse(0, 0, galaxy.size, galaxy.size * 0.6, galaxy.rotation, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        } else {
          // Irregular galaxy
          ctx.save();
          ctx.translate(galaxy.x, galaxy.y);
          
          // Random blobs
          for (let i = 0; i < 5; i++) {
            const x = (Math.random() - 0.5) * galaxy.size;
            const y = (Math.random() - 0.5) * galaxy.size;
            const size = galaxy.size * 0.2 + Math.random() * galaxy.size * 0.3;
            
            ctx.fillStyle = 'rgba(200, 200, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        }
      }
    }
    
    // Add phase-specific visual effects
    if (this.universePhase === 0) {
      // The Void - Complete darkness with subtle quantum fluctuations
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, this.width, this.height);
      
      // Extremely subtle quantum fluctuations
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        const size = Math.random() * 1 + 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, 0.02)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.universePhase === 1) {
      // Quantum Foam phase - subtle patterns of quantum fluctuations
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        const size = Math.random() * 2 + 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.universePhase === 2) {
      // Big Bang - explosive energy
      const gradient = ctx.createRadialGradient(
        this.width/2, this.height/2, 10,
        this.width/2, this.height/2, this.width/2
      );
      gradient.addColorStop(0, 'rgba(255, 255, 200, 0.7)');
      gradient.addColorStop(0.2, 'rgba(255, 100, 50, 0.5)');
      gradient.addColorStop(0.6, 'rgba(200, 50, 80, 0.3)');
      gradient.addColorStop(1, 'rgba(20, 0, 50, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }
  
  // Helper function to get spectral class based on temperature
  private getSpectralClass(temperature: number): string {
    if (temperature > 30000) return 'O';
    if (temperature > 10000) return 'B';
    if (temperature > 7500) return 'A';
    if (temperature > 6000) return 'F';
    if (temperature > 5200) return 'G'; // Like our Sun
    if (temperature > 3700) return 'K';
    return 'M';
  }
  
  // Render a special background for cosmic body interiors
  renderInteriorBackground(cosmicBody: Plant) {
    const ctx = this.ctx;
    if (!ctx) return;
    
    switch(cosmicBody.type) {
      case 'galaxy':
        // For galaxies, render a starfield with galaxy structure
        ctx.fillStyle = '#000005';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw some stars in the background
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const size = Math.random() * 1.5;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw galaxy spiral or structure
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        
        // Draw galaxy arms or structures
        for (let arm = 0; arm < 4; arm++) {
          ctx.save();
          ctx.rotate(arm * Math.PI / 2);
          
          ctx.strokeStyle = 'rgba(100, 149, 237, 0.2)';
          ctx.lineWidth = 20;
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          for (let r = 0; r < 200; r += 2) {
            const angle = r * 0.05;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          
          // Add some star clusters along the arms
          for (let i = 0; i < 30; i++) {
            const r = Math.random() * 200;
            const angle = r * 0.05;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            const size = Math.random() * 8 + 4;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        }
        
        // Draw galaxy core
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 70);
        gradient.addColorStop(0, 'rgba(255, 240, 200, 0.8)');
        gradient.addColorStop(0.2, 'rgba(255, 210, 150, 0.6)');
        gradient.addColorStop(0.4, 'rgba(200, 170, 100, 0.4)');
        gradient.addColorStop(1, 'rgba(100, 100, 150, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 70, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        break;
        
      case 'star':
        // For stars, render a radial gradient for the corona
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Generate a gentle star background
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const size = Math.random() * 1;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw the star's corona
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        
        // Inner bright region (photosphere)
        const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
        innerGradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
        innerGradient.addColorStop(0.2, 'rgba(255, 230, 150, 0.8)');
        innerGradient.addColorStop(0.4, 'rgba(255, 160, 100, 0.6)');
        innerGradient.addColorStop(0.8, 'rgba(200, 100, 50, 0.3)');
        innerGradient.addColorStop(1, 'rgba(100, 50, 0, 0)');
        
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 150, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some solar flares or prominences
        for (let i = 0; i < 8; i++) {
          const angle = i * Math.PI / 4 + Math.random() * 0.5;
          const length = 60 + Math.random() * 50;
          const width = 10 + Math.random() * 15;
          
          ctx.save();
          ctx.rotate(angle);
          
          ctx.fillStyle = 'rgba(255, 150, 50, 0.5)';
          ctx.beginPath();
          ctx.moveTo(90, -width / 2);
          ctx.lineTo(90 + length, 0);
          ctx.lineTo(90, width / 2);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        }
        
        ctx.restore();
        break;
        
      case 'planet':
        // For planets, render a space background with some atmosphere effect
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Star background
        for (let i = 0; i < 150; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const size = Math.random() * 1.5;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Determine planet type and color scheme
        let planetType = 'earth'; // Default to earth-like
        if (cosmicBody.name && cosmicBody.name.includes('gas')) {
          planetType = 'gas';
        } else if (cosmicBody.name && cosmicBody.name.includes('rocky')) {
          planetType = 'rocky';
        } else if (cosmicBody.name && cosmicBody.name.includes('ice')) {
          planetType = 'ice';
        }
        
        // Render atmosphere glow
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        
        let atmosphereColor = 'rgba(70, 130, 230, 0.2)'; // Blue for earth-like
        if (planetType === 'gas') {
          atmosphereColor = 'rgba(200, 170, 120, 0.2)'; // Tan for gas giants
        } else if (planetType === 'rocky') {
          atmosphereColor = 'rgba(180, 90, 50, 0.2)'; // Rusty for rocky planets
        } else if (planetType === 'ice') {
          atmosphereColor = 'rgba(200, 230, 255, 0.2)'; // White-blue for ice worlds
        }
        
        // Create an atmosphere glow
        const atmosphereGradient = ctx.createRadialGradient(0, 0, 150, 0, 0, 250);
        atmosphereGradient.addColorStop(0, atmosphereColor);
        atmosphereGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = atmosphereGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 250, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        break;
        
      case 'blackhole':
        // For black holes, create an eerie accretion disk and event horizon effect
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Distant stars, slightly distorted
        for (let i = 0; i < 200; i++) {
          const distance = Math.random() * this.width / 1.5;
          const angle = Math.random() * Math.PI * 2;
          
          // Apply gravitational distortion to distant stars
          const distortion = 100 / (distance + 50); // More distortion closer to center
          const distortedAngle = angle + distortion * 0.5;
          
          const x = this.width / 2 + Math.cos(distortedAngle) * distance;
          const y = this.height / 2 + Math.sin(distortedAngle) * distance;
          const size = Math.random() * 1.5;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        
        // Draw the accretion disk
        const outerRing = 130;
        const innerRing = 40;
        
        // Create a gradient for the accretion disk
        const diskGradient = ctx.createRadialGradient(0, 0, innerRing, 0, 0, outerRing);
        diskGradient.addColorStop(0, 'rgba(100, 50, 255, 0.7)');
        diskGradient.addColorStop(0.3, 'rgba(200, 100, 255, 0.6)');
        diskGradient.addColorStop(0.7, 'rgba(255, 150, 50, 0.5)');
        diskGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
        
        // Draw the disk with a slight tilt perspective
        ctx.save();
        ctx.rotate(Math.PI / 8); // Slight tilt
        ctx.scale(1, 0.3); // Flatten to create perspective
        
        ctx.fillStyle = diskGradient;
        ctx.beginPath();
        ctx.arc(0, 0, outerRing, 0, Math.PI * 2);
        ctx.fill();
        
        // Cut out the inner part to create a ring effect
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 0, innerRing, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw the event horizon (black circle in the center)
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a subtle gravitational lensing effect around the event horizon
        const lensGradient = ctx.createRadialGradient(0, 0, 30, 0, 0, 45);
        lensGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        lensGradient.addColorStop(1, 'rgba(0, 0, 20, 0)');
        
        ctx.fillStyle = lensGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 45, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        break;
        
      case 'nebula':
        // For nebulae, create a colorful gas cloud effect
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Star background
        for (let i = 0; i < 150; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const size = Math.random() * 1.5;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        
        // Generate cloud-like nebula structures with random colors
        const generateNebulaCloud = (centerX: number, centerY: number, radius: number, color: string) => {
          const cloudPoints = [];
          const pointCount = 12;
          
          // Generate irregular polygon points
          for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2;
            const variance = radius * 0.4;
            const distance = radius + (Math.random() * variance - variance / 2);
            
            cloudPoints.push({
              x: centerX + Math.cos(angle) * distance,
              y: centerY + Math.sin(angle) * distance
            });
          }
          
          // Draw the irregular cloud
          ctx.beginPath();
          ctx.moveTo(cloudPoints[0].x, cloudPoints[0].y);
          
          for (let i = 1; i < pointCount; i++) {
            const cp1x = (cloudPoints[i-1].x + cloudPoints[i].x) / 2 + (Math.random() * 20 - 10);
            const cp1y = (cloudPoints[i-1].y + cloudPoints[i].y) / 2 + (Math.random() * 20 - 10);
            ctx.quadraticCurveTo(cp1x, cp1y, cloudPoints[i].x, cloudPoints[i].y);
          }
          
          // Close the shape back to the first point
          const cp1x = (cloudPoints[pointCount-1].x + cloudPoints[0].x) / 2 + (Math.random() * 20 - 10);
          const cp1y = (cloudPoints[pointCount-1].y + cloudPoints[0].y) / 2 + (Math.random() * 20 - 10);
          ctx.quadraticCurveTo(cp1x, cp1y, cloudPoints[0].x, cloudPoints[0].y);
          
          ctx.fillStyle = color;
          ctx.fill();
        };
        
        // Generate several cloud structures with different colors
        const nebulaColors = [
          'rgba(200, 50, 80, 0.2)',  // Red
          'rgba(100, 50, 200, 0.2)', // Blue
          'rgba(50, 200, 100, 0.2)', // Green
          'rgba(200, 150, 50, 0.2)'  // Yellow
        ];
        
        for (let i = 0; i < 6; i++) {
          const centerX = (Math.random() - 0.5) * 200;
          const centerY = (Math.random() - 0.5) * 200;
          const radius = 80 + Math.random() * 100;
          const colorIndex = Math.floor(Math.random() * nebulaColors.length);
          
          generateNebulaCloud(centerX, centerY, radius, nebulaColors[colorIndex]);
        }
        
        // Add some bright stars or star formation regions
        for (let i = 0; i < 15; i++) {
          const x = (Math.random() - 0.5) * 300;
          const y = (Math.random() - 0.5) * 300;
          const size = 1 + Math.random() * 3;
          
          const starGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
          starGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          starGradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.4)');
          starGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
          
          ctx.fillStyle = starGradient;
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
        break;
        
      default:
        // Default space background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Simple star background
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const size = Math.random() * 1.5;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
    }
  }
  
  renderCosmicInterior() {
    if (!this.ctx || !this.focusedObject) return;
    
    // Render interior background based on cosmic body type
    this.renderInteriorBackground(this.focusedObject);
    
    // Draw interior objects (stars, planets, etc.)
    this.renderInteriorObjects();
    
    // Draw information panel for the focused object
    this.renderInfoPanel(this.focusedObject);
    
    // Draw exit button
    this.renderExitButton();
  }
  
  renderInteriorObjects() {
    if (!this.ctx || !this.focusedObject) return;
    
    const ctx = this.ctx;
    const cosmicBody = this.focusedObject;
    
    // Only render if there are interior objects
    if (cosmicBody.interior && cosmicBody.interior.length > 0) {
      // Draw each interior object
      for (const object of cosmicBody.interior) {
        // Draw the object with appropriate visual representation
        switch(object.type) {
          case 'star':
            // Stars are bright points of light with corona
            ctx.save();
            ctx.translate(object.x, object.y);
            
            // Star glow (corona)
            const coronaGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, object.size * 20);
            coronaGradient.addColorStop(0, `rgba(255, 255, 200, 0.2)`);
            coronaGradient.addColorStop(1, `rgba(255, 255, 200, 0)`);
            
            ctx.fillStyle = coronaGradient;
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Star core
            ctx.fillStyle = object.color || 'rgba(255, 255, 200, 1)';
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Add name if hovering or if it's significant
            if (object === this.hoverPlant || object.size > 0.5) {
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(object.name || 'Star', 0, object.size * 5 + 20);
            }
            
            ctx.restore();
            break;
            
          case 'planet':
            // Planets are circles with distinctive colors
            ctx.save();
            ctx.translate(object.x, object.y);
            
            // Planet circle
            ctx.fillStyle = object.color || '#A5A5A5';
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Planet atmosphere if applicable
            if (object.cosmicProperties.atmosphere && object.cosmicProperties.atmosphere > 0.1) {
              const atmGradient = ctx.createRadialGradient(0, 0, object.size * 8, 0, 0, object.size * 11);
              atmGradient.addColorStop(0, `rgba(150, 200, 255, 0.3)`);
              atmGradient.addColorStop(1, `rgba(150, 200, 255, 0)`);
              
              ctx.fillStyle = atmGradient;
              ctx.beginPath();
              ctx.arc(0, 0, object.size * 11, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Add name if hovering
            if (object === this.hoverPlant) {
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(object.name || 'Planet', 0, object.size * 8 + 15);
            }
            
            ctx.restore();
            break;
            
          case 'blackhole':
            // Black holes have event horizon and accretion disk
            ctx.save();
            ctx.translate(object.x, object.y);
            
            // Gravitational lensing effect
            const lensGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, object.size * 15);
            lensGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
            lensGradient.addColorStop(0.7, 'rgba(0, 0, 50, 0.2)');
            lensGradient.addColorStop(1, 'rgba(0, 0, 50, 0)');
            
            ctx.fillStyle = lensGradient;
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Accretion disk
            ctx.save();
            ctx.rotate(Math.PI / 8);
            ctx.scale(1, 0.3);
            
            const diskGradient = ctx.createRadialGradient(0, 0, object.size * 3, 0, 0, object.size * 10);
            diskGradient.addColorStop(0, 'rgba(100, 50, 255, 0.7)');
            diskGradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.5)');
            diskGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
            
            ctx.fillStyle = diskGradient;
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Cut out center
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            // Event horizon
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Add name if hovering
            if (object === this.hoverPlant) {
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(object.name || 'Black Hole', 0, object.size * 15 + 10);
            }
            
            ctx.restore();
            break;
            
          case 'galaxy':
            // Small galaxies inside a larger galaxy (substructures)
            ctx.save();
            ctx.translate(object.x, object.y);
            
            // Galaxy shape
            ctx.save();
            ctx.rotate(Math.random() * Math.PI * 2);
            
            for (let arm = 0; arm < 2; arm++) {
              ctx.save();
              ctx.rotate(arm * Math.PI);
              
              ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)';
              ctx.lineWidth = 2;
              
              ctx.beginPath();
              ctx.moveTo(0, 0);
              for (let r = 0; r < object.size * 15; r += 2) {
                const angle = r * 0.1;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                ctx.lineTo(x, y);
              }
              ctx.stroke();
              
              ctx.restore();
            }
            
            // Galaxy core
            ctx.fillStyle = 'rgba(255, 255, 200, 0.5)';
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            // Add name if hovering
            if (object === this.hoverPlant) {
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(object.name || 'Galaxy Region', 0, object.size * 15 + 10);
            }
            
            ctx.restore();
            break;
            
          case 'nebula':
            // Nebulae are colorful clouds
            ctx.save();
            ctx.translate(object.x, object.y);
            
            // Cloud-like shape
            const cloudPoints = [];
            const pointCount = 12;
            
            // Generate irregular polygon points
            for (let i = 0; i < pointCount; i++) {
              const angle = (i / pointCount) * Math.PI * 2;
              const distance = object.size * 10 + (Math.random() * object.size * 5);
              
              cloudPoints.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
              });
            }
            
            // Draw the cloud
            ctx.beginPath();
            ctx.moveTo(cloudPoints[0].x, cloudPoints[0].y);
            
            for (let i = 1; i < pointCount; i++) {
              const cp1x = (cloudPoints[i-1].x + cloudPoints[i].x) / 2 + (Math.random() * 20 - 10);
              const cp1y = (cloudPoints[i-1].y + cloudPoints[i].y) / 2 + (Math.random() * 20 - 10);
              ctx.quadraticCurveTo(cp1x, cp1y, cloudPoints[i].x, cloudPoints[i].y);
            }
            
            const cp1x = (cloudPoints[pointCount-1].x + cloudPoints[0].x) / 2 + (Math.random() * 20 - 10);
            const cp1y = (cloudPoints[pointCount-1].y + cloudPoints[0].y) / 2 + (Math.random() * 20 - 10);
            ctx.quadraticCurveTo(cp1x, cp1y, cloudPoints[0].x, cloudPoints[0].y);
            
            ctx.fillStyle = object.color || 'rgba(150, 100, 200, 0.3)';
            ctx.fill();
            
            // Add some bright spots within the nebula
            for (let i = 0; i < 5; i++) {
              const x = (Math.random() - 0.5) * object.size * 15;
              const y = (Math.random() - 0.5) * object.size * 15;
              const spotSize = 1 + Math.random() * 3;
              
              ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
              ctx.beginPath();
              ctx.arc(x, y, spotSize, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Add name if hovering
            if (object === this.hoverPlant) {
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(object.name || 'Nebula', 0, object.size * 15 + 10);
            }
            
            ctx.restore();
            break;
            
          default:
            // Generic cosmic object - simple circle
            ctx.save();
            ctx.translate(object.x, object.y);
            
            ctx.fillStyle = object.color || 'white';
            ctx.beginPath();
            ctx.arc(0, 0, object.size * 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Add name if hovering
            if (object === this.hoverPlant) {
              ctx.fillStyle = 'white';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(object.name || 'Cosmic Object', 0, object.size * 5 + 15);
            }
            
            ctx.restore();
        }
        
        // If this object is marked as interactable, add a subtle indicator
        if (object.isInteractable) {
          ctx.save();
          ctx.translate(object.x, object.y);
          
          // Pulsating effect for interactable objects
          const pulseSize = 1 + 0.2 * Math.sin(Date.now() / 300);
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, object.size * 6 * pulseSize, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.restore();
        }
      }
    }
  }
  
  renderInfoPanel(cosmicBody: Plant) {
    const ctx = this.ctx;
    if (!ctx) return;
    
    // Panel at bottom of screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, this.height - 90, this.width - 20, 80);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    // Different scientific information based on cosmic body type
    switch(cosmicBody.type) {
      case 'galaxy':
        const galaxyType = cosmicBody.cosmicProperties.galaxyType || 'spiral';
        const starDensity = cosmicBody.cosmicProperties.starDensity || 0.5;
        const darkMatterRatio = cosmicBody.cosmicProperties.darkMatterRatio || 0.75;
        
        // Scientific information about galaxies
        ctx.fillText('SCIENTIFIC DATA:', 20, this.height - 65);
        ctx.font = '14px Arial';
        ctx.fillText(`Galaxy Type: ${galaxyType}`, 20, this.height - 45);
        ctx.fillText(`Star Density: ${(starDensity * 100).toFixed(1)}%`, 20, this.height - 30);
        ctx.fillText(`Dark Matter: ${(darkMatterRatio * 100).toFixed(1)}% of total mass`, 20, this.height - 15);
        break;
        
      case 'star':
        const stellarClass = cosmicBody.cosmicProperties.stellarClass || 'G';
        const surfaceTemp = cosmicBody.cosmicProperties.surfaceTemperature || 5778;
        const stellarAge = cosmicBody.cosmicProperties.stellarAge || 4.6;
        
        // Scientific information about stars
        ctx.fillText('STELLAR ANALYSIS:', 20, this.height - 65);
        ctx.font = '14px Arial';
        ctx.fillText(`Spectral Class: ${stellarClass}`, 20, this.height - 45);
        ctx.fillText(`Surface Temperature: ${surfaceTemp} K`, 20, this.height - 30);
        ctx.fillText(`Stellar Age: ${stellarAge} billion years`, 20, this.height - 15);
        break;
        
      case 'planet':
        const planetType = cosmicBody.cosmicProperties.planetType || 'terrestrial';
        const atmosphere = cosmicBody.cosmicProperties.atmosphere || 'none';
        const surfaceGravity = cosmicBody.cosmicProperties.surfaceGravity || 1.0;
        
        // Scientific information about planets
        ctx.fillText('PLANETARY DATA:', 20, this.height - 65);
        ctx.font = '14px Arial';
        ctx.fillText(`Planet Type: ${planetType}`, 20, this.height - 45);
        ctx.fillText(`Atmosphere: ${atmosphere}`, 20, this.height - 30);
        ctx.fillText(`Surface Gravity: ${surfaceGravity.toFixed(2)} g`, 20, this.height - 15);
        break;
        
      case 'blackhole':
        const eventHorizonRadius = cosmicBody.cosmicProperties.eventHorizonRadius || 30;
        const mass = cosmicBody.cosmicProperties.mass || 1000000;
        const spinRate = cosmicBody.cosmicProperties.spinRate || 0.9;
        
        // Scientific information about black holes
        ctx.fillText('BLACK HOLE PARAMETERS:', 20, this.height - 65);
        ctx.font = '14px Arial';
        ctx.fillText(`Event Horizon: ${eventHorizonRadius} km`, 20, this.height - 45);
        ctx.fillText(`Mass: ${mass.toExponential(2)} solar masses`, 20, this.height - 30);
        ctx.fillText(`Spin Parameter: ${spinRate.toFixed(2)}`, 20, this.height - 15);
        break;
        
      case 'nebula':
        const nebulaType = cosmicBody.cosmicProperties.nebulaType || 'emission';
        const elementComposition = cosmicBody.cosmicProperties.elementComposition || 'hydrogen, helium';
        const starFormationRate = cosmicBody.cosmicProperties.starFormationRate || 'low';
        
        // Scientific information about nebulae
        ctx.fillText('NEBULAR ANALYSIS:', 20, this.height - 65);
        ctx.font = '14px Arial';
        ctx.fillText(`Nebula Type: ${nebulaType}`, 20, this.height - 45);
        ctx.fillText(`Composition: ${elementComposition}`, 20, this.height - 30);
        ctx.fillText(`Star Formation: ${starFormationRate}`, 20, this.height - 15);
        break;
        
      default:
        ctx.fillText(`${cosmicBody.type.toUpperCase()} DATA:`, 20, this.height - 65);
        ctx.font = '14px Arial';
        ctx.fillText(`No detailed scientific data available`, 20, this.height - 45);
        ctx.fillText(`Type: ${cosmicBody.type}`, 20, this.height - 30);
    }
  }
  
  renderExitButton() {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Exit button in top right
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.width - 80, 10, 70, 30);
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.width - 80, 10, 70, 30);
    
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', this.width - 45, 30);
  }
  
  renderParticles(particles: Particle[]) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    particles.forEach(particle => {
      this.renderParticle(particle);
    });
  }
  
  renderParticle(particle: Particle) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const alpha = Math.min(1, 2 - particle.age / particle.lifespan);
    
    // If particle is entangled, draw a connecting line to its entangled partner
    if (particle.entangled && particle.entangledWith) {
      ctx.strokeStyle = `rgba(100, 200, 255, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.entangledWith.x, particle.entangledWith.y);
      ctx.stroke();
      
      // Small glow at intersection points
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, 5
      );
      gradient.addColorStop(0, `rgba(100, 200, 255, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // For quantum particles, we draw wave-like patterns
    if (particle.wavelength) {
      // The main particle
      ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Quantum wave pattern
      ctx.strokeStyle = `rgba(100, 200, 255, ${alpha * 0.7})`;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = i * (Math.PI / 5) + particle.phase;
        const distance = i * 3;
        const waveAmplitude = 3 * Math.sin(particle.wavelength * distance);
        
        const x = particle.x + Math.cos(angle) * distance;
        const y = particle.y + Math.sin(angle) * distance + waveAmplitude;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    } else {
      // Regular particle
      ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  renderPlant(plant: Plant) {
    if (!this.ctx) return;
    
    // Skip this if we're in cosmic exploration mode
    if (this.focusedObject) return;
    
    const ctx = this.ctx;
    
    // Apply camera transformation
    const screenX = this.width / 2 + (plant.x - this.viewOffsetX) * this.zoomLevel;
    const screenY = this.height / 2 + (plant.y - this.viewOffsetY) * this.zoomLevel;
    const screenSize = plant.size * this.zoomLevel;
    
    // Skip if outside the visible area
    if (screenX < -screenSize * 20 || 
        screenX > this.width + screenSize * 20 || 
        screenY < -screenSize * 20 || 
        screenY > this.height + screenSize * 20) {
      return;
    }
    
    // Render any active collision effects for this cosmic body
    if (plant.cosmicProperties && plant.cosmicProperties.collisionEffects && 
        plant.cosmicProperties.collisionEffects.length > 0) {
      this.renderCollisionEffects(plant, screenX, screenY, screenSize);
    }
    
    // Render scan effects if this body is being scanned
    if (plant.cosmicProperties && plant.cosmicProperties.scanProgress !== undefined &&
        plant.cosmicProperties.scanProgress > 0 && plant.cosmicProperties.scanProgress < 1) {
      this.renderScanEffect(plant, screenX, screenY, screenSize);
    }
    
    ctx.save();
    ctx.translate(screenX, screenY);
    
    // Different visualization based on cosmic body type
    switch (plant.type) {
      case 'galaxy':
        // Draw galaxy
        ctx.save();
        ctx.rotate(Date.now() / 10000); // Slow rotation
        
        // Galaxy spiral arms
        for (let arm = 0; arm < 2; arm++) {
          ctx.save();
          ctx.rotate(arm * Math.PI);
          
          ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)';
          ctx.lineWidth = screenSize * 3;
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          for (let r = 0; r < screenSize * 30; r += 2) {
            const angle = r * 0.1;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          
          ctx.restore();
        }
        
        // Galaxy core
        const galaxyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, screenSize * 10);
        galaxyGradient.addColorStop(0, 'rgba(255, 255, 220, 0.8)');
        galaxyGradient.addColorStop(0.3, 'rgba(255, 220, 180, 0.6)');
        galaxyGradient.addColorStop(0.7, 'rgba(200, 170, 100, 0.3)');
        galaxyGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = galaxyGradient;
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        break;
        
      case 'star':
        // Draw star with glow
        const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, screenSize * 15);
        starGradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
        starGradient.addColorStop(0.2, 'rgba(255, 220, 170, 0.8)');
        starGradient.addColorStop(0.5, 'rgba(255, 180, 100, 0.4)');
        starGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
        
        ctx.fillStyle = starGradient;
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Star core
        ctx.fillStyle = 'rgba(255, 255, 220, 1)';
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Add solar flares for visual interest
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 / 6) * i + (Date.now() / 3000);
          const flareLength = screenSize * (5 + Math.sin(Date.now() / 500 + i) * 3);
          
          ctx.fillStyle = 'rgba(255, 100, 50, 0.7)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(angle) * flareLength, 
            Math.sin(angle) * flareLength
          );
          ctx.lineTo(
            Math.cos(angle + 0.2) * (flareLength * 0.7), 
            Math.sin(angle + 0.2) * (flareLength * 0.7)
          );
          ctx.closePath();
          ctx.fill();
        }
        break;
        
      case 'planet':
        // Draw planet with animated atmosphere and surface details
        const planetTime = Date.now() / 10000;
        
        // Planet surface with rotation
        ctx.save();
        ctx.rotate(planetTime);
        
        // Planet base
        ctx.fillStyle = plant.color || '#8B4513';
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Surface features (continents, clouds, etc.)
        const surfaceFeatures = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < surfaceFeatures; i++) {
          const featureAngle = (Math.PI * 2 / surfaceFeatures) * i;
          const featureSize = screenSize * (2 + Math.random() * 3);
          const featureX = Math.cos(featureAngle) * screenSize * 4;
          const featureY = Math.sin(featureAngle) * screenSize * 4;
          
          // Use different colors for different types of planets
          let featureColor;
          if (plant.habitability > 0.5) {
            // Earth-like features (green continents, blue oceans)
            featureColor = `rgba(100, ${120 + Math.floor(Math.random() * 80)}, 100, 0.6)`;
          } else if (plant.cosmicProperties?.planetType === 'gas_giant') {
            // Gas giant bands
            featureColor = `rgba(${180 + Math.floor(Math.random() * 50)}, ${170 + Math.floor(Math.random() * 50)}, ${100 + Math.floor(Math.random() * 50)}, 0.4)`;
          } else {
            // Rocky/ice planets
            featureColor = `rgba(${150 + Math.floor(Math.random() * 50)}, ${150 + Math.floor(Math.random() * 50)}, ${150 + Math.floor(Math.random() * 50)}, 0.3)`;
          }
          
          ctx.fillStyle = featureColor;
          ctx.beginPath();
          ctx.ellipse(
            featureX, featureY,
            featureSize, featureSize * 0.6,
            Math.random() * Math.PI,
            0, Math.PI * 2
          );
          ctx.fill();
        }
        
        ctx.restore();
        
        // Planet atmosphere with animated clouds
        if (plant.cosmicProperties && plant.cosmicProperties.atmosphere) {
          // Create a clipping region for atmosphere effects
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, screenSize * 12, 0, Math.PI * 2);
          ctx.clip();
          
          // Animated cloud layers
          const cloudLayers = 3;
          for (let i = 0; i < cloudLayers; i++) {
            const cloudSpeed = 0.0003 * (i + 1);
            const cloudOffset = Date.now() * cloudSpeed;
            
            // Generate cloud pattern
            for (let j = 0; j < 4; j++) {
              const cloudAngle = (j / 4) * Math.PI * 2 + cloudOffset;
              const cloudDistance = screenSize * (8 + i * 0.8);
              const cloudX = Math.cos(cloudAngle) * cloudDistance;
              const cloudY = Math.sin(cloudAngle) * cloudDistance;
              const cloudSize = screenSize * (3 + Math.random() * 2);
              
              ctx.fillStyle = `rgba(255, 255, 255, ${0.1 - i * 0.03})`;
              ctx.beginPath();
              ctx.ellipse(
                cloudX, cloudY,
                cloudSize, cloudSize * 0.6,
                cloudAngle,
                0, Math.PI * 2
              );
              ctx.fill();
            }
          }
          
          // Atmosphere glow
          const atmosphereGradient = ctx.createRadialGradient(0, 0, screenSize * 8, 0, 0, screenSize * 12);
          atmosphereGradient.addColorStop(0, 'rgba(150, 200, 255, 0.2)');
          atmosphereGradient.addColorStop(1, 'rgba(150, 200, 255, 0)');
          
          ctx.fillStyle = atmosphereGradient;
          ctx.beginPath();
          ctx.arc(0, 0, screenSize * 12, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
        break;
        
      case 'blackhole':
        // Enhanced black hole with animated accretion disk and gravitational lensing
        // Animate gravitational lensing effect
        const lensTime = Date.now() / 5000;
        const lensGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, screenSize * 25);
        lensGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
        lensGradient.addColorStop(0.5, `rgba(0, 0, ${30 + Math.sin(lensTime) * 20}, 0.6)`);
        lensGradient.addColorStop(0.8, `rgba(0, 0, ${50 + Math.sin(lensTime) * 20}, 0.3)`);
        lensGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = lensGradient;
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Distortion effect for nearby stars
        for (let i = 0; i < 20; i++) {
          const starAngle = (i / 20) * Math.PI * 2;
          const baseDistance = screenSize * (15 + Math.random() * 10);
          // Calculate distorted position
          const distortionFactor = 0.7 + Math.sin(lensTime + i) * 0.2;
          const distortedDistance = baseDistance * distortionFactor;
          
          const x = Math.cos(starAngle) * distortedDistance;
          const y = Math.sin(starAngle) * distortedDistance;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          
          // Draw elongated stars to show distortion
          ctx.ellipse(
            x, y,
            1 + Math.random(), (1 + Math.random()) * (1 + (25 / distortedDistance)),
            Math.atan2(y, x) + Math.PI/2,
            0, Math.PI * 2
          );
          ctx.fill();
        }
        
        // Animated accretion disk
        ctx.save();
        const diskRotation = Date.now() / 3000;
        ctx.rotate(diskRotation);
        ctx.scale(1, 0.3);
        
        const diskGradient = ctx.createRadialGradient(0, 0, screenSize * 5, 0, 0, screenSize * 15);
        diskGradient.addColorStop(0, 'rgba(100, 50, 255, 0.8)');
        diskGradient.addColorStop(0.4, `rgba(${150 + Math.sin(lensTime * 2) * 50}, 100, ${200 + Math.sin(lensTime * 3) * 30}, 0.6)`);
        diskGradient.addColorStop(0.7, 'rgba(255, 100, 50, 0.5)');
        diskGradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
        
        ctx.fillStyle = diskGradient;
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Cut out center
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Add jets for some black holes
        if (Math.random() < 0.5) {
          const jetLength = screenSize * (20 + Math.sin(lensTime) * 5);
          const jetWidth = screenSize * 3;
          
          // Top jet
          ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
          ctx.beginPath();
          ctx.moveTo(-jetWidth, 0);
          ctx.lineTo(0, -jetLength);
          ctx.lineTo(jetWidth, 0);
          ctx.closePath();
          ctx.fill();
          
          // Bottom jet
          ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
          ctx.beginPath();
          ctx.moveTo(-jetWidth, 0);
          ctx.lineTo(0, jetLength);
          ctx.lineTo(jetWidth, 0);
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
        
        // Event horizon with pulsating edge
        const horizonSize = screenSize * (5 + Math.sin(lensTime * 2) * 0.5);
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(0, 0, horizonSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Event horizon edge glow
        ctx.strokeStyle = 'rgba(50, 0, 80, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, horizonSize, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      case 'nebula':
        // Enhanced animated nebula with multiple colored layers
        const nebulaBaseColor = plant.color || 'rgba(150, 100, 200, 0.3)';
        const nebulaTime = Date.now() / 8000;
        
        // Multiple cloud layers with different animations
        const cloudLayers = 3;
        for (let layer = 0; layer < cloudLayers; layer++) {
          const layerOffset = nebulaTime * (layer + 1) * 0.2;
          const pointCount = 10 + layer * 2;
          const cloudPoints = [];
          
          // Generate irregular polygon points with time-based animation
          for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2;
            const pulseAmount = Math.sin(nebulaTime * 2 + i) * screenSize * 3;
            const distance = screenSize * (15 + layer * 5) + pulseAmount;
            
            cloudPoints.push({
              x: Math.cos(angle + layerOffset) * distance,
              y: Math.sin(angle + layerOffset) * distance
            });
          }
          
          // Draw the cloud layer
          ctx.beginPath();
          ctx.moveTo(cloudPoints[0].x, cloudPoints[0].y);
          
          for (let i = 1; i < pointCount; i++) {
            const cp1x = (cloudPoints[i-1].x + cloudPoints[i].x) / 2 + (Math.sin(nebulaTime + i) * 15);
            const cp1y = (cloudPoints[i-1].y + cloudPoints[i].y) / 2 + (Math.cos(nebulaTime + i) * 15);
            ctx.quadraticCurveTo(cp1x, cp1y, cloudPoints[i].x, cloudPoints[i].y);
          }
          
          const cp1x = (cloudPoints[pointCount-1].x + cloudPoints[0].x) / 2 + (Math.sin(nebulaTime) * 15);
          const cp1y = (cloudPoints[pointCount-1].y + cloudPoints[0].y) / 2 + (Math.cos(nebulaTime) * 15);
          ctx.quadraticCurveTo(cp1x, cp1y, cloudPoints[0].x, cloudPoints[0].y);
          
          // Use different color for each layer
          let layerColor;
          if (layer === 0) {
            layerColor = nebulaBaseColor;
          } else if (layer === 1) {
            // Complementary color
            layerColor = nebulaBaseColor.replace(/rgba\((\d+), (\d+), (\d+)/, (match, r, g, b) => {
              return `rgba(${255-parseInt(r)}, ${255-parseInt(g)}, ${255-parseInt(b)}`;
            });
          } else {
            // Blend
            layerColor = 'rgba(180, 180, 220, 0.2)';
          }
          
          ctx.fillStyle = layerColor;
          ctx.fill();
        }
        
        // Add some bright spots and stars inside the nebula
        for (let i = 0; i < 15; i++) {
          const angle = (i / 15) * Math.PI * 2 + nebulaTime;
          const distance = screenSize * (Math.random() * 15 + 5);
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const spotSize = 1 + Math.random() * 3;
          
          // Pulsating stars
          const brightness = 0.3 + Math.sin(nebulaTime * 3 + i * 5) * 0.2;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
          ctx.beginPath();
          ctx.arc(x, y, spotSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Star glow
          const starGradient = ctx.createRadialGradient(x, y, 0, x, y, spotSize * 4);
          starGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
          starGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = starGradient;
          ctx.beginPath();
          ctx.arc(x, y, spotSize * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'protostar':
        // Animated protostar with swirling gas and dust
        const protoTime = Date.now() / 2000;
        
        // Draw swirling dust and gas clouds
        for (let i = 0; i < 5; i++) {
          const swirl = i / 5 * Math.PI * 2 + protoTime;
          const swirlDist = screenSize * (4 + i * 2);
          
          // Spiral dust paths
          ctx.strokeStyle = `rgba(255, 180, 100, ${0.2 - i * 0.03})`;
          ctx.lineWidth = screenSize * (1 + Math.random());
          
          ctx.beginPath();
          for (let angle = 0; angle < Math.PI * 6; angle += 0.1) {
            const dist = angle * swirlDist / (Math.PI * 6) + swirlDist / 2;
            const x = Math.cos(angle + swirl) * dist;
            const y = Math.sin(angle + swirl) * dist;
            
            if (angle === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
        
        // Central protostar
        const protoGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, screenSize * 6);
        protoGradient.addColorStop(0, 'rgba(255, 180, 100, 1)');
        protoGradient.addColorStop(0.5, 'rgba(255, 130, 50, 0.7)');
        protoGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
        
        ctx.fillStyle = protoGradient;
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Animate growing flares
        for (let i = 0; i < 5; i++) {
          const flareAngle = (i / 5) * Math.PI * 2 + protoTime;
          const flareSize = screenSize * (2 + Math.sin(protoTime * 3 + i) * 2);
          
          ctx.fillStyle = 'rgba(255, 150, 50, 0.5)';
          ctx.beginPath();
          ctx.ellipse(
            Math.cos(flareAngle) * screenSize * 4,
            Math.sin(flareAngle) * screenSize * 4,
            flareSize, flareSize * 2,
            flareAngle,
            0, Math.PI * 2
          );
          ctx.fill();
        }
        break;
        
      default:
        // Enhanced default plant/life form visualization
        const lifeTime = Date.now() / 1000;
        
        // Base
        ctx.fillStyle = plant.color || 'rgb(0, 128, 0)';
        ctx.beginPath();
        ctx.arc(0, 0, screenSize * 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Animated details based on type
        if (plant.type === 'lifeForm') {
          // Life form - add more complex structure
          const complexity = plant.lifeComplexity || 0.5;
          const branches = 3 + Math.floor(complexity * 5);
          
          for (let i = 0; i < branches; i++) {
            const angle = (i / branches) * Math.PI * 2;
            const length = screenSize * (8 + Math.sin(lifeTime + i) * 2);
            
            // Branch
            ctx.strokeStyle = `rgba(${50 + Math.floor(complexity * 100)}, ${150 + Math.floor(complexity * 50)}, 50, 0.8)`;
            ctx.lineWidth = screenSize * (0.8 + complexity * 0.5);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
              Math.cos(angle) * length,
              Math.sin(angle) * length
            );
            ctx.stroke();
            
            // Leaf/endpoint
            ctx.fillStyle = `rgba(${50 + Math.floor(complexity * 100)}, ${180 + Math.floor(complexity * 50)}, 50, 0.8)`;
            ctx.beginPath();
            ctx.ellipse(
              Math.cos(angle) * length,
              Math.sin(angle) * length,
              screenSize * 2, screenSize * 3,
              angle,
              0, Math.PI * 2
            );
            ctx.fill();
          }
        } else {
          // Regular plant - add some details and animation
          // Ripple effect
          ctx.strokeStyle = 'rgba(0, 200, 100, 0.3)';
          ctx.lineWidth = screenSize * 0.5;
          
          const ripples = 3;
          for (let i = 0; i < ripples; i++) {
            const rippleSize = screenSize * (8 + i * 3 + Math.sin(lifeTime * (i+1)) * 2);
            
            ctx.beginPath();
            ctx.arc(0, 0, rippleSize, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          // Center
          ctx.fillStyle = 'rgba(0, 200, 50, 0.8)';
          ctx.beginPath();
          ctx.arc(0, 0, screenSize * 6, 0, Math.PI * 2);
          ctx.fill();
        }
    }
    
    // Interactive highlight effect - improve visibility and feedback
    if (plant === this.hoverPlant) {
      // Pulsating selection effect
      const pulseTime = Date.now() / 500;
      const pulseSize = Math.sin(pulseTime) * 0.2 + 1; // 0.8 to 1.2 size multiplier
      
      // Size based on cosmic body type
      let highlightSize = 15;
      if (plant.type === 'galaxy') highlightSize = 35;
      else if (plant.type === 'star') highlightSize = 20;
      else if (plant.type === 'blackhole') highlightSize = 30;
      else if (plant.type === 'nebula') highlightSize = 25;
      
      // Create a glowing outline
      const glowSize = screenSize * highlightSize * pulseSize;
      
      // Multiple-layer glow effect
      const glowLayers = 3;
      for (let i = 0; i < glowLayers; i++) {
        const layerSize = glowSize * (1 - i * 0.1);
        const alpha = 0.3 - i * 0.1;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 2 - i * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, layerSize, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Interactive selection indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        // Draw dashed circular indicators
        const markerLength = screenSize * 3;
        const startX = Math.cos(a) * (glowSize + 5);
        const startY = Math.sin(a) * (glowSize + 5);
        const endX = Math.cos(a) * (glowSize + 5 + markerLength);
        const endY = Math.sin(a) * (glowSize + 5 + markerLength);
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      }
      ctx.stroke();
      
      // Draw name with enhanced visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      const nameText = plant.name || plant.type.charAt(0).toUpperCase() + plant.type.slice(1);
      
      // Text background for better readability
      const textWidth = ctx.measureText(nameText).width;
      const textHeight = 20;
      ctx.fillRect(
        -textWidth / 2 - 10, 
        glowSize + 10 - 5, 
        textWidth + 20, 
        textHeight + 10
      );
      
      // Text with glow effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(nameText, 0, glowSize + 20);
      
      // Add type info for more context
      if (plant.type === 'star' && plant.cosmicProperties?.stellarClass) {
        const typeInfo = `Class ${plant.cosmicProperties.stellarClass} ${plant.cosmicProperties.starType || 'Star'}`;
        ctx.font = '12px Arial';
        ctx.fillText(typeInfo, 0, glowSize + 40);
      } else if (plant.type === 'planet' && plant.cosmicProperties?.planetType) {
        const typeInfo = plant.cosmicProperties.planetType.charAt(0).toUpperCase() + 
                        plant.cosmicProperties.planetType.slice(1).replace('_', ' ') + 
                        (plant.habitability > 0.7 ? ' (Habitable)' : '');
        ctx.font = '12px Arial';
        ctx.fillText(typeInfo, 0, glowSize + 40);
      }
    }
    
    ctx.restore();
  }
  
  renderPlants(plants: Plant[]) {
    if (!this.ctx) return;
    
    // Skip this if we're in cosmic exploration mode
    if (this.focusedObject) return;
    
    plants.forEach(plant => {
      this.renderPlant(plant);
    });
  }
  
  renderField(field: number[][]) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Only render field if we're not exploring a cosmic body
    if (this.focusedObject) return;
    
    // Dimensions
    const rows = field.length;
    const cols = field[0].length;
    const cellSize = Math.min(this.width / cols, this.height / rows);
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const value = field[y][x];
        
        // Skip rendering if energy level is too low
        if (value < 0.1) continue;
        
        const screenX = x * cellSize;
        const screenY = y * cellSize;
        
        ctx.fillStyle = `rgba(100, 200, 255, ${value * 0.3})`;
        ctx.fillRect(screenX, screenY, cellSize, cellSize);
      }
    }
  }
  
  // Render collision effects between celestial bodies
  private renderCollisionEffects(plant: Plant, screenX: number, screenY: number, screenSize: number) {
    if (!this.ctx || !plant.cosmicProperties.collisionEffects) return;
    
    const ctx = this.ctx;
    const now = Date.now();
    const effectsToRemove: number[] = [];
    
    // Process each collision effect
    plant.cosmicProperties.collisionEffects.forEach((effect, index) => {
      // Default duration is 3 seconds if not specified
      const duration = effect.duration || 3000;
      const elapsedTime = now - effect.startTime;
      
      // Remove expired effects
      if (elapsedTime > duration) {
        effectsToRemove.push(index);
        return;
      }
      
      // Calculate effect progress (0 to 1)
      const progress = elapsedTime / duration;
      
      // Position effect in screen coordinates
      const effectX = screenX;
      const effectY = screenY;
      
      // Apply different visual effects based on collision type
      switch (effect.type) {
        case 'stellar_formation':
          // Star formation effect - bright expanding flash with particles
          this.renderStellarFormation(effectX, effectY, screenSize, progress);
          break;
          
        case 'planetary_destruction':
          // Planet destruction - explosive debris field
          this.renderPlanetaryDestruction(effectX, effectY, screenSize, progress);
          break;
          
        case 'planetary_merger':
          // Planet merger - swirling effect with gradual size increase
          this.renderPlanetaryMerger(effectX, effectY, screenSize, progress);
          break;
          
        case 'stellar_flare':
          // Stellar flare - bright directional ejection
          this.renderStellarFlare(effectX, effectY, screenSize, progress);
          break;
          
        case 'accretion_event':
          // Accretion event - spiraling matter into black hole
          this.renderAccretionEvent(effectX, effectY, screenSize, progress);
          break;
          
        case 'minor_impact':
          // Minor impact - small flash and particles
          this.renderMinorImpact(effectX, effectY, screenSize, progress);
          break;
      }
    });
    
    // Remove expired effects (in reverse order to avoid index issues)
    for (let i = effectsToRemove.length - 1; i >= 0; i--) {
      plant.cosmicProperties.collisionEffects.splice(effectsToRemove[i], 1);
    }
  }
  
  // Stellar formation effect - bright flash with expanding rings
  private renderStellarFormation(x: number, y: number, size: number, progress: number) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const maxRadius = size * 30 * progress;
    
    // Bright central flash
    const flashOpacity = Math.max(0, 1 - progress * 2); // Fade out faster than rings
    ctx.fillStyle = `rgba(255, 255, 200, ${flashOpacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size * 10 * (1 + progress), 0, Math.PI * 2);
    ctx.fill();
    
    // Expanding rings
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
      const ringProgress = Math.min(1, progress * 1.5 - (i * 0.2));
      if (ringProgress <= 0) continue;
      
      const ringOpacity = Math.max(0, 0.7 - ringProgress);
      const ringRadius = maxRadius * (i + 1) / ringCount * ringProgress;
      const ringWidth = 2 + size * (1 - ringProgress);
      
      ctx.strokeStyle = `rgba(255, 220, 150, ${ringOpacity})`;
      ctx.lineWidth = ringWidth;
      ctx.beginPath();
      ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Particle emission
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = maxRadius * 0.8;
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y + Math.sin(angle) * distance;
      const particleSize = size * (1 - progress) * 2;
      
      ctx.fillStyle = `rgba(255, 200, 100, ${0.5 - progress * 0.5})`;
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Planetary destruction - explosive debris field
  private renderPlanetaryDestruction(x: number, y: number, size: number, progress: number) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const debrisCount = 30;
    const maxDistance = size * 50 * progress;
    
    // Shock wave
    const waveOpacity = Math.max(0, 0.5 - progress * 0.5);
    ctx.strokeStyle = `rgba(255, 200, 150, ${waveOpacity})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, maxDistance * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Create debris field
    for (let i = 0; i < debrisCount; i++) {
      const angle = (i / debrisCount) * Math.PI * 2;
      const randomOffset = Math.random() * 0.2 - 0.1;
      const adjustedAngle = angle + randomOffset;
      const distance = maxDistance * (0.2 + Math.random() * 0.8);
      
      const debrisX = x + Math.cos(adjustedAngle) * distance;
      const debrisY = y + Math.sin(adjustedAngle) * distance;
      const debrisSize = size * (0.2 + Math.random() * 0.3) * (1 - progress * 0.7);
      
      // Different debris colors
      const colorIndex = Math.floor(Math.random() * 3);
      const colors = ['#A67B5B', '#8B8878', '#CD853F'];
      ctx.fillStyle = colors[colorIndex];
      
      ctx.beginPath();
      ctx.arc(debrisX, debrisY, debrisSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Central explosion flash
    if (progress < 0.3) {
      const flashOpacity = Math.max(0, 1 - progress * 3.3);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 15);
      gradient.addColorStop(0, `rgba(255, 255, 200, ${flashOpacity})`);
      gradient.addColorStop(0.5, `rgba(255, 150, 50, ${flashOpacity * 0.7})`);
      gradient.addColorStop(1, `rgba(200, 0, 0, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 15, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Planet merger - swirling effect with gradual size increase
  private renderPlanetaryMerger(x: number, y: number, size: number, progress: number) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Swirling effect - spiral arms
    const armCount = 3;
    const maxRadius = size * 15;
    const rotationSpeed = progress * Math.PI * 6; // Rotate faster as merger progresses
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationSpeed);
    
    for (let i = 0; i < armCount; i++) {
      const startAngle = (i / armCount) * Math.PI * 2;
      const armOpacity = Math.max(0, 0.7 - progress * 0.7);
      
      ctx.strokeStyle = `rgba(200, 200, 255, ${armOpacity})`;
      ctx.lineWidth = 2;
      
      // Draw spiral arm
      ctx.beginPath();
      for (let j = 0; j < 30; j++) {
        const t = j / 30;
        const radius = maxRadius * t * (1 - progress * 0.5);
        const angle = startAngle + t * Math.PI * 2 * 1.5;
        
        const pointX = Math.cos(angle) * radius;
        const pointY = Math.sin(angle) * radius;
        
        if (j === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.stroke();
      
      // Add particles along the spiral
      ctx.fillStyle = `rgba(200, 255, 255, ${armOpacity})`;
      for (let j = 0; j < 10; j++) {
        const t = j / 10;
        const radius = maxRadius * t * (1 - progress * 0.5);
        const angle = startAngle + t * Math.PI * 2 * 1.5;
        
        const pointX = Math.cos(angle) * radius;
        const pointY = Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(pointX, pointY, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
    
    // Growing central body
    const centerSize = size * (1 + progress * 0.4);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, centerSize);
    gradient.addColorStop(0, `rgba(200, 200, 255, ${1 - progress * 0.3})`);
    gradient.addColorStop(1, `rgba(100, 100, 200, ${0.7 - progress * 0.3})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, centerSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Stellar flare - bright directional ejection
  private renderStellarFlare(x: number, y: number, size: number, progress: number) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const flareAngle = Math.PI * 0.3; // Angle of the flare cone
    const direction = Math.random() * Math.PI * 2; // Random direction
    const maxLength = size * 30 * progress;
    
    // Create flare gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, maxLength);
    gradient.addColorStop(0, `rgba(255, 255, 200, ${0.8 - progress * 0.8})`);
    gradient.addColorStop(0.3, `rgba(255, 200, 100, ${0.6 - progress * 0.6})`);
    gradient.addColorStop(0.7, `rgba(255, 100, 50, ${0.4 - progress * 0.4})`);
    gradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
    
    // Draw the flare cone
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(direction);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, maxLength, -flareAngle / 2, flareAngle / 2);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add particles within the flare
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() - 0.5) * flareAngle;
      const distance = Math.random() * maxLength;
      const particleX = Math.cos(angle) * distance;
      const particleY = Math.sin(angle) * distance;
      const particleSize = size * (0.2 + Math.random() * 0.3) * (1 - progress);
      
      ctx.fillStyle = `rgba(255, 255, 200, ${0.7 - progress * 0.7})`;
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    
    // Central flash
    if (progress < 0.3) {
      const flashOpacity = Math.max(0, 1 - progress * 3.3);
      ctx.fillStyle = `rgba(255, 255, 200, ${flashOpacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size * 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Accretion event - spiraling matter into black hole
  private renderAccretionEvent(x: number, y: number, size: number, progress: number) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Spiraling particles into the black hole
    const particleCount = 40;
    const maxRadius = size * 30 * (1 - progress * 0.7); // Shrinks as matter falls in
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const spiralProgress = (t + progress) % 1;
      const radius = maxRadius * (1 - spiralProgress);
      const angle = spiralProgress * Math.PI * 10;
      
      const particleX = x + Math.cos(angle) * radius;
      const particleY = y + Math.sin(angle) * radius;
      const particleSize = size * 0.3 * (1 - spiralProgress);
      
      // Color changes as it gets closer to the black hole (hotter)
      let particleColor;
      if (spiralProgress < 0.3) {
        particleColor = `rgba(255, 200, 100, ${0.7 - progress * 0.4})`;
      } else if (spiralProgress < 0.7) {
        particleColor = `rgba(255, 150, 50, ${0.7 - progress * 0.4})`;
      } else {
        particleColor = `rgba(255, 50, 50, ${0.7 - progress * 0.4})`;
      }
      
      ctx.fillStyle = particleColor;
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Add trailing effect
      ctx.strokeStyle = particleColor.replace('0.7', '0.3');
      ctx.lineWidth = particleSize * 0.5;
      ctx.beginPath();
      ctx.moveTo(particleX, particleY);
      const trailAngle = angle - 0.2;
      const trailLength = radius * 0.1;
      ctx.lineTo(
        x + Math.cos(trailAngle) * (radius + trailLength),
        y + Math.sin(trailAngle) * (radius + trailLength)
      );
      ctx.stroke();
    }
    
    // Central black hole gets slightly larger
    const holeSize = size * (1 + progress * 0.2);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x, y, holeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Event horizon glow
    const glowGradient = ctx.createRadialGradient(x, y, holeSize, x, y, holeSize * 1.5);
    glowGradient.addColorStop(0, `rgba(100, 100, 255, ${0.5 - progress * 0.3})`);
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, holeSize * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Minor impact - small flash and particles
  private renderMinorImpact(x: number, y: number, size: number, progress: number) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Quick flash
    if (progress < 0.3) {
      const flashOpacity = Math.max(0, 0.5 - progress * 1.6);
      ctx.fillStyle = `rgba(255, 255, 200, ${flashOpacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Small debris particles
    const particleCount = 10;
    const maxDistance = size * 10 * progress;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = maxDistance * (0.2 + Math.random() * 0.8);
      
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y + Math.sin(angle) * distance;
      const particleSize = size * 0.2 * (1 - progress);
      
      ctx.fillStyle = `rgba(200, 200, 200, ${0.7 - progress * 0.7})`;
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Render scanning effect when a cosmic body is being analyzed
  private renderScanEffect(plant: Plant, screenX: number, screenY: number, screenSize: number) {
    if (!this.ctx || plant.cosmicProperties.scanProgress === undefined) return;
    
    const ctx = this.ctx;
    const progress = plant.cosmicProperties.scanProgress;
    const scanRadius = screenSize * 15;
    
    // Scanning ring
    const ringWidth = 2;
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.7)';
    ctx.lineWidth = ringWidth;
    ctx.beginPath();
    ctx.arc(screenX, screenY, scanRadius, 0, Math.PI * 2 * progress);
    ctx.stroke();
    
    // Scanning endpoints
    const endAngle = Math.PI * 2 * progress;
    const endX = screenX + Math.cos(endAngle) * scanRadius;
    const endY = screenY + Math.sin(endAngle) * scanRadius;
    
    ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(endX, endY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Scanning lines (crosshair effect)
    const lineCount = 4;
    for (let i = 0; i < lineCount; i++) {
      const lineAngle = (i / lineCount) * Math.PI * 2;
      const innerRadius = scanRadius * 0.5;
      const outerRadius = scanRadius * 0.9;
      
      const innerX = screenX + Math.cos(lineAngle) * innerRadius;
      const innerY = screenY + Math.sin(lineAngle) * innerRadius;
      const outerX = screenX + Math.cos(lineAngle) * outerRadius;
      const outerY = screenY + Math.sin(lineAngle) * outerRadius;
      
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();
    }
    
    // Scan info text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Scanning... ${Math.floor(progress * 100)}%`, screenX, screenY + scanRadius + 15);
    
    // When scan is almost complete, flash scan result elements
    if (progress > 0.95) {
      const flashOpacity = (Math.sin(Date.now() / 50) + 1) * 0.5;
      ctx.fillStyle = `rgba(100, 200, 255, ${flashOpacity})`;
      ctx.beginPath();
      ctx.arc(screenX, screenY, scanRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}