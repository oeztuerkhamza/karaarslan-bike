import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  inject,
  OnInit,
  effect,
  Injector,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HolidayBannerComponent } from './components/holiday-banner/holiday-banner.component';
import { TranslationService } from './services/translation.service';
import { SeoService } from './services/seo.service';
import { HolidayService } from './services/holiday.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    HolidayBannerComponent,
  ],
  template: `
    <div class="app-layout">
      <app-holiday-banner></app-holiday-banner>
      <app-navbar></app-navbar>
      <main
        class="main-content"
        [class.with-holiday-banner]="holidayActive()"
        role="main"
      >
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--color-bg);
      }

      .main-content {
        flex: 1;
      }

      /* The banner is fixed, so shift the content down by its height to keep
         the usual clearance below the (also fixed) navbar. */
      .main-content.with-holiday-banner {
        padding-top: var(--holiday-banner-height, 44px);
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);
  private translationService = inject(TranslationService);
  private seoService = inject(SeoService);
  private holidayService = inject(HolidayService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private injector = inject(Injector);

  holidayActive = this.holidayService.isActive;

  ngOnInit(): void {
    // Set initial translations
    this.updateMetaTags();

    // Make sure a tab left open across midnight drops the holiday banner
    this.holidayService.refresh();

    // Update meta tags whenever language changes
    effect(
      () => {
        this.translationService.currentLanguage();
        this.updateMetaTags();
      },
      { injector: this.injector },
    );

    if (isPlatformBrowser(this.platformId)) {
      this.updateLanguageAttribute();
      // Update language attribute whenever language changes
      effect(
        () => {
          this.translationService.currentLanguage();
          this.updateLanguageAttribute();
        },
        { injector: this.injector },
      );
    }

    // Initialize SEO service - it handles hreflang and canonical updates
    this.seoService.init();
  }

  private updateMetaTags(): void {
    const t = this.translationService.translations();
    this.title.setTitle(t.metaTitle);
    this.meta.updateTag({ name: 'description', content: t.metaDescription });
  }

  private updateLanguageAttribute(): void {
    this.document.documentElement.lang =
      this.translationService.currentLanguage();
  }
}
