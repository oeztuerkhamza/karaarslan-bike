using BikeHaus.Application.DTOs;

namespace BikeHaus.Application.Interfaces;

public interface IEmailService
{
    Task SendSaleReceiptAsync(string toEmail, string toName, string belegNummer, byte[] pdfBytes);

    /// <summary>
    /// Sends the review campaign as a PLAIN-TEXT message from the dedicated
    /// campaign sender — no HTML, no List-Unsubscribe headers — so it reads
    /// like a normal personal mail instead of a newsletter. The opt-out link
    /// is embedded in the body text by the caller for legal compliance.
    /// </summary>
    Task SendNewsletterAsync(string toEmail, string toName, string subject, string textBody);
}
