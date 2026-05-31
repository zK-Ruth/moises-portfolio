import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface SelectOption {
  /** Stable value stored in the form (also used in the contact email). */
  value: string;
  /** i18n key for the option label. */
  labelKey: string;
}

@Component({
  selector: 'app-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      [id]="fieldId()"
      [disabled]="disabled()"
      (click)="toggle()"
      class="dd-trigger w-full bg-[#f5f5f5] rounded-lg px-md py-sm font-body-md text-on-surface flex items-center justify-between gap-sm outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-shadow"
      aria-haspopup="listbox"
      [attr.aria-expanded]="open()"
    >
      <span>{{ selectedLabelKey() | translate }}</span>
      <span class="material-symbols-outlined dd-chevron text-[20px]" [class.rot]="open()"
        >expand_more</span
      >
    </button>

    <ul class="dd-menu" [class.open]="open()" role="listbox">
      @for (opt of options(); track opt.value) {
        <li
          role="option"
          [attr.aria-selected]="opt.value === value()"
          (click)="select(opt)"
          class="dd-option px-md py-sm font-body-md flex items-center justify-between gap-sm cursor-pointer"
          [class.selected]="opt.value === value()"
        >
          <span>{{ opt.labelKey | translate }}</span>
          @if (opt.value === value()) {
            <span class="material-symbols-outlined text-[18px]">check</span>
          }
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
    }

    .dd-trigger {
      cursor: pointer;
    }
    .dd-trigger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .dd-chevron {
      color: var(--color-on-surface-variant);
      transition: transform 0.25s ease;
    }
    .dd-chevron.rot {
      transform: rotate(180deg);
    }

    .dd-menu {
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 6px);
      z-index: 50;
      margin: 0;
      padding: 4px;
      list-style: none;
      background: var(--color-surface, #ffffff);
      border: 1px solid var(--color-surface-container-highest, #e5e2e1);
      border-radius: 12px;
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.16);
      max-height: 280px;
      overflow-y: auto;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-6px) scale(0.98);
      transform-origin: top center;
      transition:
        opacity 0.18s ease,
        transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0.2s;
    }
    .dd-menu.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }

    .dd-option {
      border-radius: 8px;
      color: var(--color-on-surface-variant);
      transition:
        background-color 0.18s ease,
        color 0.18s ease;
    }
    .dd-option:hover {
      background: var(--color-surface-container-high, #ebe7e7);
      color: var(--color-on-surface);
    }
    .dd-option.selected {
      background: color-mix(in srgb, var(--color-primary-container) 18%, transparent);
      color: var(--color-on-surface);
      font-weight: 500;
    }
    .dd-option.selected .material-symbols-outlined {
      color: var(--color-primary-fixed-dim);
    }

    @media (prefers-reduced-motion: reduce) {
      .dd-menu,
      .dd-chevron {
        transition: none;
      }
    }
  `,
})
export class SelectComponent implements ControlValueAccessor {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly options = input<SelectOption[]>([]);
  readonly fieldId = input<string | undefined>(undefined, { alias: 'id' });

  readonly open = signal(false);
  readonly value = signal<string>('');
  readonly disabled = signal(false);

  readonly selectedLabelKey = computed(
    () => this.options().find((o) => o.value === this.value())?.labelKey ?? '',
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((o) => !o);
    if (!this.open()) this.onTouched();
  }

  select(option: SelectOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.open.set(false);
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.open.set(false);
  }
}
