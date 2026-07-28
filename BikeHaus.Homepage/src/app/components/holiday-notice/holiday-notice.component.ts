import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { HolidayService } from '../../services/holiday.service';

/**
 * Compact holiday note meant to sit next to an opening-hours table.
 */
@Component({
  selector: 'app-holiday-notice',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (holiday.isActive()) {
      <div class="holiday-notice">
        <span class="notice-label">{{ t().holidayLabel }}</span>
        <p class="notice-closed">
          {{ holiday.fill(t().holidayClosedRange) }}
        </p>
        <p class="notice-reopen">{{ holiday.fill(t().holidayReopen) }}</p>
        <p class="notice-hint">{{ t().holidayContactHint }}</p>
      </div>
    }
  `,
  styles: [
    `
      .holiday-notice {
        margin-top: 1rem;
        padding: 0.9rem 1rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 87, 34, 0.35);
        background: var(--color-accent-subtle);
      }

      .notice-label {
        display: inline-block;
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: 0.4rem;
      }

      .holiday-notice p {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.5;
      }

      .notice-closed {
        color: var(--color-text);
        font-weight: 600;
      }

      .notice-reopen {
        color: var(--color-text);
      }

      .notice-hint {
        margin-top: 0.35rem !important;
        color: var(--color-text-secondary);
        font-size: 0.78rem !important;
      }
    `,
  ],
})
export class HolidayNoticeComponent {
  private translationService = inject(TranslationService);
  holiday = inject(HolidayService);

  t = this.translationService.translations;
}
