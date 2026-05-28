import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { ContactComponent } from './sections/contact/contact.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, AboutComponent, ProjectsComponent, ExperienceComponent, ContactComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
