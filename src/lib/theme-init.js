// Kept as a tiny classic script so it can run in <head> before styles/body paint.
(() => {
  let preference;
  try {
    const saved = localStorage.getItem('eden-theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // Storage may be unavailable; system preference still works.
  }
  const theme = preference ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.themePreference = preference ?? 'system';
  root.style.colorScheme = theme;
})();
