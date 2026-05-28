import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly supportedLangs = ['en', 'es'] as const;
  readonly currentLang = signal<string>('en');

  init(): void {
    this.translate.setDefaultLang('en');
    const saved = localStorage.getItem('lang');
    const browser = (navigator.language ?? 'en').split('-')[0].toLowerCase();
    const lang = saved ?? (this.isSupported(browser) ? browser : 'en');
    this.apply(lang);
  }

  setLanguage(lang: string): void {
    if (!this.isSupported(lang)) return;
    this.apply(lang);
  }

  toggle(): void {
    this.setLanguage(this.currentLang() === 'en' ? 'es' : 'en');
  }

  private apply(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }

  private isSupported(lang: string): lang is (typeof this.supportedLangs)[number] {
    return (this.supportedLangs as readonly string[]).includes(lang);
  }
}
