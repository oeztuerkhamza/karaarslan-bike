import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TranslationService } from '../../services/translation.service';
import { FAQ_CONTENT, FaqCategory } from '../../services/faq.data';

const BASE_URL = 'https://karaarslan-bike.de';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="faq-page">
      <header class="faq-hero">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a [routerLink]="['/' + lang()]">{{ t().home }}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ c().h1 }}</span>
          </nav>
          <h1>{{ c().h1 }}</h1>
          <p class="faq-sub">{{ c().sub }}</p>

          <div class="faq-search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              [placeholder]="c().searchPlaceholder"
              [attr.aria-label]="c().searchPlaceholder"
              (input)="query.set($any($event.target).value)"
            />
          </div>

          <nav class="faq-chips" aria-label="Topics">
            @for (cat of c().categories; track cat.id) {
              <a [href]="'#' + cat.id" (click)="scrollTo($event, cat.id)">{{
                cat.title
              }}</a>
            }
          </nav>
        </div>
      </header>

      <section class="faq-body">
        <div class="container">
          @for (cat of visible(); track cat.id) {
            <section class="faq-cat" [id]="cat.id">
              <h2>{{ cat.title }}</h2>
              <div class="faq-list">
                @for (item of cat.items; track item.q) {
                  <details class="faq-item" [open]="!!query()">
                    <summary>
                      <h3>{{ item.q }}</h3>
                      <span class="faq-toggle" aria-hidden="true"></span>
                    </summary>
                    <div class="faq-answer">
                      <p>{{ item.a }}</p>
                      @if (item.link) {
                        <a [routerLink]="item.link.href" class="faq-link"
                          >{{ item.link.label }} →</a
                        >
                      }
                    </div>
                  </details>
                }
              </div>
            </section>
          } @empty {
            <p class="faq-none">{{ c().noMatch }}</p>
          }

          <div class="faq-cta">
            <p>{{ t().faqCtaText }}</p>
            <div class="faq-cta-actions">
              <a
                href="https://wa.me/491637390301"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary"
                >{{ t().ctaWhatsapp }}</a
              >
              <a [routerLink]="['/' + lang(), 'contact']" class="btn-secondary">{{
                t().faqCtaButton
              }}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        --line: rgba(255, 255, 255, 0.08);
        --card: rgba(255, 255, 255, 0.035);
      }
      .container {
        max-width: 880px;
      }
      .faq-hero {
        padding: 8.5rem 0 2.5rem;
        background: radial-gradient(
          ellipse 70% 80% at 50% 0%,
          rgba(255, 87, 34, 0.12),
          transparent 70%
        );
      }
      .crumbs {
        display: flex;
        gap: 0.5rem;
        font-size: 0.82rem;
        color: rgba(255, 255, 255, 0.55);
        margin-bottom: 1.25rem;
      }
      .crumbs a:hover {
        color: var(--color-accent);
      }
      h1 {
        font-size: clamp(2.4rem, 6vw, 4.2rem);
        font-weight: 800;
        letter-spacing: -0.05em;
        line-height: 1;
        margin-bottom: 1rem;
      }
      .faq-sub {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.7;
        max-width: 640px;
        margin-bottom: 2rem;
      }
      .faq-search {
        position: relative;
        margin-bottom: 1.25rem;
      }
      .faq-search svg {
        position: absolute;
        left: 1.1rem;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.5);
      }
      .faq-search input {
        width: 100%;
        padding: 1.05rem 1.2rem 1.05rem 3.2rem;
        border-radius: 999px;
        font-size: 1rem;
        outline: none;
      }
      .faq-search input:focus {
        border-color: var(--color-accent);
      }
      .faq-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .faq-chips a {
        padding: 0.5rem 0.95rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        background: var(--card);
        border: 1px solid var(--line);
        transition:
          border-color 0.25s,
          color 0.25s;
      }
      .faq-chips a:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }
      .faq-body {
        padding: 1rem 0 5rem;
      }
      .faq-cat {
        padding-top: 2.5rem;
        scroll-margin-top: 6rem;
      }
      .faq-cat h2 {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        font-size: 1.4rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 1rem;
      }
      .faq-cat h2::before {
        content: '';
        width: 24px;
        height: 2px;
        background: var(--color-accent);
      }
      .faq-list {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .faq-item {
        border-radius: 18px;
        background: var(--card);
        border: 1px solid var(--line);
        transition: border-color 0.3s;
      }
      .faq-item[open] {
        border-color: rgba(255, 87, 34, 0.45);
        background: rgba(255, 87, 34, 0.04);
      }
      summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1.15rem 1.35rem;
        cursor: pointer;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary h3 {
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.4;
      }
      .faq-toggle {
        position: relative;
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.07);
        transition:
          transform 0.35s ease,
          background 0.3s;
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
        padding: 0 1.35rem 1.25rem;
      }
      .faq-answer p {
        color: rgba(255, 255, 255, 0.72);
        line-height: 1.75;
      }
      .faq-link {
        display: inline-block;
        margin-top: 0.75rem;
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--color-accent);
      }
      .faq-none {
        padding: 3rem 0;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
      }
      .faq-cta {
        margin-top: 3.5rem;
        padding: 2rem;
        border-radius: 24px;
        text-align: center;
        background: var(--card);
        border: 1px solid var(--line);
      }
      .faq-cta p {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
      }
      .faq-cta-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
      }
      @media (max-width: 768px) {
        .faq-hero {
          padding-top: 7rem;
        }
      }
    `,
  ],
})
export class FaqComponent implements OnDestroy {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private translationService = inject(TranslationService);

  t = this.translationService.translations;
  lang = this.translationService.currentLanguage;
  c = computed(() => FAQ_CONTENT[this.lang()]);

  query = signal('');
  visible = computed<FaqCategory[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.c().categories;
    return this.c()
      .categories.map((cat) => ({
        ...cat,
        items: cat.items.filter((i) =>
          (i.q + ' ' + i.a).toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length);
  });

  private schemaEl: HTMLScriptElement | null = null;

  // Meta + schema follow the active language
  private seoEffect = effect(() => {
    const trans = this.t();
    const url = `${BASE_URL}/${this.lang()}/faq`;
    this.titleService.setTitle(trans.faqMetaTitle);
    this.metaService.updateTag({ name: 'description', content: trans.faqMetaDescription });
    this.metaService.updateTag({ property: 'og:title', content: trans.faqMetaTitle });
    this.metaService.updateTag({ property: 'og:description', content: trans.faqMetaDescription });
    this.metaService.updateTag({ property: 'og:url', content: url });

    const all = this.c().categories.flatMap((cat) => cat.items);
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          url,
          inLanguage: this.lang(),
          mainEntity: all.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: trans.home, item: `${BASE_URL}/${this.lang()}` },
            { '@type': 'ListItem', position: 2, name: this.c().h1, item: url },
          ],
        },
      ],
    };
    this.schemaEl?.remove();
    this.schemaEl = this.document.createElement('script');
    this.schemaEl.type = 'application/ld+json';
    this.schemaEl.text = JSON.stringify(schema);
    this.document.head.appendChild(this.schemaEl);
  });

  ngOnDestroy(): void {
    this.schemaEl?.remove();
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
