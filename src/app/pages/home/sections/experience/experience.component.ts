import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Experience, Certification } from '../../../../models/experience.model';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './experience.component.html',
})
export class ExperienceComponent {
  readonly experiences: Experience[] = [
    {
      id: '1',
      role: 'experience.items.1.role',
      company: 'TechCorp Inc.',
      period: '2021 - PRESENT',
      description: 'experience.items.1.description',
    },
    {
      id: '2',
      role: 'experience.items.2.role',
      company: 'Innovate Solutions',
      period: '2018 - 2021',
      description: 'experience.items.2.description',
    },
    {
      id: '3',
      role: 'experience.items.3.role',
      company: 'DataFlow Systems',
      period: '2016 - 2018',
      description: 'experience.items.3.description',
    },
    {
      id: '4',
      role: 'experience.items.4.role',
      company: 'StartUp Web',
      period: '2014 - 2016',
      description: 'experience.items.4.description',
    },
  ];

  readonly certifications: Certification[] = [
    { id: '1', name: 'experience.certs.1' },
    { id: '2', name: 'experience.certs.2' },
    { id: '3', name: 'experience.certs.3' },
  ];
}
