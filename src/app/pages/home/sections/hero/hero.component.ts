import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  /** Pointer-driven 3D tilt (degrees) for the visual card. */
  readonly tiltX = signal(0);
  readonly tiltY = signal(0);

  private static readonly MAX_TILT = 7;

  onTilt(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    this.tiltX.set(px * HeroComponent.MAX_TILT * 2);
    this.tiltY.set(-py * HeroComponent.MAX_TILT * 2);
  }

  resetTilt(): void {
    this.tiltX.set(0);
    this.tiltY.set(0);
  }
}
