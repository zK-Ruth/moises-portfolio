import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit, OnDestroy {
  readonly activeSection = signal<string>('hero');
  readonly mobileMenuOpen = signal(false);
  readonly langService = inject(LanguageService);

  readonly navLinks = [
    { id: 'about', href: '#about', label: 'nav.links.about' },
    { id: 'projects', href: '#projects', label: 'nav.links.projects' },
    { id: 'work', href: '#work', label: 'nav.links.work' },
    { id: 'contact', href: '#contact', label: 'nav.links.contact' },
  ];

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px' }
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
    this.mobileMenuOpen.update(v => !v);
  }
}
