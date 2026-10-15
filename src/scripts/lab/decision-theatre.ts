/** The lab alone loads the graphics runtime; reading never depends on WebGL. */
const root = document.querySelector<HTMLElement>('[data-theatre]');
if (root) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dispose: (() => void) | undefined;
  let generation = 0;
  const reset = () => {
    root.classList.remove('dt-enhanced', 'dt-webgl');
    root.querySelector<HTMLElement>('[data-hero]')!.hidden = false;
    root.querySelector<HTMLElement>('[data-state-copy]')!.hidden = true;
    root.querySelector<HTMLElement>('[data-progress]')!.hidden = true;
    root.querySelector<HTMLElement>('[data-scroll-hint]')!.hidden = false;
    root.querySelector<HTMLButtonElement>('[data-motion]')!.hidden = true;
    root.dataset['state'] = 'hero';
    root.dataset['progress'] = '0';
    root.dataset['renderMode'] = media.matches ? 'reduced-motion' : 'fallback';
  };
  const start = async () => {
    const current = ++generation;
    dispose?.();
    dispose = undefined;
    reset();
    if (media.matches) return;
    try {
      const { mountTheatre } = await import('./theatre-scene');
      if (generation !== current) return;
      dispose = mountTheatre(root, reset);
    } catch {
      // A blocked module, unsupported WebGL or renderer failure leaves all copy usable.
      if (generation === current) reset();
    }
  };
  media.addEventListener('change', start);
  window.addEventListener('pagehide', () => { generation++; dispose?.(); });
  window.addEventListener('pageshow', (event) => { if (event.persisted) void start(); });
  void start();
}
