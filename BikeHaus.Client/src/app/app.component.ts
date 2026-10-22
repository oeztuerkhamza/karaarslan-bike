import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from './services/translation.service';
import { AuthService } from './services/auth.service';
import { SettingsService, ShopSettings } from './services/settings.service';
import { ThemeService } from './services/theme.service';
import { PurchaseService } from './services/purchase.service';
import { NotificationComponent } from './components/notification/notification.component';
import { DialogComponent } from './components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationComponent,
    DialogComponent,
  ],
  template: `
    <!-- Login page: no sidebar -->
    <ng-container *ngIf="!authService.isLoggedIn()">
      <router-outlet></router-outlet>
    </ng-container>

    <!-- Authenti cated layout -->
    <div class="app-layout" *ngIf="authService.isLoggedIn()">
      <!-- Skip Link für Barrierefreiheit -->
      <a href="#main-content" class="skip-link">{{ t.skipToMain }}</a>

      <aside
        class="sidebar"
        [class.open]="sidebarOpen"
        role="complementary"
        aria-label="Hauptnavigation"
      >
        <div class="brand">
          <div class="brand-icon-wrap">
            <img
              [src]="logoSrc()"
              alt="Karaarslan Bike Logo"
              class="brand-logo"
              [class.no-filter]="hasCustomLogo()"
            />
          </div>
          <div class="brand-info">
            <span class="brand-name">Karaarslan Bike</span>
            <span class="brand-sub">Lünen</span>
          </div>
        </div>

        <div class="nav-section-label" id="menu-label">Menu</div>
        <nav role="navigation" aria-labelledby="menu-label">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            <span class="nav-label">{{ t.dashboard }}</span>
          </a>
          <a
            routerLink="/bicycles"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
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
            <span class="nav-label">{{ t.bicycles }}</span>
          </a>
          <a
            routerLink="/neue-fahrraeder"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
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
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="10" y1="4" x2="14" y2="4" />
              </svg>
            </span>
            <span class="nav-label">{{ t.neueFahrraeder }}</span>
          </a>
          <a
            routerLink="/homepage-accessories"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span class="nav-label">{{ t.homepageAccessories }}</span>
          </a>

          <div class="nav-divider"></div>
          <div class="nav-section-label">Transaktionen</div>

          <a
            routerLink="/purchases"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span class="nav-label">{{ t.purchases }}</span>
            <span class="nav-badge" *ngIf="missingPurchasesCount() > 0">{{
              missingPurchasesCount()
            }}</span>
          </a>
          <a
            routerLink="/sales"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
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
            <span class="nav-label">{{ t.sales }}</span>
          </a>
          <a
            routerLink="/returns"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </span>
            <span class="nav-label">{{ t.returns }}</span>
          </a>

          <div class="nav-divider"></div>
          <div class="nav-section-label">Extras</div>

          <a
            routerLink="/labels"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </span>
            <span class="nav-label">Etiketten</span>
          </a>
          <a
            routerLink="/parts"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                />
              </svg>
            </span>
            <span class="nav-label">Zubehör</span>
          </a>
          <a
            routerLink="/expenses"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </span>
            <span class="nav-label">{{ t.expenses }}</span>
          </a>
          <a
            routerLink="/invoices"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <span class="nav-label">{{ t.invoices }}</span>
          </a>
          <a
            routerLink="/export"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </span>
            <span class="nav-label">{{ t.exportDocuments }}</span>
          </a>
          <a
            routerLink="/statistics"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </span>
            <span class="nav-label">{{ t.statistics }}</span>
          </a>
          <a
            routerLink="/archive"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 8v13H3V8" />
                <path d="M1 3h22v5H1z" />
                <path d="M10 12h4" />
              </svg>
            </span>
            <span class="nav-label">{{ t.archive }}</span>
          </a>
          <a
            routerLink="/email-kampagne"
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <span class="nav-label">E-Mail Kampagne</span>
          </a>
          <div class="nav-spacer"></div>
          <a
            routerLink="/settings"
            routerLinkActive="active"
            (click)="closeSidebar()"
            class="nav-settings"
          >
            <span class="nav-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                />
              </svg>
            </span>
            <span class="nav-label">{{ t.settings }}</span>
          </a>
        </nav>
      </aside>

      <div
        class="sidebar-overlay"
        *ngIf="sidebarOpen"
        (click)="closeSidebar()"
        role="button"
        aria-label="Menü schließen"
      ></div>

      <main id="main-content" class="main-content" role="main">
        <header class="topbar" role="banner">
          <button
            class="menu-toggle"
            (click)="sidebarOpen = !sidebarOpen"
            [attr.aria-expanded]="sidebarOpen"
            aria-controls="sidebar"
            aria-label="Menü öffnen/schließen"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <img
            [src]="logoSrc()"
            alt="Karaarslan Bike"
            class="topbar-logo"
            [class.no-filter]="hasCustomLogo()"
          />
          <div class="topbar-date">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{{ todayLabel() }}</span>
          </div>
          <div class="topbar-spacer"></div>
          <div class="topbar-right">
            <button
              class="btn-theme-toggle"
              (click)="themeService.toggleTheme()"
              [title]="
                themeService.currentTheme() === 'dark'
                  ? t.darkMode + ' (An)'
                  : t.darkMode + ' (Aus)'
              "
            >
              <!-- Sun icon for dark mode (click to go light) -->
              <svg
                *ngIf="themeService.currentTheme() === 'dark'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <!-- Moon icon for light mode (click to go dark) -->
              <svg
                *ngIf="themeService.currentTheme() === 'light'"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
            <div
              class="user-info"
              (click)="userMenuOpen = !userMenuOpen"
              [class.open]="userMenuOpen"
            >
              <div class="user-avatar">{{ getInitials() }}</div>
              <span class="user-name">{{ ownerDisplayName() }}</span>
              <button
                type="button"
                class="btn-logout"
                (click)="onLogoutClick($event)"
                title="Abmelden"
                aria-label="Abmelden"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
              <div
                class="user-dropdown"
                *ngIf="userMenuOpen"
                (click)="$event.stopPropagation()"
              >
                <button
                  type="button"
                  class="dropdown-item dropdown-logout"
                  (click)="onLogoutClick($event)"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </header>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>

    <!-- Global Notification & Dialog -->
    <app-notification></app-notification>
    <app-dialog></app-dialog>
  `,
  styles: [
    `
      /* 100vh on iOS Safari is taller than the visible area (it ignores the
         browser toolbar), which hid the bottom of the page. dvh follows the
         toolbar; 100vh stays as fallback for older browsers. */
      :host {
        display: block;
        height: 100vh;
        height: 100dvh;
      }

      /* ══ SKIP LINK (Barrierefreiheit) ══ */
      .skip-link {
        position: absolute;
        top: -100px;
        left: 16px;
        padding: 12px 24px;
        background: var(--accent-primary);
        color: #fff;
        text-decoration: none;
        font-weight: 600;
        border-radius: 8px;
        z-index: 9999;
        transition: top 0.2s ease;
      }
      .skip-link:focus {
        top: 16px;
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
      }

      .app-layout {
        display: flex;
        height: 100%;
      }

      /* ══ SIDEBAR ══ */
      .sidebar {
        width: 256px;
        min-width: 256px;
        background: var(--sidebar-bg);
        color: var(--text-sidebar);
        display: flex;
        flex-direction: column;
        transition: transform var(--transition-smooth, 0.35s);
        border-right: 1px solid rgba(255, 255, 255, 0.06);
        z-index: 100;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 22px 20px 18px;
      }
      .brand-icon-wrap {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: linear-gradient(135deg, #ff7a45 0%, #ff5722 50%, #e64a19 100%);
        box-shadow:
          0 6px 18px -4px rgba(255, 87, 34, 0.55),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .brand-logo {
        width: 26px;
        height: 26px;
        object-fit: contain;
        filter: brightness(0) invert(1);
      }
      .brand-logo.no-filter {
        filter: none;
      }
      .brand-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .brand-name {
        font-weight: 800;
        font-size: 1.08rem;
        letter-spacing: -0.02em;
        line-height: 1.2;
        white-space: nowrap;
      }
      .brand-sub {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.66rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.45);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        margin-top: 2px;
      }
      .brand-sub::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ff5722;
        box-shadow: 0 0 8px #ff5722;
      }

      .nav-section-label {
        padding: 14px 22px 6px;
        font-size: 0.64rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: rgba(255, 255, 255, 0.32);
      }

      .nav-divider {
        margin: 8px 22px 2px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }

      nav {
        flex: 1;
        padding: 0 0 12px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
      }
      nav::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
      }
      nav a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 10px;
        margin: 0 12px;
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.86rem;
        font-weight: 500;
        border-radius: 10px;
        border: 1px solid transparent;
        transition:
          color 0.18s ease,
          background 0.18s ease,
          border-color 0.18s ease;
        position: relative;
      }
      nav a:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
        text-decoration: none;
      }
      nav a.active {
        color: #fff;
        background: linear-gradient(
          90deg,
          rgba(255, 87, 34, 0.2) 0%,
          rgba(255, 87, 34, 0.06) 100%
        );
        border-color: rgba(255, 87, 34, 0.22);
        font-weight: 600;
      }
      nav a.active::before {
        content: '';
        position: absolute;
        left: -12px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 22px;
        background: #ff5722;
        border-radius: 0 4px 4px 0;
        box-shadow: 0 0 12px rgba(255, 87, 34, 0.8);
      }
      .nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        opacity: 0.85;
        flex-shrink: 0;
        transition:
          background 0.18s ease,
          color 0.18s ease;
      }
      .nav-icon svg {
        width: 18px;
        height: 18px;
      }
      nav a:hover .nav-icon {
        opacity: 1;
      }
      nav a.active .nav-icon {
        opacity: 1;
        color: #fff;
        background: linear-gradient(135deg, #ff7a45, #e64a19);
        box-shadow: 0 4px 12px -2px rgba(255, 87, 34, 0.5);
      }
      .nav-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .nav-badge {
        margin-left: auto;
        background: #ff5722;
        color: #fff;
        font-size: 0.68rem;
        font-weight: 700;
        min-width: 20px;
        height: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        line-height: 1;
        box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.18);
      }

      .nav-spacer {
        flex: 1;
        min-height: 18px;
      }
      nav .nav-settings::after {
        content: '';
        position: absolute;
        left: 10px;
        right: 10px;
        top: -9px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }

      /* ══ MAIN ══ */
      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-width: 0;
      }

      /* ══ TOPBAR ══ */
      .topbar {
        padding: 0 32px;
        height: 64px;
        background: color-mix(in srgb, var(--bg-secondary) 85%, transparent);
        backdrop-filter: saturate(180%) blur(12px);
        border-bottom: 1px solid var(--border-light);
        display: flex;
        align-items: center;
        gap: 16px;
        transition: background var(--transition-smooth, 0.35s);
        position: relative;
        z-index: 10;
      }
      .topbar-logo {
        width: 30px;
        height: 30px;
        display: none;
      }
      .topbar-date {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        background: var(--bg-primary);
        border: 1px solid var(--border-light);
        color: var(--text-secondary);
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
      }
      .topbar-date svg {
        color: var(--accent-primary);
      }
      .menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        color: var(--text-secondary);
        border-radius: 8px;
        transition: all 0.15s;
      }
      .menu-toggle:hover {
        background: var(--accent-primary-light);
        color: var(--accent-primary);
      }

      .topbar-spacer {
        flex: 1;
      }

      .topbar-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        cursor: pointer;
        padding: 4px 4px 4px 4px;
        border-radius: 12px;
        border: 1px solid transparent;
        transition:
          background 0.15s,
          border-color 0.15s;
      }
      .user-info:hover,
      .user-info.open {
        background: var(--bg-primary);
        border-color: var(--border-light);
      }
      .user-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        min-width: 180px;
        z-index: 200;
        overflow: hidden;
        padding: 6px;
        animation: scaleIn 0.15s ease both;
        transform-origin: top right;
      }
      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 10px 12px;
        background: none;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.86rem;
        font-weight: 500;
        color: var(--text-primary);
        transition: background 0.15s;
        text-align: left;
      }
      .dropdown-logout {
        color: var(--accent-danger);
      }
      .dropdown-logout:hover {
        background: var(--accent-danger-light);
      }
      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: var(--accent-gradient);
        box-shadow: 0 4px 12px -4px var(--accent-glow);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .user-name {
        font-size: 0.86rem;
        font-weight: 600;
        color: var(--text-heading);
      }

      .btn-theme-toggle,
      .btn-logout {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        padding: 0;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.2s;
      }
      .btn-theme-toggle svg,
      .btn-logout svg {
        width: 18px;
        height: 18px;
      }
      .btn-theme-toggle:hover {
        background: var(--accent-primary-light);
        border-color: var(--accent-primary);
        color: var(--accent-primary);
      }
      .btn-logout {
        width: 34px;
        height: 34px;
      }
      .btn-logout svg {
        width: 16px;
        height: 16px;
      }
      .btn-logout:hover {
        background: var(--accent-danger-light);
        border-color: var(--accent-danger);
        color: var(--accent-danger);
      }

      /* ══ CONTENT ══ */
      .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 32px;
        background: var(--bg-primary);
        transition: background var(--transition-smooth, 0.35s);
      }

      .sidebar-overlay {
        display: none;
      }

      @media (max-width: 768px) {
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          transform: translateX(-100%);
          box-shadow: none;
        }
        .sidebar.open {
          transform: translateX(0);
          box-shadow: 12px 0 40px rgba(0, 0, 0, 0.4);
        }
        .topbar {
          padding: 0 16px;
          gap: 10px;
        }
        .menu-toggle {
          display: flex;
        }
        .topbar-logo {
          display: block;
        }
        .topbar-date,
        .user-name {
          display: none;
        }
        .sidebar-overlay {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 99;
          backdrop-filter: blur(3px);
        }
        .content-area {
          padding: 20px 16px;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = 'BikeHaus.Client';
  sidebarOpen = false;
  userMenuOpen = false;
  private translationService = inject(TranslationService);
  private settingsService = inject(SettingsService);
  private purchaseService = inject(PurchaseService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  settings = signal<ShopSettings | null>(null);

  logoSrc = signal('assets/logo.svg');
  hasCustomLogo = signal(false);
  ownerDisplayName = signal('');
  missingPurchasesCount = signal(0);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadSettings();
      this.loadMissingPurchasesCount();
    }
  }

  private loadMissingPurchasesCount(): void {
    this.purchaseService.getMissingSalesCount().subscribe({
      next: (res) => this.missingPurchasesCount.set(res.count),
      error: () => {},
    });
  }

  private loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.settings.set(settings);

        // Set logo
        if (settings.logoBase64) {
          this.logoSrc.set(settings.logoBase64);
          this.hasCustomLogo.set(true);
          this.updateFavicon(settings.logoBase64);
        }

        // Set owner name
        const ownerName = [settings.inhaberVorname, settings.inhaberNachname]
          .filter(Boolean)
          .join(' ');
        this.ownerDisplayName.set(ownerName || this.authService.displayName());
      },
      error: () => {
        this.ownerDisplayName.set(this.authService.displayName());
      },
    });
  }

  private updateFavicon(base64: string): void {
    const link =
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
      document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = base64;
    document.head.appendChild(link);
  }

  get t() {
    return this.translationService.translations();
  }

  todayLabel(): string {
    const locale =
      this.translationService.currentLanguage() === 'tr' ? 'tr-TR' : 'de-DE';
    return new Date().toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getInitials(): string {
    const name = this.ownerDisplayName() || this.authService.displayName();
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.userMenuOpen = false;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  onLogoutClick(event: MouseEvent) {
    event.stopPropagation();
    this.userMenuOpen = false;
    this.logout();
  }
}
