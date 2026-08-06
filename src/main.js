import { gsap } from 'gsap';
import { FLAVORS } from './textures.js';
import { SodaScene } from './scene.js';

class App {
  constructor() {
    this.currentIndex = 0;

    // DOM Elements
    this.canvasContainer = document.getElementById('canvas-container');
    this.ambientBg = document.getElementById('ambient-bg');
    this.flavorTag = document.getElementById('flavor-tag');
    this.flavorTitle = document.getElementById('flavor-title');
    this.flavorSubtitle = document.getElementById('flavor-subtitle');

    this.specSugar = document.getElementById('spec-sugar');
    this.specCaffeine = document.getElementById('spec-caffeine');
    this.specJuice = document.getElementById('spec-juice');

    this.editionCounter = document.getElementById('edition-counter');
    this.cursorBadge = document.getElementById('cursor-badge');

    this.init();
  }

  init() {
    // Initialize 3D Spatial Scene with tap & hover callbacks
    this.sodaScene = new SodaScene(
      this.canvasContainer,
      (clickedIndex) => {
        this.selectFlavor(clickedIndex);
      },
      (hoveredIndex, clientX, clientY) => {
        this.handleHover(hoveredIndex, clientX, clientY);
      }
    );

    this.setupEvents();
    this.updateUI(0, false);
  }

  handleHover(hoveredIndex, clientX, clientY) {
    if (hoveredIndex !== -1 && hoveredIndex !== this.currentIndex) {
      this.cursorBadge.classList.add('visible');
      this.cursorBadge.style.left = `${clientX}px`;
      this.cursorBadge.style.top = `${clientY}px`;
      this.cursorBadge.textContent = `VIEW ${FLAVORS[hoveredIndex].name} ✨`;
    } else {
      this.cursorBadge.classList.remove('visible');
    }
  }

  selectFlavor(index) {
    if (index === this.currentIndex || index < 0 || index >= FLAVORS.length) return;

    this.sodaScene.updateCanPositions(index, true);
    this.updateUI(index, true);
    this.currentIndex = index;
    this.cursorBadge.classList.remove('visible');
  }

  updateUI(index, animate = true) {
    const flavor = FLAVORS[index];

    // Root dynamic color tokens
    document.documentElement.style.setProperty('--color-primary', flavor.colorPrimary);
    document.documentElement.style.setProperty('--color-secondary', flavor.colorSecondary);
    document.documentElement.style.setProperty('--color-accent', flavor.colorAccent);

    // Smooth ambient background morphing over 1.2s
    this.ambientBg.style.background = flavor.bgGradient;

    // Counter
    this.editionCounter.textContent = `0${index + 1}`;

    if (animate) {
      const tl = gsap.timeline();

      tl.to([this.flavorTag, this.flavorTitle, this.flavorSubtitle], {
        opacity: 0,
        scale: 0.9,
        y: -12,
        duration: 0.22,
        stagger: 0.03,
        ease: 'power2.in',
        onComplete: () => {
          this.flavorTag.textContent = `✨ ${flavor.tag} ✨`;

          const parts = flavor.name.split(' ');
          if (parts.length > 1) {
            this.flavorTitle.innerHTML = `${parts[0]} <span class="highlight">${parts[1]}</span>`;
          } else {
            this.flavorTitle.innerHTML = flavor.name;
          }

          this.flavorSubtitle.textContent = flavor.subtitle;
          this.specSugar.textContent = flavor.sugar;
          this.specCaffeine.textContent = flavor.caffeine;
          this.specJuice.textContent = flavor.fruitJuice;
        }
      });

      tl.to([this.flavorTag, this.flavorTitle, this.flavorSubtitle], {
        opacity: 1,
        scale: 1.0,
        y: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: 'back.out(2.0)'
      });
    } else {
      this.flavorTag.textContent = `✨ ${flavor.tag} ✨`;
      const parts = flavor.name.split(' ');
      if (parts.length > 1) {
        this.flavorTitle.innerHTML = `${parts[0]} <span class="highlight">${parts[1]}</span>`;
      } else {
        this.flavorTitle.innerHTML = flavor.name;
      }
      this.flavorSubtitle.textContent = flavor.subtitle;
      this.specSugar.textContent = flavor.sugar;
      this.specCaffeine.textContent = flavor.caffeine;
      this.specJuice.textContent = flavor.fruitJuice;
    }
  }

  setupEvents() {
    // Magnetic follower on mouse move
    window.addEventListener('mousemove', (e) => {
      if (this.cursorBadge.classList.contains('visible')) {
        this.cursorBadge.style.left = `${e.clientX}px`;
        this.cursorBadge.style.top = `${e.clientY}px`;
      }
    });

    // Keyboard Left / Right Navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = (this.currentIndex - 1 + FLAVORS.length) % FLAVORS.length;
        this.selectFlavor(newIndex);
      } else if (e.key === 'ArrowRight') {
        const newIndex = (this.currentIndex + 1) % FLAVORS.length;
        this.selectFlavor(newIndex);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
