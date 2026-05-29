import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit, OnDestroy {
  readonly activeSection = signal<string>('hero');
  readonly mobileMenuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly langService = inject(LanguageService);
  readonly theme = inject(ThemeService);

  readonly navLinks = [
    { id: 'about', href: '#about', label: 'nav.links.about' },
    { id: 'projects', href: '#projects', label: 'nav.links.projects' },
    { id: 'work', href: '#work', label: 'nav.links.work' },
    { id: 'contact', href: '#contact', label: 'nav.links.contact' },
  ];

  private observer?: IntersectionObserver;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  ngOnInit(): void {
    this.onScroll();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );

    for (const link of this.navLinks) {
      const el = document.getElementById(link.id);
      if (el) this.observer.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
