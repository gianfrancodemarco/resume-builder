import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('toggleTheme', () => {
  let theme;

  beforeEach(() => {
    // Mock theme object similar to Vuetify's
    theme = {
      global: {
        current: { value: { dark: true } },  // start with light theme
        name: { value: 'dark' }
      }
    };
    localStorage.clear();
  });

  const toggleTheme = () => {
    // Start with default: dark mode
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  it('toggles from dark to light and updates localStorage', () => {
    toggleTheme();

    expect(theme.global.name.value).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('toggles from light to dark and updates localStorage', () => {
    // Manually set light mode before toggle
    theme.global.current.value.dark = false;
    theme.global.name.value = 'light';

    toggleTheme();

    expect(theme.global.name.value).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
