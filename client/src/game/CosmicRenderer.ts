import { Plant } from './Plant';

/**
 * A specialized renderer for cosmic bodies when exploring them
 * This handles the visual representation of galaxies, stars, planets, etc.
 */
// Helper function to adjust colors for shading effects
function adjustColor(color: string, amount: number): string {
  // Parse the hex color
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Adjust each channel
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  
  // For non-hex colors, return original
  return color;
}

export class CosmicRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private width: number;
  private height: number;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }
  
  /**
   * Render the interior of a cosmic body
   */
  renderCosmicInterior(cosmicBody: Plant): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.width, this.height);
    
    // Render background based on cosmic body type
    this.renderBackground(cosmicBody);
    
    // Add animated particle effects based on cosmic body type
    this.renderParticleEffects(cosmicBody);
    
    // Render interior objects if any
    if (cosmicBody.interior && cosmicBody.interior.length > 0) {
      for (const innerObject of cosmicBody.interior) {
        this.renderInteriorObject(innerObject);
        
        // Add connection lines between related objects (like planets to their star)
        if (innerObject.parent) {
          this.renderConnectionLine(innerObject, innerObject.parent);
        }
      }
    }
    
    // Draw exit button in top-right corner
    this.renderExitButton();
    
    // Draw info panel at bottom
    this.renderInfoPanel(cosmicBody);
    
    // Add a subtle glow/pulse effect to interactable objects
    this.renderInteractionHints(cosmicBody);
  }
  
  // Add subtle animated particle effects based on cosmic body type
  private renderParticleEffects(cosmicBody: Plant): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const time = performance.now() / 1000;
    
    switch(cosmicBody.type) {
      case 'star':
        // Solar flares and ejections
        const flareCount = 5;
        for (let i = 0; i < flareCount; i++) {
          const angle = (i / flareCount) * Math.PI * 2 + time * 0.2;
          const size = 20 + Math.sin(time * 0.5 + i) * 10;
          const distance = 150 + Math.sin(time + i * 2) * 30;
          
          const x = this.width/2 + Math.cos(angle) * distance;
          const y = this.height/2 + Math.sin(angle) * distance;
          
          ctx.fillStyle = `rgba(255, 220, 50, ${0.2 + Math.sin(time + i) * 0.1})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'blackhole':
        // Orbiting particles being pulled into the event horizon
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
          const speed = 0.2 + (i / particleCount) * 0.5;
          const angle = (i / particleCount) * Math.PI * 2 + time * speed;
          // Spiral inward
          const distance = 250 - ((time * 20) % 200);
          
          const x = this.width/2 + Math.cos(angle) * distance;
          const y = this.height/2 + Math.sin(angle) * distance;
          
          const particleSize = 2 + (1 - distance/250) * 4;
          
          ctx.fillStyle = 'rgba(200, 200, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(x, y, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Add a trailing effect
          ctx.strokeStyle = 'rgba(100, 100, 255, 0.2)';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            this.width/2 + Math.cos(angle - 0.1) * (distance + 10),
            this.height/2 + Math.sin(angle - 0.1) * (distance + 10)
          );
          ctx.stroke();
        }
        break;
        
      case 'galaxy':
        // Cosmic rays and distant supernovas
        for (let i = 0; i < 3; i++) {
          const flash = Math.sin(time * 0.5 + i * 10) > 0.9;
          if (flash) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = 5 + Math.random() * 15;
            
            ctx.fillStyle = 'rgba(255, 255, 200, 0.4)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
            gradient.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
        
      case 'planet':
        if ((cosmicBody.cosmicProperties.atmosphere || 0) > 0.3) {
          // Cloud movement for planets with atmosphere
          const cloudCount = 6;
          for (let i = 0; i < cloudCount; i++) {
            const y = 50 + i * 30;
            const x = (this.width + 200 * i + time * (20 + i * 5)) % (this.width + 200) - 100;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.ellipse(x, y, 50 + i * 10, 20, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
    }
  }
  
  // Draw connection lines between related cosmic objects
  private renderConnectionLine(object: Plant, parent: Plant): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const time = performance.now() / 1000;
    
    // Only draw connections for planets to stars or moons to planets
    if ((object.type === 'planet' && parent.type === 'star') || 
        (object.type.includes('moon') && parent.type === 'planet')) {
      
      // Create a dotted orbit line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      // Draw an elliptical orbit path
      const centerX = parent.x;
      const centerY = parent.y;
      const distance = Math.sqrt(
        Math.pow(object.x - parent.x, 2) + 
        Math.pow(object.y - parent.y, 2)
      );
      
      ctx.ellipse(
        centerX, 
        centerY, 
        distance, 
        distance * 0.6, // Make it slightly elliptical
        Math.PI/4, // Rotation
        0, 
        Math.PI * 2
      );
      ctx.stroke();
      ctx.setLineDash([]); // Reset line style
    }
  }
  
  // Add visual hints for interactable objects
  private renderInteractionHints(cosmicBody: Plant): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const time = performance.now() / 1000;
    
    if (cosmicBody.interior) {
      for (const object of cosmicBody.interior) {
        if (object.isInteractable) {
          // Pulsating glow effect
          const pulseSize = Math.sin(time * 2) * 5 + 10;
          const alpha = 0.3 + Math.sin(time * 2) * 0.1;
          
          ctx.strokeStyle = `rgba(255, 255, 200, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            object.x, 
            object.y, 
            object.size * 30 + pulseSize, 
            0, 
            Math.PI * 2
          );
          ctx.stroke();
          
          // Small "explore" text hint
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Explore', object.x, object.y + object.size * 30 + 20);
        }
      }
    }
  }
  
  /**
   * Render appropriate background for the cosmic body
   */
  private renderBackground(cosmicBody: Plant): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    switch (cosmicBody.type) {
      case 'galaxy':
        // Space background with subtle nebula-like colors
        ctx.fillStyle = '#000005';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Add stars
        for (let i = 0; i < 300; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const size = Math.random() * 2 + 0.5;
          const opacity = 0.3 + Math.random() * 0.7;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add nebula colors based on galaxy type
        const galaxyType = cosmicBody.cosmicProperties.galaxyType || 'spiral';
        
        if (galaxyType === 'spiral') {
          // Draw spiral arms as subtle colored regions
          const centerX = this.width / 2;
          const centerY = this.height / 2;
          const arms = cosmicBody.cosmicProperties.spiralArms || 4;
          
          for (let a = 0; a < arms; a++) {
            const startAngle = (a / arms) * Math.PI * 2;
            
            for (let r = 50; r < 300; r += 20) {
              const angle = startAngle + (r * 0.01);
              const x = centerX + Math.cos(angle) * r;
              const y = centerY + Math.sin(angle) * r;
              
              ctx.fillStyle = 'rgba(100, 150, 255, 0.05)';
              ctx.beginPath();
              ctx.arc(x, y, 30 + Math.random() * 20, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (galaxyType === 'elliptical') {
          // Yellow-reddish glow for elliptical galaxies
          const gradient = ctx.createRadialGradient(
            this.width/2, this.height/2, 50,
            this.width/2, this.height/2, 300
          );
          gradient.addColorStop(0, 'rgba(255, 240, 180, 0.1)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(this.width/2, this.height/2, 300, 200, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'star':
        // Star atmosphere with color based on temperature
        const temp = cosmicBody.cosmicProperties.temperature || 5500;
        
        // Color based on temperature (blackbody radiation)
        let starColor;
        if (temp > 30000) starColor = '#AABFFF'; // Very hot blue
        else if (temp > 10000) starColor = '#F8F7FF'; // Blue-white
        else if (temp > 7500) starColor = '#FFFFFF'; // White
        else if (temp > 6000) starColor = '#FFF9F5'; // Yellow-white
        else if (temp > 5000) starColor = '#FFF5E9'; // Yellow (Sun-like)
        else if (temp > 3500) starColor = '#FFEBD1'; // Orange
        else starColor = '#FFD2A1'; // Red dwarf
        
        // Create gradient for star atmosphere
        const starGradient = ctx.createRadialGradient(
          this.width/2, this.height/2, 10,
          this.width/2, this.height/2, this.width/2
        );
        starGradient.addColorStop(0, starColor);
        starGradient.addColorStop(0.4, starColor.replace('FF', '80')); // Half opacity
        starGradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = starGradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Surface features (sunspots, flares) for stars
        const starType = cosmicBody.cosmicProperties.starType || 'main_sequence';
        
        if (starType === 'main_sequence' || starType === 'yellow_dwarf') {
          // Sunspots
          for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 100;
            const x = this.width/2 + Math.cos(angle) * dist;
            const y = this.height/2 + Math.sin(angle) * dist;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.arc(x, y, 10 + Math.random() * 20, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
        
      case 'planet':
        // Background depends on planet type
        const planetType = cosmicBody.cosmicProperties.planetType || 'rocky';
        
        if (planetType === 'rocky') {
          // Sky color based on atmosphere
          if (cosmicBody.habitability > 0.3) {
            // Earth-like blue sky
            ctx.fillStyle = '#87CEEB';
          } else {
            // Mars-like or airless
            ctx.fillStyle = '#000010';
          }
        } else if (planetType === 'gas_giant') {
          // Cloudy atmosphere
          ctx.fillStyle = '#E8C870';
        } else {
          // Default space background
          ctx.fillStyle = '#000010';
        }
        
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Add surface features
        if (planetType === 'rocky') {
          // Draw horizon line
          ctx.fillStyle = cosmicBody.habitability > 0.3 ? '#3A5F0B' : '#A27967';
          ctx.fillRect(0, this.height - 200, this.width, 200);
          
          // Add mountains
          ctx.fillStyle = cosmicBody.habitability > 0.3 ? '#2F4F0F' : '#8B4513';
          
          for (let i = 0; i < 7; i++) {
            const mtnHeight = 100 + Math.random() * 150;
            const x = (i * this.width/7) + Math.random() * 50 - 25;
            
            ctx.beginPath();
            ctx.moveTo(x - 60, this.height - 200);
            ctx.lineTo(x, this.height - 200 - mtnHeight);
            ctx.lineTo(x + 60, this.height - 200);
            ctx.fill();
          }
          
          // Add vegetation if habitable
          if (cosmicBody.habitability > 0.5 && cosmicBody.lifeComplexity > 0) {
            for (let i = 0; i < 20; i++) {
              const x = Math.random() * this.width;
              const size = 10 + Math.random() * 30;
              
              ctx.fillStyle = '#006400';
              ctx.beginPath();
              ctx.moveTo(x, this.height - 200);
              ctx.lineTo(x - size/2, this.height - 200 - size);
              ctx.lineTo(x + size/2, this.height - 200 - size);
              ctx.fill();
              
              // Tree trunk
              ctx.fillStyle = '#8B4513';
              ctx.fillRect(x - 3, this.height - 200 - size, 6, size/2);
            }
          }
        } else if (planetType === 'gas_giant') {
          // Gas bands
          const bands = 6;
          const bandHeight = this.height / bands;
          
          for (let i = 0; i < bands; i++) {
            if (i % 2 === 0) {
              ctx.fillStyle = '#D9BC6B';
            } else {
              ctx.fillStyle = '#C6995E';
            }
            ctx.fillRect(0, i * bandHeight, this.width, bandHeight);
          }
        }
        break;
        
      case 'blackhole':
        // Space background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Add stars with gravitational lensing effect
        for (let i = 0; i < 300; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 50 + Math.random() * 300;
          const distortion = 50 / Math.max(50, distance);
          
          // Calculate position with gravitational lensing
          const x = this.width/2 + Math.cos(angle) * distance * (1 - distortion * 0.5);
          const y = this.height/2 + Math.sin(angle) * distance * (1 - distortion * 0.5);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.ellipse(x, y, 1, 1 + distortion * 3, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw accretion disk
        const diskInner = 50;
        const diskOuter = 200;
        
        // Draw disk with temperature gradient
        const diskGradient = ctx.createRadialGradient(
          this.width/2, this.height/2, diskInner,
          this.width/2, this.height/2, diskOuter
        );
        diskGradient.addColorStop(0, 'rgba(255, 255, 200, 0.7)');
        diskGradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.5)');
        diskGradient.addColorStop(1, 'rgba(150, 0, 0, 0)');
        
        ctx.save();
        ctx.translate(this.width/2, this.height/2);
        ctx.rotate(Math.PI/4); // Tilt the disk
        
        ctx.fillStyle = diskGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, diskOuter, diskOuter/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cut out center
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(0, 0, diskInner, diskInner/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Draw event horizon
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.width/2, this.height/2, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Photon ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.width/2, this.height/2, 40, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      default:
        // Default space background
        ctx.fillStyle = '#000010';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Simple stars
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          const size = Math.random() * 2 + 0.5;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.6})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
    }
  }
  
  /**
   * Render objects inside a cosmic body
   */
  private renderInteriorObject(object: Plant): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const time = performance.now() / 1000;
    
    // Different rendering based on object type
    switch (object.type) {
      case 'star':
        // Draw star with enhanced visuals
        const starRadius = object.size * 30;
        const starGradient = ctx.createRadialGradient(
          object.x, object.y, 0,
          object.x, object.y, starRadius
        );
        
        // Color based on star type with more vibrant visuals
        let starColor = '#FFFFFF';
        let coronaColor = 'rgba(255, 255, 200, 0.15)';
        let flareColor = 'rgba(255, 255, 150, 0.3)';
        
        const starType = object.cosmicProperties.starType;
        if (starType === 'blue_giant') {
          starColor = '#AABFFF';
          coronaColor = 'rgba(170, 200, 255, 0.15)';
          flareColor = 'rgba(150, 200, 255, 0.3)';
        }
        else if (starType === 'yellow_dwarf') {
          starColor = '#FFF5E9';
          coronaColor = 'rgba(255, 250, 220, 0.15)';
          flareColor = 'rgba(255, 220, 130, 0.3)';
        }
        else if (starType === 'red_dwarf') {
          starColor = '#FFD2A1';
          coronaColor = 'rgba(255, 200, 150, 0.15)';
          flareColor = 'rgba(255, 150, 100, 0.3)';
        }
        else if (starType === 'red_giant') {
          starColor = '#FF6347';
          coronaColor = 'rgba(255, 120, 80, 0.2)';
          flareColor = 'rgba(255, 100, 50, 0.4)';
        }
        else if (starType === 'neutron') {
          starColor = '#E6E6FA';
          coronaColor = 'rgba(180, 180, 255, 0.25)';
          flareColor = 'rgba(200, 200, 255, 0.5)';
        }
        
        // Core gradient 
        starGradient.addColorStop(0, starColor);
        starGradient.addColorStop(0.4, starColor.replace('FF', '90')); // Higher opacity
        starGradient.addColorStop(0.8, starColor.replace('FF', '40')); // Lower opacity
        starGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // Draw the main star body
        ctx.fillStyle = starGradient;
        ctx.beginPath();
        ctx.arc(object.x, object.y, starRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add corona (extended atmosphere)
        const coronaGradient = ctx.createRadialGradient(
          object.x, object.y, starRadius * 0.9,
          object.x, object.y, starRadius * 2.5
        );
        coronaGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        coronaGradient.addColorStop(0.3, coronaColor);
        coronaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = coronaGradient;
        ctx.beginPath();
        ctx.arc(object.x, object.y, starRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Add solar flares (random around the circumference)
        const flareCount = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < flareCount; i++) {
          const flareAngle = (i / flareCount) * Math.PI * 2 + time * 0.1;
          const flareSize = starRadius * (0.3 + Math.sin(time + i) * 0.2);
          
          ctx.fillStyle = flareColor;
          ctx.beginPath();
          ctx.moveTo(object.x, object.y);
          
          const x1 = object.x + Math.cos(flareAngle - 0.1) * starRadius;
          const y1 = object.y + Math.sin(flareAngle - 0.1) * starRadius;
          
          const x2 = object.x + Math.cos(flareAngle) * (starRadius + flareSize);
          const y2 = object.y + Math.sin(flareAngle) * (starRadius + flareSize);
          
          const x3 = object.x + Math.cos(flareAngle + 0.1) * starRadius;
          const y3 = object.y + Math.sin(flareAngle + 0.1) * starRadius;
          
          ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
          ctx.fill();
        }
        
        // Add surface features (sunspots)
        const spotCount = Math.floor(Math.random() * 5);
        for (let i = 0; i < spotCount; i++) {
          const spotAngle = Math.random() * Math.PI * 2;
          const spotDist = starRadius * (0.2 + Math.random() * 0.6);
          const spotX = object.x + Math.cos(spotAngle) * spotDist;
          const spotY = object.y + Math.sin(spotAngle) * spotDist;
          const spotSize = starRadius * (0.05 + Math.random() * 0.1);
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'planet':
        // Enhanced planet rendering with detailed features
        const planetRadius = object.size * 20;
        let planetBaseColor = '#A9A9A9'; // Default gray
        let surfacePattern = null;
        let hasRings = false;
        let hasAtmosphere = (object.cosmicProperties.atmosphere || 0) > 0.2;
        let hasIce = false;
        let hasWater = object.cosmicProperties.hydrosphere && object.cosmicProperties.hydrosphere > 0.2;
        
        // Color and features based on planet type
        const planetType = object.cosmicProperties.planetType;
        if (planetType === 'rocky') {
          // Earth-like or Mars-like
          if (object.habitability > 0.5) {
            // Earth-like with oceans and land
            planetBaseColor = '#4B6F8C';
            hasWater = true;
            hasIce = Math.random() > 0.7; // Polar ice caps
          } else if (object.habitability > 0.3) {
            // Less habitable but still has some water/atmosphere
            planetBaseColor = '#6B8E59';
            hasWater = Math.random() > 0.5;
          } else {
            // Mars-like or Mercury-like desert planet
            planetBaseColor = '#C27E60';
          }
        } else if (planetType === 'gas_giant') {
          // Jupiter or Saturn-like
          planetBaseColor = '#E8C870';
          hasRings = Math.random() > 0.5; // 50% chance for rings
          hasAtmosphere = true;
        } else if (planetType === 'ice_giant') {
          // Neptune or Uranus-like
          planetBaseColor = '#5B7FDA';
          hasRings = Math.random() > 0.7; // 30% chance for rings
          hasAtmosphere = true;
          hasIce = true;
        }
        
        // Draw the planet base with gradient
        const planetGradient = ctx.createRadialGradient(
          object.x, object.y, 0,
          object.x, object.y, planetRadius
        );
        
        // Add shading to create 3D appearance
        const shadowColor = adjustColor(planetBaseColor, -30);
        const highlightColor = adjustColor(planetBaseColor, 20);
        
        planetGradient.addColorStop(0, highlightColor);
        planetGradient.addColorStop(0.5, planetBaseColor);
        planetGradient.addColorStop(1, shadowColor);
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(object.x, object.y, planetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add planet surface features
        if (planetType === 'rocky') {
          // Add terrain features (continents, craters, etc.)
          const featureCount = 5 + Math.floor(Math.random() * 10);
          
          for (let i = 0; i < featureCount; i++) {
            const featureAngle = Math.random() * Math.PI * 2;
            const featureDist = planetRadius * (Math.random() * 0.8);
            const featureX = object.x + Math.cos(featureAngle) * featureDist;
            const featureY = object.y + Math.sin(featureAngle) * featureDist;
            const featureSize = planetRadius * (0.1 + Math.random() * 0.2);
            
            // Create landmass or crater
            if (object.habitability > 0.3) {
              // Landmass for habitable planets
              ctx.fillStyle = '#5B8C59'; // Green land
              ctx.beginPath();
              
              // Use irregular shapes for continents
              ctx.moveTo(featureX, featureY);
              for (let j = 0; j < 8; j++) {
                const angle = (j / 8) * Math.PI * 2;
                const distance = featureSize * (0.7 + Math.random() * 0.6);
                ctx.lineTo(
                  featureX + Math.cos(angle) * distance,
                  featureY + Math.sin(angle) * distance
                );
              }
              ctx.closePath();
              ctx.fill();
            } else {
              // Craters for non-habitable planets
              ctx.fillStyle = adjustColor(planetBaseColor, -20);
              ctx.beginPath();
              ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
              ctx.fill();
              
              // Crater rim
              ctx.strokeStyle = adjustColor(planetBaseColor, 10);
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(featureX, featureY, featureSize, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
          
          // Add polar ice caps if applicable
          if (hasIce) {
            // North pole
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.ellipse(
              object.x, 
              object.y - planetRadius * 0.7, 
              planetRadius * 0.5, 
              planetRadius * 0.3, 
              0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // South pole
            ctx.beginPath();
            ctx.ellipse(
              object.x, 
              object.y + planetRadius * 0.7, 
              planetRadius * 0.4, 
              planetRadius * 0.25, 
              0, 0, Math.PI * 2
            );
            ctx.fill();
          }
        } else if (planetType === 'gas_giant') {
          // Add atmospheric bands for gas giants
          const bandCount = 5 + Math.floor(Math.random() * 4);
          const bandColors = ['#D9BC6B', '#C6995E', '#E8C870', '#B3955F'];
          
          for (let i = 1; i < bandCount; i++) {
            const y = object.y - planetRadius + (planetRadius * 2 * i / bandCount);
            const bandHeight = planetRadius * 2 / bandCount;
            const bandWidth = Math.sqrt(planetRadius * planetRadius - Math.pow(y - object.y, 2)) * 2;
            
            if (bandWidth > 0) {
              // Alternating band colors
              ctx.fillStyle = bandColors[i % bandColors.length];
              ctx.globalAlpha = 0.3;
              ctx.beginPath();
              ctx.rect(object.x - bandWidth/2, y - bandHeight/2, bandWidth, bandHeight);
              ctx.fill();
              ctx.globalAlpha = 1.0;
            }
          }
          
          // Add the Great Spot (like Jupiter's Great Red Spot)
          if (Math.random() > 0.6) {
            const spotX = object.x + planetRadius * 0.3;
            const spotY = object.y + planetRadius * 0.2;
            
            ctx.fillStyle = '#C74E3C'; // Reddish spot
            ctx.beginPath();
            ctx.ellipse(spotX, spotY, planetRadius * 0.25, planetRadius * 0.15, Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // Add rings for planets like Saturn
        if (hasRings) {
          const innerRadius = planetRadius * 1.3;
          const outerRadius = planetRadius * 2.2;
          
          // Create ring gradient
          const ringGradient = ctx.createRadialGradient(
            object.x, object.y, innerRadius,
            object.x, object.y, outerRadius
          );
          
          ringGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          ringGradient.addColorStop(0.3, 'rgba(200, 200, 200, 0.5)');
          ringGradient.addColorStop(0.7, 'rgba(180, 180, 180, 0.3)');
          ringGradient.addColorStop(1, 'rgba(150, 150, 150, 0)');
          
          // Draw rings as an ellipse (perspective effect)
          ctx.fillStyle = ringGradient;
          ctx.beginPath();
          ctx.ellipse(
            object.x, object.y,
            outerRadius,
            outerRadius * 0.2, // Flattened for perspective
            0, 0, Math.PI * 2
          );
          ctx.fill();
          
          // Clear the inner part of the rings (the hole)
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.ellipse(
            object.x, object.y,
            innerRadius,
            innerRadius * 0.2, // Flattened for perspective
            0, 0, Math.PI * 2
          );
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          
          // Add ring detail (divisions in the rings)
          const ringDivisions = 3;
          for (let i = 1; i < ringDivisions; i++) {
            const divRadius = innerRadius + (outerRadius - innerRadius) * (i / ringDivisions);
            
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(
              object.x, object.y,
              divRadius,
              divRadius * 0.2, // Flattened for perspective
              0, 0, Math.PI * 2
            );
            ctx.stroke();
          }
        }
        
        // Add atmosphere glow for planets with atmosphere
        if (hasAtmosphere) {
          const atmGradient = ctx.createRadialGradient(
            object.x, object.y, planetRadius * 0.95,
            object.x, object.y, planetRadius * 1.3
          );
          
          let atmColor = 'rgba(150, 150, 150, 0.3)';
          if (object.habitability > 0.3) {
            // Earth-like blue atmosphere
            atmColor = 'rgba(100, 150, 255, 0.3)';
          } else if (planetType === 'gas_giant') {
            // Gas giant atmosphere
            atmColor = 'rgba(255, 240, 150, 0.3)';
          } else if (planetType === 'ice_giant') {
            // Ice giant atmosphere
            atmColor = 'rgba(150, 200, 255, 0.3)';
          }
          
          atmGradient.addColorStop(0, atmColor);
          atmGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = atmGradient;
          ctx.beginPath();
          ctx.arc(object.x, object.y, planetRadius * 1.3, 0, Math.PI * 2);
          ctx.fill();
          
          // Add cloud cover for planets with substantial atmosphere
          if ((object.cosmicProperties.atmosphere || 0) > 0.4) {
            const cloudCount = Math.floor(Math.random() * 10) + 5;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            
            for (let i = 0; i < cloudCount; i++) {
              const cloudAngle = Math.random() * Math.PI * 2;
              const cloudDist = planetRadius * (0.6 + Math.random() * 0.4);
              const cloudX = object.x + Math.cos(cloudAngle) * cloudDist;
              const cloudY = object.y + Math.sin(cloudAngle) * cloudDist;
              const cloudSize = planetRadius * (0.1 + Math.random() * 0.15);
              
              // Cloud formations
              ctx.beginPath();
              ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
              ctx.fill();
              
              // Add some smaller cloud formations around the main one
              const smallCloudCount = Math.floor(Math.random() * 3) + 1;
              for (let j = 0; j < smallCloudCount; j++) {
                const smallAngle = Math.random() * Math.PI * 2;
                const smallDist = cloudSize * Math.random();
                const smallX = cloudX + Math.cos(smallAngle) * smallDist;
                const smallY = cloudY + Math.sin(smallAngle) * smallDist;
                const smallSize = cloudSize * (0.4 + Math.random() * 0.3);
                
                ctx.beginPath();
                ctx.arc(smallX, smallY, smallSize, 0, Math.PI * 2);
                ctx.fill();
              }
            }
            
            // Add dynamic weather patterns (storms, cyclones) for planets with atmosphere
            if (Math.random() > 0.7) {
              const stormX = object.x + planetRadius * (Math.random() * 0.6 - 0.3);
              const stormY = object.y + planetRadius * (Math.random() * 0.6 - 0.3);
              const stormSize = planetRadius * (0.15 + Math.random() * 0.1);
              
              // Create a spinning storm effect
              const stormGradient = ctx.createRadialGradient(
                stormX, stormY, 0,
                stormX, stormY, stormSize
              );
              
              if (planetType === 'gas_giant') {
                stormGradient.addColorStop(0, 'rgba(255, 100, 50, 0.3)');
                stormGradient.addColorStop(0.7, 'rgba(255, 150, 100, 0.1)');
              } else {
                stormGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                stormGradient.addColorStop(0.7, 'rgba(200, 200, 255, 0.1)');
              }
              stormGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
              
              ctx.fillStyle = stormGradient;
              ctx.beginPath();
              ctx.arc(stormX, stormY, stormSize, 0, Math.PI * 2);
              ctx.fill();
              
              // Add spiral effect for the storm
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              
              for (let angle = 0; angle < Math.PI * 6; angle += 0.1) {
                const radius = (angle / (Math.PI * 6)) * stormSize;
                const x = stormX + Math.cos(angle) * radius;
                const y = stormY + Math.sin(angle) * radius;
                
                if (angle === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }
              
              ctx.stroke();
            }
          }
        }
        break;
        
      case 'blackhole':
        // Enhanced black hole with realistic physics effects
        const horizonRadius = object.size * 20;
        const isRotating = object.cosmicProperties.isRotating || Math.random() > 0.5;
        const hasAccretionDisk = object.cosmicProperties.accretionDisk || Math.random() > 0.3;
        
        // Create gravitational lensing effect in background
        // This simulates how light bends around the intense gravity well
        const lensGradient = ctx.createRadialGradient(
          object.x, object.y, horizonRadius * 0.8,
          object.x, object.y, horizonRadius * 5
        );
        lensGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        lensGradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.9)');
        lensGradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.7)');
        lensGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = lensGradient;
        ctx.beginPath();
        ctx.arc(object.x, object.y, horizonRadius * 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw distorted starfield around black hole (gravitational lensing)
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = horizonRadius * (2 + Math.random() * 4);
          
          // Calculate gravitational lensing effect
          // Stars appear to curve around the black hole
          const distortion = Math.pow(horizonRadius / Math.max(horizonRadius, distance), 2) * 2;
          const distortedAngle = angle + distortion * (Math.PI / 8) * Math.sin(angle * 2);
          
          // Calculate position with distortion
          const x = object.x + Math.cos(distortedAngle) * distance;
          const y = object.y + Math.sin(distortedAngle) * distance;
          
          // Stars get stretched as they approach the event horizon
          const stretchFactor = Math.min(5, horizonRadius / (distance - horizonRadius));
          const stretchAngle = distortedAngle + (Math.PI / 2);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          
          if (distance < horizonRadius * 3) {
            // Stretched stars due to gravitational lensing
            ctx.ellipse(
              x, y, 
              1 + stretchFactor, 
              1,
              stretchAngle,
              0, Math.PI * 2
            );
          } else {
            // Normal stars farther away
            ctx.arc(x, y, 1, 0, Math.PI * 2);
          }
          
          ctx.fill();
        }
        
        // Event horizon (the black part)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(object.x, object.y, horizonRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Photon sphere - where light orbits the black hole
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(object.x, object.y, horizonRadius * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Accretion disk with temperature gradient and turbulent flow
        if (hasAccretionDisk) {
          ctx.save();
          ctx.translate(object.x, object.y);
          
          // Rotating accretion disk
          const rotationAngle = isRotating ? (time * 0.1) % (Math.PI * 2) : Math.PI/4;
          ctx.rotate(rotationAngle);
          
          // Multiple layers for the accretion disk
          const innerRadius = horizonRadius * 1.2;
          const outerRadius = horizonRadius * 4;
          
          // Inner hot accretion disk
          const diskGradient = ctx.createRadialGradient(
            0, 0, innerRadius,
            0, 0, outerRadius
          );
          
          // Hot blue-white near event horizon, cooler red/orange further out
          diskGradient.addColorStop(0, 'rgba(200, 230, 255, 0.9)');
          diskGradient.addColorStop(0.2, 'rgba(255, 255, 200, 0.8)');
          diskGradient.addColorStop(0.4, 'rgba(255, 200, 100, 0.7)');
          diskGradient.addColorStop(0.7, 'rgba(255, 100, 50, 0.5)');
          diskGradient.addColorStop(1, 'rgba(100, 30, 0, 0)');
          
          ctx.fillStyle = diskGradient;
          ctx.beginPath();
          ctx.ellipse(0, 0, outerRadius, outerRadius * 0.2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Cut out the inner part where material falls into black hole
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.ellipse(0, 0, innerRadius, innerRadius * 0.2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          
          // Add turbulent flow patterns in the disk
          const turbulenceCount = 12;
          for (let i = 0; i < turbulenceCount; i++) {
            const turbAngle = (i / turbulenceCount) * Math.PI * 2;
            const turbDistance = innerRadius + Math.random() * (outerRadius - innerRadius);
            const turbSize = (outerRadius - innerRadius) * 0.1;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            
            // Spiral arm turbulence patterns
            ctx.arc(
              Math.cos(turbAngle) * turbDistance,
              Math.sin(turbAngle) * turbDistance * 0.2,
              turbSize * (0.5 + Math.sin(time * 2 + i) * 0.5),
              0, Math.PI * 2
            );
            ctx.fill();
          }
          
          // Relativistic jets for active black holes
          if (object.cosmicProperties.isActive) {
            // Jet length depends on black hole energy/activity
            const jetLength = horizonRadius * (4 + Math.random() * 6);
            const jetWidth = horizonRadius * 0.4;
            
            // Draw two opposing jets along rotation axis
            for (let j = 0; j < 2; j++) {
              const jetAngle = j === 0 ? Math.PI/2 : -Math.PI/2;
              const jetDir = j === 0 ? -1 : 1;
              
              // Create jet gradient
              const jetGradient = ctx.createLinearGradient(
                0, 0,
                0, jetLength * jetDir
              );
              
              jetGradient.addColorStop(0, 'rgba(160, 200, 255, 0.9)');
              jetGradient.addColorStop(0.3, 'rgba(120, 170, 255, 0.7)');
              jetGradient.addColorStop(0.7, 'rgba(80, 140, 255, 0.4)');
              jetGradient.addColorStop(1, 'rgba(50, 100, 255, 0)');
              
              ctx.fillStyle = jetGradient;
              
              // Jet beam
              ctx.beginPath();
              ctx.moveTo(-jetWidth/2, 0);
              ctx.lineTo(jetWidth/2, 0);
              ctx.lineTo(jetWidth * 1.5, jetLength * jetDir);
              ctx.lineTo(-jetWidth * 1.5, jetLength * jetDir);
              ctx.closePath();
              ctx.fill();
              
              // Add shock patterns in the jet
              const shockCount = 5;
              for (let s = 1; s <= shockCount; s++) {
                const shockDist = (jetLength * s / shockCount) * jetDir;
                const shockWidth = jetWidth * (1 + (s / shockCount));
                
                ctx.strokeStyle = 'rgba(200, 230, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-shockWidth/2, shockDist);
                ctx.lineTo(shockWidth/2, shockDist);
                ctx.stroke();
              }
            }
          }
          
          ctx.restore();
        }
        
        // Hawking radiation (quantum effect at event horizon)
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = horizonRadius * (0.95 + Math.random() * 0.1);
          
          const x = object.x + Math.cos(angle) * distance;
          const y = object.y + Math.sin(angle) * distance;
          
          const particleSize = 1 + Math.random();
          
          // Particles appear and disappear at the horizon
          if (Math.sin(time * 5 + i * 10) > 0.7) {
            ctx.fillStyle = 'rgba(150, 220, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(x, y, particleSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // Add ergosphere for rotating black holes
        if (isRotating) {
          const ergosphereRadius = horizonRadius * 1.8;
          
          // Subtle ergosphere boundary
          ctx.strokeStyle = 'rgba(50, 100, 255, 0.15)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(object.x, object.y, ergosphereRadius, 0, Math.PI * 2);
          ctx.stroke();
          
          // Frame dragging effect (space being pulled around the black hole)
          const dragCount = 8;
          for (let i = 0; i < dragCount; i++) {
            const dragAngle = (i / dragCount) * Math.PI * 2;
            
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)';
            ctx.lineWidth = 2;
            
            // Draw curved lines showing space being dragged
            ctx.beginPath();
            ctx.arc(
              object.x, object.y,
              horizonRadius * 2.5,
              dragAngle, 
              dragAngle + Math.PI/4
            );
            ctx.stroke();
          }
        }
        break;
        
      case 'neutron_star':
        // Enhanced neutron star with magnetic field and pulsar effects
        const neutronRadius = object.size * 15;
        
        // Neutron stars have extremely strong magnetic fields
        // These cause beams of radiation to stream from the magnetic poles
        const rotationSpeed = 0.5 + Math.random() * 1.5; // Some neutron stars rotate extremely fast
        const rotationAngle = (time * rotationSpeed) % (Math.PI * 2);
        
        // Intense magnetic field around neutron star
        const magneticFieldGradient = ctx.createRadialGradient(
          object.x, object.y, neutronRadius,
          object.x, object.y, neutronRadius * 4
        );
        
        magneticFieldGradient.addColorStop(0, 'rgba(150, 200, 255, 0.4)');
        magneticFieldGradient.addColorStop(0.3, 'rgba(100, 150, 255, 0.2)');
        magneticFieldGradient.addColorStop(0.7, 'rgba(80, 120, 255, 0.1)');
        magneticFieldGradient.addColorStop(1, 'rgba(50, 100, 255, 0)');
        
        ctx.fillStyle = magneticFieldGradient;
        ctx.beginPath();
        ctx.arc(object.x, object.y, neutronRadius * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Main neutron star body - extremely dense, small and bright
        // Draw core with a bright bluish-white gradient
        const coreGradient = ctx.createRadialGradient(
          object.x, object.y, 0,
          object.x, object.y, neutronRadius
        );
        
        coreGradient.addColorStop(0, '#FFFFFF'); // Pure white center
        coreGradient.addColorStop(0.4, '#E6E6FA'); // Lavender white
        coreGradient.addColorStop(0.7, '#B0C4DE'); // Light steel blue
        coreGradient.addColorStop(1, '#4169E1'); // Royal blue edge
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(object.x, object.y, neutronRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add pulsar beams - these rotate with the star
        ctx.save();
        ctx.translate(object.x, object.y);
        ctx.rotate(rotationAngle);
        
        // Draw pulsar beams from magnetic poles
        const beamLength = neutronRadius * 8;
        const beamWidth = neutronRadius * 0.7;
        
        // First beam
        const beam1Gradient = ctx.createLinearGradient(
          0, -neutronRadius,
          0, -beamLength
        );
        
        beam1Gradient.addColorStop(0, 'rgba(200, 220, 255, 0.8)');
        beam1Gradient.addColorStop(0.4, 'rgba(150, 180, 255, 0.6)');
        beam1Gradient.addColorStop(0.7, 'rgba(100, 150, 255, 0.4)');
        beam1Gradient.addColorStop(1, 'rgba(80, 120, 255, 0)');
        
        ctx.fillStyle = beam1Gradient;
        
        // Draw curved/cone-shaped beam
        ctx.beginPath();
        ctx.moveTo(-beamWidth/2, -neutronRadius);
        ctx.lineTo(beamWidth/2, -neutronRadius);
        ctx.lineTo(beamWidth, -beamLength);
        ctx.lineTo(-beamWidth, -beamLength);
        ctx.closePath();
        ctx.fill();
        
        // Second beam (opposite pole)
        const beam2Gradient = ctx.createLinearGradient(
          0, neutronRadius,
          0, beamLength
        );
        
        beam2Gradient.addColorStop(0, 'rgba(200, 220, 255, 0.8)');
        beam2Gradient.addColorStop(0.4, 'rgba(150, 180, 255, 0.6)');
        beam2Gradient.addColorStop(0.7, 'rgba(100, 150, 255, 0.4)');
        beam2Gradient.addColorStop(1, 'rgba(80, 120, 255, 0)');
        
        ctx.fillStyle = beam2Gradient;
        
        ctx.beginPath();
        ctx.moveTo(-beamWidth/2, neutronRadius);
        ctx.lineTo(beamWidth/2, neutronRadius);
        ctx.lineTo(beamWidth, beamLength);
        ctx.lineTo(-beamWidth, beamLength);
        ctx.closePath();
        ctx.fill();
        
        // Add pulsing effect to the beams
        const pulseOpacity = 0.3 + Math.sin(time * 10) * 0.2;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
        
        // Pulse in first beam
        ctx.beginPath();
        ctx.arc(0, -beamLength * 0.5, beamWidth * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulse in second beam
        ctx.beginPath();
        ctx.arc(0, beamLength * 0.5, beamWidth * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore(); // Restore coordinate system
        
        // Add intense surface features - neutron star "mountains" 
        // (tiny on a neutron star but have enormous mass)
        const mountainCount = 6;
        for (let i = 0; i < mountainCount; i++) {
          const mountainAngle = (i / mountainCount) * Math.PI * 2;
          const mountainX = object.x + Math.cos(mountainAngle) * neutronRadius;
          const mountainY = object.y + Math.sin(mountainAngle) * neutronRadius;
          
          // These features are extremely small on neutron stars
          const mountainSize = neutronRadius * 0.1;
          
          ctx.fillStyle = '#E6E6FA'; // Slightly different color for surface features
          ctx.beginPath();
          ctx.arc(mountainX, mountainY, mountainSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add "starquakes" - sudden shifts in the neutron star crust
        if (Math.random() > 0.85) { // Occasional starquake
          const quakeAngle = Math.random() * Math.PI * 2;
          const quakeX = object.x + Math.cos(quakeAngle) * neutronRadius * 0.8;
          const quakeY = object.y + Math.sin(quakeAngle) * neutronRadius * 0.8;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(quakeX, quakeY, neutronRadius * 0.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Shockwave from starquake
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(quakeX, quakeY, neutronRadius * 0.4, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
        
      default:
        // Default simple object
        ctx.fillStyle = object.color || '#FFFFFF';
        ctx.beginPath();
        ctx.arc(object.x, object.y, object.size * 10, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // For interactable objects, draw a highlight and label
    if (object.isInteractable) {
      // Highlight glow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(object.x, object.y, object.size * 30 + 5, 0, Math.PI * 2);
      ctx.stroke();
      
      // Label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(object.x - 40, object.y + 30, 80, 20);
      
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(object.type.toUpperCase(), object.x, object.y + 44);
    }
  }
  
  /**
   * Render the exit button to return from cosmic exploration
   */
  private renderExitButton(): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Exit button background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.width - 80, 10, 70, 30);
    
    // Exit text
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', this.width - 45, 30);
  }
  
  /**
   * Render scientific information panel about the cosmic body
   */
  private renderInfoPanel(cosmicBody: Plant): void {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // Panel background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, this.height - 70, this.width - 20, 60);
    
    // Title based on cosmic body type
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    let title = '';
    switch(cosmicBody.type) {
      case 'galaxy':
        title = 'GALACTIC DATA';
        break;
      case 'star':
        title = 'STELLAR PROPERTIES';
        break;
      case 'planet':
        title = 'PLANETARY DATA';
        break;
      case 'blackhole':
        title = 'BLACK HOLE PHYSICS';
        break;
      default:
        title = 'COSMIC PROPERTIES';
    }
    
    ctx.fillText(title, 20, this.height - 45);
    
    // Scientific details based on cosmic body type
    ctx.font = '14px Arial';
    
    switch(cosmicBody.type) {
      case 'galaxy':
        const galaxyType = cosmicBody.cosmicProperties.galaxyType || 'spiral';
        const starDensity = cosmicBody.cosmicProperties.starDensity || 0.5;
        
        ctx.fillText(`Type: ${galaxyType.charAt(0).toUpperCase() + galaxyType.slice(1)} Galaxy`, 20, this.height - 25);
        ctx.fillText(`Star Density: ${Math.round(starDensity * 100)}%`, 250, this.height - 25);
        
        if (galaxyType === 'spiral') {
          const spiralArms = cosmicBody.cosmicProperties.spiralArms || 4;
          ctx.fillText(`Spiral Arms: ${spiralArms}`, 450, this.height - 25);
        }
        break;
        
      case 'star':
        const starType = cosmicBody.cosmicProperties.starType || 'main_sequence';
        const temp = cosmicBody.cosmicProperties.temperature || 5500;
        const stellarMass = cosmicBody.cosmicProperties.stellarMass || 1;
        
        // Get spectral class based on temperature
        let spectralClass = 'G';
        if (temp > 30000) spectralClass = 'O';
        else if (temp > 10000) spectralClass = 'B';
        else if (temp > 7500) spectralClass = 'A';
        else if (temp > 6000) spectralClass = 'F';
        else if (temp > 5200) spectralClass = 'G';
        else if (temp > 3700) spectralClass = 'K';
        else spectralClass = 'M';
        
        ctx.fillText(`Type: ${starType.replace('_', ' ')}`, 20, this.height - 25);
        ctx.fillText(`Temperature: ${Math.round(temp)} K`, 250, this.height - 25);
        ctx.fillText(`Spectral Class: ${spectralClass}`, 450, this.height - 25);
        break;
        
      case 'planet':
        const planetType = cosmicBody.cosmicProperties.planetType || 'rocky';
        const atmosphere = cosmicBody.cosmicProperties.atmosphere || 0;
        
        ctx.fillText(`Type: ${planetType.charAt(0).toUpperCase() + planetType.slice(1)}`, 20, this.height - 25);
        ctx.fillText(`Atmosphere: ${Math.round(atmosphere * 100)}%`, 250, this.height - 25);
        
        if (cosmicBody.habitability > 0) {
          ctx.fillText(`Habitability: ${Math.round(cosmicBody.habitability * 100)}%`, 450, this.height - 25);
          
          if (cosmicBody.lifeComplexity > 0) {
            ctx.fillText(`Life: ${Math.round(cosmicBody.lifeComplexity * 100)}% complexity`, 650, this.height - 25);
          }
        }
        break;
        
      case 'blackhole':
        const bhMass = cosmicBody.cosmicProperties.stellarMass || 1000000;
        const schwarzschildRadius = (2.95 * bhMass / 1000000).toFixed(2);
        
        ctx.fillText(`Mass: ${bhMass.toExponential(2)} solar masses`, 20, this.height - 25);
        ctx.fillText(`Event Horizon: ${schwarzschildRadius} km`, 300, this.height - 25);
        ctx.fillText(`Type: ${bhMass > 100000 ? 'Supermassive' : 'Stellar Mass'}`, 550, this.height - 25);
        break;
    }
  }
}