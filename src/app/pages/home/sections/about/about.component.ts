import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef);
  private observer?: IntersectionObserver;

  readonly visible = signal(false);

  readonly expertiseCards = [
    {
      icon: 'code',
      title: 'about.cards.fullstack.title',
      description: 'about.cards.fullstack.description',
      tags: ['Angular', 'Node.js', 'TypeScript', 'Databases'],
    },
    {
      icon: 'cloud',
      title: 'about.cards.devsecops.title',
      description: 'about.cards.devsecops.description',
      tags: ['Pipelines', 'Docker/K8s', 'Python', 'Testing'],
    },
  ];

  readonly techGroups = [
    {
      label: 'Frontend',
      icon: 'web',
      items: ['Angular', 'TypeScript', 'Tailwind CSS', 'Javascript'],
    },
    {
      label: 'Backend',
      icon: 'dns',
      items: ['Node.js', 'Java', 'C++', 'Python', 'PostgreSQL', 'DBMS'],
    },
    {
      label: 'DevOps & Cloud',
      icon: 'cloud_sync',
      items: ['Docker', 'Kubernetes', 'Google Cloud', 'Git', 'Shell'],
    },
  ];

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
