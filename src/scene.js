import * as THREE from 'three';
import { gsap } from 'gsap';
import { FLAVORS, createCanLabelTexture, createCondensationBumpMap } from './textures.js';

export class SodaScene {
  constructor(containerElement, onSelectCallback, onHoverCallback) {
    this.container = containerElement;
    this.onSelectCallback = onSelectCallback;
    this.onHoverCallback = onHoverCallback;
    this.currentIndex = 0;
    this.hoveredIndex = -1;
    this.cans = [];
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotationY = 0;
    this.targetRotationX = 0;
    this.activeCanRotationY = 0;
    this.activeCanRotationX = 0;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initScene();
    this.createEnvironmentMap();
    this.createSodaCans();
    this.createFloatingParticles();
    this.createShockwaveParticles();
    this.createSplashRing();
    this.createFloatingIceAndFruit();
    this.setupEvents();
    this.animate();

    this.updateCanPositions(0, false);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060608, 0.035);

    // Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 9.2);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.65;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Vibrant Studio Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    this.scene.add(this.ambientLight);

    // Key Light
    this.keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    this.keyLight.position.set(4, 8, 6);
    this.keyLight.castShadow = true;
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xffffff, 1.4);
    this.fillLight.position.set(-6, -2, -4);
    this.scene.add(this.fillLight);

    // Studio Rim Lights
    this.rimLight = new THREE.PointLight(FLAVORS[0].ambientColor, 12, 16);
    this.rimLight.position.set(0, 2.5, 3.5);
    this.scene.add(this.rimLight);

    this.rimLightLeft = new THREE.PointLight(FLAVORS[0].ambientColor, 7, 14);
    this.rimLightLeft.position.set(-4.5, -1, 2);
    this.scene.add(this.rimLightLeft);

    this.rimLightRight = new THREE.PointLight(FLAVORS[0].ambientColor, 7, 14);
    this.rimLightRight.position.set(4.5, -1, 2);
    this.scene.add(this.rimLightRight);
  }

  createEnvironmentMap() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(10, 16, 16);
    const envMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color: 0x555555
    });
    envScene.add(new THREE.Mesh(envGeo, envMat));

    this.envMap = pmremGenerator.fromScene(envScene).texture;
    pmremGenerator.dispose();
  }

  createSodaCanMesh(flavor, index) {
    const canGroup = new THREE.Group();

    const labelTexture = createCanLabelTexture(flavor);
    const bumpMap = createCondensationBumpMap();

    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.98,
      roughness: 0.12,
      envMap: this.envMap,
      envMapIntensity: 2.4
    });

    const labelMaterial = new THREE.MeshPhysicalMaterial({
      map: labelTexture,
      bumpMap: bumpMap,
      bumpScale: 0.025,
      metalness: 0.70,
      roughness: 0.15,
      clearcoat: 0.90,
      clearcoatRoughness: 0.08,
      envMap: this.envMap,
      envMapIntensity: 2.2
    });

    const topLidMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8e8e8,
      metalness: 0.98,
      roughness: 0.10,
      envMap: this.envMap,
      envMapIntensity: 2.6
    });

    const canRadius = 1.0;
    const canHeight = 3.2;
    const bodyGeo = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 64, 1, true);
    const bodyMesh = new THREE.Mesh(bodyGeo, labelMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    canGroup.add(bodyMesh);

    // Top Taper & Rim
    const topTaperGeo = new THREE.CylinderGeometry(canRadius * 0.88, canRadius, 0.28, 64, 1, true);
    const topTaperMesh = new THREE.Mesh(topTaperGeo, aluminumMaterial);
    topTaperMesh.position.y = canHeight / 2 + 0.14;
    canGroup.add(topTaperMesh);

    const rimGeo = new THREE.TorusGeometry(canRadius * 0.88, 0.04, 16, 64);
    const rimMesh = new THREE.Mesh(rimGeo, aluminumMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = canHeight / 2 + 0.28;
    canGroup.add(rimMesh);

    const lidGeo = new THREE.CircleGeometry(canRadius * 0.86, 64);
    const lidMesh = new THREE.Mesh(lidGeo, topLidMaterial);
    lidMesh.rotation.x = -Math.PI / 2;
    lidMesh.position.y = canHeight / 2 + 0.26;
    canGroup.add(lidMesh);

    // Pull Tab
    const pullTabGroup = new THREE.Group();
    const tabRingGeo = new THREE.RingGeometry(0.1, 0.22, 32);
    const tabRingMesh = new THREE.Mesh(tabRingGeo, aluminumMaterial);
    tabRingMesh.rotation.x = -Math.PI / 2;
    pullTabGroup.add(tabRingMesh);

    const tabBodyGeo = new THREE.BoxGeometry(0.22, 0.02, 0.42);
    const tabBodyMesh = new THREE.Mesh(tabBodyGeo, aluminumMaterial);
    tabBodyMesh.position.set(0, 0.01, 0.14);
    pullTabGroup.add(tabBodyMesh);

    pullTabGroup.position.set(0, canHeight / 2 + 0.29, 0.18);
    canGroup.add(pullTabGroup);

    // Bottom Taper & Rim
    const botTaperGeo = new THREE.CylinderGeometry(canRadius, canRadius * 0.85, 0.24, 64, 1, true);
    const botTaperMesh = new THREE.Mesh(botTaperGeo, aluminumMaterial);
    botTaperMesh.position.y = -canHeight / 2 - 0.12;
    canGroup.add(botTaperMesh);

    const botRimGeo = new THREE.TorusGeometry(canRadius * 0.85, 0.03, 16, 64);
    const botRimMesh = new THREE.Mesh(botRimGeo, aluminumMaterial);
    botRimMesh.rotation.x = Math.PI / 2;
    botRimMesh.position.y = -canHeight / 2 - 0.24;
    canGroup.add(botRimMesh);

    canGroup.userData = { flavor, index };
    return canGroup;
  }

  createSodaCans() {
    FLAVORS.forEach((flavor, index) => {
      const canMesh = this.createSodaCanMesh(flavor, index);
      this.scene.add(canMesh);
      this.cans.push(canMesh);
    });
  }

  getSlotTransform(offsetIndex) {
    if (offsetIndex === 0) {
      return {
        x: 0,
        y: -0.2,
        z: 1.4,
        scale: 1.18,
        rotX: 0,
        rotY: 0,
        rotZ: 0
      };
    }

    const side = Math.sign(offsetIndex);
    const absOffset = Math.abs(offsetIndex);

    const x = side * (2.2 + (absOffset - 1) * 1.7);
    const z = 0.1 - absOffset * 0.75;
    const y = -0.15 + (absOffset * 0.08);
    const scale = Math.max(0.42, 0.92 - absOffset * 0.15);

    return { x, y, z, scale, rotX: 0, rotY: 0, rotZ: 0 };
  }

  createSplashRing() {
    const geo = new THREE.RingGeometry(0.1, 2.2, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: FLAVORS[0].ambientColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    this.splashRing = new THREE.Mesh(geo, mat);
    this.splashRing.rotation.x = Math.PI / 2;
    this.splashRing.position.set(0, -1.8, 1.4);
    this.scene.add(this.splashRing);
  }

  triggerShockwaveBurst(colorHex) {
    if (!this.shockwaveParticles) return;

    const positions = this.shockwaveParticles.geometry.attributes.position.array;
    const velocities = this.shockwaveVelocities;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -0.2;
      positions[i * 3 + 2] = 1.4;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.18 + 0.08;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = (Math.random() - 0.2) * 0.12;
      velocities[i * 3 + 2] = Math.sin(angle) * speed;
    }

    this.shockwaveParticles.geometry.attributes.position.needsUpdate = true;
    this.shockwaveParticles.material.color.setHex(colorHex);
    this.shockwaveParticles.material.opacity = 1.0;

    gsap.to(this.shockwaveParticles.material, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Expanding Liquid Splash Ring Animation
    if (this.splashRing) {
      this.splashRing.scale.set(0.1, 0.1, 0.1);
      this.splashRing.material.color.setHex(colorHex);
      this.splashRing.material.opacity = 0.9;

      gsap.to(this.splashRing.scale, {
        x: 1.8,
        y: 1.8,
        z: 1.8,
        duration: 0.75,
        ease: 'power2.out'
      });

      gsap.to(this.splashRing.material, {
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out'
      });
    }
  }

  updateCanPositions(activeIndex, animate = true) {
    this.currentIndex = activeIndex;
    const activeFlavor = FLAVORS[activeIndex];

    this.targetRotationY = 0;
    this.targetRotationX = 0;
    this.activeCanRotationY = 0;
    this.activeCanRotationX = 0;

    const total = FLAVORS.length;

    if (animate) {
      this.triggerShockwaveBurst(activeFlavor.ambientColor);

      this.cans.forEach((canMesh, i) => {
        let offset = i - activeIndex;
        if (offset > 3) offset -= total;
        if (offset < -3) offset += total;

        const transform = this.getSlotTransform(offset);
        const isCenter = (offset === 0);

        if (isCenter) {
          const tl = gsap.timeline();

          tl.to(canMesh.position, {
            x: transform.x,
            y: 1.1,
            z: 2.0,
            duration: 0.38,
            ease: 'power2.out'
          }, 0);

          tl.to(canMesh.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 0.38,
            ease: 'power2.out'
          }, 0);

          tl.to(canMesh.rotation, {
            x: -0.15,
            y: canMesh.rotation.y + Math.PI,
            z: 0.15,
            duration: 0.38,
            ease: 'power2.out'
          }, 0);

          tl.to(canMesh.position, {
            x: transform.x,
            y: transform.y,
            z: transform.z,
            duration: 0.6,
            ease: 'back.out(2.2)'
          }, 0.36);

          tl.to(canMesh.scale, {
            x: transform.scale,
            y: transform.scale,
            z: transform.scale,
            duration: 0.6,
            ease: 'back.out(2.2)'
          }, 0.36);

          tl.to(canMesh.rotation, {
            x: 0,
            y: Math.PI * 2,
            z: 0,
            duration: 0.65,
            ease: 'power3.out'
          }, 0.36);

        } else {
          gsap.to(canMesh.position, {
            x: transform.x,
            y: transform.y,
            z: transform.z,
            duration: 0.85,
            ease: 'power3.out'
          });

          gsap.to(canMesh.scale, {
            x: transform.scale,
            y: transform.scale,
            z: transform.scale,
            duration: 0.85,
            ease: 'power3.out'
          });

          gsap.to(canMesh.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.85,
            ease: 'power3.out'
          });
        }
      });

      // Lighting Color Glide
      const color = new THREE.Color(activeFlavor.ambientColor);
      gsap.to(this.rimLight.color, { r: color.r, g: color.g, b: color.b, duration: 0.8, ease: 'power2.out' });
      gsap.to(this.rimLightLeft.color, { r: color.r, g: color.g, b: color.b, duration: 0.8, ease: 'power2.out' });
      gsap.to(this.rimLightRight.color, { r: color.r, g: color.g, b: color.b, duration: 0.8, ease: 'power2.out' });
      gsap.to(this.particles.material.color, { r: color.r, g: color.g, b: color.b, duration: 0.8, ease: 'power2.out' });

    } else {
      this.cans.forEach((canMesh, i) => {
        let offset = i - activeIndex;
        if (offset > 3) offset -= total;
        if (offset < -3) offset += total;

        const transform = this.getSlotTransform(offset);
        canMesh.position.set(transform.x, transform.y, transform.z);
        canMesh.scale.set(transform.scale, transform.scale, transform.scale);
        canMesh.rotation.set(0, 0, 0);
      });
    }
  }

  createFloatingParticles() {
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: FLAVORS[0].ambientColor,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createShockwaveParticles() {
    const count = 90;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    this.shockwaveVelocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = 0;
      this.shockwaveVelocities[i] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: FLAVORS[0].ambientColor,
      size: 0.22,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.shockwaveParticles = new THREE.Points(geometry, material);
    this.scene.add(this.shockwaveParticles);
  }

  createFloatingIceAndFruit() {
    this.iceCubes = [];
    const floatingGroup = new THREE.Group();

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.31,
      reflectivity: 0.9,
      thickness: 0.4,
      envMap: this.envMap
    });

    const fruitMat = new THREE.MeshStandardMaterial({
      color: 0xff9900,
      roughness: 0.3,
      metalness: 0.1
    });

    // Create Ice Cubes & 3D Fruit Wedges
    for (let i = 0; i < 9; i++) {
      const isFruit = i % 2 === 0;
      let mesh;

      if (isFruit) {
        // Torus / Wedge Fruit Slice
        const geo = new THREE.TorusGeometry(0.32, 0.12, 12, 24, Math.PI);
        mesh = new THREE.Mesh(geo, fruitMat);
      } else {
        const size = Math.random() * 0.35 + 0.25;
        const geo = new THREE.BoxGeometry(size, size, size);
        mesh = new THREE.Mesh(geo, glassMat);
      }

      const angle = (i / 9) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * 5.2,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3 - 1
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      mesh.userData = {
        speedY: Math.random() * 0.005 + 0.002,
        rotSpeed: Math.random() * 0.01 + 0.004
      };

      floatingGroup.add(mesh);
      this.iceCubes.push(mesh);
    }

    this.scene.add(floatingGroup);
  }

  setupEvents() {
    const dom = this.renderer.domElement;
    let mouseDownTime = 0;
    let startPos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      this.isDragging = true;
      mouseDownTime = Date.now();
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      startPos = { x, y };
      this.previousMousePosition = { x, y };
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      // Raycast Hover Check on 3D Cans
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cans, true);

      let foundHover = false;
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.flavor && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData && typeof obj.userData.index === 'number') {
          const idx = obj.userData.index;
          if (this.hoveredIndex !== idx) {
            this.hoveredIndex = idx;
            if (this.onHoverCallback) this.onHoverCallback(idx, clientX, clientY);
          }
          foundHover = true;
        }
      }

      if (!foundHover && this.hoveredIndex !== -1) {
        this.hoveredIndex = -1;
        if (this.onHoverCallback) this.onHoverCallback(-1, clientX, clientY);
      }

      if (!this.isDragging) return;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.targetRotationY += deltaX * 0.008;
      this.targetRotationX += deltaY * 0.004;

      this.targetRotationX = Math.max(-0.4, Math.min(0.4, this.targetRotationX));
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = (e) => {
      const clickDuration = Date.now() - mouseDownTime;
      const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const endY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;
      const moveDistance = Math.hypot(endX - startPos.x, endY - startPos.y);

      if (clickDuration < 300 && moveDistance < 10) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (let hit of intersects) {
          let obj = hit.object;
          while (obj && !obj.userData.flavor && obj.parent) {
            obj = obj.parent;
          }
          if (obj && obj.userData && typeof obj.userData.index === 'number') {
            const clickedIndex = obj.userData.index;
            if (this.onSelectCallback) {
              this.onSelectCallback(clickedIndex);
            }
            break;
          }
        }
      }

      this.isDragging = false;
    };

    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const time = (performance.now() - startTime) * 0.001;

    // Smooth Camera Parallax Tracking
    this.camera.position.x += (this.mouse.x * 0.35 - this.camera.position.x) * 0.04;
    this.camera.position.y += (this.mouse.y * 0.25 - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 0, 0);

    // Active center can levitation & drag rotation
    const activeCan = this.cans[this.currentIndex];
    if (activeCan) {
      if (this.isDragging) {
        this.activeCanRotationY += (this.targetRotationY - this.activeCanRotationY) * 0.07;
        this.activeCanRotationX += (this.targetRotationX - this.activeCanRotationX) * 0.07;
        activeCan.rotation.y = this.activeCanRotationY;
        activeCan.rotation.x = this.activeCanRotationX;
      } else {
        activeCan.rotation.y += (Math.PI * 2 - activeCan.rotation.y) * 0.05;
        activeCan.rotation.x += (0 - activeCan.rotation.x) * 0.05;
      }
    }

    // Hover & Float Oscillation Physics for Idle Cans
    this.cans.forEach((can, i) => {
      if (i !== this.currentIndex) {
        can.position.y += Math.sin(time * 1.8 + i) * 0.0015;

        // Interactive Hover Tilt Effect
        if (i === this.hoveredIndex) {
          can.rotation.z += (this.mouse.x * 0.15 - can.rotation.z) * 0.1;
          can.rotation.x += (-this.mouse.y * 0.15 - can.rotation.x) * 0.1;
        } else {
          can.rotation.z += (0 - can.rotation.z) * 0.08;
          can.rotation.x += (0 - can.rotation.x) * 0.08;
        }
      }
    });

    // Particle motion
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += 0.012;
        if (positions[i * 3 + 1] > 6) {
          positions[i * 3 + 1] = -6;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Shockwave particles expansion
    if (this.shockwaveParticles && this.shockwaveParticles.material.opacity > 0.01) {
      const pos = this.shockwaveParticles.geometry.attributes.position.array;
      const vel = this.shockwaveVelocities;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        pos[i * 3] += vel[i * 3];
        pos[i * 3 + 1] += vel[i * 3 + 1];
        pos[i * 3 + 2] += vel[i * 3 + 2];
      }
      this.shockwaveParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Floating Fruit & Ice motion
    if (this.iceCubes) {
      this.iceCubes.forEach((cube) => {
        cube.position.y += cube.userData.speedY;
        cube.rotation.x += cube.userData.rotSpeed;
        cube.rotation.y += cube.userData.rotSpeed;
        if (cube.position.y > 5.5) cube.position.y = -5.5;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

const startTime = performance.now();
