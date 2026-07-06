using BikeHaus.Application.Interfaces;
using BikeHaus.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BikeHaus.API.Controllers;

/// <summary>
/// Public opt-out endpoint for marketing/newsletter mails (Abmeldung).
/// Linked from the footer of every campaign mail. No auth: the signed token
/// in the URL identifies the recipient.
/// </summary>
[ApiController]
[Route("api/public/unsubscribe")]
[AllowAnonymous]
public class UnsubscribeController : ControllerBase
{
    private readonly IUnsubscribeService _unsubscribe;
    private readonly CampaignContentOptions _content;
    private readonly ILogger<UnsubscribeController> _logger;

    public UnsubscribeController(
        IUnsubscribeService unsubscribe,
        IOptions<CampaignContentOptions> content,
        ILogger<UnsubscribeController> logger)
    {
        _unsubscribe = unsubscribe;
        _content = content.Value;
        _logger = logger;
    }

    /// <summary>
    /// Recipient clicks the "Abmelden" link in the e-mail (browser GET).
    /// Returns a small self-contained confirmation page.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Unsubscribe([FromQuery] string? token)
    {
        if (!_unsubscribe.TryValidateToken(token, out var email))
        {
            _logger.LogWarning("Unsubscribe GET with invalid/missing token.");
            return Content(BuildPage(success: false, email: null), "text/html; charset=utf-8");
        }

        await _unsubscribe.UnsubscribeAsync(email, "link");
        _logger.LogInformation("Unsubscribed {Email} via link.", email);
        return Content(BuildPage(success: true, email: email), "text/html; charset=utf-8");
    }

    /// <summary>
    /// RFC 8058 one-click unsubscribe (List-Unsubscribe-Post). Mail clients like
    /// Gmail POST here directly; must succeed without any further interaction.
    /// </summary>
    [HttpPost]
    [Consumes("application/x-www-form-urlencoded")]
    public async Task<IActionResult> UnsubscribeOneClick([FromQuery] string? token)
    {
        if (!_unsubscribe.TryValidateToken(token, out var email))
            return BadRequest();

        await _unsubscribe.UnsubscribeAsync(email, "one-click");
        _logger.LogInformation("Unsubscribed {Email} via one-click.", email);
        return Ok();
    }

    private string BuildPage(bool success, string? email)
    {
        var business = string.IsNullOrWhiteSpace(_content.BusinessName) ? "Karaarslan Bike" : _content.BusinessName;
        var contactEmail = _content.ContactEmail;
        var website = string.IsNullOrWhiteSpace(_content.WebsiteUrl) ? "https://karaarslan-bike.de" : _content.WebsiteUrl;
        var address = _content.AddressLine;

        var title = success ? "Erfolgreich abgemeldet" : "Link ungültig";
        var heading = success ? "Sie wurden abgemeldet" : "Abmeldung nicht möglich";
        var contactHint = string.IsNullOrWhiteSpace(contactEmail)
            ? "Bitte antworten Sie auf unsere E-Mail – wir tragen Sie manuell aus."
            : $"Bitte antworten Sie auf unsere E-Mail oder schreiben Sie an {System.Net.WebUtility.HtmlEncode(contactEmail)} – wir tragen Sie manuell aus.";
        var message = success
            ? (string.IsNullOrEmpty(email)
                ? "Sie erhalten von uns keine weiteren Werbe-E-Mails mehr."
                : $"Die Adresse <strong>{System.Net.WebUtility.HtmlEncode(email)}</strong> erhält von uns keine weiteren Werbe-E-Mails mehr.")
            : $"Dieser Abmelde-Link ist ungültig oder abgelaufen. {contactHint}";
        var accent = success ? "#16a34a" : "#dc2626";

        var footParts = new[] { business, address, contactEmail }
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .Select(System.Net.WebUtility.HtmlEncode);
        var foot = string.Join(" · ", footParts);

        return $@"<!DOCTYPE html>
<html lang=""de"">
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <meta name=""robots"" content=""noindex"">
  <title>{title} · {System.Net.WebUtility.HtmlEncode(business)}</title>
  <style>
    body {{ margin:0; background:#f4f5f7; font-family:Arial,Helvetica,sans-serif; color:#1f2937; }}
    .wrap {{ max-width:520px; margin:48px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.08); }}
    .head {{ background:#0f172a; padding:24px; text-align:center; color:#fff; font-size:18px; font-weight:bold; letter-spacing:.5px; }}
    .body {{ padding:32px; }}
    h1 {{ font-size:20px; margin:0 0 12px; color:{accent}; }}
    p {{ font-size:15px; line-height:1.6; margin:0 0 12px; }}
    a.btn {{ display:inline-block; margin-top:12px; color:#0ea5e9; text-decoration:none; font-weight:bold; }}
    .foot {{ padding:0 32px 28px; font-size:12px; color:#9ca3af; line-height:1.6; }}
  </style>
</head>
<body>
  <div class=""wrap"">
    <div class=""head"">{System.Net.WebUtility.HtmlEncode(business).ToUpperInvariant()}</div>
    <div class=""body"">
      <h1>{heading}</h1>
      <p>{message}</p>
      <a class=""btn"" href=""{System.Net.WebUtility.HtmlEncode(website)}"">Zur Website &rarr;</a>
    </div>
    <div class=""foot"">
      {foot}
    </div>
  </div>
</body>
</html>";
    }
}
