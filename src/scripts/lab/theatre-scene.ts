import {
  AmbientLight, BufferGeometry, BufferAttribute, DirectionalLight, EdgesGeometry,
  Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial,
  PerspectiveCamera, Scene, Vector3, WebGLRenderer, SRGBColorSpace, ACESFilmicToneMapping,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const clamp = gsap.utils.clamp(0, 1);
const precise = (value: number) => Math.round(value * 1e6) / 1e6;

/** One spatial world follows measured editorial sections. It never owns document layout. */
export function mountTheatre(root: HTMLElement, fallback: () => void): () => void {
  const host = root.querySelector<HTMLElement>('[data-canvas]')!;
  const spatialField = root.querySelector<HTMLElement>('[data-scene]')!;
  const beats = Array.from(root.querySelectorAll<HTMLElement>('[data-beat]'));
  const label = root.querySelector<HTMLElement>('[data-scene-label]')!;
  const motion = document.querySelector<HTMLButtonElement>('[data-motion]')!;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0xf4f0e7, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(33, 1, 0.1, 70);
  camera.position.set(-0.15, 0.2, 13.4);
  const fit = new Group();
  const assembly = new Group();
  assembly.rotation.set(-0.26, -0.52, -0.08);
  fit.add(assembly);
  scene.add(fit);
  scene.add(new AmbientLight(0xfff6e8, 1.9));
  const keyLight = new DirectionalLight(0xfff4dd, 3.6);
  keyLight.position.set(-4, 7, 8);
  const fill = new DirectionalLight(0xd4e0d5, 2.2);
  fill.position.set(6, 1, -3);
  scene.add(keyLight, fill);
  const materials = [0x294b3c, 0x7b8c6c, 0xbcb59f].map(color =>
    new MeshStandardMaterial({ color, roughness: 0.43, metalness: 0.24 }));
  const edges = new LineBasicMaterial({ color: 0xe8e1cd, transparent: true, opacity: 0.21 });
  const links = new LineBasicMaterial({ color: 0x8a765b, transparent: true, opacity: 0.12 });
  const modules: Group[] = [];
  const geometries: BufferGeometry[] = [];
  const timeline = gsap.timeline({ paused: true });

  // Vary the proportions and depths of three related families, with an open centre.
  // Their final assembly is intentionally asymmetric rather than a repeated cubic cage.
  for (let axis = 0; axis < 3; axis++) {
    for (let i = 0; i < 6; i++) {
      const side = i % 2 ? 1 : -1;
      const row = Math.floor(i / 2);
      const length = [2.8, 2.2, 2.5][axis]! * [1, 0.78, 1.12][row]!;
      const width = i === 0 ? 0.88 : i === 5 ? 0.62 : 0.34;
      const geometry = new RoundedBoxGeometry(length, 0.15, width, 2, 0.025);
      const outline = new EdgesGeometry(geometry, 24);
      geometries.push(geometry, outline);
      const module = new Group();
      module.add(new Mesh(geometry, materials[axis]), new LineSegments(outline, edges));
      const home = new Vector3(row * 0.15 - 0.15, (row - 1) * 0.86, side * 0.85);
      const rotation = { x: 0, y: 0, z: 0 };
      if (axis === 1) { home.set(side * 0.83, row * 0.16, (row - 1) * 0.72); rotation.z = Math.PI / 2; }
      if (axis === 2) { home.set((row - 1) * 0.8, side * 0.78 - 0.22, row * 0.12); rotation.y = Math.PI / 2; }
      const angle = axis * 1.7 + i * 1.1;
      const origin = home.clone().multiplyScalar(1.12).add(new Vector3(Math.sin(angle) * 0.7, Math.cos(angle) * 0.56, side * 0.38));
      module.position.set(precise(origin.x), precise(origin.y), precise(origin.z));
      module.rotation.set(precise(rotation.x + Math.sin(angle) * 0.22), precise(rotation.y + Math.cos(angle) * 0.26), precise(rotation.z + side * 0.14));
      assembly.add(module);
      modules.push(module);
      const fragmented = origin.clone().multiplyScalar(1.10);
      const tension = home.clone().multiplyScalar(1.4);
      tension.x += (axis - 1) * 0.38;
      tension.y += axis === 2 ? 0.35 : -0.1;
      timeline.to(module.position, { x: fragmented.x, y: fragmented.y, z: fragmented.z, duration: 1, ease: 'sine.inOut' }, 0);
      timeline.to(module.position, { x: tension.x, y: tension.y, z: tension.z, duration: 1, ease: 'sine.inOut' }, 1);
      timeline.to(module.rotation, { x: rotation.x + side * 0.08, y: rotation.y + (axis - 1) * 0.14, z: rotation.z + side * 0.05, duration: 1, ease: 'sine.inOut' }, 1);
      const delay = axis * 0.06 + row * 0.025;
      timeline.to(module.position, { x: home.x, y: home.y, z: home.z, duration: 1 - delay, ease: 'power2.inOut' }, 2 + delay);
      timeline.to(module.rotation, { ...rotation, duration: 1 - delay, ease: 'power2.inOut' }, 2 + delay);
      timeline.to(module.position, { x: home.x * 0.96, y: home.y * 0.96, z: home.z * 0.96, duration: 1, ease: 'sine.out' }, 3);
    }
  }
  const positions = new Float32Array(modules.length * 6);
  const connectionGeometry = new BufferGeometry();
  connectionGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  const connections = new LineSegments(connectionGeometry, links);
  connections.frustumCulled = false;
  assembly.add(connections);
  const cameraBeats = [
    { x: -0.35, y: 0.1, z: 14.0 },
    { x: 0.30, y: 0.35, z: 14.2 },
    { x: -0.15, y: 0.05, z: 11.5 },
    { x: 0.20, y: -0.05, z: 11.0 },
    { x: 0.30, y: 0.1, z: 18.8 },
  ];
  const angles = [
    { x: -0.15, y: -0.7, z: -0.06 },
    { x: -0.31, y: -0.90, z: 0.02 },
    { x: -0.36, y: -0.50, z: -0.03 },
    { x: -0.23, y: -0.66, z: 0.04 },
    { x: -0.17, y: -0.8, z: 0.04 },
  ];
  cameraBeats.forEach((position, i) => {
    timeline.to(camera.position, { ...position, duration: 1, ease: 'sine.inOut' }, i);
    timeline.to(assembly.rotation, { ...angles[i]!, duration: 1, ease: 'sine.inOut' }, i);
  });
  timeline.to(links, { opacity: 0.30, duration: 1 }, 1);
  timeline.to(links, { opacity: 0.025, duration: 1 }, 2);
  timeline.to(keyLight, { intensity: 4.1, duration: 2, ease: 'sine.inOut' }, 2);
  timeline.to(keyLight, { intensity: 2.8, duration: 1 }, 4);
  timeline.to(assembly.position, { x: 0.45, y: 0.35, duration: 1, ease: 'sine.inOut' }, 4);

  let disposed = false;
  let paused = false;
  let frame = 0;
  let renders = 0;
  let anchors: number[] = [];
  let target = 0;
  const playhead = { time: 0 };
  const render = () => {
    frame = 0;
    if (disposed || document.hidden) return;
    modules.forEach((module, i) => {
      const to = modules[(i + 6) % modules.length]!;
      const from = module.position;
      positions.set(module.visible && to.visible
        ? [from.x, from.y, from.z, to.position.x, to.position.y, to.position.z]
        : [0, 0, 0, 0, 0, 0], i * 6);
    });
    connectionGeometry.getAttribute('position').needsUpdate = true;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    root.dataset['renders'] = String(++renders);
  };
  const requestRender = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
  const mobilePosition = gsap.quickTo(host, 'y', { duration: 0.28, ease: 'power2.out' });
  const driver = gsap.quickTo(playhead, 'time', {
    duration: 0.28, ease: 'power2.out',
    onUpdate: () => {
      timeline.time(playhead.time);
      root.dataset['progress'] = (playhead.time / 5).toFixed(5);
      requestRender();
    },
  });
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const phone = window.innerWidth <= 650;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, phone ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fit.scale.setScalar(phone ? 1.15 : 1.07);
    if (!phone) mobilePosition(0);
    modules.forEach((module, i) => { module.visible = !phone || i % 6 < 4; });
    root.dataset['modules'] = String(modules.filter(module => module.visible).length);
    requestRender();
  };
  const measure = () => {
    const max = ScrollTrigger.maxScroll(window);
    anchors = beats.map((beat, i) => {
      if (i === 0) return 0;
      const copy = beat.querySelector<HTMLElement>('.dt-copy')!;
      const rect = copy.getBoundingClientRect();
      return Math.min(max, window.scrollY + rect.top + Math.min(rect.height * 0.38, innerHeight * 0.35) - innerHeight * 0.50);
    });
    // Anchors are real editorial positions, not fractions of a synthetic scroll spacer.
    root.dataset['anchors'] = JSON.stringify(anchors);
  };
  const frameMobileGap = () => {
    if (window.innerWidth > 650) return;
    let best = { height: 0, centre: innerHeight * 0.70 };
    beats.slice(0, -1).forEach((beat, i) => {
      const content = beat.querySelector('.dt-margin-note') ?? beat.querySelector('.dt-copy')!;
      const top = Math.max(16, content.getBoundingClientRect().bottom + 12);
      const bottom = Math.min(innerHeight - 16, beats[i + 1]!.querySelector('.dt-copy')!.getBoundingClientRect().top - 12);
      if (bottom - top > best.height) best = { height: bottom - top, centre: (top + bottom) / 2 };
    });
    // Position is derived only from current geometry, so direction reversal has no memory.
    // Bound the complete canvas inside the viewport, including the initial header offset.
    const weight = clamp(best.height / 180);
    const centre = innerHeight * 0.70 * (1 - weight) + best.centre * weight;
    const bounded = gsap.utils.clamp(152, innerHeight - 152, centre);
    mobilePosition(bounded - innerHeight / 2 - spatialField.getBoundingClientRect().top);
  };
  const sync = () => {
    if (!anchors.length) return;
    const y = window.scrollY;
    let segment = 0;
    while (segment < anchors.length - 2 && y > anchors[segment + 1]!) segment++;
    const start = anchors[segment]!;
    const end = anchors[segment + 1]!;
    target = Math.min(5, segment + clamp((y - start) / Math.max(1, end - start)));
    root.dataset['targetProgress'] = (target / 5).toFixed(5);
    const active = beats[Math.round(target)]!;
    root.dataset['state'] = active.dataset['beat']!;
    label.textContent = active.dataset['beatLabel']!;
    if (!paused) { driver(target); frameMobileGap(); }
  };
  const triggers = beats.map(beat => ScrollTrigger.create({
    trigger: beat, start: 'top bottom', end: 'bottom top',
    onUpdate: sync,
    onRefresh: () => { measure(); sync(); },
  }));
  // Subtle index parallax only; essential headings and paragraphs are never faded or hidden.
  const editorial = gsap.context(() => {
    beats.forEach(beat => {
      const kicker = beat.querySelector('.dt-kicker');
      if (kicker) gsap.fromTo(kicker, { y: 10 }, {
        y: 0, ease: 'none', scrollTrigger: { trigger: beat, start: 'top bottom', end: 'top 65%', scrub: 0.25 },
      });
    });
  }, root);
  const observer = new ResizeObserver(() => { resize(); measure(); sync(); });
  observer.observe(host);
  observer.observe(root);
  const onVisibility = () => { if (!document.hidden) requestRender(); };
  document.addEventListener('visibilitychange', onVisibility);
  const toggleMotion = () => {
    paused = !paused;
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? motion.dataset['resumeLabel']! : motion.dataset['pauseLabel']!;
    if (paused) { driver.tween.pause(); mobilePosition.tween.pause(); }
    else { driver(target); frameMobileGap(); }
  };
  motion.addEventListener('click', toggleMotion);
  root.classList.add('dt-webgl');
  root.dataset['renderMode'] = 'webgl';
  const lost = (event: Event) => { event.preventDefault(); cleanup(); fallback(); };
  renderer.domElement.addEventListener('webglcontextlost', lost);
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    triggers.forEach(trigger => trigger.kill());
    editorial.revert();
    driver.tween.kill();
    mobilePosition.tween.kill();
    gsap.set(host, { clearProps: 'transform' });
    timeline.kill();
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    motion.removeEventListener('click', toggleMotion);
    motion.setAttribute('aria-pressed', 'false');
    motion.textContent = motion.dataset['pauseLabel']!;
    renderer.domElement.removeEventListener('webglcontextlost', lost);
    geometries.forEach(geometry => geometry.dispose());
    connectionGeometry.dispose();
    materials.forEach(material => material.dispose());
    edges.dispose(); links.dispose();
    renderer.dispose(); renderer.domElement.remove(); renderer.forceContextLoss();
  };
  resize(); measure(); sync();
  return cleanup;
}
