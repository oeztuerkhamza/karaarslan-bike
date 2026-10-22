import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/models';

/**
 * Search box for existing customers. Emits the chosen customer so a form
 * can prefill its name/address fields instead of retyping them.
 */
@Component({
  selector: 'app-customer-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="picker">
      <svg
        class="picker-icon"
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
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        [placeholder]="placeholder"
        [(ngModel)]="term"
        (ngModelChange)="search$.next($event)"
        (focus)="open = results.length > 0"
        (blur)="close()"
        (keydown)="onKeydown($event)"
        autocomplete="off"
        aria-label="Kunde suchen"
      />
      <div class="picker-dropdown" *ngIf="open">
        <button
          type="button"
          class="picker-item"
          *ngFor="let c of results; let i = index"
          [class.active]="i === activeIndex"
          (mousedown)="select(c)"
        >
          <span class="picker-avatar">{{ initials(c) }}</span>
          <span class="picker-text">
            <span class="picker-name">{{ c.vorname }} {{ c.nachname }}</span>
            <span class="picker-sub">
              {{ c.fullAddress || [c.plz, c.stadt].join(' ') }}
              <ng-container *ngIf="c.telefon"> · {{ c.telefon }}</ng-container>
            </span>
          </span>
        </button>
      </div>
      <div class="picker-empty" *ngIf="noResults">
        Kein Kunde gefunden – Daten unten einfach neu eingeben.
      </div>
    </div>
  `,
  styles: [
    `
      .picker {
        position: relative;
      }
      .picker-icon {
        position: absolute;
        left: 13px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
        pointer-events: none;
      }
      input {
        width: 100%;
        padding-left: 38px;
      }
      .picker-dropdown {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        z-index: 50;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-xl);
        padding: 6px;
        max-height: 300px;
        overflow-y: auto;
      }
      .picker-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 8px 10px;
        border: none;
        border-radius: 8px;
        background: none;
        cursor: pointer;
        text-align: left;
        font-family: inherit;
        color: var(--text-primary);
      }
      .picker-item:hover,
      .picker-item.active {
        background: var(--accent-primary-light);
      }
      .picker-avatar {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: var(--accent-primary-light);
        color: var(--accent-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.72rem;
        font-weight: 700;
        flex-shrink: 0;
      }
      .picker-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .picker-name {
        font-size: 0.88rem;
        font-weight: 600;
      }
      .picker-sub {
        font-size: 0.76rem;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .picker-empty {
        margin-top: 6px;
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    `,
  ],
})
export class CustomerPickerComponent implements OnDestroy {
  @Input() placeholder = 'Name, Telefon oder E-Mail suchen…';
  @Output() customerSelected = new EventEmitter<Customer>();

  term = '';
  results: Customer[] = [];
  open = false;
  noResults = false;
  activeIndex = -1;
  search$ = new Subject<string>();
  private sub: Subscription;

  constructor(private customerService: CustomerService) {
    this.sub = this.search$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((value) => {
          const words = (value || '').trim().toLowerCase().split(/\s+/);
          if (!words[0] || words.join(' ').length < 2) return of([]);
          // The API matches one term against single fields, so query with the
          // first word and narrow down by the remaining words here.
          return this.customerService.search(words[0]).pipe(
            catchError(() => of([] as Customer[])),
            switchMap((list) =>
              of(
                list.filter((c) => {
                  const hay = [c.vorname, c.nachname, c.telefon, c.email]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                  return words.every((w) => hay.includes(w));
                }),
              ),
            ),
          );
        }),
      )
      .subscribe((list) => {
        this.results = list;
        this.activeIndex = list.length ? 0 : -1;
        this.open = list.length > 0;
        this.noResults = list.length === 0 && this.term.trim().length >= 2;
      });
  }

  initials(c: Customer): string {
    return ((c.vorname?.[0] || '') + (c.nachname?.[0] || '')).toUpperCase();
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.open) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.results.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex =
        (this.activeIndex - 1 + this.results.length) % this.results.length;
    } else if (event.key === 'Enter' && this.activeIndex >= 0) {
      event.preventDefault();
      this.select(this.results[this.activeIndex]);
    } else if (event.key === 'Escape') {
      this.open = false;
    }
  }

  select(customer: Customer) {
    this.customerSelected.emit(customer);
    this.term = '';
    this.search$.next('');
    this.results = [];
    this.open = false;
    this.noResults = false;
  }

  close() {
    // Delay so a mousedown on an item is handled first
    setTimeout(() => (this.open = false), 150);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
