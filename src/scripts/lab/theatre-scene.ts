import {
  AmbientLight, BoxGeometry, BufferGeometry, BufferAttribute, DirectionalLight, EdgesGeometry, Group,
  LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, PerspectiveCamera,
  Scene, Vector3, WebGLRenderer, SRGBColorSpace, ACESFilmicToneMapping,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const clamp = gsap.utils.clamp(0, 1);
const ENTRY = 0.14;
const stateKeys = ['fragmentation', 'tension', 'alignment', 'coherence'];

/** One set of 24 structural modules, one reversible timeline, demand rendering. */
export function mountTheatre(root: HTMLElement, fallback: () => void): () => void {
  const host = root.querySelector<HTMLElement>('[data-canvas]')!;
  const hero = root.querySelector<HTMLElement>('[data-hero]')!;
  const copy = root.querySelector<HTMLElement>('[data-state-copy]')!;
  const states = Array.from(root.querySelectorAll<HTMLElement>('[data-state]'));
  const progressRail = root.querySelector<HTMLElement>('[data-progress]')!;
  const hint = root.querySelector<HTMLElement>('[data-scroll-hint]')!;
  const motion = root.querySelector<HTMLButtonElement>('[data-motion]')!;
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-jump]'));
  const label = root.querySelector<HTMLElement>('[data-scene-label]')!;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.setClearColor(0xf4f0e7, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 651 ? 1.25 : 1.5));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);
  const scene = new Scene();
  const camera = new PerspectiveCamera(33, 1, 0.1, 60);
  camera.position.set(0, 0, 13.8);
  const assembly = new Group();
  assembly.rotation.set(-0.32, -0.57, -0.10);
  scene.add(assembly);
  scene.add(new AmbientLight(0xfff5e6, 2.3));
  const keyLight = new DirectionalLight(0xfff7e9, 4.2);
  keyLight.position.set(-4, 7, 8);
  scene.add(keyLight);
  const fill = new DirectionalLight(0xdce8d3, 2.4);
  fill.position.set(6, 1, -3);
  scene.add(fill);

  const palette = [0x344f40, 0x667a58, 0xc9c2aa];
  const materials = palette.map((color) => new MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.18 }));
  const edgeMaterial = new LineBasicMaterial({ color: 0xeee6cf, transparent: true, opacity: 0.32 });
  const lineMaterial = new LineBasicMaterial({ color: 0x8b775c, transparent: true, opacity: 0.30 });
  const modules: Group[] = [];
  const geometries: (BoxGeometry | EdgesGeometry)[] = [];
  const timeline = gsap.timeline({ paused: true });
  // Three interlocking planes of responsibility. Slotted negative space stays visible.
  // These are elongated structural modules, never a field of free-floating cubes.
  for (let axis = 0; axis < 3; axis++) {
    for (let i = 0; i < 8; i++) {
      const row = i % 4;
      const side = i < 4 ? -1 : 1;
      const module = new Group();
      const geometry = new BoxGeometry(3.15, 0.18, 0.48);
      const edgeGeometry = new EdgesGeometry(geometry);
      geometries.push(geometry, edgeGeometry);
      const mesh = new Mesh(geometry, materials[axis]);
      module.add(mesh, new LineSegments(edgeGeometry, edgeMaterial));
      // Each axis is a consistent functional family, recognizable in every state.
      const home = new Vector3(0, (row - 1.5) * 0.69, side * 1.12);
      const finalRotation = { x: 0, y: 0, z: 0 };
      if (axis === 1) { home.set(side * 1.12, 0, (row - 1.5) * 0.69); finalRotation.z = Math.PI / 2; }
      if (axis === 2) { home.set((row - 1.5) * 0.69, side * 1.12, 0); finalRotation.y = Math.PI / 2; }
      const index = axis * 8 + i;
      const a = index * 2.399963;
      const spread = new Vector3(Math.cos(a) * 0.95, Math.sin(a) * 0.82, Math.sin(index * 1.7) * 0.7);
      const fragmented = home.clone().multiplyScalar(1.18).add(spread);
      const tension = home.clone().multiplyScalar(1.38);
      tension.x += axis === 0 ? -0.55 : axis === 1 ? 0.55 : 0;
      tension.y += axis === 2 ? 0.40 : -0.12;
      module.position.copy(fragmented);
      module.rotation.set(finalRotation.x + Math.sin(a) * 0.37, finalRotation.y + Math.cos(a) * 0.40, finalRotation.z + Math.sin(index) * 0.29);
      // GSAP stores interpolated transforms at six-decimal precision. Canonicalise
      // the initial frame too, so reversing to 0% returns identical rendered pixels.
      const precise = (value: number) => Math.round(value * 1e6) / 1e6;
      module.position.set(precise(module.position.x), precise(module.position.y), precise(module.position.z));
      module.rotation.set(precise(module.rotation.x), precise(module.rotation.y), precise(module.rotation.z));
      assembly.add(module);
      modules.push(module);
      timeline.to(module.position, { x: tension.x, y: tension.y, z: tension.z, duration: 0.28, ease: 'sine.inOut' }, 0);
      timeline.to(module.rotation, { x: finalRotation.x + side * 0.12, y: finalRotation.y + (axis - 1) * 0.20, z: finalRotation.z + side * 0.09, duration: 0.28, ease: 'sine.inOut' }, 0);
      // Alignment is the longest beat. Families lock into their common axes in order.
      const delay = axis * 0.035 + row * 0.008;
      timeline.to(module.position, { x: home.x, y: home.y, z: home.z, duration: 0.43 - delay, ease: 'power2.inOut' }, 0.28 + delay);
      timeline.to(module.rotation, { ...finalRotation, duration: 0.43 - delay, ease: 'power2.inOut' }, 0.28 + delay);
      timeline.to(module.position, { x: home.x * 0.97, y: home.y * 0.97, z: home.z * 0.97, duration: 0.29, ease: 'sine.out' }, 0.71);
    }
  }
  // Sparse dependency lines join the same module origins; they resolve with the solids.
  const connectionPositions = new Float32Array(24 * 2 * 3);
  const connectionGeometry = new BufferGeometry();
  connectionGeometry.setAttribute('position', new BufferAttribute(connectionPositions, 3));
  const connections = new LineSegments(connectionGeometry, lineMaterial);
  connections.frustumCulled = false;
  assembly.add(connections);
  timeline.to(assembly.rotation, { x: -0.24, y: -0.83, z: 0.03, duration: 0.28, ease: 'sine.inOut' }, 0);
  timeline.to(assembly.rotation, { x: -0.42, y: -0.55, z: 0.0, duration: 0.43, ease: 'sine.inOut' }, 0.28);
  timeline.to(assembly.rotation, { x: -0.38, y: -0.70, z: 0.0, duration: 0.29, ease: 'sine.out' }, 0.71);
  timeline.to(camera.position, { z: 14.5, y: 0.1, duration: 0.28, ease: 'sine.inOut' }, 0);
  timeline.to(camera.position, { z: 11.8, y: 0, duration: 0.43, ease: 'sine.inOut' }, 0.28);
  timeline.to(camera.position, { z: 11.2, duration: 0.29, ease: 'sine.out' }, 0.71);
  timeline.to(lineMaterial, { opacity: 0.05, duration: 0.5 }, 0.5);

  let disposed = false;
  let paused = false;
  let frame = 0;
  let renders = 0;
  let rawProgress = 0;
  let currentState = -1;
  let trigger: ScrollTrigger | undefined;
  const render = () => {
    frame = 0;
    if (disposed || document.hidden) return;
    for (let i = 0; i < 24; i++) {
      const from = modules[i]!.position;
      const to = modules[(i + 8) % 24]!.position;
      connectionPositions.set([from.x, from.y, from.z, to.x, to.y, to.z], i * 6);
    }
    connectionGeometry.getAttribute('position').needsUpdate = true;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    root.dataset['renders'] = String(++renders);
  };
  const requestRender = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Phones retain the complete structure, rather than cropping a desktop camera.
    assembly.scale.setScalar(width < 600 ? 0.90 : 1.06);
    requestRender();
  };
  const update = (raw: number) => {
    rawProgress = raw;
    if (paused) return;
    const p = clamp((raw - ENTRY) / (1 - ENTRY));
    const inHero = raw < ENTRY - 0.0003;
    hero.hidden = !inHero;
    copy.hidden = inHero;
    progressRail.hidden = inHero;
    hint.hidden = !inHero;
    const state = p < 0.22 ? 0 : p < 0.43 ? 1 : p < 0.80 ? 2 : 3;
    if (state !== currentState) {
      states.forEach((element, i) => { element.hidden = i !== state; });
      buttons.forEach((button, i) => {
        if (i === state) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      label.textContent = `0${state + 1} — ${states[state]!.querySelector('h2')!.textContent!.replace(/\.$/, '')}`;
      currentState = state;
    }
    timeline.progress(p);
    // An initial camera approach gives the hero beat spatial progression too.
    camera.position.x = inHero ? -0.55 * (1 - raw / ENTRY) : 0;
    root.dataset['progress'] = p.toFixed(5);
    root.dataset['state'] = inHero ? 'hero' : stateKeys[state]!;
    requestRender();
  };
  const jumpTo = (p: number) => {
    if (!trigger) return;
    const raw = ENTRY + p * (1 - ENTRY);
    window.scrollTo({ top: trigger.start + raw * (trigger.end - trigger.start), behavior: 'smooth' });
  };
  const jumpHandlers = buttons.map((button, i) => {
    const handler = () => jumpTo([0.01, 0.30, 0.60, 1][i]!);
    button.addEventListener('click', handler);
    return handler;
  });
  const enter = root.querySelector<HTMLAnchorElement>('[data-enter]')!;
  const enterHandler = (event: MouseEvent) => { event.preventDefault(); jumpTo(0.01); };
  enter.addEventListener('click', enterHandler);
  const motionHandler = () => {
    paused = !paused;
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? motion.dataset['resumeLabel']! : motion.dataset['pauseLabel']!;
    if (!paused) update(rawProgress);
  };
  motion.addEventListener('click', motionHandler);
  motion.hidden = false;
  root.classList.add('dt-enhanced', 'dt-webgl');
  root.dataset['renderMode'] = 'webgl';
  root.dataset['modules'] = String(modules.length);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  trigger = ScrollTrigger.create({
    trigger: root, start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => update(self.progress),
    onRefresh: (self) => { resize(); update(self.progress); },
  });
  const visibilityHandler = () => { if (!document.hidden) requestRender(); };
  document.addEventListener('visibilitychange', visibilityHandler);
  const contextLost = (event: Event) => { event.preventDefault(); cleanup(); fallback(); };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    trigger?.kill();
    timeline.kill();
    observer.disconnect();
    document.removeEventListener('visibilitychange', visibilityHandler);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    enter.removeEventListener('click', enterHandler);
    buttons.forEach((button, i) => button.removeEventListener('click', jumpHandlers[i]!));
    motion.removeEventListener('click', motionHandler);
    geometries.forEach((geometry) => geometry.dispose());
    connectionGeometry.dispose();
    materials.forEach((material) => material.dispose());
    edgeMaterial.dispose();
    lineMaterial.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    // Release the context when navigating away without waiting for garbage collection.
    renderer.forceContextLoss();
  };
  resize();
  update(trigger.progress);
  return cleanup;

}
