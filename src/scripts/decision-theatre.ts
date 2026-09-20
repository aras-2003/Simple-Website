const root = document.querySelector<HTMLElement>('[data-theatre]');
if (root) {
  const system = root.querySelector<HTMLElement>('[data-system]')!;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-mode-button]')];
  const stories = [...root.querySelectorAll<HTMLElement>('[data-story]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = root.querySelector<HTMLButtonElement>('[data-motion-toggle]')!;
  const label = root.querySelector<HTMLElement>('[data-motion-label]')!;
  let userPaused = false;

  function syncMotion() {
    const paused = userPaused || reduced.matches;
    root!.dataset.motion = paused ? 'paused' : 'running';
    toggle.hidden = reduced.matches;
    toggle.setAttribute('aria-pressed', String(userPaused));
    label.textContent = userPaused ? 'Wznów ruch' : 'Wstrzymaj ruch';
  }
  toggle.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  syncMotion();

  const choose = (index: number) => {
    system.dataset.mode = String(index);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    stories.forEach((story, i) => { story.hidden = i !== index; });
    const counter = root!.querySelector('[data-mode-count]');
    if (counter) counter.textContent = `0${index + 1} / 03`;
    const path = buttons[index]!.dataset.path!.split(',').map(Number);
    system.querySelectorAll<SVGElement>('[data-node]').forEach(node => {
      node.classList.toggle('is-active', path.includes(Number(node.dataset.node)));
    });
  };
  buttons.forEach((button, index) => {
    button.disabled = false;
    button.addEventListener('click', () => choose(index));
    button.addEventListener('keydown', event => {
      const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
        (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]!.focus();
      choose(next);
    });
  });
  choose(0);

  // Only animate visible scenes; CSS has a complete no-JS/default appearance.
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
