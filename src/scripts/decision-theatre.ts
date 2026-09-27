import { modulePosition, decisionPaths } from '../content/decision-theatre';
const root = document.querySelector<HTMLElement>('[data-theatre]');
if (root) {
  const system = root.querySelector<HTMLElement>('[data-system]')!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-mode-button]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1000px) and (min-height: 740px)');
  const toggle = root.querySelector<HTMLButtonElement>('[data-motion-toggle]')!;
  const models = [...root.querySelectorAll<HTMLElement>('[data-sculpture]')].map(el => ({el,
    cubes: [...el.querySelectorAll<HTMLElement>('[data-cube]')],
    wires: [...el.querySelectorAll<HTMLElement>('.dt-wire')],
    world: el.querySelector<HTMLElement>('.dt-world')!,
  }));
  let paused = false, active = 0, position = 0, target = 0, frame = 0, last = 0;
  let scrollFrame = 0;
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const lerp = (a: number,b: number,t: number) => a+(b-a)*t;
  const choreography = () => desktop.matches && !reduced.matches && !paused;

  function draw(value: number, model = models[1]!) {
    const state = Math.min(1, Math.floor(value));
    const t = value-state;
    const points = model.cubes.map((cube,i) => {
      const a = modulePosition(state,i), b = modulePosition(state+1,i);
      const p = a.map((v,j)=>lerp(v,b[j]!,t)) as [number,number,number];
      cube.style.transform = `translate3d(${p[0]}px,${p[1]}px,${p[2]}px)`;
      return p;
    });
    // Endpoints are recomputed from the interpolated module positions, so paths
    // remain attached throughout the transition instead of crossfading off-object.
    const path = decisionPaths[Math.round(value)]!;
    model.wires.forEach((wire,i) => {
      const first = path[i], second = path[i+1];
      wire.hidden = first === undefined || second === undefined;
      if (wire.hidden) return;
      const a = points[first!]!, b = points[second!]!;
      const [dx,dy,dz] = b.map((v,j)=>v-a[j]!);
      const length = Math.hypot(dx!,dy!,dz!);
      wire.style.width = `${length}px`;
      wire.style.transform = `translate3d(${a[0]}px,${a[1]}px,${a[2]+37}px) rotateZ(${Math.atan2(dy!,dx!)*180/Math.PI}deg) rotateY(${-Math.atan2(dz!,Math.hypot(dx!,dy!))*180/Math.PI}deg)`;
    });
    if (model.el.dataset.sculpture === 'system') {
      model.world.style.transform = `rotateX(${lerp(58,51,value/2)}deg) rotateZ(${lerp(-34,-22,value/2)}deg)`;
    }
  }
  function setStory(index: number) {
    if (active === index && system.dataset.ready) return;
    active = index;
    system.dataset.ready = 'true';
    system.dataset.mode = String(index);
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    root!.querySelectorAll<HTMLElement>('[data-story]').forEach(el=>el.hidden=Number(el.dataset.story)!==index);
    root!.querySelectorAll<HTMLElement>('[data-caption]').forEach(el=>el.hidden=Number(el.dataset.caption)!==index);
  }
  function tick(now: number) {
    frame = 0;
    const dt = Math.min(64,now-last || 16); last = now;
    position = lerp(position,target,1-Math.exp(-dt/110));
    if (Math.abs(position-target)<.001) position=target;
    draw(position);
    if (position!==target && !document.hidden) frame=requestAnimationFrame(tick);
  }
  function move(value: number) {
    target = clamp(value,0,2);
    if (paused || reduced.matches) { cancelAnimationFrame(frame); frame=0; position=target; draw(position); }
    else if (!frame && !document.hidden) {last=0;frame=requestAnimationFrame(tick);}
  }
  function readScroll() {
    scrollFrame=0;
    if (!choreography()) return;
    const rect = system.getBoundingClientRect();
    const progress = clamp(-rect.top/(system.offsetHeight-innerHeight),0,1);
    // Reading plateaus at each perspective, connected by continuous spatial moves.
    const value = progress<.12 ? 0 : progress<.42 ? (progress-.12)/.30 : progress<.58 ? 1 : progress<.88 ? 1+(progress-.58)/.30 : 2;
    setStory(Math.round(value)); move(value);
  }
  function queueScroll() {if (!scrollFrame) scrollFrame=requestAnimationFrame(readScroll);}
  function choose(index: number) {
    setStory(index);move(index);
    if (choreography()) {
      const top = system.getBoundingClientRect().top+scrollY;
      // Direct controls jump to a stable reading point; subsequent scrolling
      // resumes from that perspective without an unrelated animation queue.
      window.scrollTo({top:top+(system.offsetHeight-innerHeight)*[.06,.5,.94][index]!,behavior:'instant'});
    }
  }
  buttons.forEach((button,index)=>{
    button.disabled=false;
    button.addEventListener('click',()=>choose(index));
    button.addEventListener('keydown',event=>{
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;
      buttons[next]!.focus({preventScroll:true});choose(next);
    });
  });
  function syncMotion() {
    root!.dataset.motion = paused || reduced.matches ? 'paused' : 'running';
    // Retain the pinned layout while user-paused to avoid a multi-screen jump.
    root!.dataset.choreography = String(desktop.matches && !reduced.matches);
    toggle.hidden=reduced.matches;
    toggle.setAttribute('aria-pressed',String(paused));
    root!.querySelector('[data-motion-label]')!.textContent=paused?'Wznów ruch':'Wstrzymaj ruch';
    root!.querySelector('[data-scroll-hint]')!.textContent=desktop.matches&&!reduced.matches?'Przewijaj lub wybierz perspektywę':'Wybierz perspektywę poniżej';
    if (paused||reduced.matches)move(active); else queueScroll();
  }
  toggle.addEventListener('click',()=>{paused=!paused;syncMotion();});
  reduced.addEventListener('change',syncMotion);desktop.addEventListener('change',syncMotion);
  addEventListener('scroll',queueScroll,{passive:true});addEventListener('resize',queueScroll,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    root!.dataset.background=String(document.hidden);
    if(document.hidden){cancelAnimationFrame(frame);frame=0;}else move(target);
  });
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      (entry.target as HTMLElement).dataset.visible=String(entry.isIntersecting);
    }));
    root.querySelectorAll('[data-scene]').forEach(scene=>observer.observe(scene));
  }
  draw(0,models[0]!);draw(0);setStory(0);syncMotion();
}
