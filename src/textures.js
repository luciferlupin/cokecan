import * as THREE from 'three';

export const FLAVORS = [
  {
    id: 'neon-hibiscus',
    name: 'NEON HIBISCUS',
    japaneseName: 'ハイビスカス',
    subtitle: 'CORAL PINK & SUNBURST • MAIN CHARACTER VIBE',
    colorPrimary: '#ff0055',
    colorSecondary: '#ff9900',
    colorAccent: '#ffff00',
    bgGradient: 'radial-gradient(circle at 50% 40%, #ff0055 0%, #c70042 45%, #380013 95%)',
    ambientColor: 0xff0055,
    tag: 'MAIN CHARACTER ENERGY ✨',
    caffeine: '120mg',
    sugar: '0g',
    calories: '5 kcal',
    fruitJuice: '20% Peach',
    rating: '5.0 ★★★★★',
    description: 'Electric Pink Hibiscus infused with Georgia peach nectar and an explosive sunburst summer fizz.'
  },
  {
    id: 'tropical-cyan',
    name: 'TROPICAL CYAN',
    japaneseName: 'トロピカル',
    subtitle: 'HYPER LAGOON & COCONUT • NO CAP HYDRATION',
    colorPrimary: '#00f0ff',
    colorSecondary: '#0077ff',
    colorAccent: '#ffffff',
    bgGradient: 'radial-gradient(circle at 50% 40%, #00f0ff 0%, #0077ff 45%, #002259 95%)',
    ambientColor: 0x00f0ff,
    tag: 'NO CAP HYDRATION 🌊',
    caffeine: '110mg',
    sugar: '0g',
    calories: '0 kcal',
    fruitJuice: '15% Coconut Water',
    rating: '4.9 ★★★★★',
    description: 'Ultra-bright turquoise lagoon water infused with toasted coconut water and icy electric cyan sparkles.'
  },
  {
    id: 'sunburst-citrus',
    name: 'SUNBURST CITRUS',
    japaneseName: 'シトラス',
    subtitle: 'ELECTRIC LEMON & TANGERINE • HIGH KEY CITRUS',
    colorPrimary: '#ffe600',
    colorSecondary: '#ff6600',
    colorAccent: '#ffffff',
    bgGradient: 'radial-gradient(circle at 50% 40%, #ffe600 0%, #ff6600 45%, #421a00 95%)',
    ambientColor: 0xffe600,
    tag: 'HIGH KEY CITRUS ⚡',
    caffeine: '115mg',
    sugar: '0g',
    calories: '5 kcal',
    fruitJuice: '25% Yuzu Lemon',
    rating: '5.0 ★★★★★',
    description: 'High-energy Japanese Yuzu citrus blended with sun-drenched tangerine pulp and golden electric fizz.'
  },
  {
    id: 'electric-melon',
    name: 'ELECTRIC MELON',
    japaneseName: 'スイカ',
    subtitle: 'WATERMELON & MINT LIME • CHILL PILL MELON',
    colorPrimary: '#ff0066',
    colorSecondary: '#00ff66',
    colorAccent: '#ccff00',
    bgGradient: 'radial-gradient(circle at 50% 40%, #ff0066 0%, #b80049 45%, #360015 95%)',
    ambientColor: 0xff0066,
    tag: 'CHILL PILL MELON 🍉',
    caffeine: '105mg',
    sugar: '0g',
    calories: '0 kcal',
    fruitJuice: '30% Melon Lime',
    rating: '5.0 ★★★★★',
    description: 'Vivid summer watermelon crushed with neon kiwi mint lime juice and chilled sparkling drops.'
  },
  {
    id: 'golden-pineapple',
    name: 'GOLDEN PINEAPPLE',
    japaneseName: 'パイナップル',
    subtitle: 'PINEAPPLE & PASSIONFRUIT • GOLDEN HOUR ERA',
    colorPrimary: '#ffcc00',
    colorSecondary: '#ff3366',
    colorAccent: '#ffffff',
    bgGradient: 'radial-gradient(circle at 50% 40%, #ffcc00 0%, #ff3366 45%, #4a0018 95%)',
    ambientColor: 0xffcc00,
    tag: 'GOLDEN HOUR ERA 🌅',
    caffeine: '125mg',
    sugar: '0g',
    calories: '5 kcal',
    fruitJuice: '25% Pineapple',
    rating: '4.9 ★★★★★',
    description: 'Golden sun-ripened pineapple nectar fused with electric passionfruit puree and a glowing beach breeze.'
  },
  {
    id: 'hyper-berry',
    name: 'HYPER BERRY',
    japaneseName: 'ベリー',
    subtitle: 'NEON VIOLET & CYBER AQUA • AURA MAX BERRY',
    colorPrimary: '#a000ff',
    colorSecondary: '#00d2ff',
    colorAccent: '#ff00cc',
    bgGradient: 'radial-gradient(circle at 50% 40%, #a000ff 0%, #5900b3 45%, #180036 95%)',
    ambientColor: 0xa000ff,
    tag: 'AURA MAX BERRY 🔮',
    caffeine: '130mg',
    sugar: '0g',
    calories: '5 kcal',
    fruitJuice: '18% Acai Blueberry',
    rating: '4.8 ★★★★★',
    description: 'Hyper neon wild blueberries crushed with acai berries and sparkling electric cyber stardust.'
  },
  {
    id: 'neon-matcha',
    name: 'NEON MATCHA',
    japaneseName: '抹茶',
    subtitle: 'HIGHLIGHTER LIME & MATCHA • MATCHA FIX REAL TALK',
    colorPrimary: '#66ff00',
    colorSecondary: '#00cc66',
    colorAccent: '#ffff00',
    bgGradient: 'radial-gradient(circle at 50% 40%, #66ff00 0%, #00994d 45%, #002e17 95%)',
    ambientColor: 0x66ff00,
    tag: 'MATCHA FIX REAL TALK 🍵',
    caffeine: '140mg',
    sugar: '0g',
    calories: '0 kcal',
    fruitJuice: 'High-Energy Matcha',
    rating: '5.0 ★★★★★',
    description: 'Highlighter neon mint matcha whisked with sweet lime zest and sparkling botanical energy.'
  }
];

/**
 * Renders 4K ultra-high DPI Gen Z aesthetic procedural label textures with Y2K sticker badges & cyber sparkles
 */
export function createCanLabelTexture(flavor) {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base Background
  ctx.fillStyle = flavor.colorPrimary;
  ctx.fillRect(0, 0, width, height);

  // High-Vibrance Fluid Aura Gradient Mesh Blobs
  const aura1 = ctx.createRadialGradient(width * 0.25, height * 0.4, 100, width * 0.25, height * 0.4, 1000);
  aura1.addColorStop(0, flavor.colorSecondary);
  aura1.addColorStop(0.7, flavor.colorPrimary);
  aura1.addColorStop(1, 'transparent');
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, width, height);

  const aura2 = ctx.createRadialGradient(width * 0.75, height * 0.4, 100, width * 0.75, height * 0.4, 1000);
  aura2.addColorStop(0, flavor.colorSecondary);
  aura2.addColorStop(0.7, flavor.colorPrimary);
  aura2.addColorStop(1, 'transparent');
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, width, height);

  // Organic Waves
  ctx.save();
  ctx.globalAlpha = 0.35;
  const waveGrad = ctx.createLinearGradient(0, 0, width, height);
  waveGrad.addColorStop(0, flavor.colorAccent);
  waveGrad.addColorStop(0.5, flavor.colorSecondary);
  waveGrad.addColorStop(1, flavor.colorPrimary);
  ctx.fillStyle = waveGrad;

  ctx.beginPath();
  ctx.moveTo(0, height * 0.3);
  ctx.bezierCurveTo(width * 0.25, height * 0.1, width * 0.5, height * 0.5, width, height * 0.2);
  ctx.lineTo(width, height * 0.8);
  ctx.bezierCurveTo(width * 0.75, height * 0.9, width * 0.25, height * 0.6, 0, height * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Dark Translucent Text Vignette Backdrop for 100% Text Legibility
  const drawTextBackdrop = (centerX) => {
    ctx.save();
    const grad = ctx.createRadialGradient(centerX, height * 0.45, 100, centerX, height * 0.45, 750);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(centerX - 800, 150, 1600, height - 300);
    ctx.restore();
  };

  drawTextBackdrop(width * 0.5);
  drawTextBackdrop(0);
  drawTextBackdrop(width);

  // Top/Bottom Silver Rim Lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(0, 70, width, 6);
  ctx.fillRect(0, height - 76, width, 6);

  // Render Gen Z Aesthetic Label
  const renderLabel = (centerX) => {
    ctx.save();

    // 1. Gen Z Y2K Sticker Pill Tag
    const tagText = `${flavor.tag}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.roundRect(centerX - 300, height * 0.13, 600, 76, 38);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tagText, centerX, height * 0.13 + 49);

    // 2. Brand Name: "HIS DRINK" (Y2K Cyber Chrome Typography)
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 35;
    ctx.font = '900 135px "Inter", sans-serif';
    ctx.letterSpacing = '12px';
    ctx.fillText('H I S   D R I N K', centerX, height * 0.30);

    // Sparkle Decals
    ctx.font = '40px "Inter", sans-serif';
    ctx.fillText('✦  100% REAL AURA  ✦', centerX, height * 0.36);

    // 3. Japanese Katakana/Kanji Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '900 46px "Inter", sans-serif';
    ctx.fillText(`【 ${flavor.japaneseName} 】`, centerX, height * 0.42);

    // 4. Main Flavor Name (Crisp Bold Typography)
    ctx.font = '900 155px "Inter", sans-serif';
    ctx.letterSpacing = '-2px';

    const parts = flavor.name.split(' ');
    if (parts.length > 1) {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(parts[0], centerX, height * 0.53);
      ctx.fillStyle = flavor.colorAccent;
      ctx.fillText(parts[1], centerX, height * 0.63);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(flavor.name, centerX, height * 0.58);
    }

    // 5. Subtitle & Vibe Tagline
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '700 38px "Inter", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(flavor.subtitle, centerX, height * 0.70);

    // 6. Gen Z Sticker Specs Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.roundRect(centerX - 440, height * 0.76, 880, 84, 42);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 34px "Inter", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(`⚡ 0g SUGAR  |  ${flavor.caffeine} CAFFEINE  |  355 ML ⚡`, centerX, height * 0.76 + 55);

    ctx.restore();
  };

  // Primary Front Label at U = 0.5 (Facing camera)
  renderLabel(width * 0.5);
  renderLabel(0);
  renderLabel(width);

  // Side Barcode Box
  [width * 0.22, width * 0.78].forEach((sideX) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(sideX - 100, height * 0.38, 200, 360);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HIS DRINK', sideX, height * 0.41);
    ctx.fillRect(sideX - 80, height * 0.42, 160, 3);

    for (let b = sideX - 75; b < sideX + 75; b += Math.floor(Math.random() * 8) + 5) {
      ctx.fillRect(b, height * 0.44, Math.floor(Math.random() * 6) + 3, 180);
    }

    ctx.font = 'bold 18px monospace';
    ctx.fillText('0 78912 3456', sideX, height * 0.54);
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates 2K ultra-high detail procedural bump map for realistic condensation water droplets
 */
export function createCondensationBumpMap() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 5 + 1.5;

    const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.6, '#b0b0b0');
    grad.addColorStop(1, '#404040');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = Math.random() * 60 + 20;
    const radius = Math.random() * 4 + 3;

    const trailGrad = ctx.createLinearGradient(x, y, x, y + length);
    trailGrad.addColorStop(0, '#ffffff');
    trailGrad.addColorStop(0.8, '#a0a0a0');
    trailGrad.addColorStop(1, '#606060');

    ctx.beginPath();
    ctx.moveTo(x - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.lineTo(x + radius * 0.5, y + length);
    ctx.lineTo(x - radius * 0.5, y + length);
    ctx.closePath();
    ctx.fillStyle = trailGrad;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}
