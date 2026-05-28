import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../../../../models/project.model';

type FilterCategory = 'all' | 'fullstack' | 'devsecops' | 'opensource';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  readonly activeFilter = signal<FilterCategory>('all');

  readonly filters: { label: string; value: FilterCategory }[] = [
    { label: 'projects.filters.all', value: 'all' },
    { label: 'projects.filters.fullstack', value: 'fullstack' },
    { label: 'projects.filters.devsecops', value: 'devsecops' },
    { label: 'projects.filters.opensource', value: 'opensource' },
  ];

  private readonly allProjects: Project[] = [
    { id: '1', title: 'projects.items.securepipe.title', description: 'projects.items.securepipe.description', tags: ['Go', 'GitHub Actions'], category: 'devsecops', accentColor: '#1a1a1a' },
    { id: '2', title: 'projects.items.cloudarch.title', description: 'projects.items.cloudarch.description', tags: ['React', 'Node.js', 'AWS'], category: 'fullstack', accentColor: '#f5c400' },
    { id: '3', title: 'projects.items.vaultguard.title', description: 'projects.items.vaultguard.description', tags: ['Vue.js', 'Vault API'], category: 'devsecops', accentColor: '#1a1a1a' },
    { id: '4', title: 'projects.items.portfolioos.title', description: 'projects.items.portfolioos.description', tags: ['Next.js', 'Tailwind'], category: 'fullstack', accentColor: '#f5c400' },
    { id: '5', title: 'projects.items.threatmapper.title', description: 'projects.items.threatmapper.description', tags: ['Python', 'K8s API'], category: 'opensource', accentColor: '#1a1a1a' },
    { id: '6', title: 'projects.items.apishield.title', description: 'projects.items.apishield.description', tags: ['TypeScript', 'Express'], category: 'opensource', accentColor: '#f5c400' },
  ];

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all' ? this.allProjects : this.allProjects.filter(p => p.category === filter);
  });
}
