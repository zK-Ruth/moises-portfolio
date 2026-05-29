import { computed, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  /** Light is the default; only an explicitly saved 'dark' opts in. */
  init(): void {
    const saved = localStorage.getItem('theme');
    this.apply(saved === 'dark' ? 'dark' : 'light');
  }

  toggle(): void {
    this.apply(this.isDark() ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.apply(theme);
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }
}
