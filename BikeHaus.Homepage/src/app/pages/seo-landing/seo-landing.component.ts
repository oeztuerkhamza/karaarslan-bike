import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';
import { BikeCardComponent } from '../../components/bike-card/bike-card.component';
import { KleinanzeigenListing } from '../../models/models';
import {
  LANDING_PAGES,
  LandingKey,
  LandingContent,
} from '../../services/landing-pages.data';

const BASE_URL = 'https://karaarslan-bike.de';
const WHATSAPP_URL = 'https://wa.me/491637390301';
const MAPS_URL = 'https://maps.app.goo.gl/Q1fXe7A6PRb8E5wV7';

/**
 * Data-driven SEO landing page (used bikes, Christmas gifts). The route passes
 * `data: { page }`; all copy lives in landing-pages.data.ts per language.
 */
@Component({
  selector: 'app-seo-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, BikeCardComponent],
  template: `
    @if (c(); as c) {
      <!-- ═══ HERO ═══ -->
      <section class="lp-hero" aria-labelledby="lp-h1">
        <img
          class="lp-hero-img"
          [src]="page().heroImage"
          alt=""
          width="1800"
          height="1200"
          fetchpriority="high"
          decoding="async"
        />
        <div class="lp-hero-shade" aria-hidden="true"></div>
        <div class="container lp-hero-inner">
          <nav class="lp-crumbs" aria-label="Breadcrumb">
            <a [routerLink]="['/' + lang()]">{{ t().home }}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ c.breadcrumb }}</span>
          </nav>
          <span class="lp-eyebrow">
            <span class="lp-dot" aria-hidden="true"></span>{{ c.eyebrow }}
          </span>
          <h1 id="lp-h1" class="lp-h1">
            {{ c.h1 }}
            <span class="lp-h1-accent">{{ c.h1Accent }}</span>
          </h1>
          <p class="lp-sub">{{ c.sub }}</p>
          <div class="lp-actions">
            <a [routerLink]="c.ctaPrimary.href" class="btn-primary"
              >{{ c.ctaPrimary.label }}
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
              [href]="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary lp-glass"
              >{{ t().ctaWhatsapp }}</a
            >
          </div>
          <ul class="lp-usps">
            @for (u of c.usps; track u) {
              <li>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ u }}
              </li>
            }
          </ul>
        </div>
      </section>

      <!-- ═══ SECTIONS ═══ -->
      @for (s of c.sections; track $index; let odd = $odd) {
        <section class="lp-block" [class.lp-tint]="odd">
          <div class="container">
            @switch (s.kind) {
              @case ('listings') {
                @if (s.kind === 'listings') {
                  <header class="lp-head">
                    <div>
                      <h2 class="lp-title">{{ s.heading }}</h2>
                      <p class="lp-intro">{{ s.intro }}</p>
                    </div>
                    <a
                      [routerLink]="['/' + lang(), 'showroom']"
                      class="lp-link-arrow"
                      >{{ s.moreLabel }} →</a
                    >
                  </header>
                  @if (listings().length) {
                    <div class="lp-bike-grid">
                      @for (bike of listings().slice(0, 6); track bike.id) {
                        <app-bike-card [listing]="bike"></app-bike-card>
                      }
                    </div>
                  } @else {
                    <div class="lp-empty">
                      <a
                        [routerLink]="['/' + lang(), 'showroom']"
                        class="btn-primary"
                        >{{ s.moreLabel }}</a
                      >
                    </div>
                  }
                }
              }
              @case ('compare') {
                @if (s.kind === 'compare') {
                  <h2 class="lp-title">{{ s.heading }}</h2>
                  @if (s.intro) {
                    <p class="lp-intro">{{ s.intro }}</p>
                  }
                  <div class="lp-table-wrap">
                    <table class="lp-table">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">{{ s.cols[0] }}</th>
                          <th scope="col" class="lp-us">{{ s.cols[1] }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (r of s.rows; track r.label) {
                          <tr>
                            <th scope="row">{{ r.label }}</th>
                            <td class="lp-them">{{ r.a }}</td>
                            <td class="lp-us">{{ r.b }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              }
              @case ('list') {
                @if (s.kind === 'list') {
                  <div class="lp-split">
                    <div>
                      <h2 class="lp-title">{{ s.heading }}</h2>
                      @if (s.intro) {
                        <p class="lp-intro">{{ s.intro }}</p>
                      }
                    </div>
                    <ul class="lp-checks">
                      @for (it of s.items; track it) {
                        <li>
                          <span class="lp-check" aria-hidden="true">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          {{ it }}
                        </li>
                      }
                    </ul>
                  </div>
                }
              }
              @case ('cards') {
                @if (s.kind === 'cards') {
                  <h2 class="lp-title">{{ s.heading }}</h2>
                  @if (s.intro) {
                    <p class="lp-intro">{{ s.intro }}</p>
                  }
                  <div class="lp-cards">
                    @for (card of s.cards; track card.title; let i = $index) {
                      <article class="lp-card">
                        <span class="lp-card-num">0{{ i + 1 }}</span>
                        <h3>{{ card.title }}</h3>
                        <p>{{ card.text }}</p>
                        @if (card.href) {
                          <a [routerLink]="card.href" class="lp-card-link"
                            >{{ card.linkLabel }} →</a
                          >
                        }
                      </article>
                    }
                  </div>
                }
              }
              @case ('feature') {
                @if (s.kind === 'feature') {
                  <div class="lp-feature">
                    <img
                      [src]="s.image"
                      alt=""
                      loading="lazy"
                      width="1400"
                      height="933"
                    />
                    <div>
                      <h2 class="lp-title">{{ s.heading }}</h2>
                      @for (p of s.paragraphs; track $index) {
                        <p class="lp-p">{{ p }}</p>
                      }
                      @if (s.items) {
                        <ul class="lp-checks lp-checks-compact">
                          @for (it of s.items; track it) {
                            <li>
                              <span class="lp-check" aria-hidden="true">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="3"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                              {{ it }}
                            </li>
                          }
                        </ul>
                      }
                    </div>
                  </div>
                }
              }
              @case ('table') {
                @if (s.kind === 'table') {
                  <h2 class="lp-title">{{ s.heading }}</h2>
                  @if (s.intro) {
                    <p class="lp-intro">{{ s.intro }}</p>
                  }
                  <div class="lp-table-wrap">
                    <table class="lp-table lp-table-data">
                      <thead>
                        <tr>
                          @for (col of s.columns; track col) {
                            <th scope="col">{{ col }}</th>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of s.rows; track $index) {
                          <tr>
                            @for (cell of row; track $index; let first = $first) {
                              @if (first) {
                                <th scope="row">{{ cell }}</th>
                              } @else {
                                <td>{{ cell }}</td>
                              }
                            }
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                  @if (s.note) {
                    <p class="lp-note">{{ s.note }}</p>
                  }
                }
              }
              @case ('calculator') {
                @if (s.kind === 'calculator') {
                  <div class="lp-calc">
                    <div>
                      <h2 class="lp-title">{{ s.heading }}</h2>
                      <p class="lp-intro">{{ s.intro }}</p>
                      <div class="lp-calc-fields">
                        <label>
                          <span>{{ s.labels.height }}</span>
                          <input
                            type="number"
                            inputmode="numeric"
                            [min]="s.mode === 'kids' ? 80 : 120"
                            [max]="s.mode === 'kids' ? 170 : 220"
                            (input)="calcHeight.set(num($event))"
                          />
                        </label>
                        <label>
                          <span>{{ s.labels.second }}</span>
                          <input
                            type="number"
                            inputmode="numeric"
                            [min]="s.mode === 'kids' ? 2 : 50"
                            [max]="s.mode === 'kids' ? 14 : 110"
                            (input)="calcSecond.set(num($event))"
                          />
                          <small>{{ s.labels.secondHint }}</small>
                        </label>
                      </div>
                    </div>
                    <div class="lp-calc-result" aria-live="polite">
                      <span class="lp-calc-label">{{ s.labels.result }}</span>
                      @if (s.mode === 'frame') {
                        @if (frameResult(); as r) {
                          <dl class="lp-calc-out">
                            <div>
                              <dt>{{ s.labels.outputs[0] }}</dt>
                              <dd>{{ r.city }} cm <small>({{ r.letter }})</small></dd>
                            </div>
                            <div>
                              <dt>{{ s.labels.outputs[1] }}</dt>
                              <dd>{{ r.mtb }}″</dd>
                            </div>
                            <div>
                              <dt>{{ s.labels.outputs[2] }}</dt>
                              <dd>{{ r.road }} cm</dd>
                            </div>
                          </dl>
                        } @else {
                          <p class="lp-calc-empty">{{ s.labels.empty }}</p>
                        }
                      } @else {
                        @if (kidsResult(); as r) {
                          <dl class="lp-calc-out">
                            <div>
                              <dt>{{ s.labels.outputs[0] }}</dt>
                              <dd class="lp-calc-big">{{ r }}</dd>
                            </div>
                          </dl>
                        } @else {
                          <p class="lp-calc-empty">{{ s.labels.empty }}</p>
                        }
                      }
                      <p class="lp-note">{{ s.labels.note }}</p>
                    </div>
                  </div>
                }
              }
              @case ('links') {
                @if (s.kind === 'links') {
                  <h2 class="lp-title">{{ s.heading }}</h2>
                  @if (s.intro) {
                    <p class="lp-intro">{{ s.intro }}</p>
                  }
                  <div class="lp-links">
                    @for (l of s.links; track l.href) {
                      <a [routerLink]="l.href">{{ l.label }}</a>
                    }
                  </div>
                }
              }
              @default {
                @if (s.kind === 'text') {
                  <div class="lp-text">
                    <h2 class="lp-title">{{ s.heading }}</h2>
                    @for (p of s.paragraphs; track $index) {
                      <p class="lp-p">{{ p }}</p>
                    }
                  </div>
                }
              }
            }
          </div>
        </section>
      }

      <!-- ═══ FAQ ═══ -->
      <section class="lp-block lp-tint" aria-labelledby="lp-faq">
        <div class="container lp-faq-layout">
          <div>
            <h2 id="lp-faq" class="lp-title">{{ c.faqHeading }}</h2>
            <a
              [href]="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary lp-glass"
              >{{ t().ctaWhatsapp }}</a
            >
          </div>
          <div class="lp-faq-list">
            @for (f of c.faq; track f.q) {
              <details class="lp-faq-item">
                <summary>
                  <span>{{ f.q }}</span>
                  <span class="lp-toggle" aria-hidden="true"></span>
                </summary>
                <p>{{ f.a }}</p>
              </details>
            }
          </div>
        </div>
      </section>

      <!-- ═══ CTA ═══ -->
      <section class="lp-cta" aria-labelledby="lp-cta-h">
        <img
          class="lp-cta-img"
          [src]="page().ctaImage"
          alt=""
          loading="lazy"
          width="1800"
          height="1200"
        />
        <div class="lp-cta-shade" aria-hidden="true"></div>
        <div class="container lp-cta-inner">
          <h2 id="lp-cta-h">{{ c.ctaTitle }}</h2>
          <p>{{ c.ctaText }}</p>
          <div class="lp-actions lp-actions-center">
            <a [routerLink]="c.ctaPrimary.href" class="btn-primary">{{
              c.ctaPrimary.label
            }}</a>
            <a
              [href]="mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary lp-glass"
              >{{ t().ctaRoute }}</a
            >
          </div>
          <p class="lp-address">
            Karaarslan Bike · Alstedder Straße 5 · 44534 Lünen · +49 163 7390 301
          </p>
        </div>
      </section>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        --line: rgba(255, 255, 255, 0.08);
        --ink-soft: rgba(255, 255, 255, 0.7);
        --card: rgba(255, 255, 255, 0.035);
        --ease: cubic-bezier(0.22, 1, 0.36, 1);
      }

      /* HERO */
      .lp-hero {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        min-height: 88vh;
        min-height: 88svh;
        display: flex;
        align-items: flex-end;
      }
      .lp-hero-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;
      }
      .lp-hero-shade {
        position: absolute;
        inset: 0;
        z-index: -1;
        background:
          linear-gradient(
            90deg,
            rgba(10, 10, 10, 0.94) 0%,
            rgba(10, 10, 10, 0.72) 45%,
            rgba(10, 10, 10, 0.25) 100%
          ),
          linear-gradient(0deg, var(--color-bg) 0%, transparent 40%);
      }
      .lp-hero-inner {
        padding-top: 8.5rem;
        padding-bottom: clamp(3rem, 7vh, 5rem);
      }
      .lp-crumbs {
        display: flex;
        gap: 0.5rem;
        font-size: 0.82rem;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 1.25rem;
      }
      .lp-crumbs a:hover {
        color: #fff;
      }
      .lp-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 1rem 0.5rem 0.75rem;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        margin-bottom: 1.4rem;
      }
      .lp-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-accent);
      }
      .lp-h1 {
        font-size: clamp(2.5rem, 6.4vw, 5.4rem);
        font-weight: 800;
        line-height: 0.98;
        letter-spacing: -0.05em;
        max-width: 900px;
        margin-bottom: 1.4rem;
        text-wrap: balance;
      }
      .lp-h1-accent {
        display: block;
        background: linear-gradient(90deg, #ff5722, #ff9a5a);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .lp-sub {
        max-width: 640px;
        font-size: clamp(1rem, 1.6vw, 1.15rem);
        line-height: 1.75;
        color: rgba(255, 255, 255, 0.82);
        margin-bottom: 2rem;
      }
      .lp-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.85rem;
      }
      .lp-actions-center {
        justify-content: center;
      }
      .lp-glass {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      .lp-usps {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 2rem;
        max-width: 820px;
      }
      .lp-usps li {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.45rem 0.85rem;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
      .lp-usps svg {
        color: var(--color-accent);
      }

      /* BLOCKS */
      .lp-block {
        padding: clamp(3.5rem, 7vw, 6rem) 0;
      }
      .lp-tint {
        background: var(--color-bg-secondary);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
      }
      .lp-head {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .lp-title {
        font-size: clamp(1.8rem, 3.6vw, 2.9rem);
        font-weight: 800;
        line-height: 1.05;
        letter-spacing: -0.04em;
        margin-bottom: 0.9rem;
        max-width: 760px;
        text-wrap: balance;
      }
      .lp-intro,
      .lp-p {
        color: var(--ink-soft);
        line-height: 1.75;
        max-width: 720px;
        font-size: 1.02rem;
      }
      .lp-intro {
        margin-bottom: 2rem;
      }
      .lp-head .lp-intro {
        margin-bottom: 0;
      }
      .lp-p + .lp-p {
        margin-top: 1rem;
      }
      .lp-text {
        max-width: 820px;
      }
      .lp-link-arrow {
        flex-shrink: 0;
        font-weight: 700;
        padding-bottom: 0.3rem;
        border-bottom: 2px solid var(--color-accent);
      }
      .lp-link-arrow:hover {
        color: var(--color-accent);
      }

      .lp-bike-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
      .lp-empty {
        padding: 2rem 0;
      }

      /* COMPARE */
      .lp-table-wrap {
        overflow-x: auto;
        border-radius: 20px;
        border: 1px solid var(--line);
      }
      .lp-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 560px;
      }
      .lp-table th,
      .lp-table td {
        padding: 1rem 1.25rem;
        text-align: left;
        border-bottom: 1px solid var(--line);
        font-size: 0.95rem;
      }
      .lp-table tbody tr:last-child th,
      .lp-table tbody tr:last-child td {
        border-bottom: none;
      }
      .lp-table thead th {
        font-size: 0.78rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-soft);
      }
      .lp-table th[scope='row'] {
        font-weight: 700;
      }
      .lp-them {
        color: rgba(255, 255, 255, 0.5);
      }
      .lp-us {
        background: rgba(255, 87, 34, 0.08);
        font-weight: 600;
      }
      .lp-table thead .lp-us {
        color: var(--color-accent);
      }

      .lp-table-data tbody td {
        font-variant-numeric: tabular-nums;
      }
      .lp-table-data tbody tr:hover {
        background: rgba(255, 87, 34, 0.06);
      }
      .lp-note {
        margin-top: 1rem;
        font-size: 0.88rem;
        color: rgba(255, 255, 255, 0.55);
        line-height: 1.6;
        max-width: 720px;
      }

      /* CALCULATOR */
      .lp-calc {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: clamp(1.5rem, 4vw, 3rem);
        padding: clamp(1.5rem, 4vw, 2.75rem);
        border-radius: 28px;
        background:
          radial-gradient(
            ellipse 70% 90% at 0% 0%,
            rgba(255, 87, 34, 0.16),
            transparent 60%
          ),
          var(--card);
        border: 1px solid var(--line);
      }
      .lp-calc-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .lp-calc-fields label {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .lp-calc-fields input {
        padding: 0.95rem 1rem;
        border-radius: 14px;
        font-size: 1.15rem;
        font-weight: 700;
        outline: none;
      }
      .lp-calc-fields input:focus {
        border-color: var(--color-accent);
      }
      .lp-calc-fields small {
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        line-height: 1.4;
      }
      .lp-calc-result {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--line);
      }
      .lp-calc-label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: 1rem;
      }
      .lp-calc-out {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }
      .lp-calc-out div {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px dashed var(--line);
      }
      .lp-calc-out dt {
        color: var(--ink-soft);
        font-size: 0.92rem;
      }
      .lp-calc-out dd {
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        white-space: nowrap;
      }
      .lp-calc-out dd small {
        font-size: 0.85rem;
        color: var(--color-accent);
      }
      .lp-calc-big {
        font-size: 3rem !important;
        color: var(--color-accent);
      }
      .lp-calc-empty {
        color: var(--ink-soft);
        line-height: 1.6;
      }

      /* LISTS */
      .lp-split {
        display: grid;
        grid-template-columns: 0.9fr 1.1fr;
        gap: clamp(2rem, 5vw, 4rem);
        align-items: start;
      }
      .lp-checks {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
      }
      .lp-checks li {
        display: flex;
        gap: 0.85rem;
        align-items: flex-start;
        padding: 1rem 1.15rem;
        border-radius: 16px;
        background: var(--card);
        border: 1px solid var(--line);
        line-height: 1.55;
      }
      .lp-checks-compact li {
        padding: 0.7rem 0.9rem;
      }
      .lp-check {
        flex-shrink: 0;
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--color-accent);
        color: #fff;
      }

      /* CARDS */
      .lp-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
      .lp-card {
        display: flex;
        flex-direction: column;
        padding: 1.6rem;
        border-radius: 20px;
        background: var(--card);
        border: 1px solid var(--line);
        transition:
          border-color 0.3s,
          transform 0.4s var(--ease);
      }
      .lp-card:hover {
        border-color: rgba(255, 87, 34, 0.45);
        transform: translateY(-4px);
      }
      .lp-card-num {
        font-size: 0.8rem;
        font-weight: 800;
        color: var(--color-accent);
        margin-bottom: 0.9rem;
      }
      .lp-card h3 {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .lp-card p {
        color: var(--ink-soft);
        line-height: 1.65;
        font-size: 0.94rem;
        flex: 1;
      }
      .lp-card-link {
        margin-top: 1rem;
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--color-accent);
      }

      /* FEATURE */
      .lp-feature {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(2rem, 5vw, 4rem);
        align-items: center;
      }
      .lp-feature img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: 24px;
      }
      .lp-feature .lp-checks {
        margin-top: 1.5rem;
      }

      /* LINKS */
      .lp-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }
      .lp-links a {
        padding: 0.7rem 1.1rem;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.92rem;
        background: var(--card);
        border: 1px solid var(--line);
        transition:
          border-color 0.25s,
          color 0.25s;
      }
      .lp-links a:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }

      /* FAQ */
      .lp-faq-layout {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: clamp(2rem, 5vw, 4rem);
        align-items: start;
      }
      .lp-faq-list {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
      }
      .lp-faq-item {
        border-radius: 18px;
        background: var(--card);
        border: 1px solid var(--line);
      }
      .lp-faq-item[open] {
        border-color: rgba(255, 87, 34, 0.45);
      }
      .lp-faq-item summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1.2rem 1.4rem;
        font-weight: 700;
        cursor: pointer;
        list-style: none;
      }
      .lp-faq-item summary::-webkit-details-marker {
        display: none;
      }
      .lp-faq-item p {
        padding: 0 1.4rem 1.3rem;
        color: var(--ink-soft);
        line-height: 1.75;
      }
      .lp-toggle {
        position: relative;
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.07);
        transition: transform 0.4s var(--ease), background 0.3s;
      }
      .lp-toggle::before,
      .lp-toggle::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 12px;
        height: 2px;
        margin: -1px 0 0 -6px;
        background: currentColor;
      }
      .lp-toggle::after {
        transform: rotate(90deg);
      }
      .lp-faq-item[open] .lp-toggle {
        background: var(--color-accent);
        transform: rotate(45deg);
      }

      /* CTA */
      .lp-cta {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        padding: clamp(5rem, 12vw, 9rem) 0;
        text-align: center;
      }
      .lp-cta-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;
      }
      .lp-cta-shade {
        position: absolute;
        inset: 0;
        z-index: -1;
        background:
          linear-gradient(180deg, var(--color-bg) 0%, transparent 35%),
          rgba(10, 10, 10, 0.62);
      }
      .lp-cta h2 {
        font-size: clamp(2.2rem, 5vw, 4rem);
        font-weight: 800;
        letter-spacing: -0.045em;
        line-height: 1.02;
        margin-bottom: 1rem;
        text-wrap: balance;
      }
      .lp-cta-inner > p {
        max-width: 580px;
        margin: 0 auto 2rem;
        color: rgba(255, 255, 255, 0.82);
        line-height: 1.7;
      }
      .lp-cta-inner > .lp-address {
        margin: 2rem auto 0;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.6);
      }

      @media (max-width: 1024px) {
        .lp-cards,
        .lp-bike-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 768px) {
        .lp-head {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        .lp-hero-shade {
          background: linear-gradient(
            180deg,
            rgba(10, 10, 10, 0.6) 0%,
            rgba(10, 10, 10, 0.8) 50%,
            var(--color-bg) 100%
          );
        }
        .lp-hero-inner {
          padding-top: 7rem;
        }
        .lp-split,
        .lp-feature,
        .lp-faq-layout,
        .lp-calc,
        .lp-calc-fields {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 640px) {
        .lp-cards,
        .lp-bike-grid {
          grid-template-columns: 1fr;
        }
        .lp-actions > a {
          flex: 1 1 100%;
          justify-content: center;
        }
      }
    `,
  ],
})
export class SeoLandingComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private translationService = inject(TranslationService);
  private apiService = inject(ApiService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  t = this.translationService.translations;
  lang = this.translationService.currentLanguage;

  readonly whatsappUrl = WHATSAPP_URL;
  readonly mapsUrl = MAPS_URL;

  private key = signal<LandingKey>(
    (this.route.snapshot.data['page'] as LandingKey) ?? 'used',
  );
  page = computed(() => LANDING_PAGES[this.key()]);
  c = computed<LandingContent>(() => this.page().content[this.lang()]);
  listings = signal<KleinanzeigenListing[]>([]);

  // Size calculator (frame: height + inside leg; kids: height or age)
  calcHeight = signal(0);
  calcSecond = signal(0);

  frameResult = computed(() => {
    const h = this.calcHeight();
    if (h < 120 || h > 220) return null;
    const leg = this.calcSecond();
    // Inside leg is roughly 45 % of height when not measured
    const inseam = leg >= 50 && leg <= 110 ? leg : h * 0.45;
    const city = Math.round(inseam * 0.66);
    const letter =
      city < 46
        ? 'XS'
        : city < 50
          ? 'S'
          : city < 55
            ? 'M'
            : city < 60
              ? 'L'
              : city < 64
                ? 'XL'
                : 'XXL';
    return {
      city,
      letter,
      mtb: Math.floor(inseam * 0.226),
      road: Math.round(inseam * 0.665),
    };
  });

  kidsResult = computed(() => {
    let h = this.calcHeight();
    const age = this.calcSecond();
    if (!(h >= 80 && h <= 170)) {
      // Typical height by age, 2 to 14 years
      const byAge = [90, 97, 104, 110, 117, 123, 129, 134, 140, 145, 151, 157, 163];
      h = age >= 2 && age <= 14 ? byAge[Math.round(age) - 2] : 0;
    }
    if (!h) return null;
    if (h < 95) return '12″';
    if (h < 105) return '14″';
    if (h < 118) return '16″';
    if (h < 133) return '20″';
    if (h < 148) return '24″';
    if (h < 158) return '26″';
    return '27,5″ / 28″';
  });

  num(event: Event): number {
    return Number((event.target as HTMLInputElement).value) || 0;
  }

  private schemaEls: HTMLScriptElement[] = [];

  // Re-apply meta + schema when the language changes on the same page
  private seoEffect = effect(() => {
    this.applySeo(this.c(), this.listings());
  });

  ngOnInit(): void {
    const hasListings = this.page().content.de.sections.some(
      (s) => s.kind === 'listings',
    );
    if (this.isBrowser && hasListings) {
      this.apiService.getListings().subscribe({
        next: (data) => this.listings.set(data ?? []),
      });
    }
  }

  ngOnDestroy(): void {
    this.schemaEls.forEach((el) => el.remove());
  }

  private applySeo(c: LandingContent, listings: KleinanzeigenListing[]): void {
    const url = `${BASE_URL}/${this.lang()}/${this.page().slug}`;
    const image = `${BASE_URL}${this.page().heroImage}`;

    this.titleService.setTitle(c.metaTitle);
    this.metaService.updateTag({ name: 'description', content: c.metaDescription });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    this.metaService.updateTag({ property: 'og:title', content: c.metaTitle });
    this.metaService.updateTag({ property: 'og:description', content: c.metaDescription });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    const graph: object[] = [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: c.metaTitle,
        description: c.metaDescription,
        inLanguage: this.lang(),
        primaryImageOfPage: image,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#localbusiness` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: this.t().home,
            item: `${BASE_URL}/${this.lang()}`,
          },
          { '@type': 'ListItem', position: 2, name: c.breadcrumb, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ];

    const priced = listings.filter((l) => l.price && l.price > 0).slice(0, 12);
    if (priced.length) {
      graph.push({
        '@type': 'ItemList',
        name: c.breadcrumb,
        itemListElement: priced.map((l, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: l.title,
            url: `${BASE_URL}/${this.lang()}/showroom/${l.id}`,
            ...(l.images?.[0]?.imageUrl ? { image: l.images[0].imageUrl } : {}),
            offers: {
              '@type': 'Offer',
              price: l.price,
              priceCurrency: 'EUR',
              itemCondition: 'https://schema.org/UsedCondition',
              availability: 'https://schema.org/InStock',
              seller: { '@id': `${BASE_URL}/#localbusiness` },
            },
          },
        })),
      });
    }

    this.schemaEls.forEach((el) => el.remove());
    const el = this.document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    this.document.head.appendChild(el);
    this.schemaEls = [el];
  }
}
