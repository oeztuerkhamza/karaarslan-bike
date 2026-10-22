import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../../services/purchase.service';
import { DocumentService } from '../../services/document.service';
import { BicycleService } from '../../services/bicycle.service';
import { CustomerService } from '../../services/customer.service';
import { TranslationService } from '../../services/translation.service';
import { NotificationService } from '../../services/notification.service';
import { CustomerPickerComponent } from '../../components/customer-picker/customer-picker.component';
import {
  Customer,
  PurchaseCreate,
  BulkPurchaseCreate,
  PaymentMethod,
  BikeCondition,
  DocumentType,
} from '../../models/models';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CustomerPickerComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>{{ t.newPurchaseTitle }}</h1>
        <a routerLink="/purchases" class="btn btn-outline">{{ t.back }}</a>
      </div>

      <!-- Mode Toggle -->
      <div class="mode-toggle">
        <button
          type="button"
          class="toggle-btn"
          [class.active]="!bulkMode"
          (click)="setBulkMode(false)"
        >
          🚲 {{ t.singlePurchase }}
        </button>
        <button
          type="button"
          class="toggle-btn"
          [class.active]="bulkMode"
          (click)="setBulkMode(true)"
        >
          📦 {{ t.bulkPurchase }}
        </button>
      </div>

      <form (ngSubmit)="submit()" #f="ngForm">
        <div class="form-sections">
          <!-- Bicycle info -->
          <div class="form-card bicycle-card">
            <h2>{{ t.bicycle }}</h2>
            <!-- Bulk quantity -->
            <div class="bulk-quantity" *ngIf="bulkMode">
              <label>{{ t.quantity }} *</label>
              <div class="quantity-control">
                <button type="button" class="qty-btn" (click)="decreaseQty()">
                  −
                </button>
                <input
                  type="number"
                  [(ngModel)]="bulkQuantity"
                  name="bulkQty"
                  min="1"
                  max="100"
                  class="qty-input"
                />
                <button type="button" class="qty-btn" (click)="increaseQty()">
                  +
                </button>
              </div>
              <small class="hint">{{ t.bulkQuantityHint }}</small>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>{{ t.brand }} *</label>
                <input
                  [(ngModel)]="bicycle.marke"
                  name="bikeMarke"
                  required
                  list="brandList"
                  (ngModelChange)="onBrandChange()"
                  autocomplete="off"
                />
                <datalist id="brandList">
                  <option *ngFor="let b of brands" [value]="b"></option>
                </datalist>
              </div>
              <div class="field">
                <label>{{ t.model }}</label>
                <input
                  [(ngModel)]="bicycle.modell"
                  name="bikeModell"
                  list="modelList"
                  autocomplete="off"
                />
                <datalist id="modelList">
                  <option *ngFor="let m of models" [value]="m"></option>
                </datalist>
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.frameNumber }}</label>
                <input
                  [(ngModel)]="bicycle.rahmennummer"
                  name="bikeRahmen"
                  placeholder="optional"
                  style="text-transform: uppercase"
                />
              </div>
              <div class="field">
                <label>{{ t.frameSize }}</label>
                <input
                  [(ngModel)]="bicycle.rahmengroesse"
                  name="bikeRahmengroesse"
                  placeholder="z.B. 52, 56, M, L"
                />
              </div>
              <div class="field">
                <label>{{ t.color }}</label>
                <div class="color-chips">
                  <button
                    type="button"
                    *ngFor="let c of colorOptions"
                    class="color-chip"
                    [class.selected]="isColorSelected(bicycle.farbe, c.value)"
                    [style.--chip-color]="c.hex"
                    (click)="
                      bicycle.farbe = toggleColor(bicycle.farbe, c.value)
                    "
                  >
                    <span class="chip-dot"></span>
                    {{ c.label }}
                  </button>
                </div>
              </div>
              <div class="field full">
                <label>{{ t.wheelSize }} *</label>
                <div
                  class="chip-group"
                  role="radiogroup"
                  [attr.aria-label]="t.wheelSize"
                  [class.invalid]="showErrors && !bicycle.reifengroesse"
                >
                  <button
                    type="button"
                    class="chip"
                    *ngFor="let size of wheelSizes"
                    role="radio"
                    [attr.aria-checked]="bicycle.reifengroesse === size"
                    [class.selected]="bicycle.reifengroesse === size"
                    (click)="bicycle.reifengroesse = size"
                  >
                    {{ size }}"
                  </button>
                </div>
              </div>
              <div class="field">
                <label>{{ t.bicycleType }}</label>
                <select [(ngModel)]="bicycle.fahrradtyp" name="bikeFahrradtyp">
                  <option value="">-- Auswählen --</option>
                  <option value="E-Bike">E-Bike</option>
                  <option value="E-Trekking Pedelec">E-Trekking Pedelec</option>
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
                <label>{{ t.artLabel }}</label>
                <div class="chip-group" role="radiogroup" [attr.aria-label]="t.artLabel">
                  <button
                    type="button"
                    class="chip"
                    *ngFor="let a of artOptions"
                    role="radio"
                    [attr.aria-checked]="bicycle.art === a"
                    [class.selected]="bicycle.art === a"
                    (click)="bicycle.art = bicycle.art === a ? '' : a"
                  >
                    {{ a }}
                  </button>
                </div>
              </div>
              <div class="field full" *ngIf="!bulkMode">
                <label>{{ t.condition }} *</label>
                <div class="chip-group" role="radiogroup" [attr.aria-label]="t.condition">
                  <button
                    type="button"
                    class="chip"
                    role="radio"
                    [attr.aria-checked]="bicycle.zustand === 'Gebraucht'"
                    [class.selected]="bicycle.zustand === 'Gebraucht'"
                    (click)="bicycle.zustand = conditions.Gebraucht"
                  >
                    {{ t.usedCondition }}
                  </button>
                  <button
                    type="button"
                    class="chip"
                    role="radio"
                    [attr.aria-checked]="bicycle.zustand === 'Neu'"
                    [class.selected]="bicycle.zustand === 'Neu'"
                    (click)="bicycle.zustand = conditions.Neu"
                  >
                    {{ t.newCondition }}
                  </button>
                </div>
              </div>
              <div class="field" *ngIf="bulkMode">
                <label>{{ t.condition }}</label>
                <div class="fixed-value">{{ t.newCondition }}</div>
              </div>
              <div class="field full">
                <label>{{ t.descriptionEquipment }}</label>
                <textarea
                  [(ngModel)]="bicycle.beschreibung"
                  name="bikeBeschr"
                  rows="4"
                  placeholder="z.B.&#10;E-Trekking Pedelec&#10;Bosch Performance Line 65&#10;NM 500 Wh&#10;28 Zoll Trapez 50 cm"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Purchase details -->
          <div class="form-card">
            <h2>{{ t.purchaseData }}</h2>
            <div class="form-grid">
              <div class="field">
                <label
                  >{{ t.receiptNo }}
                  {{ bulkMode ? '(' + t.invoiceOptional + ')' : '' }}</label
                >
                <input
                  [(ngModel)]="belegNummer"
                  name="belegNummer"
                  [placeholder]="bulkMode ? 'z.B. RE-2026-001234' : 'z.B. 001'"
                />
                <small class="hint" *ngIf="bulkMode">{{
                  t.sameInvoiceForAllBikes
                }}</small>
              </div>
              <div class="field">
                <label>{{ bulkMode ? t.pricePerBike : t.priceRequired }}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputmode="decimal"
                  [(ngModel)]="preis"
                  name="preis"
                  required
                  [class.input-invalid]="showErrors && !(preis > 0)"
                />
              </div>
              <div class="field" *ngIf="bulkMode">
                <label>{{ t.totalPrice }}</label>
                <div class="calculated-price">
                  {{ preis * bulkQuantity | number: '1.2-2' }} €
                </div>
              </div>
              <div class="field">
                <label>{{ t.plannedSellingPrice }} (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputmode="decimal"
                  [(ngModel)]="verkaufspreisVorschlag"
                  name="verkaufspreisVorschlag"
                  placeholder="optional"
                />
                <small
                  class="margin-hint"
                  *ngIf="verkaufspreisVorschlag && preis > 0"
                  [class.negative]="verkaufspreisVorschlag < preis"
                >
                  Erwarteter Gewinn:
                  <strong
                    >{{ verkaufspreisVorschlag - preis | number: '1.2-2' }}
                    €</strong
                  >
                  ({{
                    ((verkaufspreisVorschlag - preis) / preis) * 100
                      | number: '1.0-0'
                  }}
                  %)
                </small>
              </div>
              <div class="field full">
                <label>{{ t.paymentMethodRequired }}</label>
                <div
                  class="chip-group"
                  role="radiogroup"
                  [attr.aria-label]="t.paymentMethodRequired"
                >
                  <button
                    type="button"
                    class="chip"
                    *ngFor="let p of paymentOptions"
                    role="radio"
                    [attr.aria-checked]="zahlungsart === p.value"
                    [class.selected]="zahlungsart === p.value"
                    (click)="zahlungsart = p.value"
                  >
                    {{ p.icon }} {{ t[p.labelKey] }}
                  </button>
                </div>
              </div>
              <div class="field">
                <label>{{ t.purchaseDate }} *</label>
                <input
                  type="date"
                  [(ngModel)]="kaufdatum"
                  name="kaufdatum"
                  required
                />
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.adNumber }}</label>
                <input
                  [(ngModel)]="anzeigeNr"
                  name="anzeigeNr"
                  placeholder="optional"
                />
                <small class="hint">{{ t.adNumberHint }}</small>
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.distanceKm }}</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  [(ngModel)]="entfernungKm"
                  name="entfernungKm"
                  placeholder="optional"
                />
                <small class="hint">{{ t.distanceKmHint }}</small>
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

          <!-- Seller info -->
          <div class="form-card seller-card">
            <h2>
              {{
                bulkMode ? t.supplierStore : t.seller + ' (' + t.customer + ')'
              }}
            </h2>
            <div class="customer-search" *ngIf="!bulkMode">
              <label>Stammkunde? Schnell übernehmen</label>
              <app-customer-picker
                (customerSelected)="fillSeller($event)"
              ></app-customer-picker>
            </div>
            <div class="form-grid">
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.firstNameRequired }}</label>
                <input
                  [(ngModel)]="seller.vorname"
                  name="sellerVorname"
                  [required]="!bulkMode"
                  (ngModelChange)="updateSignerName()"
                  autocomplete="off"
                />
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.lastNameRequired }}</label>
                <input
                  [(ngModel)]="seller.nachname"
                  name="sellerNachname"
                  [required]="!bulkMode"
                  (ngModelChange)="updateSignerName()"
                  autocomplete="off"
                />
              </div>
              <div class="field full" *ngIf="bulkMode">
                <label>{{ t.storeName }} *</label>
                <input
                  [(ngModel)]="seller.nachname"
                  name="sellerStore"
                  [required]="bulkMode"
                  [placeholder]="t.storeNamePlaceholder"
                  list="storeNameList"
                  autocomplete="off"
                />
                <datalist id="storeNameList">
                  <option *ngFor="let s of storeNames" [value]="s"></option>
                </datalist>
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.street }}</label>
                <input [(ngModel)]="seller.strasse" name="sellerStrasse" />
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.houseNumber }}</label>
                <input [(ngModel)]="seller.hausnummer" name="sellerHausnr" />
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.postalCode }}</label>
                <input [(ngModel)]="seller.plz" name="sellerPlz" />
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.city }}</label>
                <input [(ngModel)]="seller.stadt" name="sellerStadt" />
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.phone }}</label>
                <input [(ngModel)]="seller.telefon" name="sellerTel" />
              </div>
              <div class="field" *ngIf="!bulkMode">
                <label>{{ t.email }}</label>
                <input
                  type="email"
                  [(ngModel)]="seller.email"
                  name="sellerEmail"
                />
              </div>
            </div>
          </div>

          <!-- Verkaufsfotos (for Website & Kleinanzeigen) -->
          <div class="form-card" *ngIf="!bulkMode">
            <h2>📸 {{ t.salesPhotos }}</h2>
            <p class="hint-text">
              {{ t.salesPhotosHint }}
            </p>
            <input
              type="file"
              #galleryInput
              (change)="onGalleryFilesSelected($event)"
              accept="image/*"
              multiple
              style="display: none"
            />
            <button
              type="button"
              class="dropzone"
              [class.dragover]="dragTarget === 'gallery'"
              (click)="galleryInput.click()"
              (dragover)="onDragOver($event, 'gallery')"
              (dragleave)="dragTarget = null"
              (drop)="onDrop($event, 'gallery')"
            >
              <span>📷 <strong>{{ t.selectPhotos }}</strong> oder hierher ziehen</span>
              <small *ngIf="galleryFiles.length > 0"
                >{{ galleryFiles.length }} {{ t.photosSelected }}</small
              >
            </button>
            <div class="preview-grid" *ngIf="galleryPreviewUrls.length > 0">
              <div
                class="preview-item"
                *ngFor="let url of galleryPreviewUrls; let i = index"
              >
                <img [src]="url" alt="Galerie Vorschau" />
                <button
                  type="button"
                  class="remove-btn"
                  (click)="removeGalleryFile(i)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Einkaufsfotos (internal documentation) -->
          <div class="form-card" *ngIf="!bulkMode">
            <h2>📄 {{ t.purchasePhotos }}</h2>
            <p class="hint-text">
              {{ t.purchasePhotosHint }}
            </p>
            <input
              type="file"
              #fileInput
              (change)="onFilesSelected($event)"
              accept="image/*"
              multiple
              style="display: none"
            />
            <button
              type="button"
              class="dropzone"
              [class.dragover]="dragTarget === 'documents'"
              (click)="fileInput.click()"
              (dragover)="onDragOver($event, 'documents')"
              (dragleave)="dragTarget = null"
              (drop)="onDrop($event, 'documents')"
            >
              <span>📄 <strong>{{ t.selectPhotos }}</strong> oder hierher ziehen</span>
              <small *ngIf="selectedFiles.length > 0"
                >{{ selectedFiles.length }} {{ t.photosSelected }}</small
              >
            </button>
            <div class="preview-grid" *ngIf="previewUrls.length > 0">
              <div
                class="preview-item"
                *ngFor="let url of previewUrls; let i = index"
              >
                <img [src]="url" alt="Vorschau" />
                <button
                  type="button"
                  class="remove-btn"
                  (click)="removeFile(i)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky save bar -->
        <div class="form-action-bar">
          <div class="bar-summary">
            <span class="bar-title">{{
              bulkMode ? t.totalPrice : t.price
            }}</span>
            <span class="bar-value"
              >{{
                (bulkMode ? preis * bulkQuantity : preis) || 0
                  | number: '1.2-2'
              }}
              €</span
            >
            <span class="bar-hint warn" *ngIf="missingFields().length > 0">
              Noch offen: {{ missingFields().join(', ') }}
            </span>
            <span class="bar-hint ok" *ngIf="missingFields().length === 0">
              ✓ {{ bulkMode ? bulkQuantity + 'x ' : ''
              }}{{ bicycle.marke }} {{ bicycle.modell }}
              <span class="kbd-hint">· <span class="kbd">Strg</span> +
                <span class="kbd">S</span></span>
            </span>
          </div>
          <button
            type="submit"
            class="btn btn-primary btn-lg"
            [disabled]="submitting"
          >
            {{
              submitting
                ? t.saving
                : bulkMode
                  ? t.saveBulkPurchase
                  : t.savePurchase
            }}
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
      .page-header h1 {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-primary);
      }
      .mode-toggle {
        display: flex;
        gap: 0;
        margin-bottom: 20px;
        background: var(--bg-card, #fff);
        border-radius: var(--radius-lg, 14px);
        border: 1.5px solid var(--border-light, #e2e8f0);
        overflow: hidden;
      }
      .toggle-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        background: transparent;
        font-size: 0.92rem;
        font-weight: 600;
        cursor: pointer;
        color: var(--text-secondary, #64748b);
        transition: var(--transition-fast);
      }
      .toggle-btn.active {
        background: var(--accent-primary, #e64a19);
        color: white;
      }
      .toggle-btn:not(.active):hover {
        background: var(--table-hover, #f1f5f9);
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
      .bulk-quantity {
        margin-bottom: 18px;
        padding-bottom: 18px;
        border-bottom: 1.5px solid var(--border-light, #e2e8f0);
      }
      .bulk-quantity label {
        display: block;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-secondary, #64748b);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .quantity-control {
        display: flex;
        align-items: center;
        gap: 0;
        width: fit-content;
      }
      .qty-btn {
        width: 40px;
        height: 40px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        background: var(--bg-card, #fff);
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        color: var(--text-primary);
        transition: var(--transition-fast);
      }
      .qty-btn:first-child {
        border-radius: var(--radius-md, 10px) 0 0 var(--radius-md, 10px);
      }
      .qty-btn:last-child {
        border-radius: 0 var(--radius-md, 10px) var(--radius-md, 10px) 0;
      }
      .qty-btn:hover {
        background: var(--accent-primary-light, rgba(230, 74, 25, 0.08));
        border-color: var(--accent-primary, #e64a19);
        color: var(--accent-primary, #e64a19);
      }
      .qty-input {
        width: 60px;
        height: 40px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-left: none;
        border-right: none;
        text-align: center;
        font-size: 1.1rem;
        font-weight: 700;
        background: var(--bg-card, #fff);
        color: var(--text-primary);
      }
      .qty-input:focus {
        outline: none;
      }
      .bulk-quantity .hint {
        display: block;
        font-size: 0.73rem;
        color: var(--text-secondary, #94a3b8);
        margin-top: 6px;
      }
      .calculated-price {
        padding: 9px 12px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-radius: var(--radius-md, 10px);
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--accent-primary, #e64a19);
        background: var(--accent-primary-light, rgba(230, 74, 25, 0.06));
      }
      .fixed-value {
        padding: 9px 12px;
        border: 1.5px solid var(--border-light, #e2e8f0);
        border-radius: var(--radius-md, 10px);
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-secondary, #64748b);
        background: var(--bg-tertiary, #f1f5f9);
      }
      .btn {
        padding: 8px 16px;
        border-radius: var(--radius-md, 10px);
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        border: none;
        transition: var(--transition-fast);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
      }
      .btn-primary {
        background: var(--accent-primary, #e64a19);
        color: white;
      }
      .btn-primary:hover {
        background: var(--accent-primary-hover, #c43c0f);
        box-shadow: var(--shadow-sm);
      }
      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .btn-outline {
        background: var(--bg-card, #fff);
        color: var(--text-primary);
        border: 1.5px solid var(--border-light, #e2e8f0);
      }
      .btn-outline:hover {
        border-color: var(--accent-primary, #e64a19);
        color: var(--accent-primary, #e64a19);
      }
      .btn-lg {
        padding: 12px 32px;
        font-size: 1.05rem;
      }
      .hint-text {
        font-size: 0.85rem;
        color: var(--text-secondary, #64748b);
        margin-bottom: 12px;
      }
      .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
      }
      .preview-item {
        position: relative;
        aspect-ratio: 1;
        border-radius: var(--radius-md, 10px);
        overflow: hidden;
        border: 1.5px solid var(--border-light, #e2e8f0);
      }
      .preview-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .remove-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 24px;
        height: 24px;
        border: none;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        transition: var(--transition-fast);
      }
      .remove-btn:hover {
        background: var(--accent-danger, #ef4444);
      }
      .margin-hint {
        display: block;
        margin-top: 6px;
        font-size: 0.8rem;
        color: var(--accent-success);
      }
      .margin-hint.negative {
        color: var(--accent-danger);
      }
      .input-invalid {
        border-color: var(--accent-danger) !important;
      }
    `,
  ],
})
export class PurchaseFormComponent implements OnInit {
  private translationService = inject(TranslationService);
  private notificationService = inject(NotificationService);
  get t() {
    return this.translationService.translations();
  }

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
  readonly artOptions = ['Herren', 'Damen', 'Kinder', 'Unisex'];
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

  /** Highlight missing required fields once the user tried to save. */
  showErrors = false;
  dragTarget: 'gallery' | 'documents' | null = null;
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
    { value: 'Türkis', label: 'Türkis', hex: '#06b6d4' },
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

  bulkMode = false;
  bulkQuantity = 1;

  seller = {
    vorname: '',
    nachname: '',
    strasse: '',
    hausnummer: '',
    plz: '',
    stadt: '',
    telefon: '',
    email: '',
    steuernummer: '',
  };
  bicycle = {
    marke: '',
    modell: '',
    rahmennummer: '',
    rahmengroesse: '',
    farbe: '',
    reifengroesse: '',
    fahrradtyp: '',
    art: '',
    beschreibung: '',
    zustand: BikeCondition.Gebraucht,
  };
  preis = 0;
  verkaufspreisVorschlag: number | null = null;
  zahlungsart: PaymentMethod = PaymentMethod.Bar;
  kaufdatum = '';
  notizen = '';
  anzeigeNr = '';
  entfernungKm: number | null = null;
  belegNummer = '';
  signatureData = '';
  signerName = '';
  submitting = false;

  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  galleryFiles: File[] = [];
  galleryPreviewUrls: string[] = [];

  brands: string[] = [];
  models: string[] = [];
  storeNames: string[] = [];

  firstNames: string[] = [];
  lastNames: string[] = [];

  constructor(
    private purchaseService: PurchaseService,
    private documentService: DocumentService,
    private bicycleService: BicycleService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Check for bulk mode from query param
    this.route.queryParams.subscribe((params) => {
      if (params['bulk'] === 'true') {
        this.bulkMode = true;
        this.bicycle.zustand = BikeCondition.Neu; // Bulk mode is always Neu
      } else {
        this.bicycle.zustand = BikeCondition.Gebraucht; // Single mode is Gebraucht
      }
    });

    this.kaufdatum = new Date().toISOString().split('T')[0];
    this.purchaseService.getNextBelegNummer().subscribe({
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

    // Load store names for autocomplete
    this.purchaseService.getStoreNames().subscribe({
      next: (res) => {
        this.storeNames = res;
      },
      error: () => {},
    });

    // Load all models initially
    this.bicycleService.getModels().subscribe({
      next: (res) => {
        this.models = res;
      },
      error: () => {},
    });

    // Load customer names for autocomplete
    this.customerService.getFirstNames().subscribe({
      next: (res) => {
        this.firstNames = res;
      },
      error: () => {},
    });

    this.customerService.getLastNames().subscribe({
      next: (res) => {
        this.lastNames = res;
      },
      error: () => {},
    });
  }

  increaseQty() {
    if (this.bulkQuantity < 100) this.bulkQuantity++;
  }

  decreaseQty() {
    if (this.bulkQuantity > 1) this.bulkQuantity--;
  }

  setBulkMode(isBulk: boolean) {
    this.bulkMode = isBulk;
    // Set the correct Zustand based on mode
    this.bicycle.zustand = isBulk ? BikeCondition.Neu : BikeCondition.Gebraucht;
  }

  onBrandChange() {
    // Load models filtered by the selected brand
    const brand = this.bicycle.marke?.trim();
    if (brand && this.brands.includes(brand)) {
      this.bicycleService.getModels(brand).subscribe({
        next: (res) => {
          this.models = res;
        },
        error: () => {},
      });
    } else {
      // Load all models if brand is cleared or doesn't match exactly
      this.bicycleService.getModels().subscribe({
        next: (res) => {
          this.models = res;
        },
        error: () => {},
      });
    }
  }

  canSubmit(): boolean {
    const baseValid = !!(
      this.bicycle.marke?.trim() &&
      this.bicycle.reifengroesse?.trim() &&
      this.preis > 0 &&
      this.kaufdatum
    );

    if (this.bulkMode) {
      return (
        baseValid && !!this.seller.nachname?.trim() && this.bulkQuantity >= 1
      );
    }

    // Seller vorname and nachname are now optional
    return baseValid;
  }

  missingFields(): string[] {
    const missing: string[] = [];
    if (this.bulkMode && !this.seller.nachname?.trim())
      missing.push(this.t.storeName);
    if (!this.bicycle.marke?.trim()) missing.push(this.t.brand);
    if (!this.bicycle.reifengroesse?.trim()) missing.push(this.t.wheelSize);
    if (!(this.preis > 0)) missing.push(this.t.price);
    if (!this.kaufdatum) missing.push(this.t.purchaseDate);
    return missing;
  }

  fillSeller(customer: Customer) {
    this.seller = {
      ...this.seller,
      vorname: customer.vorname || '',
      nachname: customer.nachname || '',
      strasse: customer.strasse || '',
      hausnummer: customer.hausnummer || '',
      plz: customer.plz || '',
      stadt: customer.stadt || '',
      telefon: customer.telefon || '',
      email: customer.email || '',
      steuernummer: customer.steuernummer || '',
    };
    this.updateSignerName();
    this.notificationService.info(
      `${customer.vorname} ${customer.nachname} übernommen`,
      2500,
    );
  }

  @HostListener('document:keydown', ['$event'])
  onShortcut(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      if (!this.submitting) this.submit();
    }
  }

  onDragOver(event: DragEvent, target: 'gallery' | 'documents') {
    event.preventDefault();
    this.dragTarget = target;
  }

  onDrop(event: DragEvent, target: 'gallery' | 'documents') {
    event.preventDefault();
    this.dragTarget = null;
    const files = Array.from(event.dataTransfer?.files || []).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (target === 'gallery') {
      this.addFiles(files, this.galleryFiles, this.galleryPreviewUrls);
    } else {
      this.addFiles(files, this.selectedFiles, this.previewUrls);
    }
  }

  private addFiles(files: File[], list: File[], previews: string[]) {
    for (const file of files) {
      list.push(file);
      const reader = new FileReader();
      reader.onload = (e) => previews.push(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  updateSignerName() {
    const name = [this.seller.vorname, this.seller.nachname]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (name) {
      this.signerName = name;
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.addFiles(
      Array.from(input.files || []),
      this.selectedFiles,
      this.previewUrls,
    );
    input.value = '';
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onGalleryFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.addFiles(
      Array.from(input.files || []),
      this.galleryFiles,
      this.galleryPreviewUrls,
    );
    input.value = '';
  }

  removeGalleryFile(index: number) {
    this.galleryFiles.splice(index, 1);
    this.galleryPreviewUrls.splice(index, 1);
  }

  submit() {
    if (!this.canSubmit()) {
      this.showErrors = true;
      this.notificationService.warning(
        'Bitte noch ausfüllen: ' + this.missingFields().join(', '),
      );
      return;
    }
    this.submitting = true;
    if (this.bulkMode) {
      this.submitBulk();
    } else {
      this.submitSingle();
    }
  }

  private submitBulk() {
    const bulkData: BulkPurchaseCreate = {
      bicycle: {
        marke: this.bicycle.marke,
        modell: this.bicycle.modell,
        farbe: this.bicycle.farbe || undefined,
        reifengroesse: this.bicycle.reifengroesse,
        rahmengroesse: this.bicycle.rahmengroesse || undefined,
        fahrradtyp: this.bicycle.fahrradtyp || undefined,
        beschreibung: this.bicycle.beschreibung || undefined,
        zustand: this.bicycle.zustand as BikeCondition,
      },
      seller: {
        vorname: this.seller.vorname || this.seller.nachname,
        nachname: this.seller.nachname,
      },
      anzahl: this.bulkQuantity,
      preis: this.preis,
      verkaufspreisVorschlag: this.verkaufspreisVorschlag || undefined,
      zahlungsart: this.zahlungsart,
      kaufdatum: this.kaufdatum,
      notizen: this.notizen || undefined,
      belegNummer: this.belegNummer || undefined,
      anzeigeNr: this.anzeigeNr || undefined,
      entfernungKm: this.entfernungKm || undefined,
    };

    this.purchaseService.createBulk(bulkData).subscribe({
      next: () => {
        this.notificationService.success(
          `${this.bulkQuantity} Fahrräder angekauft`,
        );
        this.router.navigate(['/purchases']);
      },
      error: () => {
        this.submitting = false;
        this.notificationService.error('Fehler beim Speichern des Sammelankaufs');
      },
    });
  }

  private submitSingle() {
    const purchase: PurchaseCreate = {
      bicycle: this.bicycle,
      seller: this.seller,
      preis: this.preis,
      verkaufspreisVorschlag: this.verkaufspreisVorschlag || undefined,
      zahlungsart: this.zahlungsart,
      kaufdatum: this.kaufdatum,
      notizen: this.notizen || undefined,
      belegNummer: this.belegNummer || undefined,
      anzeigeNr: this.anzeigeNr || undefined,
      entfernungKm: this.entfernungKm || undefined,
    };

    this.purchaseService.create(purchase).subscribe({
      next: (result) => {
        this.notificationService.success(
          `Ankauf gespeichert: ${this.bicycle.marke} ${this.bicycle.modell}`.trim(),
        );
        const allUploads: Observable<any>[] = [];

        // Upload document files (screenshots/invoices)
        if (this.selectedFiles.length > 0 && result.id) {
          const docType =
            this.bicycle.zustand === 'Neu'
              ? DocumentType.Rechnung
              : DocumentType.Screenshot;
          const docUploads = this.selectedFiles.map((file) =>
            this.documentService.upload(
              file,
              docType,
              result.bicycle.id,
              result.id,
            ),
          );
          allUploads.push(...docUploads);
        }

        // Upload gallery photos (for website/Kleinanzeigen)
        if (this.galleryFiles.length > 0 && result.bicycle?.id) {
          const galleryUploads = this.galleryFiles.map((file) =>
            this.bicycleService.uploadGalleryImage(result.bicycle.id, file),
          );
          allUploads.push(...galleryUploads);
        }

        if (allUploads.length > 0) {
          forkJoin(allUploads).subscribe({
            next: () => {
              this.router.navigate(['/purchases']);
            },
            error: () => {
              this.notificationService.warning(
                'Ankauf gespeichert, aber einige Fotos konnten nicht hochgeladen werden',
              );
              this.router.navigate(['/purchases']);
            },
          });
        } else {
          this.router.navigate(['/purchases']);
        }
      },
      error: () => {
        this.submitting = false;
        this.notificationService.error('Fehler beim Speichern des Ankaufs');
      },
    });
  }
}
