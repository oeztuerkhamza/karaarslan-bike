import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { PurchaseService } from '../../services/purchase.service';
import { SaleService } from '../../services/sale.service';
import { Dashboard } from '../../models/models';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Loading State -->
    <div
      class="dashboard-loading"
      *ngIf="loading"
      role="status"
      aria-label="Laden..."
    >
      <div class="skeleton-header">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-subtitle"></div>
      </div>
      <div class="skeleton-grid">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>
      <div class="skeleton-sections">
        <div class="skeleton skeleton-table"></div>
        <div class="skeleton skeleton-table"></div>
      </div>
    </div>

    <div class="dashboard" *ngIf="!loading && data" role="main">
      <div class="page-header">
        <div>
          <h1>{{ t.dashboard }}</h1>
          <p class="page-subtitle">{{ t.welcomeToBikeHaus }}</p>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card kpi-highlight">
          <div class="kpi-top">
            <span class="kpi-label">{{ t.available }}</span>
            <span class="kpi-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path
                  d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"
                />
              </svg>
            </span>
          </div>
          <div class="kpi-value">{{ data.availableBicycles }}</div>
          <div class="kpi-meta">
            {{ data.totalBicycles }} {{ t.totalBicycles }}
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">{{ t.sold }}</span>
            <span class="kpi-icon kpi-icon-success">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </div>
          <div class="kpi-value">{{ data.soldBicycles }}</div>
          <div class="kpi-meta">{{ data.totalSales }} {{ t.sales }}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">{{ t.totalSales }}</span>
            <span class="kpi-icon kpi-icon-info">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </span>
          </div>
          <div class="kpi-value">
            {{ data.totalSaleAmount | number: '1.0-0' }} <small>€</small>
          </div>
          <div class="kpi-meta">
            {{ t.totalPurchases }}:
            {{ data.totalPurchaseAmount | number: '1.0-0' }} €
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">{{ t.profit }}</span>
            <span
              class="kpi-icon"
              [class.kpi-icon-success]="data.profit >= 0"
              [class.kpi-icon-danger]="data.profit < 0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
          </div>
          <div
            class="kpi-value"
            [class.positive]="data.profit >= 0"
            [class.negative]="data.profit < 0"
          >
            {{ data.profit | number: '1.0-0' }} <small>€</small>
          </div>
          <div class="kpi-meta">{{ t.totalSales }} − {{ t.totalPurchases }}</div>
        </div>
      </div>

      <div class="shortcuts-grid">
        <a routerLink="/purchases/new" class="shortcut-card card-accent">
          <div class="shortcut-icon-wrap accent-primary">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path
                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              />
            </svg>
          </div>
          <div class="shortcut-info">
            <div class="shortcut-label">{{ t.newPurchase }}</div>
            <div class="shortcut-desc">{{ t.buyBicycle }}</div>
          </div>
          <svg
            class="shortcut-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
        <a
          routerLink="/purchases/new"
          [queryParams]="{ bulk: 'true' }"
          class="shortcut-card card-accent"
        >
          <div class="shortcut-icon-wrap accent-violet">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              <path d="M6 11h4" />
              <path d="M14 11h4" />
            </svg>
          </div>
          <div class="shortcut-info">
            <div class="shortcut-label">{{ t.bulkPurchase }}</div>
            <div class="shortcut-desc">{{ t.bulkPurchaseDesc }}</div>
          </div>
          <svg
            class="shortcut-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
        <a routerLink="/sales/new" class="shortcut-card card-accent">
          <div class="shortcut-icon-wrap accent-success">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div class="shortcut-info">
            <div class="shortcut-label">{{ t.newSale }}</div>
            <div class="shortcut-desc">{{ t.sellBicycle }}</div>
          </div>
          <svg
            class="shortcut-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
        <a
          routerLink="/sales/new"
          [queryParams]="{ accessoryOnly: 'true' }"
          class="shortcut-card card-accent"
        >
          <div class="shortcut-icon-wrap accent-amber">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </div>
          <div class="shortcut-info">
            <div class="shortcut-label">Zubehörverkauf</div>
            <div class="shortcut-desc">Nur Zubehör ohne Fahrrad</div>
          </div>
          <svg
            class="shortcut-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
        <a routerLink="/renovation-costs" class="shortcut-card card-accent">
          <div class="shortcut-icon-wrap accent-rose">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div class="shortcut-info">
            <div class="shortcut-label">Renovierung Kosten</div>
            <div class="shortcut-desc">Renovierungskosten erfassen</div>
          </div>
          <svg
            class="shortcut-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>

      <div class="recent-sections">
        <div class="recent-section">
          <div class="section-header">
            <h2>{{ t.recentPurchases }}</h2>
            <a routerLink="/purchases" class="view-all"
              >{{ t.viewAll }}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
          <div
            class="table-wrap"
            *ngIf="data.recentPurchases.length; else noPurchases"
          >
            <table>
              <thead>
                <tr>
                  <th>{{ t.receiptNo }}</th>
                  <th>{{ t.bicycle }}</th>
                  <th>{{ t.seller }}</th>
                  <th>{{ t.price }}</th>
                  <th>{{ t.date }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let p of data.recentPurchases"
                  class="clickable-row"
                  (click)="showPurchaseMenu($event, p.id)"
                >
                  <td>
                    <span class="badge-mono">{{ p.belegNummer }}</span>
                  </td>
                  <td>{{ p.bikeInfo }}</td>
                  <td>{{ p.sellerName }}</td>
                  <td class="price">{{ p.preis | number: '1.2-2' }} €</td>
                  <td class="date">{{ p.kaufdatum | date: 'dd.MM.yyyy' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noPurchases>
            <div class="empty-state">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
              <p>{{ t.noPurchasesFound }}</p>
            </div>
          </ng-template>
        </div>

        <div class="recent-section">
          <div class="section-header">
            <h2>{{ t.recentSales }}</h2>
            <a routerLink="/sales" class="view-all"
              >{{ t.viewAll }}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
          <div class="table-wrap" *ngIf="data.recentSales.length; else noSales">
            <table>
              <thead>
                <tr>
                  <th>{{ t.receiptNo }}</th>
                  <th>{{ t.bicycle }}</th>
                  <th>{{ t.buyer }}</th>
                  <th>{{ t.price }}</th>
                  <th>{{ t.date }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let s of data.recentSales"
                  class="clickable-row"
                  (click)="showSaleMenu($event, s.id)"
                >
                  <td>
                    <span class="badge-mono">{{ s.belegNummer }}</span>
                  </td>
                  <td>{{ s.bikeInfo }}</td>
                  <td>{{ s.buyerName }}</td>
                  <td class="price">
                    {{ s.gesamtbetrag | number: '1.2-2' }} €
                  </td>
                  <td class="date">
                    {{ s.verkaufsdatum | date: 'dd.MM.yyyy' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noSales>
            <div class="empty-state">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <p>{{ t.noSalesFound }}</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>

    <!-- Context Menu -->
    <div
      class="context-menu"
      *ngIf="contextMenu.visible"
      [style.top.px]="contextMenu.y"
      [style.left.px]="contextMenu.x"
    >
      <button (click)="printDocument()">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path
            d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
          ></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        {{ t.printDocument }}
      </button>
      <button (click)="editDocument()">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          ></path>
          <path
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          ></path>
        </svg>
        {{ t.editDocument }}
      </button>
    </div>
    <div
      class="context-menu-backdrop"
      *ngIf="contextMenu.visible"
      (click)="closeMenu()"
    ></div>
  `,
  styles: [
    `
      /* ── Skeleton Loading ── */
      .dashboard-loading {
        max-width: 1280px;
        margin: 0 auto;
        padding: 24px;
      }
      .skeleton {
        background: linear-gradient(
          90deg,
          var(--bg-card) 25%,
          var(--border-light) 50%,
          var(--bg-card) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-md, 8px);
      }
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      .skeleton-header {
        margin-bottom: 28px;
      }
      .skeleton-title {
        height: 32px;
        width: 180px;
        margin-bottom: 8px;
      }
      .skeleton-subtitle {
        height: 18px;
        width: 240px;
      }
      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 14px;
        margin-bottom: 36px;
      }
      .skeleton-card {
        height: 80px;
      }
      .skeleton-sections {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
      .skeleton-table {
        height: 300px;
      }
      @media (max-width: 900px) {
        .skeleton-sections {
          grid-template-columns: 1fr;
        }
      }

      .dashboard {
        max-width: 1280px;
        margin: 0 auto;
        animation: fadeIn 0.4s ease;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .page-header {
        margin-bottom: 24px;
      }
      .page-header h1 {
        font-size: 1.85rem;
        font-weight: 800;
        color: var(--text-heading);
        letter-spacing: -0.02em;
        margin: 0;
      }
      .page-subtitle {
        font-size: 0.88rem;
        color: var(--text-muted);
        margin-top: 4px;
      }

      /* ── Shortcut Grid ── */
      /* ── KPI Cards ── */
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }
      .kpi-card {
        position: relative;
        padding: 18px 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg, 16px);
        box-shadow: var(--shadow-xs);
        overflow: hidden;
      }
      .kpi-highlight {
        background:
          radial-gradient(
            120% 120% at 100% 0%,
            rgba(255, 122, 69, 0.45) 0%,
            transparent 60%
          ),
          linear-gradient(140deg, #18181b 0%, #0b0b0d 100%);
        border-color: rgba(255, 87, 34, 0.35);
        color: #fff;
      }
      .kpi-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .kpi-label {
        font-size: 0.74rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
      }
      .kpi-highlight .kpi-label {
        color: rgba(255, 255, 255, 0.65);
      }
      .kpi-icon {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--accent-primary-light);
        color: var(--accent-primary);
        flex-shrink: 0;
      }
      .kpi-highlight .kpi-icon {
        background: linear-gradient(135deg, #ff7a45, #e64a19);
        color: #fff;
        box-shadow: 0 6px 16px -4px rgba(255, 87, 34, 0.6);
      }
      .kpi-icon-success {
        background: var(--accent-success-light);
        color: var(--accent-success);
      }
      .kpi-icon-info {
        background: rgba(6, 182, 212, 0.1);
        color: var(--accent-info);
      }
      .kpi-icon-danger {
        background: var(--accent-danger-light);
        color: var(--accent-danger);
      }
      .kpi-value {
        margin-top: 10px;
        font-size: 1.9rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.1;
        color: var(--text-heading);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .kpi-value small {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-muted);
      }
      .kpi-highlight .kpi-value {
        color: #fff;
      }
      .kpi-value.positive {
        color: var(--accent-success);
      }
      .kpi-value.negative {
        color: var(--accent-danger);
      }
      .kpi-meta {
        margin-top: 6px;
        font-size: 0.78rem;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .kpi-highlight .kpi-meta {
        color: rgba(255, 255, 255, 0.6);
      }
      @media (max-width: 1100px) {
        .kpi-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .kpi-grid {
          gap: 10px;
        }
        .kpi-card {
          padding: 14px 16px;
        }
        .kpi-value {
          font-size: 1.45rem;
        }
      }

      /* ── Shortcut Grid ── */
      .shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 28px;
      }
      @media (max-width: 1280px) {
        .shortcuts-grid {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }
      }
      .shortcut-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg, 14px);
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .shortcut-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          transparent 60%,
          rgba(230, 74, 25, 0.03) 100%
        );
        pointer-events: none;
      }
      .shortcut-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.08));
        border-color: rgba(230, 74, 25, 0.35);
        text-decoration: none;
        color: var(--text-primary);
      }
      .shortcut-card.card-accent {
        border-color: var(--border-light);
      }
      .shortcut-card.card-accent::before {
        background: none;
      }

      .shortcut-icon-wrap {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .accent-primary {
        background: rgba(230, 74, 25, 0.1);
        color: #e64a19;
      }
      .accent-success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      .accent-info {
        background: rgba(6, 182, 212, 0.1);
        color: #06b6d4;
      }
      .accent-warning {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
      .accent-violet {
        background: rgba(139, 92, 246, 0.1);
        color: #8b5cf6;
      }
      .accent-emerald {
        background: rgba(52, 211, 153, 0.1);
        color: #34d399;
      }
      .accent-sky {
        background: rgba(56, 189, 248, 0.1);
        color: #38bdf8;
      }
      .accent-rose {
        background: rgba(244, 63, 94, 0.1);
        color: #f43f5e;
      }
      .accent-amber {
        background: rgba(251, 191, 36, 0.1);
        color: #fbbf24;
      }
      .accent-slate {
        background: rgba(100, 116, 139, 0.1);
        color: #64748b;
      }

      .shortcut-info {
        flex: 1;
        min-width: 0;
      }
      .shortcut-label {
        font-size: 0.88rem;
        font-weight: 650;
        color: var(--text-heading);
      }
      .shortcut-desc {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 2px;
        line-height: 1.4;
      }
      .shortcut-arrow {
        position: absolute;
        top: 18px;
        right: 16px;
        color: var(--accent-primary);
        opacity: 0;
        transform: translateX(-4px);
        transition: all 0.2s;
        flex-shrink: 0;
      }
      .shortcut-card:hover .shortcut-arrow {
        opacity: 1;
        transform: translateX(0);
      }

      /* ── Recent Sections ── */
      .recent-sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 32px;
      }
      @media (max-width: 900px) {
        .recent-sections {
          grid-template-columns: 1fr;
        }
      }

      .recent-section {
        background: var(--bg-card);
        border-radius: var(--radius-lg, 14px);
        border: 1px solid var(--border-light);
        box-shadow: var(--shadow-xs);
        padding: 0;
        overflow: hidden;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 22px;
        border-bottom: 1px solid var(--border-light);
      }
      .section-header h2 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-heading);
        margin: 0;
      }
      .view-all {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--accent-primary);
        text-decoration: none;
        transition: gap 0.2s;
      }
      .view-all:hover {
        gap: 6px;
        text-decoration: none;
      }

      .table-wrap {
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.84rem;
      }
      th {
        text-align: left;
        white-space: nowrap;
        padding: 10px 18px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        background: var(--table-stripe, #f8fafc);
        border-bottom: 1px solid var(--border-light);
      }
      td {
        padding: 12px 18px;
        border-bottom: 1px solid var(--border-light);
        color: var(--text-secondary);
      }
      tbody tr:last-child td {
        border-bottom: none;
      }
      .clickable-row {
        cursor: pointer;
        transition: background-color 0.15s;
      }
      .clickable-row:hover {
        background-color: var(--table-hover, #f1f5f9);
      }
      .badge-mono {
        display: inline-block;
        padding: 2px 8px;
        background: var(--accent-primary-light, rgba(230, 74, 25, 0.08));
        color: var(--accent-primary);
        border-radius: 6px;
        font-size: 0.78rem;
        font-weight: 600;
        font-family: 'SF Mono', 'Consolas', monospace;
        white-space: nowrap;
      }
      .price {
        font-weight: 650;
        color: var(--text-heading);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .date {
        color: var(--text-muted);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 40px 20px;
        color: var(--text-muted);
      }
      .empty-state svg {
        opacity: 0.3;
      }
      .empty-state p {
        font-size: 0.88rem;
        font-style: italic;
      }

      @media (max-width: 600px) {
        .shortcuts-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .shortcut-card {
          padding: 14px;
        }
      }

      .action-cell {
        text-align: center;
        display: flex;
        gap: 4px;
        justify-content: center;
      }
      .btn-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        border: none;
        background: var(--accent-primary-light, rgba(230, 74, 25, 0.08));
        color: var(--accent-primary, #e64a19);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-icon:hover {
        background: var(--accent-primary, #e64a19);
        color: white;
        transform: scale(1.05);
      }

      .context-menu-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
      }

      .context-menu {
        position: fixed;
        z-index: 1000;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        min-width: 190px;
        padding: 6px;
        overflow: hidden;
        animation: menuFadeIn 0.15s ease;
      }

      @keyframes menuFadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .context-menu button {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 10px 12px;
        border: none;
        border-radius: 8px;
        background: none;
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.86rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
        text-align: left;
      }

      .context-menu button:hover {
        background: var(--accent-primary-light);
      }

      .context-menu button svg {
        color: var(--accent-primary, #e64a19);
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private translationService = inject(TranslationService);
  private purchaseService = inject(PurchaseService);
  private saleService = inject(SaleService);

  get t() {
    return this.translationService.translations();
  }

  data: Dashboard | null = null;

  contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    type: '' as 'purchase' | 'sale',
    id: 0,
  };
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.dashboardService.getDashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  showPurchaseMenu(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.contextMenu = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      type: 'purchase',
      id,
    };
  }

  showSaleMenu(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.contextMenu = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      type: 'sale',
      id,
    };
  }

  closeMenu() {
    this.contextMenu.visible = false;
  }

  printDocument() {
    const id = this.contextMenu.id;
    this.closeMenu();
    if (this.contextMenu.type === 'purchase') {
      this.previewPurchasePdf(id);
    } else {
      this.previewSalePdf(id);
    }
  }

  editDocument() {
    const id = this.contextMenu.id;
    const type = this.contextMenu.type;
    this.closeMenu();
    if (type === 'purchase') {
      this.router.navigate(['/purchases/edit', id]);
    } else {
      this.router.navigate(['/sales/edit', id]);
    }
  }

  downloadPurchasePdf(id: number, belegNr: string | undefined) {
    this.purchaseService.downloadKaufbeleg(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kaufbeleg_${belegNr || id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadSalePdf(id: number, belegNr: string | undefined) {
    this.saleService.downloadVerkaufsbeleg(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Verkaufsbeleg_${belegNr || id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  previewPurchasePdf(id: number) {
    this.purchaseService.downloadKaufbeleg(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  previewSalePdf(id: number) {
    this.saleService.downloadVerkaufsbeleg(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

}
