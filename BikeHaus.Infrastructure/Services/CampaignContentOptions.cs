namespace BikeHaus.Infrastructure.Services;

/// <summary>
/// Business-specific content of the Google-review request mail and the
/// unsubscribe confirmation page. Bound from the "Campaign" section so the
/// review link, signature and address live in configuration instead of being
/// hard-coded — change them in appsettings, never in the service.
/// </summary>
public class CampaignContentOptions
{
    /// <summary>Shop name shown in the body, signature and subject fallback.</summary>
    public string BusinessName { get; set; } = "Karaarslan Bike";

    /// <summary>Mail subject line.</summary>
    public string Subject { get; set; } = "Wie war Ihr Besuch bei Karaarslan Bike?";

    /// <summary>The Google review link (e.g. https://g.page/r/.../review). REQUIRED for the mail to be useful.</summary>
    public string ReviewUrl { get; set; } = string.Empty;

    /// <summary>Name signed under the mail (a real person reads more personal).</summary>
    public string SenderName { get; set; } = string.Empty;

    /// <summary>Single-line postal address for the signature.</summary>
    public string AddressLine { get; set; } = string.Empty;

    /// <summary>Phone / WhatsApp shown in the signature.</summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>Contact address shown on the unsubscribe page for manual opt-out.</summary>
    public string ContactEmail { get; set; } = string.Empty;

    /// <summary>Public website, linked from the unsubscribe confirmation page.</summary>
    public string WebsiteUrl { get; set; } = "https://karaarslan-bike.de";
}
