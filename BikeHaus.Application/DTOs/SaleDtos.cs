using BikeHaus.Domain.Enums;

namespace BikeHaus.Application.DTOs;

// ── SalePayment DTOs ──
public record SalePaymentDto(
    int Id,
    PaymentMethod Zahlungsart,
    decimal Betrag
);

public record SalePaymentCreateDto(
    PaymentMethod Zahlungsart,
    decimal Betrag
);

// ── SaleAccessory DTOs ──
public record SaleAccessoryDto(
    int Id,
    string Bezeichnung,
    decimal Preis,
    int Menge,
    decimal Gesamtpreis
);

public record SaleAccessoryCreateDto(
    string Bezeichnung,
    decimal Preis,
    int Menge
);

// ── Sale DTOs ──
public record SaleDto(
    int Id,
    string BelegNummer,
    BicycleDto Bicycle,
    CustomerDto Buyer,
    int? PurchaseId,
    decimal Preis,
    PaymentMethod Zahlungsart,
    DateTime Verkaufsdatum,
    bool Garantie,
    string? GarantieBedingungen,
    string? Notizen,
    SignatureDto? BuyerSignature,
    SignatureDto? SellerSignature,
    List<SaleAccessoryDto> Accessories,
    List<SalePaymentDto> Zahlungen,
    decimal Rabatt,
    bool Versand,
    decimal VersandGebuehr,
    decimal Gesamtbetrag,
    DateTime CreatedAt
);

public record SaleCreateDto(
    int BicycleId,
    bool IsAccessoryOnly,
    int? PurchaseId,
    CustomerCreateDto Buyer,
    decimal Preis,
    PaymentMethod Zahlungsart,
    DateTime? Verkaufsdatum,
    bool Garantie,
    string? GarantieBedingungen,
    string? Notizen,
    SignatureCreateDto? BuyerSignature,
    SignatureCreateDto? SellerSignature,
    List<SaleAccessoryCreateDto>? Accessories,
    List<SalePaymentCreateDto>? Zahlungen = null,
    decimal Rabatt = 0,
    bool Versand = false,
    decimal VersandGebuehr = 0,
    string? BelegNummer = null
);

public record SaleListDto(
    int Id,
    string BelegNummer,
    int BicycleId,
    int? PurchaseId,
    string BikeInfo,
    string? Rahmennummer,
    string BuyerName,
    decimal Preis,
    decimal Gesamtbetrag,
    decimal Rabatt,
    bool Versand,
    decimal VersandGebuehr,
    PaymentMethod Zahlungsart,
    List<SalePaymentDto> Zahlungen,
    DateTime Verkaufsdatum,
    bool Garantie,
    BikeCondition Zustand
);

// Update DTO - for editing existing sales
public record SaleUpdateDto(
    CustomerUpdateDto Buyer,
    decimal Preis,
    PaymentMethod Zahlungsart,
    DateTime Verkaufsdatum,
    bool Garantie,
    string? GarantieBedingungen,
    string? Notizen,
    List<SaleAccessoryCreateDto>? Accessories,
    List<SalePaymentCreateDto>? Zahlungen = null,
    decimal Rabatt = 0,
    bool Versand = false,
    decimal VersandGebuehr = 0,
    string? BelegNummer = null
);
