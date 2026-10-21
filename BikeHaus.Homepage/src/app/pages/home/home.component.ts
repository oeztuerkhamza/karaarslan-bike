import {
  Component,
  PLATFORM_ID,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';
import { HOLIDAY_SCHEMA_SPEC } from '../../services/holiday.service';
import { BikeCardComponent } from '../../components/bike-card/bike-card.component';
import { NeueBikeCardComponent } from '../../components/neue-bike-card/neue-bike-card.component';
import { environment } from '../../../environments/environment';
import {
  KleinanzeigenListing,
  KleinanzeigenCategory,
  PublicShopInfo,
  NeueFahrrad,
  RepairShowcase,
  GoogleReview,
} from '../../models/models';

interface Testimonial {
  name: string;
  initials: string;
  text: string;
  detail: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BikeCardComponent,
    NeueBikeCardComponent,
  ],
  template: `
    <!-- ═══ HERO ═══ -->
    <section class="hero" aria-labelledby="hero-heading">
      <img
        class="hero-img"
        src="/assets/stock/hero.webp"
        alt=""
        width="2200"
        height="1467"
        fetchpriority="high"
        decoding="async"
      />
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow fade-in">
            <span class="eyebrow-dot" aria-hidden="true"></span>
            {{ t().heroEyebrow }}
          </span>
          <h1 id="hero-heading" class="hero-h1 fade-in d1">
            {{ heroTitle()[0]
            }}<span class="hero-h1-accent" *ngIf="heroTitle()[1]">{{
              heroTitle()[1]
            }}</span>
          </h1>
          <p class="hero-sub fade-in d2">{{ t().heroSub }}</p>
          <div class="hero-actions fade-in d3">
            <a
              [routerLink]="['/' + lang(), 'neue-fahrraeder']"
              class="btn-primary"
              >{{ t().ctaPrimary }}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              [routerLink]="['/' + lang(), 'showroom']"
              class="btn-secondary btn-glass"
              >{{ t().ctaSecondary }}</a
            >
          </div>
        </div>

        <aside class="hero-card fade-in d4" aria-label="Karaarslan Bike">
          <div class="hero-card-stats">
            <div class="hc-stat" *ngIf="shopInfo()?.totalActiveListings">
              <span class="hc-stat-n">{{
                shopInfo()?.totalActiveListings ?? '—'
              }}</span>
              <span class="hc-stat-l">{{ t().bikesAvailable }}</span>
            </div>
            <div class="hc-stat" *ngIf="googleRating() > 0">
              <span class="hc-stat-n"
                >{{ googleRating().toFixed(1) }}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  /></svg
              ></span>
              <span class="hc-stat-l"
                >{{ googleTotalReviews() }} Google
                {{ t().reviewCountLabel }}</span
              >
            </div>
          </div>
          <a
            class="hc-row"
            href="https://maps.app.goo.gl/Q1fXe7A6PRb8E5wV7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>
              <strong>Alstedder Straße 5</strong>
              <small>44534 Lünen · {{ t().ctaRoute }}</small>
            </span>
          </a>
          <a
            class="hc-row"
            href="https://wa.me/491637390301"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path [attr.d]="whatsappPath" />
            </svg>
            <span>
              <strong>+49 163 7390 301</strong>
              <small>{{ t().ctaWhatsapp }}</small>
            </span>
          </a>
        </aside>
      </div>
      <div class="hero-scroll" aria-hidden="true">
        <span></span>
      </div>
    </section>

    <!-- ═══ USP TICKER ═══ -->
    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        @for (round of [0, 1]; track round) {
          @for (item of tickerItems(); track $index) {
            <span class="ticker-item">{{ item }}</span>
            <span class="ticker-sep">✦</span>
          }
        }
      </div>
    </div>

    <!-- ═══ SERVICES ═══ -->
    <section class="block" aria-label="Services">
      <div class="container svc-grid">
        <article class="svc-card reveal">
          <img
            src="/assets/stock/werkstatt.webp"
            alt=""
            loading="lazy"
            width="1200"
            height="800"
          />
          <div class="svc-body">
            <span class="chip">{{ t().svcRepairBadge }}</span>
            <h2>{{ t().svcRepairTitle }}</h2>
            <p>{{ t().svcRepairSub }}</p>
            <ul class="svc-tags">
              <li>{{ t().svcRepairItem1 }}</li>
              <li>{{ t().svcRepairItem2 }}</li>
              <li>{{ t().svcRepairItem3 }}</li>
              <li>{{ t().svcRepairItem4 }}</li>
            </ul>
            <a
              href="https://wa.me/491637390301"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary btn-wa"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path [attr.d]="whatsappPath" />
              </svg>
              {{ t().svcRepairWaCta }}
            </a>
          </div>
        </article>
        <article class="svc-card reveal">
          <img
            src="/assets/stock/neurad.webp"
            alt=""
            loading="lazy"
            width="1200"
            height="665"
          />
          <div class="svc-body">
            <span class="chip">{{ t().svcAngeboteBadge }}</span>
            <h2>{{ t().svcAngeboteTitle }}</h2>
            <p>{{ t().svcAngeboteSub }}</p>
            <a
              [routerLink]="['/' + lang(), 'neue-fahrraeder']"
              class="btn-secondary btn-glass"
            >
              {{ t().svcAngeboteCta }}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </section>

    <!-- ═══ CATEGORIES ═══ -->
    <section class="block" aria-labelledby="cat-heading">
      <div class="container">
        <header class="block-head reveal">
          <div>
            <span class="section-label">{{ t().catLabel }}</span>
            <h2 id="cat-heading" class="section-title">{{ t().catTitle }}</h2>
          </div>
          <p class="section-subtitle">{{ t().catSub }}</p>
        </header>
        <div class="cat-grid">
          @for (cat of categoryTiles(); track cat.img; let i = $index) {
            <a
              class="cat-tile reveal"
              [class.cat-tile-wide]="i === 0"
              [routerLink]="['/' + lang(), 'showroom']"
            >
              <img
                [src]="cat.img"
                alt=""
                loading="lazy"
                width="900"
                height="600"
              />
              <span class="cat-index">0{{ i + 1 }}</span>
              <span class="cat-text">
                <strong>{{ cat.label }}</strong>
                <small>{{ t().catCta }}</small>
              </span>
              <span class="cat-arrow" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ═══ VALUES ═══ -->
    <section class="block block-tint" aria-labelledby="values-heading">
      <div class="container">
        <header class="block-head reveal">
          <div>
            <span class="section-label">{{ t().valueLabel }}</span>
            <h2 id="values-heading" class="section-title">
              {{ t().valueTitle }}
            </h2>
          </div>
        </header>
        <div class="values-grid">
          <article class="value-card reveal">
            <span class="value-num">01</span>
            <h3>{{ t().value1Title }}</h3>
            <p>{{ t().value1Desc }}</p>
          </article>
          <article class="value-card reveal">
            <span class="value-num">02</span>
            <h3>{{ t().value2Title }}</h3>
            <p>{{ t().value2Desc }}</p>
          </article>
          <article class="value-card reveal">
            <span class="value-num">03</span>
            <h3>{{ t().value3Title }}</h3>
            <p>{{ t().value3Desc }}</p>
          </article>
          <article class="value-card reveal">
            <span class="value-num">04</span>
            <h3>{{ t().value4Title }}</h3>
            <p>{{ t().value4Desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══ SHOWROOM PREVIEW ═══ -->
    <section
      class="block"
      aria-labelledby="showroom-heading"
      *ngIf="listings().length"
    >
      <div class="container">
        <header class="block-head reveal">
          <div>
            <span class="section-label">{{ t().showroomLabel }}</span>
            <h2 id="showroom-heading" class="section-title">
              {{ t().showroomTitle }}
            </h2>
            <p class="section-subtitle">{{ t().showroomSub }}</p>
          </div>
          <a [routerLink]="['/' + lang(), 'showroom']" class="link-arrow"
            >{{ t().viewAll }}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </header>
        <div class="bike-grid">
          <app-bike-card
            *ngFor="let bike of listings().slice(0, 6)"
            [listing]="bike"
          ></app-bike-card>
        </div>
      </div>
    </section>

    <!-- ═══ NEUE FAHRRÄDER PREVIEW ═══ -->
    <section
      class="block"
      aria-labelledby="neue-heading"
      *ngIf="neueFahrraeder().length"
    >
      <div class="container">
        <header class="block-head reveal">
          <div>
            <span class="section-label">{{ t().newBikesLabel }}</span>
            <h2 id="neue-heading" class="section-title">
              {{ t().newBikesTitle }}
            </h2>
            <p class="section-subtitle">{{ t().newBikesSub }}</p>
          </div>
          <a [routerLink]="['/' + lang(), 'neue-fahrraeder']" class="link-arrow"
            >{{ t().browseNewBikes }}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </header>
        <div class="bike-grid">
          <app-neue-bike-card
            *ngFor="let bike of neueFahrraeder().slice(0, 6)"
            [bike]="bike"
          ></app-neue-bike-card>
        </div>
      </div>
    </section>

    <!-- ═══ STORY & QUALITY ═══ -->
    <section class="block" aria-labelledby="story-heading">
      <div class="container story-grid">
        <div class="story-media reveal">
          <img
            class="story-img-main"
            src="/assets/stock/werkbank.webp"
            alt=""
            loading="lazy"
            width="1200"
            height="742"
          />
          <img
            class="story-img-small"
            [src]="shopPhotos[0]"
            alt="Karaarslan Bike Lünen"
            loading="lazy"
            width="400"
            height="300"
          />
          <span class="story-badge">{{ t().trustBadgeSince }}</span>
        </div>
        <div class="story-text">
          <span class="section-label reveal">{{ t().storyLabel }}</span>
          <h2 id="story-heading" class="section-title reveal">
            {{ t().storyTitle }}
          </h2>
          <p class="story-body reveal">{{ t().storyText }}</p>
          <div class="story-values">
            <div class="story-value reveal">
              <span class="sv-num">01</span>
              <div>
                <h3>{{ t().storyValue1Title }}</h3>
                <p>{{ t().storyValue1Desc }}</p>
              </div>
            </div>
            <div class="story-value reveal">
              <span class="sv-num">02</span>
              <div>
                <h3>{{ t().storyValue2Title }}</h3>
                <p>{{ t().storyValue2Desc }}</p>
              </div>
            </div>
            <div class="story-value reveal">
              <span class="sv-num">03</span>
              <div>
                <h3>{{ t().storyValue3Title }}</h3>
                <p>{{ t().storyValue3Desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="trust-panel reveal" aria-labelledby="trust-heading">
          <div class="trust-head">
            <span class="section-label">{{ t().trustLabel }}</span>
            <h2 id="trust-heading" class="trust-title">
              {{ t().trustTitle }}
            </h2>
            <p>{{ t().trustSub }}</p>
          </div>
          <ul class="trust-list">
            @for (item of trustItems(); track $index) {
              <li>
                <span class="trust-check" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {{ item }}
              </li>
            }
          </ul>
        </div>
      </div>
    </section>

    <!-- ═══ SHOP GALLERY ═══ -->
    <section class="block block-tint" aria-labelledby="gallery-heading">
      <div class="container">
        <header class="block-head reveal">
          <div>
            <span class="section-label">{{ t().galleryLabel }}</span>
            <h2 id="gallery-heading" class="section-title">
              {{ t().galleryTitle }}
            </h2>
          </div>
          <p class="section-subtitle">{{ t().gallerySub }}</p>
        </header>
        <div class="gallery-grid">
          <button
            type="button"
            class="gallery-item reveal"
            *ngFor="let photo of shopPhotos; let i = index"
            (click)="openLightbox(i)"
            [attr.aria-label]="'Karaarslan Bike - Foto ' + (i + 1)"
          >
            <img
              [src]="photo"
              [alt]="'Karaarslan Bike - Foto ' + (i + 1)"
              loading="lazy"
              width="400"
              height="300"
            />
            <span class="gallery-overlay" aria-hidden="true">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <div class="lightbox" *ngIf="lightboxOpen" (click)="closeLightbox()">
      <button
        class="lightbox-close"
        (click)="closeLightbox()"
        aria-label="Close"
      >
        &times;
      </button>
      <button
        class="lightbox-nav lightbox-prev"
        (click)="prevPhoto($event)"
        aria-label="Previous"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <img
        [src]="shopPhotos[lightboxIndex]"
        [alt]="'Karaarslan Bike - Foto ' + (lightboxIndex + 1)"
        class="lightbox-img"
        width="1200"
        height="800"
        (click)="$event.stopPropagation()"
      />
      <button
        class="lightbox-nav lightbox-next"
        (click)="nextPhoto($event)"
        aria-label="Next"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
      <div class="lightbox-counter" (click)="$event.stopPropagation()">
        {{ lightboxIndex + 1 }} / {{ shopPhotos.length }}
      </div>
    </div>

    <!-- ═══ BIKE CHECK SERVICE ═══ -->
    <section class="block" aria-labelledby="bikecheck-heading">
      <div class="container">
        <header class="block-head reveal">
          <div>
            <span class="section-label">{{ t().bikeCheckLabel }}</span>
            <h2 id="bikecheck-heading" class="section-title">
              {{ t().bikeCheckTitle }}
            </h2>
          </div>
          <p class="section-subtitle">{{ t().bikeCheckSub }}</p>
        </header>

        <div class="bikecheck-grid">
          <div class="bikecheck-photo reveal">
            <img
              src="/assets/stock/check.webp"
              alt=""
              loading="lazy"
              width="1200"
              height="800"
            />
            <span class="bikecheck-price">
              <strong>0 €</strong>
              <small>{{ t().bikeCheckFreeTitle }}</small>
            </span>
          </div>

          <div class="bikecheck-card bikecheck-free reveal">
            <h3>
              <span class="bikecheck-icon" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </span>
              {{ t().bikeCheckFreeTitle }}
            </h3>
            <ul class="bikecheck-list">
              @for (item of freeCheckItems(); track $index) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>

          <div class="bikecheck-card bikecheck-repair reveal">
            <h3>
              <span class="bikecheck-icon" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  />
                </svg>
              </span>
              {{ t().bikeCheckRepairTitle }}
            </h3>
            <ul class="bikecheck-list">
              @for (item of repairServiceItems(); track $index) {
                <li>{{ item }}</li>
              }
            </ul>
            <span class="liability-badge">{{ t().bikeCheckNoLiability }}</span>
          </div>
        </div>

        <div class="bikecheck-footer reveal">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{{ t().bikeCheckNote }} — {{ t().bikeCheckExclusion }}</span>
          <strong>{{ t().bikeCheckFairPrices }}</strong>
        </div>
      </div>
    </section>

    <!-- ═══ REPAIR SHOWCASES ═══ -->
    @if (repairShowcases().length > 0) {
      <section class="block block-tint" aria-labelledby="repair-heading">
        <div class="container">
          <header class="block-head reveal">
            <div>
              <span class="section-label">{{ t().repairLabel }}</span>
              <h2 id="repair-heading" class="section-title">
                {{ t().repairTitle }}
              </h2>
            </div>
            <p class="section-subtitle">{{ t().repairSub }}</p>
          </header>

          <div class="repair-showcase reveal">
            <div class="repair-main-image">
              @if (repairShowcases()[repairActiveIndex].images.length) {
                <img
                  [src]="
                    getRepairImageUrl(
                      repairShowcases()[repairActiveIndex].images[
                        repairImageIndex
                      ].filePath
                    )
                  "
                  [alt]="repairShowcases()[repairActiveIndex].titel"
                  loading="lazy"
                  width="800"
                  height="500"
                />
                @if (repairShowcases()[repairActiveIndex].images.length > 1) {
                  <div class="repair-image-counter">
                    {{ repairImageIndex + 1 }} /
                    {{ repairShowcases()[repairActiveIndex].images.length }}
                  </div>
                }
              }
              <div class="repair-overlay">
                <h3>{{ repairShowcases()[repairActiveIndex].titel }}</h3>
                @if (repairShowcases()[repairActiveIndex].beschreibung) {
                  <p>{{ repairShowcases()[repairActiveIndex].beschreibung }}</p>
                }
              </div>
            </div>

            @if (repairShowcases().length > 1) {
              <div class="repair-thumbs">
                @for (
                  showcase of repairShowcases();
                  track showcase.id;
                  let i = $index
                ) {
                  <button
                    class="repair-thumb"
                    [class.active]="i === repairActiveIndex"
                    (click)="selectRepairShowcase(i)"
                  >
                    @if (showcase.images.length > 0) {
                      <img
                        [src]="getRepairImageUrl(showcase.images[0].filePath)"
                        [alt]="showcase.titel"
                        loading="lazy"
                        width="120"
                        height="70"
                      />
                    }
                    <span class="repair-thumb-label">{{ showcase.titel }}</span>
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </section>
    }

    <!-- ═══ GOOGLE REVIEWS ═══ -->
    <section class="block" aria-labelledby="testimonials-heading">
      <div class="container">
        <header class="block-head reveal">
          <div>
            <span class="section-label">{{ t().testimonialsLabel }}</span>
            <h2 id="testimonials-heading" class="section-title">
              {{ t().testimonialsTitle }}
            </h2>
            <p class="section-subtitle">{{ t().testimonialsSub }}</p>
          </div>

          @if (googleRating() > 0) {
            <div class="google-rating-badge">
              <svg
                class="google-icon"
                viewBox="0 0 24 24"
                width="30"
                height="30"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <div class="google-rating-info">
                <div class="google-rating-stars">
                  <span class="google-rating-value">{{
                    googleRating().toFixed(1)
                  }}</span>
                  <div class="google-stars-row">
                    @for (s of [1, 2, 3, 4, 5]; track s) {
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        [attr.fill]="s <= googleRating() ? '#f59e0b' : '#4b5563'"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    }
                  </div>
                </div>
                <span class="google-review-count"
                  >{{ googleTotalReviews() }} Google
                  {{ t().reviewCountLabel }}</span
                >
              </div>
              @if (googlePlaceUrl()) {
                <a
                  [href]="googlePlaceUrl()"
                  target="_blank"
                  rel="noopener"
                  class="google-review-link"
                >
                  {{ t().reviewCta }}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                    />
                  </svg>
                </a>
              }
            </div>
          }
        </header>

        <div class="testimonials-grid">
          @if (googleReviews().length > 0) {
            @for (review of googleReviews(); track review.time) {
              @if (review.text) {
                <article class="testimonial-card reveal">
                  <div
                    class="testimonial-stars"
                    [attr.aria-label]="review.rating + ' von 5 Sternen'"
                  >
                    @for (s of [1, 2, 3, 4, 5]; track s) {
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        [attr.fill]="s <= review.rating ? '#f59e0b' : '#4b5563'"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    }
                  </div>
                  <blockquote class="testimonial-text">
                    {{ review.text }}
                  </blockquote>
                  <footer class="testimonial-author">
                    @if (review.authorPhotoUrl) {
                      <img
                        [src]="review.authorPhotoUrl"
                        [alt]="review.authorName"
                        class="author-photo"
                        width="44"
                        height="44"
                        loading="lazy"
                        referrerpolicy="no-referrer"
                      />
                    } @else {
                      <div class="author-avatar">
                        {{ getInitials(review.authorName) }}
                      </div>
                    }
                    <div class="author-info">
                      <cite class="author-name">{{ review.authorName }}</cite>
                      <span class="author-detail">{{
                        review.relativeTime
                      }}</span>
                    </div>
                  </footer>
                </article>
              }
            }
          } @else {
            <article
              class="testimonial-card reveal"
              *ngFor="let review of testimonials"
            >
              <div
                class="testimonial-stars"
                [attr.aria-label]="t().ariaStarsRating"
              >
                <svg
                  *ngFor="let s of [1, 2, 3, 4, 5]"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#f59e0b"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>
              <blockquote class="testimonial-text">
                {{ review.text }}
              </blockquote>
              <footer class="testimonial-author">
                <div class="author-avatar">{{ review.initials }}</div>
                <div class="author-info">
                  <cite class="author-name">{{ review.name }}</cite>
                  <span class="author-detail">{{ review.detail }}</span>
                </div>
              </footer>
            </article>
          }
        </div>

        <div class="trust-badges reveal">
          <div class="trust-badge">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>{{ t().value1Title }}</span>
          </div>
          <div class="trust-badge">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{{ t().trustBadgeSince }}</span>
          </div>
          <div class="trust-badge">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{{ t().trustBadgeCustomers }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="block block-tint" aria-labelledby="faq-heading">
      <div class="container faq-layout">
        <div class="faq-intro reveal">
          <span class="section-label">{{ t().faqLabel }}</span>
          <h2 id="faq-heading" class="section-title">{{ t().faqTitle }}</h2>
          <p class="section-subtitle">{{ t().faqSub }}</p>
          <a
            href="https://wa.me/491637390301"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary btn-glass"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path [attr.d]="whatsappPath" />
            </svg>
            {{ t().ctaWhatsapp }}
          </a>
        </div>

        <div class="faq-list">
          @for (faq of faqItems(); track $index) {
            <details class="faq-item reveal">
              <summary class="faq-question">
                <span>{{ faq.q }}</span>
                <span class="faq-toggle" aria-hidden="true"></span>
              </summary>
              <p class="faq-answer">{{ faq.a }}</p>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="cta-section" aria-labelledby="cta-heading">
      <img
        class="cta-img"
        src="/assets/stock/ausfahrt.webp"
        alt=""
        loading="lazy"
        width="1800"
        height="1013"
      />
      <div class="cta-shade" aria-hidden="true"></div>
      <div class="container cta-inner reveal">
        <h2 id="cta-heading" class="cta-h2">{{ t().ctaSectionTitle }}</h2>
        <p class="cta-sub">{{ t().ctaSectionSub }}</p>
        <div class="cta-actions">
          <a [routerLink]="['/' + lang(), 'showroom']" class="btn-primary"
            >{{ t().ctaSectionButton }}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="https://maps.app.goo.gl/Q1fXe7A6PRb8E5wV7"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary btn-glass"
            >{{ t().ctaRoute }}</a
          >
        </div>
      </div>
    </section>

    <!-- ═══ LOADING (skeleton) ═══ -->
    <section class="block" *ngIf="loading()" aria-label="Loading">
      <div class="container">
        <div class="skeleton-row">
          <div class="skeleton-card" *ngFor="let i of [1, 2, 3]">
            <div class="sk-img"></div>
            <div class="sk-body">
              <div class="sk-line l"></div>
              <div class="sk-line s"></div>
              <div class="sk-line m"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        --line: rgba(255, 255, 255, 0.08);
        --line-strong: rgba(255, 255, 255, 0.14);
        --ink-soft: rgba(255, 255, 255, 0.68);
        --ink-faint: rgba(255, 255, 255, 0.46);
        --card: rgba(255, 255, 255, 0.035);
        --radius-xl: 28px;
        --radius-lg: 20px;
        --ease: cubic-bezier(0.22, 1, 0.36, 1);
      }

      /* ═══ SHARED ═══ */
      .block {
        position: relative;
        padding: clamp(4rem, 8vw, 7rem) 0;
      }

      .block-tint {
        background:
          radial-gradient(
            ellipse 60% 50% at 100% 0%,
            rgba(255, 87, 34, 0.07),
            transparent 70%
          ),
          var(--color-bg-secondary);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }

      .block-head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 2rem;
        margin-bottom: clamp(2rem, 4vw, 3.25rem);
      }

      .block-head > .section-subtitle {
        max-width: 420px;
        margin-bottom: 0.4rem;
      }

      .section-label {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: var(--color-accent);
        margin-bottom: 1rem;
      }

      .section-label::before {
        content: '';
        width: 28px;
        height: 2px;
        border-radius: 2px;
        background: var(--color-accent);
      }

      .section-title {
        font-size: clamp(2rem, 4.2vw, 3.4rem);
        font-weight: 800;
        line-height: 1.02;
        letter-spacing: -0.04em;
        margin: 0 0 0.9rem;
        max-width: 760px;
        text-wrap: balance;
      }

      .section-subtitle {
        font-size: 1.02rem;
        line-height: 1.7;
        color: var(--ink-soft);
        max-width: 620px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        padding: 0.35rem 0.8rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #fff;
        background: rgba(255, 87, 34, 0.9);
      }

      .btn-glass {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .btn-glass:hover {
        background: rgba(255, 255, 255, 0.16);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .link-arrow {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--color-text);
        padding-bottom: 0.3rem;
        border-bottom: 2px solid var(--color-accent);
        transition: gap 0.3s var(--ease), color 0.3s;
      }

      .link-arrow:hover {
        gap: 0.85rem;
        color: var(--color-accent);
      }

      /* Load-in animation (hero) */
      .fade-in {
        opacity: 0;
        transform: translateY(24px);
        animation: fadeInUp 0.9s var(--ease) forwards;
      }
      .d1 {
        animation-delay: 0.08s;
      }
      .d2 {
        animation-delay: 0.16s;
      }
      .d3 {
        animation-delay: 0.24s;
      }
      .d4 {
        animation-delay: 0.36s;
      }

      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Scroll reveal — progressive enhancement, content stays visible without support */
      @supports (animation-timeline: view()) {
        .reveal {
          animation: reveal linear both;
          animation-timeline: view();
          animation-range: entry 0% entry 40%;
        }
      }

      @keyframes reveal {
        from {
          opacity: 0;
          transform: translateY(36px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      /* ═══ HERO ═══ */
      .hero {
        position: relative;
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
        isolation: isolate;
      }

      .hero-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 60% 50%;
        z-index: -2;
        animation: heroZoom 18s ease-out forwards;
      }

      @keyframes heroZoom {
        from {
          transform: scale(1.12);
        }
        to {
          transform: scale(1);
        }
      }

      .hero-shade {
        position: absolute;
        inset: 0;
        z-index: -1;
        background:
          linear-gradient(
            90deg,
            rgba(10, 10, 10, 0.92) 0%,
            rgba(10, 10, 10, 0.7) 38%,
            rgba(10, 10, 10, 0.15) 75%
          ),
          linear-gradient(0deg, var(--color-bg) 0%, transparent 35%),
          linear-gradient(180deg, rgba(10, 10, 10, 0.6) 0%, transparent 25%);
      }

      .hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.75fr);
        align-items: end;
        gap: 3rem;
        padding-top: 9rem;
        padding-bottom: clamp(4rem, 9vh, 6.5rem);
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 1rem 0.5rem 0.75rem;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 600;
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        margin-bottom: 1.6rem;
      }

      .eyebrow-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-accent);
        box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.6);
        animation: pulse 2.2s infinite;
      }

      @keyframes pulse {
        70% {
          box-shadow: 0 0 0 10px rgba(255, 87, 34, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 87, 34, 0);
        }
      }

      .hero-h1 {
        font-size: clamp(2.8rem, 7.2vw, 6.2rem);
        font-weight: 800;
        line-height: 0.95;
        letter-spacing: -0.055em;
        margin: 0 0 1.5rem;
        text-wrap: balance;
      }

      .hero-h1-accent {
        display: block;
        color: var(--color-accent);
        background: linear-gradient(90deg, #ff5722, #ff9a5a);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .hero-sub {
        font-size: clamp(1rem, 1.6vw, 1.18rem);
        line-height: 1.75;
        color: rgba(255, 255, 255, 0.8);
        max-width: 600px;
        margin: 0 0 2.25rem;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
      }

      .hero-card {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 1.1rem;
        border-radius: var(--radius-xl);
        background: rgba(18, 18, 18, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
      }

      .hero-card-stats:empty {
        display: none;
      }

      .hero-card-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
        gap: 0.4rem;
        margin-bottom: 0.3rem;
      }

      .hc-stat {
        display: flex;
        flex-direction: column;
        padding: 1rem 1.1rem;
        border-radius: var(--radius-lg);
        background: rgba(255, 255, 255, 0.05);
      }

      .hc-stat-n {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 2.1rem;
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1;
        color: #fff;
      }

      .hc-stat-l {
        margin-top: 0.4rem;
        font-size: 0.74rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--ink-faint);
      }

      .hc-row {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.85rem 1rem;
        border-radius: var(--radius-lg);
        transition: background 0.25s;
      }

      .hc-row:hover {
        background: rgba(255, 255, 255, 0.07);
      }

      .hc-row svg {
        flex-shrink: 0;
        color: var(--color-accent);
      }

      .hc-row span {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
      }

      .hc-row strong {
        font-size: 0.95rem;
      }

      .hc-row small {
        font-size: 0.8rem;
        color: var(--ink-faint);
      }

      .hero-scroll {
        position: absolute;
        left: 50%;
        bottom: 1.6rem;
        width: 22px;
        height: 36px;
        margin-left: -11px;
        border-radius: 12px;
        border: 2px solid rgba(255, 255, 255, 0.35);
      }

      .hero-scroll span {
        position: absolute;
        left: 50%;
        top: 6px;
        width: 4px;
        height: 7px;
        margin-left: -2px;
        border-radius: 2px;
        background: #fff;
        animation: scrollDot 1.8s var(--ease) infinite;
      }

      @keyframes scrollDot {
        0% {
          opacity: 0;
          transform: translateY(0);
        }
        30% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(12px);
        }
      }

      /* ═══ TICKER ═══ */
      .ticker {
        overflow: hidden;
        background: var(--color-accent);
        color: #fff;
        transform: rotate(-1.2deg);
        margin: 1.5rem -1rem 0;
        box-shadow: 0 20px 50px rgba(255, 87, 34, 0.2);
      }

      .ticker-track {
        display: flex;
        width: max-content;
        animation: ticker 38s linear infinite;
      }

      .ticker-item,
      .ticker-sep {
        padding: 1rem 1.1rem;
        white-space: nowrap;
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .ticker-sep {
        opacity: 0.6;
      }

      @keyframes ticker {
        to {
          transform: translateX(-50%);
        }
      }

      /* ═══ SERVICES ═══ */
      .svc-grid {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        gap: 1.25rem;
      }

      .svc-card {
        position: relative;
        display: flex;
        align-items: flex-end;
        min-height: 560px;
        border-radius: var(--radius-xl);
        overflow: hidden;
        isolation: isolate;
        border: 1px solid var(--line);
      }

      .svc-card img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;
        transition: transform 1.2s var(--ease);
      }

      .svc-card:hover img {
        transform: scale(1.05);
      }

      .svc-card::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: linear-gradient(
          180deg,
          rgba(10, 10, 10, 0) 15%,
          rgba(10, 10, 10, 0.75) 50%,
          rgba(10, 10, 10, 0.95) 85%
        );
      }

      .svc-body {
        padding: clamp(1.5rem, 3vw, 2.5rem);
      }

      .svc-body h2 {
        font-size: clamp(1.8rem, 3vw, 2.6rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1.05;
        margin: 1rem 0 0.6rem;
      }

      .svc-body p {
        color: rgba(255, 255, 255, 0.78);
        line-height: 1.65;
        max-width: 460px;
        margin-bottom: 1.4rem;
      }

      .svc-tags {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.6rem;
      }

      .svc-tags li {
        padding: 0.45rem 0.85rem;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.14);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .btn-wa {
        background: #25d366;
      }

      .btn-wa:hover {
        background: #1fbd59;
        box-shadow: 0 8px 32px rgba(37, 211, 102, 0.3);
      }

      /* ═══ CATEGORIES ═══ */
      .cat-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr 1fr;
        grid-template-rows: repeat(2, 260px);
        gap: 1rem;
      }

      .cat-tile {
        position: relative;
        display: flex;
        align-items: flex-end;
        border-radius: var(--radius-lg);
        overflow: hidden;
        isolation: isolate;
        padding: 1.4rem;
        border: 1px solid var(--line);
      }

      .cat-tile-wide {
        grid-row: span 2;
      }

      .cat-tile:nth-child(4) {
        grid-column: span 2;
      }

      .cat-tile img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;
        transition: transform 1s var(--ease);
      }

      .cat-tile::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: linear-gradient(
          180deg,
          transparent 35%,
          rgba(10, 10, 10, 0.85) 100%
        );
        transition: background 0.4s;
      }

      .cat-tile:hover img {
        transform: scale(1.07);
      }

      .cat-index {
        position: absolute;
        top: 1.2rem;
        left: 1.4rem;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.85);
      }

      .cat-text {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .cat-text strong {
        font-size: clamp(1.3rem, 2.2vw, 1.8rem);
        font-weight: 800;
        letter-spacing: -0.03em;
      }

      .cat-text small {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.7);
      }

      .cat-arrow {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transition:
          background 0.3s,
          transform 0.4s var(--ease);
      }

      .cat-tile:hover .cat-arrow {
        background: var(--color-accent);
        transform: rotate(45deg);
      }

      /* ═══ VALUES ═══ */
      .values-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-top: 1px solid var(--line-strong);
      }

      .value-card {
        padding: 2rem 1.75rem 0.5rem 0;
        position: relative;
      }

      .value-card + .value-card {
        padding-left: 1.75rem;
        border-left: 1px solid var(--line);
      }

      .value-card::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--color-accent);
        transition: width 0.6s var(--ease);
      }

      .value-card:hover::before {
        width: 100%;
      }

      .value-num {
        display: block;
        font-size: 3rem;
        font-weight: 800;
        letter-spacing: -0.05em;
        line-height: 1;
        color: transparent;
        -webkit-text-stroke: 1.5px var(--color-accent);
        margin-bottom: 1.5rem;
      }

      .value-card h3 {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 0.6rem;
      }

      .value-card p {
        font-size: 0.93rem;
        line-height: 1.7;
        color: var(--ink-soft);
      }

      /* ═══ BIKE GRIDS ═══ */
      .bike-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }

      /* ═══ STORY ═══ */
      .story-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(2.5rem, 6vw, 5.5rem);
        align-items: center;
      }

      .story-media {
        position: relative;
        padding: 0 3rem 3rem 0;
      }

      .story-img-main {
        width: 100%;
        aspect-ratio: 4 / 5;
        object-fit: cover;
        border-radius: var(--radius-xl);
      }

      .story-img-small {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 46%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: var(--radius-lg);
        border: 6px solid var(--color-bg);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
      }

      .story-badge {
        position: absolute;
        top: 1.5rem;
        left: -1rem;
        padding: 0.75rem 1.1rem;
        border-radius: 14px;
        font-weight: 800;
        font-size: 0.9rem;
        background: var(--color-accent);
        color: #fff;
        box-shadow: 0 16px 40px rgba(255, 87, 34, 0.35);
        transform: rotate(-3deg);
      }

      .story-body {
        font-size: 1.1rem;
        line-height: 1.8;
        color: var(--ink-soft);
        margin-bottom: 2.25rem;
      }

      .story-values {
        display: flex;
        flex-direction: column;
      }

      .story-value {
        display: flex;
        gap: 1.25rem;
        padding: 1.25rem 0;
        border-top: 1px solid var(--line);
      }

      .sv-num {
        font-size: 0.85rem;
        font-weight: 800;
        color: var(--color-accent);
        padding-top: 0.2rem;
      }

      .story-value h3 {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
      }

      .story-value p {
        font-size: 0.93rem;
        line-height: 1.65;
        color: var(--ink-soft);
      }

      .trust-panel {
        display: grid;
        grid-template-columns: 0.9fr 1.1fr;
        gap: 2.5rem;
        margin-top: clamp(3.5rem, 7vw, 5.5rem);
        padding: clamp(1.75rem, 4vw, 3rem);
        border-radius: var(--radius-xl);
        background:
          radial-gradient(
            ellipse 70% 90% at 0% 0%,
            rgba(255, 87, 34, 0.16),
            transparent 60%
          ),
          var(--card);
        border: 1px solid var(--line);
      }

      .trust-title {
        font-size: clamp(1.6rem, 2.8vw, 2.2rem);
        font-weight: 800;
        letter-spacing: -0.035em;
        line-height: 1.1;
        margin-bottom: 0.8rem;
      }

      .trust-head p {
        color: var(--ink-soft);
        line-height: 1.7;
      }

      .trust-list {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        align-content: center;
      }

      .trust-list li {
        display: flex;
        gap: 0.8rem;
        align-items: flex-start;
        padding: 1.1rem;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--line);
        font-size: 0.93rem;
        line-height: 1.55;
      }

      .trust-check {
        flex-shrink: 0;
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--color-accent);
        color: #fff;
      }

      /* ═══ GALLERY ═══ */
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 220px;
        gap: 0.8rem;
      }

      .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        border: none;
        padding: 0;
        cursor: zoom-in;
        background: var(--color-surface);
      }

      .gallery-item:first-child {
        grid-column: span 2;
        grid-row: span 2;
      }

      .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.9s var(--ease);
      }

      .gallery-item:hover img {
        transform: scale(1.06);
      }

      .gallery-overlay {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: #fff;
        background: rgba(255, 87, 34, 0.35);
        opacity: 0;
        transition: opacity 0.35s;
      }

      .gallery-item:hover .gallery-overlay,
      .gallery-item:focus-visible .gallery-overlay {
        opacity: 1;
      }

      /* ═══ LIGHTBOX ═══ */
      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.94);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeInLightbox 0.25s ease;
      }

      @keyframes fadeInLightbox {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .lightbox-img {
        max-width: 90vw;
        max-height: 85vh;
        border-radius: 12px;
        object-fit: contain;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      }

      .lightbox-close {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: none;
        border: none;
        color: #fff;
        font-size: 2.5rem;
        cursor: pointer;
        line-height: 1;
        opacity: 0.8;
        z-index: 10;
      }

      .lightbox-close:hover {
        opacity: 1;
      }

      .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #fff;
        cursor: pointer;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        transition: background 0.2s;
      }

      .lightbox-nav:hover {
        background: var(--color-accent);
      }

      .lightbox-prev {
        left: 1.5rem;
      }

      .lightbox-next {
        right: 1.5rem;
      }

      .lightbox-counter {
        position: absolute;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.05em;
      }

      /* ═══ BIKE CHECK ═══ */
      .bikecheck-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
      }

      .bikecheck-photo {
        position: relative;
        min-height: 420px;
        border-radius: var(--radius-xl);
        overflow: hidden;
      }

      .bikecheck-photo img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .bikecheck-price {
        position: absolute;
        left: 1.25rem;
        bottom: 1.25rem;
        display: flex;
        flex-direction: column;
        padding: 1rem 1.25rem;
        border-radius: 18px;
        background: var(--color-accent);
        box-shadow: 0 18px 40px rgba(255, 87, 34, 0.35);
      }

      .bikecheck-price strong {
        font-size: 2.4rem;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .bikecheck-price small {
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0.9;
      }

      .bikecheck-card {
        display: flex;
        flex-direction: column;
        padding: 1.75rem;
        border-radius: var(--radius-xl);
        background: var(--card);
        border: 1px solid var(--line);
      }

      .bikecheck-free {
        background:
          linear-gradient(
            160deg,
            rgba(34, 197, 94, 0.12),
            transparent 55%
          ),
          var(--card);
      }

      .bikecheck-card h3 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 1.25rem;
      }

      .bikecheck-icon {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(255, 87, 34, 0.14);
        color: var(--color-accent);
      }

      .bikecheck-free .bikecheck-icon {
        background: rgba(34, 197, 94, 0.14);
        color: var(--color-success);
      }

      .bikecheck-list {
        list-style: none;
        display: flex;
        flex-direction: column;
      }

      .bikecheck-list li {
        position: relative;
        padding: 0.7rem 0 0.7rem 1.6rem;
        font-size: 0.93rem;
        color: rgba(255, 255, 255, 0.82);
        border-bottom: 1px dashed var(--line);
      }

      .bikecheck-list li:last-child {
        border-bottom: none;
      }

      .bikecheck-list li::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 8px;
        height: 8px;
        margin-top: -4px;
        border-radius: 50%;
        background: var(--color-accent);
      }

      .bikecheck-free .bikecheck-list li::before {
        background: var(--color-success);
      }

      .liability-badge {
        align-self: flex-start;
        margin-top: auto;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #fca5a5;
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.25);
      }

      .bikecheck-footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        margin-top: 1rem;
        padding: 1.1rem 1.4rem;
        border-radius: 16px;
        font-size: 0.92rem;
        color: var(--ink-soft);
        background: var(--card);
        border: 1px solid var(--line);
      }

      .bikecheck-footer svg {
        color: var(--color-accent);
        flex-shrink: 0;
      }

      .bikecheck-footer strong {
        margin-left: auto;
        color: var(--color-text);
      }

      /* ═══ REPAIR SHOWCASE ═══ */
      .repair-showcase {
        display: grid;
        gap: 1rem;
      }

      .repair-main-image {
        position: relative;
        aspect-ratio: 16 / 8;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: var(--color-surface);
      }

      .repair-main-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .repair-image-counter {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .repair-overlay {
        position: absolute;
        inset: auto 0 0 0;
        padding: 3rem 2rem 1.75rem;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.88), transparent);
      }

      .repair-overlay h3 {
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 0.35rem;
      }

      .repair-overlay p {
        color: rgba(255, 255, 255, 0.78);
        max-width: 640px;
        line-height: 1.6;
      }

      .repair-thumbs {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding-bottom: 0.25rem;
      }

      .repair-thumb {
        flex: 0 0 160px;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 0.4rem;
        border-radius: 14px;
        border: 1px solid var(--line);
        background: var(--card);
        color: var(--color-text);
        cursor: pointer;
        text-align: left;
        opacity: 0.65;
        transition:
          opacity 0.25s,
          border-color 0.25s;
      }

      .repair-thumb:hover,
      .repair-thumb.active {
        opacity: 1;
        border-color: var(--color-accent);
      }

      .repair-thumb img {
        width: 100%;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
      }

      .repair-thumb-label {
        font-size: 0.78rem;
        font-weight: 600;
        padding: 0 0.25rem 0.2rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ═══ REVIEWS ═══ */
      .google-rating-badge {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        flex-shrink: 0;
        padding: 1rem 1.25rem;
        border-radius: var(--radius-lg);
        background: var(--card);
        border: 1px solid var(--line);
      }

      .google-rating-info {
        display: flex;
        flex-direction: column;
      }

      .google-rating-stars {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .google-rating-value {
        font-size: 1.6rem;
        font-weight: 800;
        line-height: 1;
      }

      .google-stars-row {
        display: flex;
        gap: 2px;
      }

      .google-review-count {
        font-size: 0.8rem;
        color: var(--ink-faint);
      }

      .google-review-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-accent);
      }

      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }

      .testimonial-card {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        padding: 1.75rem;
        border-radius: var(--radius-lg);
        background: var(--card);
        border: 1px solid var(--line);
        transition:
          border-color 0.3s,
          transform 0.4s var(--ease);
      }

      .testimonial-card:hover {
        border-color: var(--line-strong);
        transform: translateY(-4px);
      }

      .testimonial-stars {
        display: flex;
        gap: 2px;
      }

      .testimonial-text {
        position: relative;
        flex: 1;
        margin: 0;
        font-size: 0.98rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.85);
        display: -webkit-box;
        -webkit-line-clamp: 7;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .testimonial-author {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding-top: 1.1rem;
        border-top: 1px solid var(--line);
      }

      .author-photo,
      .author-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .author-avatar {
        display: grid;
        place-items: center;
        font-size: 0.85rem;
        font-weight: 800;
        color: #fff;
        background: linear-gradient(135deg, #ff5722, #ff9a5a);
      }

      .author-info {
        display: flex;
        flex-direction: column;
      }

      .author-name {
        font-style: normal;
        font-weight: 700;
        font-size: 0.95rem;
      }

      .author-detail {
        font-size: 0.8rem;
        color: var(--ink-faint);
      }

      .trust-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
        margin-top: 2.5rem;
      }

      .trust-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.7rem 1.15rem;
        border-radius: 999px;
        font-size: 0.88rem;
        font-weight: 600;
        background: var(--card);
        border: 1px solid var(--line);
      }

      .trust-badge svg {
        color: var(--color-accent);
      }

      /* ═══ FAQ ═══ */
      .faq-layout {
        display: grid;
        grid-template-columns: 0.85fr 1.15fr;
        gap: clamp(2rem, 6vw, 5rem);
        align-items: start;
      }

      .faq-intro {
        position: sticky;
        top: 7rem;
      }

      .faq-intro .section-subtitle {
        margin-bottom: 1.75rem;
      }

      .faq-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .faq-item {
        border-radius: var(--radius-lg);
        background: var(--card);
        border: 1px solid var(--line);
        transition:
          border-color 0.3s,
          background 0.3s;
      }

      .faq-item[open] {
        border-color: rgba(255, 87, 34, 0.45);
        background: rgba(255, 87, 34, 0.05);
      }

      .faq-question {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1.3rem 1.5rem;
        font-weight: 700;
        font-size: 1.02rem;
        cursor: pointer;
        list-style: none;
      }

      .faq-question::-webkit-details-marker {
        display: none;
      }

      .faq-toggle {
        position: relative;
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.07);
        transition:
          background 0.3s,
          transform 0.4s var(--ease);
      }

      .faq-toggle::before,
      .faq-toggle::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 12px;
        height: 2px;
        margin: -1px 0 0 -6px;
        border-radius: 2px;
        background: currentColor;
      }

      .faq-toggle::after {
        transform: rotate(90deg);
      }

      .faq-item[open] .faq-toggle {
        background: var(--color-accent);
        transform: rotate(45deg);
      }

      .faq-answer {
        padding: 0 1.5rem 1.4rem;
        line-height: 1.75;
        color: var(--ink-soft);
      }

      /* ═══ CTA ═══ */
      .cta-section {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        padding: clamp(6rem, 14vw, 11rem) 0;
        text-align: center;
      }

      .cta-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;
      }

      .cta-shade {
        position: absolute;
        inset: 0;
        z-index: -1;
        background:
          linear-gradient(180deg, var(--color-bg) 0%, transparent 30%),
          linear-gradient(0deg, var(--color-bg) 0%, transparent 35%),
          rgba(10, 10, 10, 0.55);
      }

      .cta-h2 {
        font-size: clamp(2.4rem, 6vw, 4.8rem);
        font-weight: 800;
        letter-spacing: -0.05em;
        line-height: 1;
        max-width: 900px;
        margin: 0 auto 1.25rem;
        text-wrap: balance;
      }

      .cta-sub {
        font-size: 1.1rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.8);
        max-width: 580px;
        margin: 0 auto 2.25rem;
      }

      .cta-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.85rem;
      }

      /* ═══ SKELETON ═══ */
      .skeleton-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }

      .skeleton-card {
        border-radius: 16px;
        overflow: hidden;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
      }

      .sk-img,
      .sk-line {
        background: linear-gradient(
          90deg,
          var(--color-surface) 25%,
          var(--color-surface-alt) 50%,
          var(--color-surface) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      .sk-img {
        aspect-ratio: 16/11;
      }

      .sk-body {
        padding: 1.25rem;
      }

      .sk-line {
        height: 12px;
        border-radius: 6px;
        margin-bottom: 0.65rem;
      }

      .sk-line.l {
        width: 85%;
      }
      .sk-line.s {
        width: 35%;
      }
      .sk-line.m {
        width: 55%;
      }

      @keyframes shimmer {
        to {
          background-position: -200% 0;
        }
      }

      /* ═══ RESPONSIVE ═══ */
      @media (max-width: 1024px) {
        .hero-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .hero-card {
          max-width: 520px;
        }
        .svc-card {
          min-height: 480px;
        }
        .values-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .value-card:nth-child(3) {
          border-left: none;
          padding-left: 0;
        }
        .bike-grid,
        .testimonials-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .bikecheck-grid {
          grid-template-columns: 1fr 1fr;
        }
        .bikecheck-photo {
          grid-column: span 2;
          min-height: 300px;
        }
        .trust-panel {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .block-head {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        .hero-shade {
          background:
            linear-gradient(
              180deg,
              rgba(10, 10, 10, 0.55) 0%,
              rgba(10, 10, 10, 0.75) 45%,
              var(--color-bg) 100%
            );
        }
        .hero-grid {
          padding-top: 7.5rem;
        }
        .hero-scroll {
          display: none;
        }
        .svc-grid,
        .story-grid,
        .faq-layout {
          grid-template-columns: 1fr;
        }
        .faq-intro {
          position: static;
        }
        .cat-grid {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: none;
          grid-auto-rows: 200px;
        }
        .cat-tile-wide {
          grid-row: auto;
          grid-column: span 2;
        }
        .cat-tile:nth-child(4) {
          grid-column: auto;
        }
        .story-media {
          padding: 0 1.5rem 2rem 0;
        }
        .story-img-main {
          aspect-ratio: 4 / 3;
        }
        .story-badge {
          left: 0.75rem;
        }
        .gallery-grid {
          grid-template-columns: repeat(2, 1fr);
          grid-auto-rows: 160px;
        }
        .bikecheck-footer strong {
          margin-left: 0;
        }
      }

      @media (max-width: 640px) {
        .values-grid,
        .bike-grid,
        .testimonials-grid,
        .skeleton-row,
        .trust-list,
        .bikecheck-grid {
          grid-template-columns: 1fr;
        }
        .bikecheck-photo {
          grid-column: auto;
          min-height: 240px;
        }
        .value-card,
        .value-card + .value-card {
          padding: 1.75rem 0 1rem;
          border-left: none;
          border-bottom: 1px solid var(--line);
        }
        .hero-actions > a {
          flex: 1 1 100%;
          justify-content: center;
        }
        .svc-card {
          min-height: 520px;
        }
        .lightbox-nav {
          width: 38px;
          height: 38px;
        }
        .lightbox-prev {
          left: 0.6rem;
        }
        .lightbox-next {
          right: 0.6rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .hero-img,
        .ticker-track,
        .eyebrow-dot,
        .hero-scroll span,
        .reveal {
          animation: none !important;
        }
        .fade-in {
          animation-duration: 0.01s;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private apiService = inject(ApiService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  t = this.translationService.translations;
  lang = this.translationService.currentLanguage;

  // Hero headline split at the em dash so the second half can be accented
  heroTitle = computed(() => {
    const [main, ...rest] = this.t().heroH1.split(' — ');
    return [main, rest.join(' — ')];
  });

  tickerItems = computed(() => [
    this.t().value1Title,
    this.t().value2Title,
    this.t().value3Title,
    this.t().value4Title,
    this.t().bikeCheckTitle,
    this.t().svcRepairTitle,
  ]);

  categoryTiles = computed(() => [
    { img: '/assets/stock/city.webp', label: this.t().catCity },
    { img: '/assets/stock/ebike.webp', label: this.t().catEBike },
    { img: '/assets/stock/mtb.webp', label: this.t().catMountain },
    { img: '/assets/stock/rennrad.webp', label: this.t().catRennrad },
  ]);

  trustItems = computed(() => [
    this.t().trust1,
    this.t().trust2,
    this.t().trust3,
    this.t().trust4,
  ]);

  freeCheckItems = computed(() => [
    this.t().bikeCheckBrakeCheck,
    this.t().bikeCheckGearTest,
    this.t().bikeCheckTireChain,
    this.t().bikeCheckLightCheck,
    this.t().bikeCheckReflectorCheck,
    this.t().bikeCheckBellCheck,
    this.t().bikeCheckSafetyCheck,
  ]);

  repairServiceItems = computed(() => [
    this.t().bikeCheckBrakeAdjust,
    this.t().bikeCheckChainCassette,
    this.t().bikeCheckGearAdjust,
    this.t().bikeCheckTireService,
    this.t().bikeCheckCableReplace,
    this.t().bikeCheckBottomBracket,
    this.t().bikeCheckSpokeRepair,
    this.t().bikeCheckLightInstall,
    this.t().bikeCheckPedalReplace,
  ]);

  faqItems = computed(() => [
    { q: this.t().faq1Q, a: this.t().faq1A },
    { q: this.t().faq2Q, a: this.t().faq2A },
    { q: this.t().faq3Q, a: this.t().faq3A },
    { q: this.t().faq4Q, a: this.t().faq4A },
    { q: this.t().faq5Q, a: this.t().faq5A },
  ]);

  readonly whatsappPath =
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z';

  listings = signal<KleinanzeigenListing[]>([]);
  categories = signal<KleinanzeigenCategory[]>([]);
  shopInfo = signal<PublicShopInfo | null>(null);
  neueFahrraeder = signal<NeueFahrrad[]>([]);
  loading = signal(true);

  // ── Service Carousel ──
  currentSlide = 0;
  private carouselInterval: ReturnType<typeof setInterval> | null = null;
  private carouselPaused = false;

  get totalSlides(): number {
    return 3 + (this.angebotBikes().length > 0 ? 1 : 0);
  }

  get slideIndices(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  angebotBikes() {
    return this.neueFahrraeder()
      .filter((b) => b.angebot && b.angebot > 0)
      .slice(0, 3);
  }

  get carouselTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  getAngebotImageUrl(path: string): string {
    return `${environment.apiUrl.replace('/api/public', '')}${path}`;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.resetCarouselTimer();
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.resetCarouselTimer();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetCarouselTimer();
  }

  pauseCarousel(): void {
    this.carouselPaused = true;
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  resumeCarousel(): void {
    this.carouselPaused = false;
    this.startCarouselTimer();
  }

  private startCarouselTimer(): void {
    if (this.carouselInterval) clearInterval(this.carouselInterval);
    this.carouselInterval = setInterval(() => {
      if (!this.carouselPaused) {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
      }
    }, 5000);
  }

  private resetCarouselTimer(): void {
    this.startCarouselTimer();
  }

  // Repair Showcases
  repairShowcases = signal<RepairShowcase[]>([]);
  repairActiveIndex = 0;
  repairImageIndex = 0;
  private repairInterval: ReturnType<typeof setInterval> | null = null;

  // Shop gallery
  shopPhotos: string[] = [
    '/assets/shop/shop-1.webp',
    '/assets/shop/shop-2.webp',
    '/assets/shop/shop-3.webp',
    '/assets/shop/shop-4.webp',
    '/assets/shop/shop-5.webp',
    '/assets/shop/shop-6.webp',
    '/assets/shop/shop-7.webp',
    '/assets/shop/shop-8.webp',
    '/assets/shop/shop-9.webp',
  ];
  lightboxOpen = false;
  lightboxIndex = 0;

  // Google Reviews
  googleReviews = signal<GoogleReview[]>([]);
  googleRating = signal(0);
  googleTotalReviews = signal(0);
  googlePlaceUrl = signal('');

  // Testimonials for SEO and social proof (fallback when Google API not configured)
  testimonials: Testimonial[] = [
    {
      name: 'Thomas M.',
      initials: 'TM',
      text: 'Habe hier mein Trekkingrad gekauft. Super Beratung, faire Preise und das Rad war top aufbereitet. Kann ich nur empfehlen!',
      detail: 'Trekkingrad gekauft',
      rating: 5,
    },
    {
      name: 'Sandra K.',
      initials: 'SK',
      text: 'Endlich ein Fahrradladen in Lünen, der ehrlich berät und keine überteuerten Preise hat. Mein Sohn liebt sein neues Kinderfahrrad!',
      detail: 'Kinderfahrrad gekauft',
      rating: 5,
    },
    {
      name: 'Michael W.',
      initials: 'MW',
      text: 'Als Student war ich auf der Suche nach einem günstigen, zuverlässigen Fahrrad. Bei Karaarslan Bike wurde ich fündig. Top Qualität zum fairen Preis!',
      detail: 'Cityrad gekauft',
      rating: 5,
    },
    {
      name: 'Elena B.',
      initials: 'EB',
      text: 'Ich habe mein altes Fahrrad hier verkauft und gleich ein E-Bike mitgenommen. Unkompliziert und fair. Beste Fahrradhandlung in Lünen!',
      detail: 'E-Bike gekauft',
      rating: 5,
    },
    {
      name: 'Peter H.',
      initials: 'PH',
      text: 'Schnelle und unkomplizierte Abwicklung. Das gebrauchte Mountainbike war in einwandfreiem Zustand. Sehr zu empfehlen!',
      detail: 'Mountainbike gekauft',
      rating: 5,
    },
    {
      name: 'Julia F.',
      initials: 'JF',
      text: 'Toller Service! Die Beratung war super und ich wurde nicht gedrängt. Mein neues Fahrrad macht mich jeden Tag glücklich.',
      detail: 'Damenrad gekauft',
      rating: 5,
    },
  ];

  private reviewSchemaElement: HTMLScriptElement | null = null;

  ngOnInit(): void {
    // SEO - Reset to homepage defaults
    this.titleService.setTitle(this.t().metaTitle);
    this.metaService.updateTag({
      name: 'description',
      content: this.t().metaDescription,
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: this.t().metaTitle,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: this.t().metaDescription,
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: `https://karaarslan-bike.de/${this.lang()}`,
    });

    // Add Review/Rating Schema for SEO
    this.addReviewSchema();

    if (this.isBrowser) {
      // Browser-only behavior: timers and API subscriptions
      this.loadData();
      return;
    }

    // Server render should not block on client API calls.
    this.loading.set(false);
  }

  private addReviewSchema(): void {
    const googleReviews = this.googleReviews();
    const useGoogle = googleReviews.length > 0;

    const reviews = useGoogle
      ? googleReviews
          .filter((r) => r.text)
          .map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.authorName },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.rating,
              bestRating: 5,
            },
            reviewBody: r.text,
          }))
      : this.testimonials.map((t) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: t.name },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: t.rating,
            bestRating: 5,
          },
          reviewBody: t.text,
        }));

    const ratingValue = useGoogle ? this.googleRating().toFixed(1) : '4.9';
    const reviewCount = useGoogle
      ? this.googleTotalReviews().toString()
      : this.testimonials.length.toString();

    const schema = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'BikeStore'],
      '@id': 'https://karaarslan-bike.de/#localbusiness',
      name: 'Karaarslan Bike',
      image: 'https://karaarslan-bike.de/assets/logo.png',
      url: 'https://karaarslan-bike.de',
      telephone: '+49-163-7390301',
      email: 'info@karaarslan-bike.de',
      availableLanguage: ['German', 'English', 'French', 'Turkish'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Alstedder Straße 5',
        addressLocality: 'Lünen',
        postalCode: '44534',
        addressCountry: 'DE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.6236,
        longitude: 7.5130,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews,
      priceRange: '€-€€€',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Cash, Credit Card, Debit Card, PayPal, Bank Transfer',
      sameAs: [
        'https://maps.app.goo.gl/Q1fXe7A6PRb8E5wV7',
        'https://www.instagram.com/karaarslanbike',
        'https://wa.me/491637390301',
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '09:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '09:00',
          closes: '13:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '15:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '18:00',
        },
      ],
      specialOpeningHoursSpecification: [HOLIDAY_SCHEMA_SPEC],
    };

    // Remove old schema element if exists (e.g. after Google reviews load)
    if (this.reviewSchemaElement) {
      this.reviewSchemaElement.remove();
    }

    this.reviewSchemaElement = this.document.createElement('script');
    this.reviewSchemaElement.type = 'application/ld+json';
    this.reviewSchemaElement.text = JSON.stringify(schema);
    this.document.head.appendChild(this.reviewSchemaElement);
  }

  private loadData(): void {
    this.apiService.getListings().subscribe({
      next: (data) => {
        this.listings.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.apiService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
    });

    this.apiService.getShopInfo().subscribe({
      next: (data) => this.shopInfo.set(data),
    });

    this.apiService.getNeueFahrraeder().subscribe({
      next: (data) => this.neueFahrraeder.set(data),
    });

    this.apiService.getRepairShowcases().subscribe({
      next: (data) => {
        this.repairShowcases.set(data);
        if (data.length > 0) {
          this.startRepairSlideshow();
        }
      },
    });

    this.apiService.getGoogleReviews().subscribe({
      next: (data) => {
        if (data.reviews?.length) {
          this.googleReviews.set(data.reviews);
          this.googleRating.set(data.rating);
          this.googleTotalReviews.set(data.totalReviews);
          this.googlePlaceUrl.set(data.placeUrl);
          // Re-inject schema with real Google data
          this.addReviewSchema();
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.stopRepairSlideshow();
    if (this.carouselInterval) clearInterval(this.carouselInterval);
  }

  // ── Repair Showcase Slideshow ──
  getRepairImageUrl(path: string): string {
    return `${environment.apiUrl.replace('/api/public', '')}${path}`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  private startRepairSlideshow(): void {
    this.stopRepairSlideshow();
    this.repairInterval = setInterval(() => {
      const showcases = this.repairShowcases();
      if (showcases.length === 0) return;
      const current = showcases[this.repairActiveIndex];
      if (
        current.images.length > 1 &&
        this.repairImageIndex < current.images.length - 1
      ) {
        this.repairImageIndex++;
      } else {
        this.repairActiveIndex =
          (this.repairActiveIndex + 1) % showcases.length;
        this.repairImageIndex = 0;
      }
    }, 3000);
  }

  private stopRepairSlideshow(): void {
    if (this.repairInterval) {
      clearInterval(this.repairInterval);
      this.repairInterval = null;
    }
  }

  selectRepairShowcase(index: number): void {
    this.repairActiveIndex = index;
    this.repairImageIndex = 0;
    this.startRepairSlideshow();
  }

  openLightbox(index: number): void {
    this.lightboxIndex = index;
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  nextPhoto(event: Event): void {
    event.stopPropagation();
    this.lightboxIndex = (this.lightboxIndex + 1) % this.shopPhotos.length;
  }

  prevPhoto(event: Event): void {
    event.stopPropagation();
    this.lightboxIndex =
      (this.lightboxIndex - 1 + this.shopPhotos.length) %
      this.shopPhotos.length;
  }
}
