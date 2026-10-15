type Theme = 'light' | 'dark';
const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';
const root = document.documentElement;
const system = window.matchMedia('(prefers-color-scheme: dark)');
let preference: Theme | undefined = isTheme(root.dataset.themePreference) ? root.dataset.themePreference : undefined;

function applyTheme() {
  const theme = preference ?? (system.matches ? 'dark' : 'light');
  // Do not animate contrasting foreground/background colors through low-contrast midpoints.
  root.setAttribute('data-theme-changing', '');
  root.dataset.theme = theme;
  root.dataset.themePreference = preference ?? 'system';
  root.style.colorScheme = theme;
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    if (button.hasAttribute('data-theme-action')) {
      const label = (theme === 'dark' ? button.dataset.lightLabel : button.dataset.darkLabel) ?? '';
      button.setAttribute('aria-label', label);
      button.title = label;
    } else {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    button.hidden = false;
  });
  document.dispatchEvent(new CustomEvent('eden:theme-change', { detail: { theme, preference: preference ?? 'system' } }));
  requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute('data-theme-changing')));
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || !event.target.closest('[data-theme-toggle]')) return;
  preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('eden-theme', preference); } catch { /* Keep the choice for this page when storage is blocked. */ }
  applyTheme();
});

system.addEventListener('change', () => { if (!preference) applyTheme(); });
window.addEventListener('storage', (event) => {
  if (event.key !== 'eden-theme' && event.key !== null) return;
  try { if (event.storageArea !== localStorage) return; } catch { return; }
  preference = isTheme(event.newValue) ? event.newValue : undefined;
  applyTheme();
});

applyTheme();
