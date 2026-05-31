import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactService } from '../../../../services/contact.service';
import { SelectComponent, SelectOption } from '../../../../components/select/select.component';

interface AmbientParticle {
  left: string;
  bottom: string;
  size: number;
  color: string;
  opacity: number;
  duration: string;
  delay: string;
}

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslateModule, SelectComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly submitted = signal(false);
  readonly loading = signal(false);

  readonly projectTypeOptions: SelectOption[] = [
    { value: 'Full Stack App', labelKey: 'contact.form.options.projectType.fullstack' },
    { value: 'E-commerce Website', labelKey: 'contact.form.options.projectType.ecommerce' },
    { value: 'Infra/Template Structure', labelKey: 'contact.form.options.projectType.infra' },
    { value: 'Portfolio', labelKey: 'contact.form.options.projectType.portfolio' },
    { value: 'Secured Pipeline', labelKey: 'contact.form.options.projectType.pipeline' },
    { value: 'Other', labelKey: 'contact.form.options.projectType.other' },
  ];

  readonly budgetOptions: SelectOption[] = [
    { value: '< $500', labelKey: 'contact.form.options.budget.under500' },
    { value: '$500 - $1k', labelKey: 'contact.form.options.budget.range500to1k' },
    { value: '$1k - $3k', labelKey: 'contact.form.options.budget.range1to3k' },
    { value: '$3k - $10k', labelKey: 'contact.form.options.budget.range3to10k' },
    { value: '$10k+', labelKey: 'contact.form.options.budget.over10k' },
  ];

  /** Decorative rising particles for the ambient backdrop (gold + cyan). */
  readonly particles: AmbientParticle[] = [
    { left: '6%', bottom: '4%', size: 8, color: 'rgba(245,196,0,0.95)', opacity: 0.9, duration: '9s', delay: '0s' },
    { left: '13%', bottom: '24%', size: 6, color: 'rgba(56,189,248,0.9)', opacity: 0.85, duration: '11s', delay: '1.4s' },
    { left: '21%', bottom: '44%', size: 7, color: 'rgba(245,196,0,0.85)', opacity: 0.8, duration: '13s', delay: '0.6s' },
    { left: '28%', bottom: '10%', size: 5, color: 'rgba(56,189,248,0.95)', opacity: 0.85, duration: '10s', delay: '2.2s' },
    { left: '36%', bottom: '32%', size: 9, color: 'rgba(245,196,0,0.8)', opacity: 0.8, duration: '14s', delay: '0.9s' },
    { left: '44%', bottom: '6%', size: 6, color: 'rgba(56,189,248,0.85)', opacity: 0.8, duration: '12s', delay: '3s' },
    { left: '51%', bottom: '48%', size: 7, color: 'rgba(245,196,0,0.9)', opacity: 0.85, duration: '15s', delay: '1.1s' },
    { left: '58%', bottom: '20%', size: 5, color: 'rgba(56,189,248,0.9)', opacity: 0.85, duration: '10.5s', delay: '2.6s' },
    { left: '65%', bottom: '38%', size: 8, color: 'rgba(245,196,0,0.85)', opacity: 0.8, duration: '13.5s', delay: '0.3s' },
    { left: '72%', bottom: '8%', size: 6, color: 'rgba(56,189,248,0.95)', opacity: 0.9, duration: '11.5s', delay: '1.9s' },
    { left: '80%', bottom: '30%', size: 7, color: 'rgba(245,196,0,0.8)', opacity: 0.8, duration: '14.5s', delay: '3.4s' },
    { left: '88%', bottom: '14%', size: 5, color: 'rgba(56,189,248,0.85)', opacity: 0.85, duration: '12.5s', delay: '0.5s' },
    { left: '94%', bottom: '40%', size: 8, color: 'rgba(245,196,0,0.9)', opacity: 0.85, duration: '16s', delay: '2s' },
    { left: '33%', bottom: '56%', size: 6, color: 'rgba(56,189,248,0.8)', opacity: 0.8, duration: '15.5s', delay: '1.6s' },
    { left: '48%', bottom: '64%', size: 5, color: 'rgba(245,196,0,0.85)', opacity: 0.8, duration: '13s', delay: '3.8s' },
    { left: '76%', bottom: '58%', size: 7, color: 'rgba(56,189,248,0.9)', opacity: 0.85, duration: '14s', delay: '0.8s' },
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    projectType: ['Full Stack App'],
    budget: ['< $500'],
    message: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    try {
      await this.contactService.submitContact(this.form.getRawValue());
      this.submitted.set(true);
      this.form.reset();
    } finally {
      this.loading.set(false);
    }
  }
}
