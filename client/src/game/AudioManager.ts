export class AudioManager {
  private backgroundMusic: HTMLAudioElement;
  private hitSound: HTMLAudioElement;
  private successSound: HTMLAudioElement;
  private isMuted: boolean = false; // Enable sound by default
  
  constructor() {
    // Create audio elements
    this.backgroundMusic = new Audio('/sounds/background.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    
    this.hitSound = new Audio('/sounds/hit.mp3');
    this.hitSound.volume = 0.2;
    
    this.successSound = new Audio('/sounds/success.mp3');
    this.successSound.volume = 0.3;
    
    // Attempt to preload sounds
    this.preloadSounds();
  }
  
  private preloadSounds() {
    // Touch sounds to preload them
    this.backgroundMusic.load();
    this.hitSound.load();
    this.successSound.load();
  }
  
  playBackground() {
    if (this.isMuted) return;
    
    this.backgroundMusic.play().catch(error => {
      console.log("Background music play prevented:", error);
    });
  }
  
  playHit() {
    if (this.isMuted) return;
    
    // Clone to allow overlapping sounds
    const soundClone = this.hitSound.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.15;
    soundClone.play().catch(error => {
      console.log("Hit sound play prevented:", error);
    });
  }
  
  playSuccess() {
    if (this.isMuted) return;
    
    const soundClone = this.successSound.cloneNode() as HTMLAudioElement;
    soundClone.play().catch(error => {
      console.log("Success sound play prevented:", error);
    });
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.backgroundMusic.pause();
    } else {
      this.playBackground();
    }
    
    return this.isMuted;
  }
  
  setMuted(muted: boolean) {
    this.isMuted = muted;
    
    if (this.isMuted) {
      this.backgroundMusic.pause();
    } else {
      this.playBackground();
    }
  }
}
