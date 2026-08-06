/**
 * Sound Engine - Completely disabled per user request
 */
class SoundEngine {
  constructor() {
    this.enabled = false;
  }
  init() {}
  toggleSound() { return false; }
  playPopSound() {}
  triggerShockwaveSound() {}
  playHoverClick() {}
}

export const sound = new SoundEngine();
