import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-dv]');
if (root) {
  const journey = root.querySelector<HTMLElement>('[data-journey]');
  const stage = root.querySelector<HTMLElement>('.dv-stage');
  const rig = root.querySelector<HTMLElement>('[data-rig]');
  const layers = [...root.querySelectorAll<HTMLElement>('[data-layer]')];
  const decision = root.querySelector<HTMLElement>('[data-decision-plane]');
  const flow = root.querySelector<HTMLElement>('[data-flow]');
  const lanes = [...root.querySelectorAll<HTMLElement>('[data-flow-lane]')];
  const dots = [...root.querySelectorAll<HTMLElement>('.dv-flow-dot')];
  const hero = root.querySelector<HTMLElement>('[data-hero-copy]');
  const stories = [...root.querySelectorAll<HTMLElement>('[data-story]')];
  const progressSteps = [...root.querySelectorAll<HTMLElement>('[data-progress-step]')];
  const caption = root.querySelector<HTMLElement>('[data-stage-caption]');
  const darkField = root.querySelector<HTMLElement>('[data-dark-field]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 801px)');

  const captions = ['FRICTION → ALIGN', 'ALIGNMENT', 'DECISION', 'EXECUTION → FEEDBACK'];
  let activeStage = -1;

  const setStage = (index: number) => {
    const next = Math.max(0, Math.min(3, index));
    if (activeStage === next) return;
    activeStage = next;
    stage?.setAttribute('data-stage', String(next));
    stage?.setAttribute('data-dark', String(next > 0));
    if (caption) caption.textContent = captions[next]!;
    stories.forEach((story, i) => {
      const visible = i === next && next > 0;
      story.setAttribute('aria-hidden', String(!visible));
    });
  };

  const staticLayout = () => {
    gsap.set(layers, { clearProps: 'all' });
    gsap.set(decision, { clearProps: 'all' });
    gsap.set(flow, { clearProps: 'all' });
    gsap.set(lanes, { clearProps: 'all' });
    gsap.set(dots, { clearProps: 'all' });
    gsap.set(rig, { clearProps: 'all' });
    gsap.set(hero, { clearProps: 'all' });
    gsap.set(stories, { clearProps: 'all' });
    setStage(0);
  };

  const buildDesktop = () => {
    if (!journey || !rig || !decision || !flow || !hero || !darkField) return;

    const friction = [
      { x:-72, y:-178, z:132, rotateZ:-8, rotateY:8 },
      { x:84, y:-88, z:-30, rotateZ:6, rotateY:-8 },
      { x:-40, y:5, z:88, rotateZ:-3, rotateY:5 },
      { x:98, y:108, z:-85, rotateZ:8, rotateY:-7 },
      { x:-86, y:196, z:38, rotateZ:-6, rotateY:6 },
    ];
    const alignedY = [-168,-84,0,84,168];

    layers.forEach((layer, i) => gsap.set(layer, {
      x: friction[i]!.x, y: friction[i]!.y, z: friction[i]!.z,
      rotateZ: friction[i]!.rotateZ, rotateY: friction[i]!.rotateY,
      rotateX: 0, opacity: 1,
    }));
    gsap.set(decision, { opacity: 0, x: -280, rotateY: 90 });
    gsap.set(flow, { opacity: 0 });
    lanes.forEach((lane, i) => gsap.set(lane, { y: alignedY[i]!, z: -20 + i * 10, rotateZ: 0 }));
    dots.forEach(dot => gsap.set(dot, { x: 0 }));
    gsap.set(darkField, { yPercent: 104 });
    gsap.set(hero, { opacity: 1, yPercent: 0 });
    gsap.set(stories, { opacity: 0, y: 26, autoAlpha: 0 });
    gsap.set(rig, { rotateX: 63, rotateZ: -32, scale: 1 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      scrollTrigger: {
        trigger: journey,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.15,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress;
          const idx = p < .19 ? 0 : p < .46 ? 1 : p < .72 ? 2 : 3;
          setStage(idx);
          progressSteps.forEach((step, i) => {
            const local = Math.max(0, Math.min(1, p * 4 - i));
            step.style.setProperty('--step-progress', String(local));
          });
        },
      },
    });

    // Act I — friction resolves into a coherent stack.
    tl.to(layers, {
      x: 0,
      y: (i:number) => alignedY[i]!,
      z: 0,
      rotateZ: 0,
      rotateY: 0,
      duration: 1.7,
      stagger: { each: .045, from: 'center' },
    }, 0)
    .to(rig, { rotateX: 58, rotateZ: -28, scale: 1.03, duration: 1.7 }, 0)
    .to(hero, { opacity: .25, yPercent: -8, duration: .5 }, .92)
    .to(hero, { opacity: 0, yPercent: -18, duration: .45 }, 1.18)
    .to(darkField, { yPercent: 0, duration: 1.05, ease: 'power4.inOut' }, 1.05)
    .to(stories[1]!, { autoAlpha: 1, opacity: 1, y: 0, duration: .55 }, 1.5);

    // Act II — a single decision plane crosses every organizational layer.
    tl.to(stories[1]!, { autoAlpha: 0, opacity: 0, y: -20, duration: .35 }, 2.25)
    .to(stories[2]!, { autoAlpha: 1, opacity: 1, y: 0, duration: .5 }, 2.43)
    .to(decision, { opacity: 1, x: 0, rotateY: 0, duration: .85, ease: 'power4.out' }, 2.35)
    .to(layers, {
      x: (i:number) => i === 2 ? 0 : (i % 2 ? 26 : -26),
      z: (i:number) => i === 2 ? 42 : (i - 2) * 18,
      duration: .85,
      stagger: { each: .035, from: 'center' },
    }, 2.48)
    .to(rig, { rotateX: 54, rotateZ: -19, duration: .9 }, 2.42);

    // Act III — the stack opens into five execution lanes.
    tl.to(stories[2]!, { autoAlpha: 0, opacity: 0, y: -20, duration: .35 }, 3.55)
    .to(stories[3]!, { autoAlpha: 1, opacity: 1, y: 0, duration: .5 }, 3.73)
    .to(decision, { opacity: .26, z: -70, scaleY: 1.15, duration: .75 }, 3.63)
    .to(layers, {
      x: (i:number) => (i - 2) * 96,
      y: (i:number) => alignedY[i]! * .46,
      z: (i:number) => i * 12,
      rotateZ: (i:number) => (i - 2) * 1.4,
      scaleX: .72,
      duration: 1.05,
      stagger: { each: .045, from: 'center' },
    }, 3.62)
    .to(flow, { opacity: 1, duration: .5 }, 3.88)
    .to(lanes, {
      x: (i:number) => (i - 2) * 96,
      y: (i:number) => alignedY[i]! * .46,
      rotateZ: -19,
      duration: .8,
    }, 3.78)
    .to(rig, { rotateX: 47, rotateZ: -10, scale: 1.05, duration: 1.05 }, 3.58)
    .to(dots, {
      x: 390,
      duration: 1.2,
      stagger: { each: .08, from: 'start' },
      ease: 'power1.inOut',
    }, 4.05);
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', buildDesktop);
  mm.add('(max-width: 800px), (prefers-reduced-motion: reduce)', () => {
    staticLayout();
    return () => staticLayout();
  });

  const onChange = () => ScrollTrigger.refresh();
  desktop.addEventListener('change', onChange);
  reduced.addEventListener('change', onChange);
}
