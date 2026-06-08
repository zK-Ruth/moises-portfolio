import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../../../../models/project.model';

type FilterCategory = 'all' | 'fullstack' | 'devsecops' | 'opensource';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  /** Toggles the staggered card-entrance animation once the grid scrolls into view. */
  readonly visible = signal(false);

  readonly activeFilter = signal<FilterCategory>('all');

  /** Ids whose <img> failed to load — we fall back to the generated cover for these. */
  private readonly failedImages = signal<ReadonlySet<string>>(new Set());

  readonly filters: { label: string; value: FilterCategory }[] = [
    { label: 'projects.filters.all', value: 'all' },
    { label: 'projects.filters.fullstack', value: 'fullstack' },
    { label: 'projects.filters.devsecops', value: 'devsecops' },
    { label: 'projects.filters.opensource', value: 'opensource' },
  ];

  private readonly allProjects: Project[] = [
    {
      id: 'dzeus',
      title: 'projects.items.dzeus.title',
      description: 'projects.items.dzeus.description',
      tags: ['Telemedicine', 'Cloud', 'Full Stack'],
      category: 'fullstack',
      accentColor: '#00677d',
      icon: 'health_and_safety',
      image: 'images/dzeus.PNG',
      url: 'https://dzeus.com',
    },
    {
      id: 'dinofeedback',
      title: 'projects.items.dinofeedback.title',
      description: 'projects.items.dinofeedback.description',
      tags: ['Angular 20', 'Firebase', 'TailwindCSS'],
      category: 'fullstack',
      accentColor: '#f5c400',
      icon: 'reviews',
      image: 'images/dinofeedback.PNG',
      url: 'https://dinofeedback.web.app',
    },
    {
      id: 'photography',
      title: 'projects.items.photography.title',
      description: 'projects.items.photography.description',
      tags: ['TBD'],
      category: 'fullstack',
      accentColor: '#f5c400',
      icon: 'hourglass_top',
      image: 'images/photography.PNG',
      url: 'https://photography-in-progress.web.app/',
    },
    {
      id: 'pipelines',
      title: 'projects.items.pipelines.title',
      description: 'projects.items.pipelines.description',
      tags: ['CI/CD', 'Docker/K8s', 'Security'],
      category: 'devsecops',
      accentColor: '#1a1a1a',
      icon: 'account_tree',
      disabled: true,
      disabledLabel: 'projects.private',
    },
    {
      id: 'playaspr',
      title: 'projects.items.playaspr.title',
      description: 'projects.items.playaspr.description',
      tags: ['Angular, Webscraping, APIs'],
      category: 'fullstack',
      accentColor: '#f5c400',
      icon: 'hourglass_top',
      image: 'images/playaspr.PNG',
      disabled: false,
      url: 'https://playaspr.com',
    },
    {
      id: 'crudapp',
      title: 'projects.items.crudapp.title',
      description: 'projects.items.crudapp.description',
      tags: ['C++, MySQL, OOP, PopSQL'],
      category: 'devsecops',
      accentColor: '#1a1a1a',
      icon: 'hourglass_top',
      image: 'images/crudapp.PNG',
      disabled: true,
      disabledLabel: 'projects.private',
    },
  ];

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all'
      ? this.allProjects
      : this.allProjects.filter((p) => p.category === filter);
  });

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /** Track the cursor so each card's spotlight glow follows the pointer. */
  onCardMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }

  /** The View Project button is disabled explicitly, or when there is no destination url. */
  isDisabled(project: Project): boolean {
    return project.disabled === true || !project.url;
  }

  /** Show the real screenshot only when one is set and it hasn't failed to load. */
  showImage(project: Project): boolean {
    return !!project.image && !this.failedImages().has(project.id);
  }

  onImageError(id: string): void {
    this.failedImages.update((set) => new Set(set).add(id));
  }

  /** Premium mesh-gradient cover derived from each project's accent colour. */
  coverBackground(accent: string): string {
    return (
      `radial-gradient(circle at 78% 18%, rgba(255,255,255,0.22), transparent 45%),` +
      `radial-gradient(circle at 15% 90%, rgba(0,0,0,0.35), transparent 55%),` +
      `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 38%, #111111) 100%)`
    );
  }
}
