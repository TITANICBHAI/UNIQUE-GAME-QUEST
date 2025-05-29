/**
 * SpaceScanner - Advanced scanning mechanism for space exploration
 * Provides detailed analysis of cosmic bodies with scientific accuracy
 */

import { Plant } from './Plant';

export interface ScanResult {
  objectType: string;
  name: string;
  distance: number;
  mass: number;
  composition: string[];
  temperature: number;
  atmosphere?: AtmosphereData;
  magneticField?: number;
  radiation: number;
  habitability: number;
  lifeSignatures: string[];
  mineralDeposits: string[];
  spectralAnalysis: SpectralData;
  threat: ThreatLevel;
  scanQuality: number; // 0-1, affects detail level
  timeToScan: number; // milliseconds
}

export interface AtmosphereData {
  composition: { [element: string]: number };
  pressure: number;
  density: number;
  windSpeed: number;
  stormActivity: number;
  opacity: number;
  entryDifficulty: EntryDifficulty;
}

export interface SpectralData {
  hydrogenLines: number;
  heliumLines: number;
  metalLines: number;
  waterVapor: number;
  organicCompounds: number;
  redshift: number;
}

export enum ThreatLevel {
  SAFE = 'Safe',
  CAUTION = 'Caution',
  DANGEROUS = 'Dangerous', 
  EXTREME = 'Extreme Danger'
}

export enum EntryDifficulty {
  EASY = 'Easy Entry',
  MODERATE = 'Moderate Entry',
  DIFFICULT = 'Difficult Entry',
  EXTREME = 'Extreme Entry Risk'
}

export class SpaceScanner {
  private scanProgress: Map<string, number> = new Map();
  private scanResults: Map<string, ScanResult> = new Map();
  private activeScan: string | null = null;
  private scanRange: number = 1000; // Maximum scan range in game units
  private scannerPower: number = 1.0; // Scanner efficiency multiplier
  
  private onScanComplete: ((result: ScanResult) => void) | null = null;
  private onScanProgress: ((progress: number, target: string) => void) | null = null;
  
  constructor() {
    this.initializeScanner();
  }
  
  private initializeScanner(): void {
    // Scanner starts with basic capabilities
    this.scanRange = 1000;
    this.scannerPower = 1.0;
  }
  
  /**
   * Start scanning a cosmic body
   */
  startScan(target: Plant, scannerX: number, scannerY: number): boolean {
    const distance = Math.sqrt(
      Math.pow(target.x - scannerX, 2) + Math.pow(target.y - scannerY, 2)
    );
    
    if (distance > this.scanRange) {
      return false; // Target out of range
    }
    
    this.activeScan = target.id || `${target.x}-${target.y}`;
    this.scanProgress.set(this.activeScan, 0);
    
    return true;
  }
  
  /**
   * Update scanning progress
   */
  updateScan(deltaTime: number): void {
    if (!this.activeScan) return;
    
    const currentProgress = this.scanProgress.get(this.activeScan) || 0;
    const scanSpeed = this.scannerPower * 0.001; // Base scan speed
    const newProgress = Math.min(1.0, currentProgress + (scanSpeed * deltaTime));
    
    this.scanProgress.set(this.activeScan, newProgress);
    
    if (this.onScanProgress) {
      this.onScanProgress(newProgress, this.activeScan);
    }
    
    if (newProgress >= 1.0) {
      this.completeScan();
    }
  }
  
  /**
   * Complete the current scan and generate results
   */
  private completeScan(): void {
    if (!this.activeScan) return;
    
    // Find the target being scanned (simplified - in real implementation, store reference)
    const result = this.generateScanResult(this.activeScan);
    this.scanResults.set(this.activeScan, result);
    
    if (this.onScanComplete) {
      this.onScanComplete(result);
    }
    
    this.activeScan = null;
  }
  
  /**
   * Generate detailed scan results based on cosmic body properties
   */
  private generateScanResult(targetId: string): ScanResult {
    // This would normally use the actual Plant object, simplified for demo
    const scanQuality = this.scannerPower * (0.7 + Math.random() * 0.3);
    
    const result: ScanResult = {
      objectType: this.determineObjectType(),
      name: `Object-${targetId.substring(0, 8)}`,
      distance: Math.random() * this.scanRange,
      mass: this.generateMass(),
      composition: this.generateComposition(),
      temperature: this.generateTemperature(),
      atmosphere: this.generateAtmosphereData(),
      magneticField: Math.random() * 10,
      radiation: Math.random() * 100,
      habitability: Math.random(),
      lifeSignatures: this.detectLifeSignatures(),
      mineralDeposits: this.detectMinerals(),
      spectralAnalysis: this.generateSpectralData(),
      threat: this.assessThreat(),
      scanQuality,
      timeToScan: 3000 + Math.random() * 2000
    };
    
    return result;
  }
  
  private determineObjectType(): string {
    const types = ['planet', 'star', 'asteroid', 'comet', 'gas_giant', 'dwarf_planet', 'moon'];
    return types[Math.floor(Math.random() * types.length)];
  }
  
  private generateMass(): number {
    return Math.random() * 1000 + 0.1; // Earth masses
  }
  
  private generateComposition(): string[] {
    const elements = ['Iron', 'Silicon', 'Magnesium', 'Carbon', 'Hydrogen', 'Helium', 'Water', 'Methane'];
    const composition: string[] = [];
    
    for (let i = 0; i < Math.random() * 5 + 2; i++) {
      composition.push(elements[Math.floor(Math.random() * elements.length)]);
    }
    
    return composition;
  }
  
  private generateTemperature(): number {
    return Math.random() * 2000 + 50; // Kelvin
  }
  
  private generateAtmosphereData(): AtmosphereData | undefined {
    if (Math.random() < 0.3) return undefined; // Some objects have no atmosphere
    
    return {
      composition: {
        'Nitrogen': Math.random() * 0.8,
        'Oxygen': Math.random() * 0.3,
        'Carbon Dioxide': Math.random() * 0.5,
        'Argon': Math.random() * 0.1,
        'Water Vapor': Math.random() * 0.05
      },
      pressure: Math.random() * 10, // Earth atmospheres
      density: Math.random() * 2,
      windSpeed: Math.random() * 200, // km/h
      stormActivity: Math.random(),
      opacity: Math.random(),
      entryDifficulty: this.calculateEntryDifficulty()
    };
  }
  
  private calculateEntryDifficulty(): EntryDifficulty {
    const difficulty = Math.random();
    if (difficulty < 0.25) return EntryDifficulty.EASY;
    if (difficulty < 0.5) return EntryDifficulty.MODERATE;
    if (difficulty < 0.75) return EntryDifficulty.DIFFICULT;
    return EntryDifficulty.EXTREME;
  }
  
  private detectLifeSignatures(): string[] {
    const signatures = ['Biosignatures', 'Organic compounds', 'Electromagnetic emissions', 'Atmospheric oxygen'];
    const detected: string[] = [];
    
    for (const signature of signatures) {
      if (Math.random() < 0.2) { // 20% chance for each
        detected.push(signature);
      }
    }
    
    return detected;
  }
  
  private detectMinerals(): string[] {
    const minerals = ['Rare earth elements', 'Platinum', 'Titanium', 'Lithium', 'Deuterium', 'Helium-3'];
    const detected: string[] = [];
    
    for (const mineral of minerals) {
      if (Math.random() < 0.3) { // 30% chance for each
        detected.push(mineral);
      }
    }
    
    return detected;
  }
  
  private generateSpectralData(): SpectralData {
    return {
      hydrogenLines: Math.random(),
      heliumLines: Math.random(),
      metalLines: Math.random(),
      waterVapor: Math.random(),
      organicCompounds: Math.random(),
      redshift: (Math.random() - 0.5) * 0.1 // Doppler shift
    };
  }
  
  private assessThreat(): ThreatLevel {
    const threat = Math.random();
    if (threat < 0.4) return ThreatLevel.SAFE;
    if (threat < 0.7) return ThreatLevel.CAUTION;
    if (threat < 0.9) return ThreatLevel.DANGEROUS;
    return ThreatLevel.EXTREME;
  }
  
  /**
   * Get scan result for a target
   */
  getScanResult(targetId: string): ScanResult | null {
    return this.scanResults.get(targetId) || null;
  }
  
  /**
   * Check if scanner can reach target
   */
  canScanTarget(targetX: number, targetY: number, scannerX: number, scannerY: number): boolean {
    const distance = Math.sqrt(
      Math.pow(targetX - scannerX, 2) + Math.pow(targetY - scannerY, 2)
    );
    return distance <= this.scanRange;
  }
  
  /**
   * Upgrade scanner capabilities
   */
  upgradeScanner(powerIncrease: number, rangeIncrease: number): void {
    this.scannerPower += powerIncrease;
    this.scanRange += rangeIncrease;
  }
  
  /**
   * Set callback functions
   */
  setCallbacks(
    onComplete: (result: ScanResult) => void,
    onProgress: (progress: number, target: string) => void
  ): void {
    this.onScanComplete = onComplete;
    this.onScanProgress = onProgress;
  }
  
  /**
   * Get current scan progress
   */
  getCurrentScanProgress(): number {
    if (!this.activeScan) return 0;
    return this.scanProgress.get(this.activeScan) || 0;
  }
  
  /**
   * Get scanner range
   */
  getScanRange(): number {
    return this.scanRange;
  }
  
  /**
   * Cancel current scan
   */
  cancelScan(): void {
    if (this.activeScan) {
      this.scanProgress.delete(this.activeScan);
      this.activeScan = null;
    }
  }
}