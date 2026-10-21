import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { BicycleService } from '../../services/bicycle.service';
import { PurchaseService } from '../../services/purchase.service';
import { SettingsService } from '../../services/settings.service';
import { TranslationService } from '../../services/translation.service';
import { NotificationService } from '../../services/notification.service';
import {
  Customer,
  SaleCreate,
  Bicycle,
  BicycleUpdate,
  BikeCondition,
  PaymentMethod,
  SignatureCreate,
  SaleAccessoryCreate,
  SalePaymentCreate,
  AccessoryCatalogList,
} from '../../models/models';
import { BikeSelectorComponent } from '../../components/bike-selector/bike-selector.component';
import { AccessoryAutocompleteComponent } from '../../components/accessory-autocomplete/accessory-autocomplete.component';
import { CustomerPickerComponent } from '../../components/customer-picker/customer-picker.component';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BikeSelectorComponent,
    AccessoryAutocompleteComponent,
    CustomerPickerComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>{{ t.newSaleTitle }}</h1>
        <div class="page-header-actions">
          <label
            class="checkbox-label accessory-toggle"
            [class.active]="isAccessoryOnly"
          >
            <input
              type="checkbox"
              [(ngModel)]="isAccessoryOnly"
              name="isAccessoryOnly"
              (ngModelChange)="onAccessoryOnlyChange()"
            />
            <span class="accessory-toggle-indicator">✓</span>
            <span>Nur Zubehörverkauf (ohne Fahrrad)</span>
          </label>
          <a routerLink="/sales" class="btn btn-outline">{{ t.back }}</a>
        </div>
      </div>

      <form (ngSubmit)="submit()" #f="ngForm">
        <div class="form-sections">
          <ng-container *ngIf="!isAccessoryOnly">
            <!-- Bicycle selection -->
            <div class="form-card">
              <h2>{{ t.selectBicycle }}</h2>
              <app-bike-selector
                [bikes]="availableBikes"
                [(selectedBike)]="selectedBike"
                [allowQuickAdd]="true"
                (bikeSelected)="onBikeSelected($event)"
                (quickAddRequested)="onQuickAddBike()"
              ></app-bike-selector>
            </div>

            <!-- Bicycle details edit form -->
            <div class="form-card" *ngIf="selectedBike">
              <div class="card-header-row">
                <h2>
                  <span *ngIf="isQuickAddMode" class="quick-add-badge"
                    >🆕 {{ t.newBicycle }}</span
                  >
                  <span *ngIf="!isQuickAddMode">{{ t.bicycleDetails }}</span>
                </h2>
              </div>
              <div class="form-grid">
                <!-- Rahmennummer first with autocomplete dropdown -->
                <div
                  class="field full rahmen-autocomplete-wrapper"
                  [class.field-error]="bikeErrors['rahmennummer']"
                >
                  <label>{{ t.frameNumber }} *</label>
                  <input
                    [(ngModel)]="bikeEdit.rahmennummer"
                    name="bikeRahmen"
                    (ngModelChange)="
                      bikeErrors['rahmennummer'] = false;
                      onRahmennummerChange($event)
                    "
                    (focus)="onRahmennummerChange(bikeEdit.rahmennummer)"
                    (blur)="hideRahmenDropdown()"
                    style="text-transform: uppercase"
                    placeholder="Rahmennummer eingeben..."
                    autocomplete="off"
                  />
                  <span class="error-msg" *ngIf="bikeErrors['rahmennummer']">{{
                    t.requiredField
                  }}</span>
                  <!-- Autocomplete dropdown -->
                  <div
                    class="rahmen-dropdown"
                    *ngIf="rahmenSearchResults.length > 0 && showRahmenDropdown"
                  >
                    <div
                      class="rahmen-dropdown-item"
                      *ngFor="let bike of rahmenSearchResults"
                      (mousedown)="selectRahmenBike(bike)"
                    >
                      <span class="rahmen-nr">{{ bike.rahmennummer }}</span>
                      <span class="rahmen-info"
                        >{{ bike.marke }} {{ bike.modell }}</span
                      >
                      <span
                        class="rahmen-badge"
                        *ngIf="bike.status === 'Available'"
                        >Verfügbar</span
                      >
                      <span
                        class="rahmen-badge sold"
                        *ngIf="bike.status === 'Sold'"
                        >Verkauft</span
                      >
                    </div>
                  </div>
                </div>
                <div class="field" [class.field-error]="bikeErrors['marke']">
                  <label>{{ t.brand }} *</label>
                  <input
                    [(ngModel)]="bikeEdit.marke"
                    name="bikeMarke"
                    list="brandList"
                    autocomplete="off"
                    (ngModelChange)="bikeErrors['marke'] = false"
                  />
                  <datalist id="brandList">
                    <option *ngFor="let b of brands" [value]="b"></option>
                  </datalist>
                  <span class="error-msg" *ngIf="bikeErrors['marke']">{{
                    t.requiredField
                  }}</span>
                </div>
                <div class="field">
                  <label>{{ t.model }}</label>
                  <input
                    [(ngModel)]="bikeEdit.modell"
                    name="bikeModell"
                    list="modelList"
                    autocomplete="off"
                  />
                  <datalist id="modelList">
                    <option *ngFor="let m of models" [value]="m"></option>
                  </datalist>
                </div>
                <div class="field">
                  <label>{{ t.frameSize }}</label>
                  <input
                    [(ngModel)]="bikeEdit.rahmengroesse"
                    name="bikeRahmengroesse"
                    placeholder="z.B. 52, 56, M, L"
                  />
                </div>
                <div class="field" [class.field-error]="bikeErrors['farbe']">
                  <label>{{ t.color }} *</label>
                  <div class="color-chips">
                    <button
                      type="button"
                      *ngFor="let c of colorOptions"
                      class="color-chip"
                      [class.selected]="
                        isColorSelected(bikeEdit.farbe, c.value)
                      "
                      [style.--chip-color]="c.hex"
                      (click)="
                        bikeEdit.farbe = toggleColor(bikeEdit.farbe, c.value);
                        bikeErrors['farbe'] = false
                      "
                    >
                      <span class="chip-dot"></span>
                      {{ c.label }}
                    </button>
                  </div>
                  <span class="error-msg" *ngIf="bikeErrors['farbe']">{{
                    t.requiredField
                  }}</span>
                </div>
                <div
                  class="field full"
                  [class.field-error]="bikeErrors['reifengroesse']"
                >
                  <label>{{ t.wheelSize }} *</label>
                  <span class="error-msg" *ngIf="bikeErrors['reifengroesse']">{{
                    t.requiredField
                  }}</span>
                  <div
                    class="chip-group"
                    role="radiogroup"
                    [attr.aria-label]="t.wheelSize"
                    [class.invalid]="bikeErrors['reifengroesse']"
                  >
                    <button
                      type="button"
                      class="chip"
                      *ngFor="let size of wheelSizes"
                      role="radio"
                      [attr.aria-checked]="bikeEdit.reifengroesse === size"
                      [class.selected]="bikeEdit.reifengroesse === size"
                      (click)="
                        bikeEdit.reifengroesse = size;
                        bikeErrors['reifengroesse'] = false
                      "
                    >
                      {{ size }}"
                    </button>
                  </div>
                </div>
                <div
                  class="field"
                  [class.field-error]="bikeErrors['fahrradtyp']"
                >
                  <label>{{ t.bicycleType }} *</label>
                  <span class="error-msg" *ngIf="bikeErrors['fahrradtyp']">{{
                    t.requiredField
                  }}</span>
                  <select
                    [(ngModel)]="bikeEdit.fahrradtyp"
                    name="bikeFahrradtyp"
                    (ngModelChange)="bikeErrors['fahrradtyp'] = false"
                  >
                    <option value="">-- {{ t.selectOption }} --</option>
                    <option value="E-Bike">E-Bike</option>
                    <option value="E-Trekking Pedelec">
                      E-Trekking Pedelec
                    </option>
                    <option value="Trekking">Trekking</option>
                    <option value="City">City</option>
                    <option value="MTB">Mountainbike (MTB)</option>
                    <option value="Rennrad">Rennrad</option>
                    <option value="Kinderfahrrad">Kinderfahrrad</option>
                    <option value="Lastenrad">Lastenrad</option>
                    <option value="Klapprad">Klapprad</option>
                    <option value="Sonstige">Sonstige</option>
                  </select>
                </div>
                <div class="field">
                  <label>{{ t.condition }} *</label>
                  <div class="chip-group" role="radiogroup" [attr.aria-label]="t.condition">
                    <button
                      type="button"
                      class="chip"
                      role="radio"
                      [attr.aria-checked]="bikeEdit.zustand === 'Gebraucht'"
                      [class.selected]="bikeEdit.zustand === 'Gebraucht'"
                      (click)="bikeEdit.zustand = conditions.Gebraucht"
                    >
                      {{ t.usedCondition }}
                    </button>
                    <button
                      type="button"
                      class="chip"
                      role="radio"
                      [attr.aria-checked]="bikeEdit.zustand === 'Neu'"
                      [class.selected]="bikeEdit.zustand === 'Neu'"
                      (click)="bikeEdit.zustand = conditions.Neu"
                    >
                      {{ t.newCondition }}
                    </button>
                  </div>
                </div>
                <div class="field" [class.field-error]="bikeErrors['preis']">
                  <label>Preis (€) *</label>
                  <span class="error-msg" *ngIf="bikeErrors['preis']">{{
                    t.requiredField
                  }}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    inputmode="decimal"
                    [(ngModel)]="preis"
                    name="preis"
                    required
                    (ngModelChange)="bikeErrors['preis'] = false"
                  />
                </div>
                <div class="field full">
                  <label>{{ t.descriptionEquipment }}</label>
                  <textarea
                    [(ngModel)]="bikeEdit.beschreibung"
                    name="bikeBeschr"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- Sale details -->
          <div class="form-card">
            <h2>{{ t.saleData }}</h2>
            <div class="form-grid">
              <div class="field">
                <label>{{ t.receiptNo }}</label>
                <input
                  [(ngModel)]="belegNummer"
                  name="belegNummer"
                  placeholder="z.B. VB-20260219-001"
                />
              </div>
              <div class="field">
                <label>{{ t.saleDateRequired }}</label>
                <input
                  type="date"
                  [(ngModel)]="verkaufsdatum"
                  name="verkaufsdatum"
                  required
                />
              </div>
              <div class="field" *ngIf="selectedBike">
                <label>{{ t.warranty }}</label>
                <div class="warranty-info">
                  <span
                    class="warranty-badge"
                    [class.warranty-new]="selectedBike.zustand === 'Neu'"
                  >
                    {{
                      selectedBike.zustand === 'Neu'
                        ? t.warrantyNew
                        : t.warrantyUsed
                    }}
                  </span>
                  <small
                    >({{
                      selectedBike.zustand === 'Neu'
                        ? t.newBicycle
                        : t.usedBicycle
                    }})</small
                  >
                </div>
              </div>
              <div class="field full">
                <label>{{ t.notes }}</label>
                <textarea
                  [(ngModel)]="notizen"
                  name="notizen"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Accessories (Zubehör) -->
          <div class="form-card">
            <h2>{{ t.accessoriesOptional }}</h2>
            <p class="hint">
              {{ t.accessorySaleHint }}
            </p>

            <!-- Autocomplete to add from catalog -->
            <div class="field" style="margin-bottom: 16px;">
              <label>{{ t.addAccessoryFromCatalog }}</label>
              <app-accessory-autocomplete
                [placeholder]="t.searchAccessory"
                (itemSelected)="addAccessoryFromCatalog($event)"
              ></app-accessory-autocomplete>
            </div>

            <div class="accessories-list" *ngIf="accessories.length > 0">
              <div
                class="accessory-item"
                *ngFor="let acc of accessories; let i = index"
              >
                <div class="accessory-fields">
                  <div class="field">
                    <label>{{ t.designation }}</label>
                    <input
                      [(ngModel)]="acc.bezeichnung"
                      [name]="'accBez' + i"
                      placeholder="z.B. Fahrradschloss"
                      required
                    />
                  </div>
                  <div class="field">
                    <label>{{ t.price }} (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      [(ngModel)]="acc.preis"
                      [name]="'accPreis' + i"
                      required
                    />
                  </div>
                  <div class="field">
                    <label>{{ t.quantity }}</label>
                    <input
                      type="number"
                      min="1"
                      [(ngModel)]="acc.menge"
                      [name]="'accMenge' + i"
                      required
                    />
                  </div>
                  <div class="field accessory-total">
                    <label>{{ t.total }}</label>
                    <span class="total-value"
                      >{{ acc.preis * acc.menge | number: '1.2-2' }} €</span
                    >
                  </div>
                  <button
                    type="button"
                    class="btn btn-icon btn-danger"
                    (click)="removeAccessory(i)"
                    [title]="t.remove"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <div class="accessory-summary" *ngIf="accessories.length > 0">
              <span>{{ t.accessoriesTotal }}:</span>
              <strong>{{ accessoriesTotal | number: '1.2-2' }} €</strong>
            </div>

            <button
              type="button"
              class="btn btn-outline btn-sm"
              (click)="addAccessory()"
            >
              + {{ t.addManually }}
            </button>
          </div>

          <!-- Rabatt & Gesamtbetrag -->
          <div class="form-card">
            <h2>{{ t.discount }}</h2>

            <!-- Rabatt -->
            <div class="discount-section">
              <div class="field">
                <label>{{ t.discountOptional }} (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputmode="decimal"
                  [(ngModel)]="rabatt"
                  name="rabatt"
                  placeholder="0.00"
                />
                <div class="chip-group discount-chips">
                  <button
                    type="button"
                    class="chip"
                    *ngFor="let pct of discountPercents"
                    [class.selected]="isDiscountPercent(pct)"
                    (click)="applyDiscountPercent(pct)"
                  >
                    {{ pct }} %
                  </button>
                  <button
                    type="button"
                    class="chip"
                    *ngIf="rabatt > 0"
                    (click)="rabatt = 0"
                  >
                    Kein Rabatt
                  </button>
                </div>
              </div>
            </div>

            <!-- Versand -->
            <div class="discount-section versand-row">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="versand"
                  name="versand"
                  (ngModelChange)="onVersandChange()"
                />
                <span>Versand</span>
              </label>
              <div class="field" *ngIf="versand">
                <label>Versandgebühr (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  [(ngModel)]="versandGebuehr"
                  name="versandGebuehr"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <!-- Buyer info -->
          <div class="form-card" *ngIf="showBuyerFields">
            <h2>Kundendaten</h2>
            <div class="customer-search">
              <label>Stammkunde? Schnell übernehmen</label>
              <app-customer-picker
                (customerSelected)="fillBuyer($event)"
              ></app-customer-picker>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>Vorname</label>
                <input [(ngModel)]="buyer.vorname" name="buyerVorname" />
              </div>
              <div class="field">
                <label>Nachname</label>
                <input [(ngModel)]="buyer.nachname" name="buyerNachname" />
              </div>
              <div class="field">
                <label>E-Mail</label>
                <input
                  type="email"
                  [(ngModel)]="buyer.email"
                  name="buyerEmail"
                  placeholder="kunde@example.com"
                />
              </div>
              <div class="field">
                <label>Telefon</label>
                <input [(ngModel)]="buyer.telefon" name="buyerTelefon" />
              </div>
              <div class="field">
                <label>Straße</label>
                <input [(ngModel)]="buyer.strasse" name="buyerStrasse" />
              </div>
              <div class="field">
                <label>Hausnummer</label>
                <input [(ngModel)]="buyer.hausnummer" name="buyerHausnr" />
              </div>
              <div class="field">
                <label>PLZ</label>
                <input [(ngModel)]="buyer.plz" name="buyerPlz" />
              </div>
              <div class="field">
                <label>Stadt</label>
                <input [(ngModel)]="buyer.stadt" name="buyerStadt" />
              </div>
            </div>
          </div>

          <div class="form-card">
            <h2>Preisübersicht</h2>
            <table class="price-summary-table">
              <tr *ngIf="!isAccessoryOnly">
                <th>Fahrradpreis</th>
                <td>{{ preis | number: '1.2-2' }} €</td>
              </tr>
              <tr>
                <th>Zubehörpreis</th>
                <td>{{ accessoriesTotal | number: '1.2-2' }} €</td>
              </tr>
              <tr>
                <th>Rabatt</th>
                <td>- {{ rabatt | number: '1.2-2' }} €</td>
              </tr>
              <tr *ngIf="versand">
                <th>Versandgebühr</th>
                <td>{{ versandGebuehr | number: '1.2-2' }} €</td>
              </tr>
              <tr class="table-total-row">
                <th>Gesamt</th>
                <td>{{ effectiveGrandTotal | number: '1.2-2' }} €</td>
              </tr>
            </table>
          </div>

          <div class="form-card">
            <h2>Zahlung</h2>
            <div class="zahlungen-list">
              <div
                class="zahlung-item"
                *ngFor="let z of zahlungen; let i = index"
              >
                <div
                  class="chip-group"
                  role="radiogroup"
                  aria-label="Zahlungsart"
                >
                  <button
                    type="button"
                    class="chip"
                    *ngFor="let p of paymentOptions"
                    role="radio"
                    [attr.aria-checked]="z.zahlungsart === p.value"
                    [class.selected]="z.zahlungsart === p.value"
                    (click)="z.zahlungsart = p.value"
                  >
                    {{ p.icon }} {{ t[p.labelKey] }}
                  </button>
                </div>
                <div class="zahlung-amount" *ngIf="zahlungen.length > 1">
                  <input
                    type="number"
                    step="0.01"
                    inputmode="decimal"
                    [(ngModel)]="z.betrag"
                    [name]="'zBetrag' + i"
                    placeholder="Betrag"
                  />
                  <span class="zahlung-euro">€</span>
                  <button
                    type="button"
                    class="btn btn-outline btn-sm"
                    (click)="fillRemaining(i)"
                    *ngIf="remainingAmount > 0"
                  >
                    Rest übernehmen
                  </button>
                  <button
                    type="button"
                    class="btn btn-icon btn-danger"
                    (click)="removeZahlung(i)"
                    [title]="t.remove"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p class="hint" *ngIf="zahlungen.length === 1">
                Der Gesamtbetrag von
                <strong>{{ effectiveGrandTotal | number: '1.2-2' }} €</strong>
                wird vollständig mit dieser Zahlungsart bezahlt.
              </p>
              <button
                type="button"
                class="btn btn-outline btn-sm"
                (click)="addZahlung()"
              >
                + Betrag aufteilen (weitere Zahlungsart)
              </button>
            </div>

            <div class="payment-status" *ngIf="zahlungen.length > 1">
              <div class="total-row">
                <span>Bezahlt</span>
                <span>{{ paidAmount | number: '1.2-2' }} €</span>
              </div>
              <div class="total-row" [class.remaining]="remainingAmount > 0">
                <span>Offen</span>
                <strong>{{ remainingAmount | number: '1.2-2' }} €</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky save bar -->
        <div class="form-action-bar">
          <div class="bar-summary">
            <span class="bar-title">Gesamt</span>
            <span class="bar-value"
              >{{ effectiveGrandTotal | number: '1.2-2' }} €</span
            >
            <span class="bar-hint warn" *ngIf="missingFields().length > 0">
              Noch offen: {{ missingFields().join(', ') }}
            </span>
            <span class="bar-hint ok" *ngIf="missingFields().length === 0">
              ✓ Bereit zum Speichern
              <span class="kbd-hint">· <span class="kbd">Strg</span> +
                <span class="kbd">S</span></span>
            </span>
          </div>
          <button
            type="submit"
            class="btn btn-primary btn-lg"
            [disabled]="submitting"
          >
            {{ submitting ? t.saving : t.saveSale }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 900px;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 22px;
      }
      .page-header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .accessory-toggle {
        display: inline-flex !important;
        align-items: center;
        gap: 10px;
        padding: 9px 14px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-radius: 10px;
        background: var(--bg-card, #fff);
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-secondary, #64748b);
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
        transition: all 0.18s ease;
      }
      .accessory-toggle:hover {
        border-color: var(--accent-primary, #e64a19);
        color: var(--text-primary);
      }
      .accessory-toggle input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      .accessory-toggle-indicator {
        width: 18px;
        height: 18px;
        border-radius: 5px;
        border: 1.5px solid var(--border-light, #cbd5e1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        line-height: 1;
        color: transparent;
        background: transparent;
        transition: all 0.18s ease;
      }
      .accessory-toggle.active {
        border-color: var(--accent-primary, #e64a19);
        background: var(--accent-primary-light, rgba(230, 74, 25, 0.1));
        color: var(--text-primary);
      }
      .accessory-toggle.active .accessory-toggle-indicator {
        border-color: var(--accent-primary, #e64a19);
        background: var(--accent-primary, #e64a19);
        color: #fff;
      }
      .page-header h1 {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-primary);
      }
      @media (max-width: 900px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .page-header-actions {
          width: 100%;
          justify-content: space-between;
        }
        .accessory-toggle {
          white-space: normal;
        }
      }
      .form-sections {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .form-card {
        background: var(--bg-card, #fff);
        border-radius: var(--radius-lg, 14px);
        padding: 24px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        box-shadow: var(--shadow-sm);
      }
      .form-card h2 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 16px;
        color: var(--text-primary);
      }
      .card-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .card-header-row h2 {
        margin-bottom: 0;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      @media (max-width: 600px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
      .field label {
        display: block;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-secondary, #64748b);
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .field input,
      .field select,
      .field textarea {
        width: 100%;
        padding: 9px 12px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-radius: var(--radius-md, 10px);
        font-size: 0.92rem;
        background: var(--bg-card, #fff);
        color: var(--text-primary);
        transition: var(--transition-fast);
      }
      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        outline: none;
        border-color: var(--accent-primary, #e64a19);
        box-shadow: 0 0 0 3px
          var(--accent-primary-light, rgba(230, 74, 25, 0.1));
      }
      .field.full {
        grid-column: 1 / -1;
      }
      .field .hint {
        display: block;
        font-size: 0.73rem;
        color: var(--text-secondary, #94a3b8);
        margin-top: 4px;
      }
      .color-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .color-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-radius: 20px;
        background: var(--bg-card, #fff);
        font-size: 0.82rem;
        font-weight: 500;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .color-chip:hover {
        border-color: var(--accent-primary, #e64a19);
        background: var(--table-hover, #f1f5f9);
      }
      .color-chip.selected {
        border-color: var(--accent-primary, #e64a19);
        background: var(--accent-primary-light, rgba(230, 74, 25, 0.08));
        font-weight: 600;
      }
      .chip-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--chip-color, #ccc);
        border: 1px solid rgba(0, 0, 0, 0.12);
        flex-shrink: 0;
      }
      .checkbox-label {
        display: flex !important;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        text-transform: none;
        letter-spacing: normal;
      }
      .checkbox-label input {
        width: auto;
        accent-color: var(--accent-primary, #e64a19);
      }
      .warranty-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .warranty-badge {
        display: inline-block;
        padding: 5px 12px;
        background: var(--accent-success-light, rgba(16, 185, 129, 0.08));
        color: var(--accent-success, #10b981);
        border-radius: 50px;
        font-weight: 600;
        font-size: 0.82rem;
      }
      .warranty-badge.warranty-new {
        background: rgba(59, 130, 246, 0.08);
        color: #3b82f6;
      }
      .warranty-info small {
        color: var(--text-secondary, #64748b);
        font-size: 0.8rem;
      }
      .btn-lg {
        padding: 12px 32px;
        font-size: 1.05rem;
      }
      .accessories-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 16px;
      }
      .accessory-item {
        background: var(--bg-secondary, #f8fafc);
        padding: 14px;
        border-radius: var(--radius-md, 10px);
        border: 1.5px solid var(--border-light, #e2e8f0);
      }
      .accessory-fields {
        display: flex;
        gap: 10px;
        align-items: flex-end;
        flex-wrap: wrap;
      }
      .accessory-fields .field {
        flex: 1;
        min-width: 100px;
      }
      .accessory-fields .field input {
        padding: 6px 8px;
      }
      .accessory-total {
        display: flex;
        align-items: center;
      }
      .total-value {
        font-weight: 700;
        color: var(--text-primary);
        padding: 6px 10px;
        background: var(--bg-card, #fff);
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-radius: var(--radius-sm, 6px);
      }
      .btn-icon {
        width: 32px;
        height: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm, 6px);
        font-size: 14px;
        flex-shrink: 0;
      }
      .btn-danger {
        background: var(--accent-danger, #ef4444);
        color: white;
        border: none;
      }
      .btn-sm {
        padding: 8px 16px;
        font-size: 0.85rem;
      }
      .accessory-summary {
        display: flex;
        justify-content: space-between;
        padding: 10px 14px;
        background: var(--bg-secondary, #f1f5f9);
        border-radius: var(--radius-md, 10px);
        margin-bottom: 16px;
        font-weight: 600;
      }
      .zahlungen-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .zahlung-item {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .zahlung-item + .zahlung-item {
        padding-top: 12px;
        border-top: 1px dashed var(--border-color);
      }
      .zahlung-item input {
        flex: 1;
        min-width: 0;
        padding: 9px 12px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-radius: var(--radius-md, 10px);
        font-size: 0.92rem;
        background: var(--bg-card, #fff);
        color: var(--text-primary);
      }
      .zahlung-euro {
        font-weight: 600;
        color: var(--text-secondary, #64748b);
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        color: var(--text-primary);
      }
      .total-row.grand {
        border-top: 1.5px solid var(--border-light, #e2e8f0);
        padding-top: 8px;
        margin-top: 8px;
        font-size: 1.1rem;
        font-weight: 700;
      }
      .total-row.discount {
        color: var(--accent-danger, #ef4444);
      }
      .discount-section {
        padding-top: 8px;
        border-top: 1px dashed var(--border-light, #e2e8f0);
      }
      .versand-row {
        margin-top: 8px;
        display: flex;
        align-items: flex-end;
        gap: 16px;
        flex-wrap: wrap;
      }
      .versand-row .field {
        flex: 1;
        min-width: 160px;
      }
      .versand-row .checkbox-label {
        padding-bottom: 9px;
        font-weight: 600;
        color: var(--text-primary);
      }
      .price-summary-table {
        width: 100%;
        border-collapse: collapse;
      }
      .price-summary-table th,
      .price-summary-table td {
        padding: 10px 12px;
        border-bottom: 1px solid var(--border-light, #e2e8f0);
        text-align: left;
      }
      .price-summary-table td {
        text-align: right;
        font-weight: 600;
      }
      .table-total-row th,
      .table-total-row td {
        font-weight: 800;
        font-size: 1.02rem;
      }
      .discount-chips {
        margin-top: 8px;
      }
      .zahlung-amount {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .zahlung-amount input {
        flex: 1;
        min-width: 0;
      }
      .payment-status {
        margin-top: 12px;
        padding: 12px;
        border-radius: 10px;
        background: var(--bg-secondary, #f8fafc);
        border: 1px solid var(--border-light, #e2e8f0);
      }
      .payment-status .remaining {
        color: var(--accent-danger, #ef4444);
      }
      .field-error input,
      .field-error select,
      .field-error textarea {
        border-color: #ef4444 !important;
        background: rgba(239, 68, 68, 0.04);
      }
      .field-error label {
        color: #ef4444;
      }
      .error-msg {
        display: block;
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 4px;
        font-weight: 500;
      }
      .quick-add-badge {
        display: inline-block;
        background: linear-gradient(135deg, #10b981, #059669);
        color: #fff;
        font-size: 0.9rem;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 8px;
        vertical-align: middle;
      }
      .rahmen-autocomplete-wrapper {
        position: relative;
      }
      .rahmen-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 100;
        background: var(--bg-card, #fff);
        border: 1.5px solid var(--accent-primary, #e64a19);
        border-radius: 0 0 var(--radius-md, 10px) var(--radius-md, 10px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        max-height: 240px;
        overflow-y: auto;
      }
      .rahmen-dropdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        cursor: pointer;
        transition: background 0.1s;
        border-bottom: 1px solid var(--border-light, #e2e8f0);
      }
      .rahmen-dropdown-item:last-child {
        border-bottom: none;
      }
      .rahmen-dropdown-item:hover {
        background: var(--accent-primary-light, rgba(230, 74, 25, 0.08));
      }
      .rahmen-nr {
        font-weight: 700;
        font-family: monospace;
        font-size: 0.88rem;
        text-transform: uppercase;
        color: var(--accent-primary, #e64a19);
      }
      .rahmen-info {
        font-size: 0.85rem;
        color: var(--text-primary);
      }
      .rahmen-badge {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 99px;
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        margin-left: auto;
      }
      .rahmen-badge.sold {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
    `,
  ],
})
export class SaleFormComponent implements OnInit {
  private translationService = inject(TranslationService);
  private notificationService = inject(NotificationService);

  readonly conditions = BikeCondition;
  readonly wheelSizes = [
    '12',
    '14',
    '16',
    '18',
    '20',
    '24',
    '26',
    '27.5',
    '28',
    '29',
  ];
  readonly discountPercents = [5, 10, 15];
  readonly paymentOptions = [
    { value: PaymentMethod.Bar, icon: '💶', labelKey: 'cash' as const },
    { value: PaymentMethod.PayPal, icon: '🅿️', labelKey: 'paypal' as const },
    {
      value: PaymentMethod.Karte,
      icon: '💳',
      labelKey: 'bankTransfer' as const,
    },
    {
      value: PaymentMethod.Ueberweisung,
      icon: '🏦',
      labelKey: 'wireTransfer' as const,
    },
  ];
  private readonly defaultBuyer = {
    vorname: '',
    nachname: '',
  };

  colorOptions = [
    { value: 'Schwarz', label: 'Schwarz', hex: '#1a1a1a' },
    { value: 'Weiß', label: 'Weiß', hex: '#f5f5f5' },
    { value: 'Rot', label: 'Rot', hex: '#ef4444' },
    { value: 'Blau', label: 'Blau', hex: '#3b82f6' },
    { value: 'Grün', label: 'Grün', hex: '#22c55e' },
    { value: 'Gelb', label: 'Gelb', hex: '#eab308' },
    { value: 'Orange', label: 'Orange', hex: '#f97316' },
    { value: 'Grau', label: 'Grau', hex: '#9ca3af' },
    { value: 'Silber', label: 'Silber', hex: '#c0c0c0' },
    { value: 'Pink', label: 'Pink', hex: '#ec4899' },
    { value: 'T\u00fcrkis', label: 'T\u00fcrkis', hex: '#06b6d4' },
    { value: 'Lila', label: 'Lila', hex: '#a855f7' },
    { value: 'Dunkelblau', label: 'Dunkelblau', hex: '#1e3a5f' },
  ];

  isColorSelected(farbe: string, color: string): boolean {
    if (!farbe) return false;
    return farbe.split(/[,\/]\s*/).includes(color);
  }

  toggleColor(farbe: string, color: string): string {
    const colors = farbe ? farbe.split(/[,\/]\s*/).filter(Boolean) : [];
    const idx = colors.indexOf(color);
    if (idx >= 0) colors.splice(idx, 1);
    else colors.push(color);
    return colors.join('/');
  }

  availableBikes: Bicycle[] = [];
  selectedBike: Bicycle | null = null;

  buyer = {
    vorname: this.defaultBuyer.vorname,
    nachname: this.defaultBuyer.nachname,
    strasse: '',
    hausnummer: '',
    plz: '',
    stadt: '',
    telefon: '',
    email: '',
  };
  preis = 0;
  zahlungsart: PaymentMethod = PaymentMethod.Bar;
  zahlungen: SalePaymentCreate[] = [
    { zahlungsart: PaymentMethod.Bar, betrag: 0 },
  ];
  verkaufsdatum = '';
  notizen = '';
  belegNummer = '';
  sellerSignatureData = '';
  sellerSignerName = '';
  submitting = false;
  isAccessoryOnly = false;
  showBuyerFields = true;
  accessories: SaleAccessoryCreate[] = [];
  rabatt = 0;
  versand = false;
  versandGebuehr = 0;
  purchaseId: number | undefined = undefined;

  // Bicycle edit
  bikeEditExpanded = true;
  isQuickAddMode = false;
  bikeErrors: { [key: string]: boolean } = {};
  rahmenMatchBike: Bicycle | null = null;
  rahmenSearchResults: Bicycle[] = [];
  showRahmenDropdown = false;
  private rahmenSearchTimeout: any = null;
  bikeEdit = {
    marke: '',
    modell: '',
    rahmennummer: '',
    rahmengroesse: '',
    farbe: '',
    reifengroesse: '',
    fahrradtyp: '',
    beschreibung: '',
    zustand: 'Gebraucht' as BikeCondition,
  };
  brands: string[] = [];
  models: string[] = [];

  get t() {
    return this.translationService.translations();
  }

  get hasBikeErrors(): boolean {
    return Object.values(this.bikeErrors).some((v) => v);
  }

  get accessoriesTotal(): number {
    return this.accessories.reduce(
      (sum, acc) => sum + acc.preis * acc.menge,
      0,
    );
  }

  get effectiveSalePrice(): number {
    return this.isAccessoryOnly ? 0 : this.preis;
  }

  get effectiveVersandGebuehr(): number {
    return this.versand ? this.versandGebuehr || 0 : 0;
  }

  get effectiveGrandTotal(): number {
    return Math.max(
      0,
      this.effectiveSalePrice +
        this.accessoriesTotal -
        this.rabatt +
        this.effectiveVersandGebuehr,
    );
  }

  get paidAmount(): number {
    return this.zahlungen.reduce((sum, z) => sum + (z.betrag || 0), 0);
  }

  get remainingAmount(): number {
    return Math.max(0, this.effectiveGrandTotal - this.paidAmount);
  }

  constructor(
    private saleService: SaleService,
    private bicycleService: BicycleService,
    private purchaseService: PurchaseService,
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const _d = new Date();
    this.verkaufsdatum = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, '0')}-${String(_d.getDate()).padStart(2, '0')}`;

    const accessoryOnlyParam =
      this.route.snapshot.queryParamMap.get('accessoryOnly');
    if (accessoryOnlyParam === 'true') {
      this.isAccessoryOnly = true;
      this.onAccessoryOnlyChange();
    }

    this.showBuyerFields = !this.isAccessoryOnly;

    this.bicycleService.getAvailable().subscribe((bikes) => {
      this.availableBikes = bikes;
      const preselect = this.route.snapshot.queryParamMap.get('bicycleId');
      if (preselect) {
        const bike = bikes.find((b) => b.id === +preselect);
        if (bike) {
          this.onBikeSelected(bike);
        }
      }
    });
    // Load next BelegNummer
    this.saleService.getNextBelegNummer().subscribe({
      next: (res) => {
        this.belegNummer = res.belegNummer;
      },
      error: () => {},
    });

    // Load brands for autocomplete
    this.bicycleService.getBrands().subscribe({
      next: (res) => {
        this.brands = res;
      },
      error: () => {},
    });

    // Load all models
    this.bicycleService.getModels().subscribe({
      next: (res) => {
        this.models = res;
      },
      error: () => {},
    });
    // Load owner signature from settings
    this.settingsService.getSettings().subscribe((settings) => {
      if (settings?.inhaberSignatureBase64) {
        this.sellerSignatureData = settings.inhaberSignatureBase64;
        const ownerName = [settings.inhaberVorname, settings.inhaberNachname]
          .filter(Boolean)
          .join(' ');
        if (ownerName) {
          this.sellerSignerName = ownerName;
        }
      }
    });
  }

  onBikeSelected(bike: Bicycle) {
    this.selectedBike = bike;
    this.isQuickAddMode = false;
    this.loadPlannedPrice(bike.id);
    // Populate bikeEdit form
    this.bikeEdit = {
      marke: bike.marke || '',
      modell: bike.modell || '',
      rahmennummer: bike.rahmennummer || '',
      rahmengroesse: bike.rahmengroesse || '',
      farbe: bike.farbe || '',
      reifengroesse: bike.reifengroesse || '',
      fahrradtyp: bike.fahrradtyp || '',
      beschreibung: bike.beschreibung || '',
      zustand: bike.zustand || BikeCondition.Gebraucht,
    };
  }

  onQuickAddBike() {
    // Create a temporary bike placeholder for quick add mode
    this.isQuickAddMode = true;
    this.purchaseId = undefined;
    this.rahmenMatchBike = null;
    this.selectedBike = {
      id: 0, // Temporary ID, will be replaced when created
      marke: '',
      modell: '',
      rahmennummer: '',
      rahmengroesse: '',
      farbe: '',
      reifengroesse: '',
      fahrradtyp: '',
      beschreibung: '',
      status: 'Verfügbar' as any,
      zustand: BikeCondition.Gebraucht,
    } as Bicycle;

    // Clear bikeEdit form for new bike
    this.bikeEdit = {
      marke: '',
      modell: '',
      rahmennummer: '',
      rahmengroesse: '',
      farbe: '',
      reifengroesse: '',
      fahrradtyp: '',
      beschreibung: '',
      zustand: BikeCondition.Gebraucht,
    };

    // Expand the form to enter details
    this.bikeEditExpanded = true;
    this.bikeErrors = {};
  }

  onRahmennummerChange(value: string) {
    this.rahmenMatchBike = null;
    this.rahmenSearchResults = [];
    if (this.rahmenSearchTimeout) clearTimeout(this.rahmenSearchTimeout);
    if (!value || value.trim().length < 2) {
      this.showRahmenDropdown = false;
      return;
    }
    this.rahmenSearchTimeout = setTimeout(() => {
      this.bicycleService.search(value.trim()).subscribe({
        next: (bikes) => {
          this.rahmenSearchResults = bikes.filter(
            (b) =>
              b.status !== 'Sold' &&
              b.rahmennummer
                ?.toUpperCase()
                .includes(value.trim().toUpperCase()),
          );
          this.showRahmenDropdown = this.rahmenSearchResults.length > 0;
        },
        error: () => {},
      });
    }, 300);
  }

  hideRahmenDropdown() {
    // Small delay so mousedown on dropdown item fires first
    setTimeout(() => {
      this.showRahmenDropdown = false;
    }, 200);
  }

  selectRahmenBike(bike: Bicycle) {
    this.showRahmenDropdown = false;
    this.rahmenSearchResults = [];
    this.rahmenMatchBike = null;
    this.isQuickAddMode = false;
    this.selectedBike = bike;
    this.loadPlannedPrice(bike.id);
    this.bikeEdit = {
      marke: bike.marke || '',
      modell: bike.modell || '',
      rahmennummer: bike.rahmennummer || '',
      rahmengroesse: bike.rahmengroesse || '',
      farbe: bike.farbe || '',
      reifengroesse: bike.reifengroesse || '',
      fahrradtyp: bike.fahrradtyp || '',
      beschreibung: bike.beschreibung || '',
      zustand: bike.zustand || BikeCondition.Gebraucht,
    };
    this.bikeErrors = {};
  }

  useExistingBike(bike: Bicycle) {
    this.rahmenMatchBike = null;
    this.isQuickAddMode = false;
    this.selectedBike = bike;
    this.loadPlannedPrice(bike.id);
    this.bikeEdit = {
      marke: bike.marke || '',
      modell: bike.modell || '',
      rahmennummer: bike.rahmennummer || '',
      rahmengroesse: bike.rahmengroesse || '',
      farbe: bike.farbe || '',
      reifengroesse: bike.reifengroesse || '',
      fahrradtyp: bike.fahrradtyp || '',
      beschreibung: bike.beschreibung || '',
      zustand: bike.zustand || BikeCondition.Gebraucht,
    };
  }

  private loadPlannedPrice(bicycleId: number) {
    this.purchaseService.getByBicycleId(bicycleId).subscribe({
      next: (purchase) => {
        if (purchase) {
          this.purchaseId = purchase.id;
          if (purchase.verkaufspreisVorschlag) {
            this.preis = purchase.verkaufspreisVorschlag;
          }
        }
      },
      error: () => {
        // No purchase found for this bike, ignore
        this.purchaseId = undefined;
      },
    });
  }

  addAccessory() {
    this.accessories.push({
      bezeichnung: '',
      preis: 0,
      menge: 1,
    });
  }

  addAccessoryFromCatalog(item: AccessoryCatalogList) {
    this.accessories.push({
      bezeichnung: item.bezeichnung,
      preis: item.standardpreis || 0,
      menge: 1,
    });
  }

  removeAccessory(index: number) {
    this.accessories.splice(index, 1);
  }

  addZahlung() {
    // Switching from a single payment to a split: start the first row with
    // the full amount so only the second part has to be entered.
    if (this.zahlungen.length === 1 && !this.zahlungen[0].betrag) {
      this.zahlungen[0].betrag = this.effectiveGrandTotal;
    }
    const used = new Set(this.zahlungen.map((z) => z.zahlungsart));
    const next =
      this.paymentOptions.find((p) => !used.has(p.value))?.value ??
      PaymentMethod.Bar;
    this.zahlungen.push({ zahlungsart: next, betrag: 0 });
  }

  get discountBase(): number {
    return this.effectiveSalePrice + this.accessoriesTotal;
  }

  applyDiscountPercent(pct: number) {
    this.rabatt = Math.round(this.discountBase * pct) / 100;
  }

  isDiscountPercent(pct: number): boolean {
    return (
      this.rabatt > 0 &&
      Math.abs(this.rabatt - Math.round(this.discountBase * pct) / 100) < 0.005
    );
  }

  fillBuyer(customer: Customer) {
    this.buyer = {
      vorname: customer.vorname || '',
      nachname: customer.nachname || '',
      strasse: customer.strasse || '',
      hausnummer: customer.hausnummer || '',
      plz: customer.plz || '',
      stadt: customer.stadt || '',
      telefon: customer.telefon || '',
      email: customer.email || '',
    };
    this.notificationService.info(
      `${customer.vorname} ${customer.nachname} übernommen`,
      2500,
    );
  }

  missingFields(): string[] {
    const missing: string[] = [];
    if (this.isAccessoryOnly) {
      if (this.accessories.length === 0) missing.push('Zubehör');
    } else {
      if (!this.selectedBike) {
        missing.push(this.t.bicycle);
      } else {
        if (!this.bikeEdit.rahmennummer?.trim())
          missing.push(this.t.frameNumber);
        if (!this.bikeEdit.marke?.trim()) missing.push(this.t.brand);
        if (!this.bikeEdit.farbe) missing.push(this.t.color);
        if (!this.bikeEdit.reifengroesse) missing.push(this.t.wheelSize);
        if (!this.bikeEdit.fahrradtyp) missing.push(this.t.bicycleType);
        if (!(this.preis > 0)) missing.push(this.t.price);
      }
    }
    if (!this.verkaufsdatum) missing.push(this.t.date);
    if (this.zahlungen.length > 1 && this.remainingAmount > 0.009)
      missing.push(
        `Restbetrag ${this.remainingAmount.toFixed(2).replace('.', ',')} €`,
      );
    return missing;
  }

  @HostListener('document:keydown', ['$event'])
  onShortcut(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      if (!this.submitting) this.submit();
    }
  }

  fillRemaining(index: number) {
    if (this.remainingAmount <= 0) return;
    this.zahlungen[index].betrag =
      Math.round(
        ((this.zahlungen[index].betrag || 0) + this.remainingAmount) * 100,
      ) / 100;
  }

  removeZahlung(index: number) {
    this.zahlungen.splice(index, 1);
  }

  validateBike(): boolean {
    this.bikeErrors = {};
    if (!this.bikeEdit.marke?.trim()) this.bikeErrors['marke'] = true;
    if (!this.bikeEdit.rahmennummer?.trim())
      this.bikeErrors['rahmennummer'] = true;
    if (!this.bikeEdit.farbe) this.bikeErrors['farbe'] = true;
    if (!this.bikeEdit.reifengroesse) this.bikeErrors['reifengroesse'] = true;
    if (!this.bikeEdit.fahrradtyp) this.bikeErrors['fahrradtyp'] = true;
    if (this.preis <= 0) this.bikeErrors['preis'] = true;
    return Object.keys(this.bikeErrors).length === 0;
  }

  onVersandChange() {
    if (!this.versand) {
      this.versandGebuehr = 0;
    }
  }

  onAccessoryOnlyChange() {
    this.showBuyerFields = !this.isAccessoryOnly;

    if (this.isAccessoryOnly) {
      this.selectedBike = null;
      this.isQuickAddMode = false;
      this.purchaseId = undefined;
      this.preis = 0;
      this.zahlungen = [{ zahlungsart: PaymentMethod.Bar, betrag: 0 }];
      return;
    }

    if (this.zahlungen.length === 0) {
      this.zahlungen = [{ zahlungsart: PaymentMethod.Bar, betrag: 0 }];
    }
  }

  submit() {
    if (!this.isAccessoryOnly && !this.selectedBike) {
      this.notificationService.warning('Bitte zuerst ein Fahrrad auswählen.');
      return;
    }

    if (this.isAccessoryOnly) {
      this.preis = 0;
      this.zahlungen = [
        {
          zahlungsart: this.zahlungen[0]?.zahlungsart || (null as any),
          betrag: 0,
        },
      ];
    }

    // If payment is not split, use the first selected payment method for full amount.
    if (this.zahlungen.length === 1 && this.effectiveGrandTotal > 0) {
      this.zahlungen[0].betrag = this.effectiveGrandTotal;
    }

    if (!this.verkaufsdatum) {
      this.notificationService.warning('Bitte Verkaufsdatum ausfüllen.');
      return;
    }

    if (this.zahlungen.some((z) => !z.zahlungsart)) {
      this.notificationService.warning('Bitte Zahlungsart auswählen.');
      return;
    }

    if (
      this.effectiveGrandTotal > 0 &&
      this.zahlungen.every((z) => z.betrag <= 0)
    ) {
      this.notificationService.warning('Bitte mindestens eine Zahlung eintragen.');
      return;
    }

    if (this.remainingAmount > 0.009) {
      this.notificationService.warning(
        `Es bleibt ein Restbetrag von ${this.remainingAmount.toFixed(2)} €. Bitte vollständig bezahlen.`,
      );
      return;
    }

    if (this.isAccessoryOnly && this.accessories.length === 0) {
      this.notificationService.warning('Bitte mindestens ein Zubehör hinzufügen.');
      return;
    }

    if (!this.isAccessoryOnly && !this.validateBike()) {
      this.bikeEditExpanded = true;
      this.notificationService.warning(
        'Bitte noch ausfüllen: ' + this.missingFields().join(', '),
      );
      return;
    }

    this.submitting = true;

    if (this.isAccessoryOnly) {
      this.createSale();
      return;
    }

    // If in quick add mode, create the bike first
    if (this.isQuickAddMode) {
      const newBike = {
        marke: this.bikeEdit.marke,
        modell: this.bikeEdit.modell,
        rahmennummer: this.bikeEdit.rahmennummer || undefined,
        rahmengroesse: this.bikeEdit.rahmengroesse || undefined,
        farbe: this.bikeEdit.farbe || undefined,
        reifengroesse: this.bikeEdit.reifengroesse,
        fahrradtyp: this.bikeEdit.fahrradtyp || undefined,
        beschreibung: this.bikeEdit.beschreibung || undefined,
        status: 'Verfügbar' as any,
        zustand: this.bikeEdit.zustand,
      };

      this.bicycleService.create(newBike).subscribe({
        next: (createdBike) => {
          this.selectedBike = createdBike;
          this.isQuickAddMode = false;
          const bikeUpdate = this.buildBikeUpdate(createdBike.status);
          this.bicycleService.update(createdBike.id, bikeUpdate).subscribe({
            next: () => {
              this.selectedBike!.zustand = this.bikeEdit.zustand;
              this.selectedBike!.verkaufspreisVorschlag =
                bikeUpdate.verkaufspreisVorschlag;
              this.createSale();
            },
            error: () => {
              this.submitting = false;
              this.notificationService.error('Fehler beim Aktualisieren des Fahrrads');
            },
          });
        },
        error: () => {
          this.submitting = false;
          this.notificationService.error('Fehler beim Erstellen des Fahrrads');
        },
      });
      return;
    }

    // Otherwise update the existing bicycle
    const selectedBike = this.selectedBike;
    if (!selectedBike) {
      this.submitting = false;
      return;
    }

    const bikeUpdate = this.buildBikeUpdate(selectedBike.status);

    // Update bicycle first, then create sale
    this.bicycleService.update(selectedBike.id, bikeUpdate).subscribe({
      next: () => {
        // Update local selectedBike to reflect changes (for warranty calculation)
        this.selectedBike!.zustand = this.bikeEdit.zustand;
        this.selectedBike!.verkaufspreisVorschlag =
          bikeUpdate.verkaufspreisVorschlag;
        this.createSale();
      },
      error: () => {
        this.submitting = false;
        this.notificationService.error('Fehler beim Aktualisieren des Fahrrads');
      },
    });
  }

  private buildBikeUpdate(status: Bicycle['status']): BicycleUpdate {
    return {
      marke: this.bikeEdit.marke,
      modell: this.bikeEdit.modell,
      rahmennummer: this.bikeEdit.rahmennummer || undefined,
      rahmengroesse: this.bikeEdit.rahmengroesse || undefined,
      farbe: this.bikeEdit.farbe || undefined,
      reifengroesse: this.bikeEdit.reifengroesse,
      fahrradtyp: this.bikeEdit.fahrradtyp || undefined,
      beschreibung: this.bikeEdit.beschreibung || undefined,
      status,
      zustand: this.bikeEdit.zustand,
      verkaufspreisVorschlag: this.preis > 0 ? this.preis : undefined,
    };
  }

  private createSale() {
    const hasBuyerName =
      !!this.buyer.vorname?.trim() && !!this.buyer.nachname?.trim();

    const saleBuyer = hasBuyerName
      ? this.buyer
      : {
          ...this.buyer,
          vorname: this.defaultBuyer.vorname,
          nachname: this.defaultBuyer.nachname,
        };

    const sellerSig: SignatureCreate | undefined = this.sellerSignatureData
      ? {
          signatureData: this.sellerSignatureData,
          signerName: this.sellerSignerName || 'Karaarslan Bike',
          signatureType: 'ShopOwner' as any,
        }
      : undefined;

    const sale: SaleCreate = {
      bicycleId: this.isAccessoryOnly ? 0 : this.selectedBike!.id,
      isAccessoryOnly: this.isAccessoryOnly,
      purchaseId: this.purchaseId,
      buyer: saleBuyer,
      preis: this.effectiveSalePrice,
      zahlungsart: this.zahlungen[0]?.zahlungsart || this.zahlungsart,
      verkaufsdatum: this.verkaufsdatum,
      garantie: !this.isAccessoryOnly,
      garantieBedingungen: this.isAccessoryOnly
        ? undefined
        : this.selectedBike!.zustand === 'Neu'
          ? '2 Jahre Gewährleistung gemäß § 437 BGB'
          : '3 Monate Garantie auf das Fahrrad',
      notizen: this.notizen || undefined,
      sellerSignature: sellerSig,
      accessories:
        this.accessories.length > 0
          ? this.accessories.filter((a) => a.bezeichnung && a.preis > 0)
          : undefined,
      zahlungen:
        this.zahlungen.length > 0
          ? this.zahlungen.filter((z) => z.betrag > 0)
          : undefined,
      rabatt: this.rabatt > 0 ? this.rabatt : undefined,
      versand: this.versand,
      versandGebuehr: this.versand ? this.versandGebuehr : undefined,
      belegNummer: this.belegNummer || undefined,
    };

    this.saleService.create(sale).subscribe({
      next: () => {
        this.notificationService.success(
          `Verkauf gespeichert (${this.effectiveGrandTotal.toFixed(2).replace('.', ',')} €)`,
        );
        this.router.navigate(['/sales']);
      },
      error: (err) => {
        this.submitting = false;
        this.notificationService.error(err?.error?.error || this.t.saleError);
      },
    });
  }
}
