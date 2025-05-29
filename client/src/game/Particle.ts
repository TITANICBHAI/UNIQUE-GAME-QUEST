export class Particle {
  public x: number;
  public y: number;
  public direction: number;
  public energy: number;
  public speed: number;
  public lifespan: number;
  public age: number = 0;
  public entangled: boolean = false;
  public entangledWith?: Particle; // Reference to entangled partner particle
  public wavelength: number;
  public phase: number;
  
  constructor(
    x: number,
    y: number,
    direction: number,
    energy: number,
    lifespan: number
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.energy = energy;
    this.lifespan = lifespan;
    this.speed = 30 + energy * 20; // Higher energy = faster movement
    this.wavelength = 4 + Math.random() * 6;
    this.phase = Math.random() * Math.PI * 2;
  }
  
  update(deltaTime: number, field: number[][]) {
    // Age the particle
    this.age += deltaTime;
    
    // Get field values at particle position
    const fieldX = Math.floor(this.x / 10);
    const fieldY = Math.floor(this.y / 10);
    
    let fieldValue = 0;
    if (fieldX >= 0 && fieldX < field.length && 
        fieldY >= 0 && fieldY < field[0].length) {
      fieldValue = field[fieldX][fieldY];
    }
    
    // Adjust direction based on field (quantum steering)
    if (!this.entangled) {
      // Particles tend to move towards areas of higher field potential
      this.direction += fieldValue * 0.1 * deltaTime;
    }
    
    // Wave-particle duality: particles move in a wave-like pattern
    const waveAmplitude = 20 * this.energy;
    const waveOffset = Math.sin(this.age * 5 + this.phase) * waveAmplitude;
    
    // Calculate new position with wave motion
    const normalDirection = this.direction + Math.PI/2;
    const waveX = Math.cos(normalDirection) * waveOffset;
    const waveY = Math.sin(normalDirection) * waveOffset;
    
    this.x += Math.cos(this.direction) * this.speed * deltaTime + waveX * deltaTime;
    this.y += Math.sin(this.direction) * this.speed * deltaTime + waveY * deltaTime;
    
    // Particles lose energy over time
    this.energy -= 0.02 * deltaTime;
    if (this.energy < 0) this.energy = 0;
    
    // Update speed based on energy
    this.speed = Math.max(10, 30 + this.energy * 20);
  }
  
  isDead(): boolean {
    return this.age >= this.lifespan || this.energy <= 0;
  }
}
