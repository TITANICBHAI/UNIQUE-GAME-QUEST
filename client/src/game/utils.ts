/**
 * Generate perlin noise for the quantum field
 */
export function generatePerlinNoise(width: number, height: number, scale: number = 0.1): number[][] {
  // Create an array to store the perlin noise values
  const noiseArray: number[][] = Array(width)
    .fill(0)
    .map(() => Array(height).fill(0));

  // Generate gradient vectors at grid points
  const gradients: { x: number; y: number }[][] = Array(width + 1)
    .fill(0)
    .map(() =>
      Array(height + 1)
        .fill(0)
        .map(() => {
          const angle = Math.random() * Math.PI * 2;
          return { x: Math.cos(angle), y: Math.sin(angle) };
        })
    );

  // Helper for dot product
  const dot = (
    ix: number,
    iy: number,
    x: number,
    y: number
  ): number => {
    const dx = x - ix;
    const dy = y - iy;
    return dx * gradients[ix][iy].x + dy * gradients[ix][iy].y;
  };

  // Helper for smoothstep interpolation
  const smoothstep = (t: number): number => t * t * (3 - 2 * t);

  // Generate perlin noise values
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // Scale coordinates
      const x = i * scale;
      const y = j * scale;

      // Get grid cell coordinates
      const x0 = Math.floor(x);
      const x1 = x0 + 1;
      const y0 = Math.floor(y);
      const y1 = y0 + 1;

      // Calculate dot products with grid point gradients
      const n0 = dot(x0, y0, x, y);
      const n1 = dot(x1, y0, x, y);
      const n2 = dot(x0, y1, x, y);
      const n3 = dot(x1, y1, x, y);

      // Interpolation weights
      const sx = smoothstep(x - x0);
      const sy = smoothstep(y - y0);

      // Bilinear interpolation
      const nx0 = lerp(n0, n1, sx);
      const nx1 = lerp(n2, n3, sx);
      const value = lerp(nx0, nx1, sy);

      noiseArray[i][j] = value;
    }
  }

  return noiseArray;
}

/**
 * Linear interpolation helper
 */
export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Generate a random number between min and max
 */
export function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value from one range to another
 */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
