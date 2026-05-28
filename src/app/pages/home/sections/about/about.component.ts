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
      tags: ['React', 'Node.js', 'TypeScript'],
    },
    {
      icon: 'cloud',
      title: 'about.cards.devsecops.title',
      description: 'about.cards.devsecops.description',
      tags: ['AWS', 'Docker/K8s', 'Terraform'],
    },
  ];

  readonly coreTech = ['React', 'Node.js', 'AWS', 'Kubernetes', 'Terraform', 'Docker', 'PostgreSQL', 'GraphQL'];
}
