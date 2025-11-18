// Sound Manager for Nutcracker App 123
// Generates retro 8-bit style sound effects using Web Audio API

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
  }

  /**
   * Initialize AudioContext
   * IMPORTANT: Must be called after user interaction (iOS/Safari requirement)
   */
  init() {
    if (!this.initialized) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
        console.log('SoundManager initialized');
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    }
  }

  /**
   * Create oscillator node with frequency and type
   */
  createOscillator(frequency, type = 'square') {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    return oscillator;
  }

  /**
   * Create gain node for volume control and envelope
   */
  createGain(initialValue = 0.3) {
    if (!this.audioContext) return null;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = initialValue;
    return gainNode;
  }

  /**
   * Play correct answer sound (nut crack)
   * Short, sharp click sound at 800Hz
   */
  playCorrect() {
    if (!this.audioContext) {
      console.warn('AudioContext not initialized. Call init() first.');
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(800, 'square');
    const gainNode = this.createGain(0.3);

    // Quick attack and decay for click sound
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  /**
   * Play incorrect answer sound (jaw break)
   * Descending tone from 400Hz to 100Hz
   */
  playIncorrect() {
    if (!this.audioContext) {
      console.warn('AudioContext not initialized. Call init() first.');
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(400, 'sawtooth');
    const gainNode = this.createGain(0.2);

    // Descending frequency (failure sound)
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    // Fade out
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  /**
   * Play button click sound
   * Simple blip at 600Hz
   */
  playClick() {
    if (!this.audioContext) {
      console.warn('AudioContext not initialized. Call init() first.');
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.createOscillator(600, 'square');
    const gainNode = this.createGain(0.15);

    // Quick blip
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  /**
   * Play level complete sound (victory jingle)
   * Ascending arpeggio: C-E-G-C (262, 330, 392, 523 Hz)
   */
  playLevelComplete() {
    if (!this.audioContext) {
      console.warn('AudioContext not initialized. Call init() first.');
      return;
    }

    const notes = [262, 330, 392, 523]; // C-E-G-C
    const noteDuration = 0.12;
    const now = this.audioContext.currentTime;

    notes.forEach((frequency, index) => {
      const startTime = now + (index * noteDuration);
      const oscillator = this.createOscillator(frequency, 'square');
      const gainNode = this.createGain(0.2);

      // Envelope for each note
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    });
  }

  /**
   * Test all sounds (useful for debugging)
   */
  testAllSounds() {
    console.log('Testing all sounds...');
    this.init();

    setTimeout(() => {
      console.log('Playing click...');
      this.playClick();
    }, 0);

    setTimeout(() => {
      console.log('Playing correct...');
      this.playCorrect();
    }, 500);

    setTimeout(() => {
      console.log('Playing incorrect...');
      this.playIncorrect();
    }, 1000);

    setTimeout(() => {
      console.log('Playing level complete...');
      this.playLevelComplete();
    }, 1500);
  }
}

// Export singleton instance
const soundManager = new SoundManager();
export default soundManager;
