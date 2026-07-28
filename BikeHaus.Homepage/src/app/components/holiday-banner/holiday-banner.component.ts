import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { HolidayService } from '../../services/holiday.service';

@Component({
  selector: 'app-holiday-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (holiday.isActive()) {
      <div class="holiday-banner" role="status">
        <div class="container banner-inner">
          <span class="badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {{ t().holidayLabel }}
          </span>
          <p class="banner-text">
            <strong>{{ closedText() }}</strong>
            <span>{{ reopenText() }}</span>
          </p>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .holiday-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1100;
        background: linear-gradient(90deg, #ff5722 0%, #e64a19 100%);
        color: #fff;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
      }

      .banner-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        min-height: 44px;
        text-align: center;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        flex-shrink: 0;
        background: rgba(0, 0, 0, 0.18);
        border-radius: 999px;
        padding: 0.25rem 0.65rem;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .banner-text {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.4;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
      }

      .banner-text strong {
        font-weight: 700;
      }

      .banner-text span {
        opacity: 0.9;
      }

      @media (max-width: 768px) {
        .banner-inner {
          flex-direction: column;
          gap: 0.3rem;
          padding-top: 0.45rem;
          padding-bottom: 0.45rem;
        }

        .banner-text {
          font-size: 0.78rem;
          flex-direction: column;
          gap: 0.1rem;
        }
      }
    `,
  ],
})
export class HolidayBannerComponent implements AfterViewInit, OnDestroy {
  private translationService = inject(TranslationService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private resizeObserver?: ResizeObserver;

  holiday = inject(HolidayService);

  t = this.translationService.translations;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.holiday.isActive()) return;

    const banner: HTMLElement | null =
      this.elementRef.nativeElement.querySelector('.holiday-banner');
    if (!banner) return;

    this.publishHeight(banner.offsetHeight);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() =>
        this.publishHeight(banner.offsetHeight),
      );
      this.resizeObserver.observe(banner);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.style.removeProperty(
        '--holiday-banner-height',
      );
    }
  }

  /** Lets the fixed navbar know how far down it has to sit. */
  private publishHeight(height: number): void {
    this.document.documentElement.style.setProperty(
      '--holiday-banner-height',
      `${height}px`,
    );
  }

  closedText(): string {
    return this.holiday.fill(
      this.holiday.isClosed()
        ? this.t().holidayClosedNow
        : this.t().holidayClosedSoon,
    );
  }

  reopenText(): string {
    return this.holiday.fill(this.t().holidayReopen);
  }
}
