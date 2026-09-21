const root = document.querySelector<HTMLElement>('[data-theatre]');
if (root) {
  const system = root.querySelector<HTMLElement>('[data-system]')!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-mode-button]')];
  const stories = [...root.querySelectorAll<HTMLElement>('[data-story]')];
  const phases = [...root.querySelectorAll<HTMLButtonElement>('[data-phase]')];
  const hero = root.querySelector<HTMLElement>('[data-hero]')!;
  const heroButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-hero-choice]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = root.querySelector<HTMLButtonElement>('[data-motion-toggle]')!;
  const label = root.querySelector<HTMLElement>('[data-motion-label]')!;
  const connect = root.querySelector<HTMLButtonElement>('[data-connect]')!;
  let userPaused = false;

  function syncMotion() {
    root!.dataset.motion = userPaused || reduced.matches ? 'paused' : 'running';
    toggle.hidden = reduced.matches;
    toggle.setAttribute('aria-pressed', String(userPaused));
    label.textContent = userPaused ? 'Wznów ruch' : 'Wstrzymaj ruch';
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  syncMotion();

  function focusPhase(index: string) {
    system.dataset.focus = index;
    phases.forEach((button, i) => button.setAttribute('aria-pressed', String(i === Number(index))));
    root!.querySelector<HTMLElement>('[data-phase-intro]')!.hidden = index !== 'all';
    root!.querySelectorAll<HTMLElement>('[data-phase-copy]').forEach(copy => {
      copy.hidden = copy.dataset.phaseCopy !== `${system.dataset.mode}-${index}`;
    });
  }
  function chooseHero(index: number) {
    hero.dataset.hero = String(index);
    heroButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    hero.querySelectorAll<HTMLElement>('[data-hero-story]').forEach(story => {
      story.hidden = story.dataset.heroStory !== String(index);
    });
  }
  function choose(index: number) {
    system.dataset.mode = String(index);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    stories.forEach((story, i) => { story.hidden = i !== index; });
    const path = buttons[index]!.dataset.path!.split(',').map(Number);
    system.querySelectorAll<HTMLElement>('[data-node]').forEach(node => {
      node.classList.toggle('is-active', path.includes(Number(node.dataset.node)));
    });
    focusPhase('all');
  }
  function enableGroup(group: HTMLButtonElement[], select: (index: number) => void) {
    group.forEach((button, index) => {
      button.disabled = false;
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? group.length - 1 :
          (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + group.length) % group.length;
        group[next]!.focus();
        select(next);
      });
    });
  }
  enableGroup(buttons, choose);
  enableGroup(heroButtons, chooseHero);
  enableGroup(phases, index => focusPhase(String(index)));
  choose(0);
  connect.disabled = false;
  connect.addEventListener('click', () => {
    const joined = system.dataset.view !== 'joined';
    system.dataset.view = joined ? 'joined' : 'separate';
    connect.setAttribute('aria-pressed', String(joined));
    root!.querySelector('[data-connect-label]')!.textContent = joined ? 'Rozdziel warstwy' : 'Połącz warstwy';
  });
  // The decorative 3D surfaces mirror the adjacent native controls for pointer users.
  root.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const plane = event.target.closest<HTMLElement>('[data-hero-plane]');
    const phase = event.target.closest<HTMLElement>('[data-plane-group]');
    if (plane) chooseHero(Number(plane.dataset.heroPlane));
    if (phase) focusPhase(phase.dataset.planeGroup!);
  });

  const scenes = [...root.querySelectorAll<HTMLElement>('[data-scene]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const scene = entry.target as HTMLElement;
      scene.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting) scene.classList.add('dt-seen');
    }), { threshold: 0.08 });
    scenes.forEach(scene => observer.observe(scene));
  }
  const syncVisibility = () => { root.dataset.background = String(document.hidden); };
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
}
