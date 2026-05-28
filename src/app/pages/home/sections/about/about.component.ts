import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './about.component.html',
})
export class AboutComponent {
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

  readonly coreTech = [
    'Angular',
    'Node.js',
    'Tailwind CSS',
    'Kubernetes',
    'Python',
    'Docker',
    'PostgreSQL',
    'Java',
    'C++',
    'Typescript',
    'Shell',
    'DBMS',
    'Google Cloud',
    'Git',
  ];
}
