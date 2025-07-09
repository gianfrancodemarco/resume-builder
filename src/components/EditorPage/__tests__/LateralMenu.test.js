import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LateralMenu from '@/components/EditorPage/LateralMenu.vue';
import { vuetify } from '@/test/setup';

describe('toggleTheme', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(LateralMenu, {
      global: {
        plugins: [vuetify]
      }
    })
    localStorage.clear();
  });

  it('toggles from dark to light theme and updates localStorage', () => {
    wrapper.vm.theme.global.current.value.dark = true
    wrapper.vm.theme.global.name.value = 'dark'

    wrapper.vm.toggleTheme();
    
    expect(wrapper.vm.theme.global.name.value).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('toggles from light to dark theme and updates localStorage', () => {
    // Manually set light mode before toggle
    wrapper.vm.theme.global.current.value.dark = false;
    wrapper.vm.theme.global.name.value = 'light';

    wrapper.vm.toggleTheme();

    expect(wrapper.vm.theme.global.name.value).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
