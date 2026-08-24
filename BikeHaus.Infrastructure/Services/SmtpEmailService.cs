using System.IO;
using System.Net.Security;
using System.Net.Sockets;
using BikeHaus.Application.DTOs;
using BikeHaus.Application.Interfaces;
using BikeHaus.Domain.Entities;
using BikeHaus.Infrastructure.Data;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Linq;

namespace BikeHaus.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private const int MaxSendAttempts = 3;
    private readonly SmtpOptions _options;
    private readonly CampaignSmtpOptions _campaignOptions;
    private readonly ILogger<SmtpEmailService> _logger;
    private readonly BikeHausDbContext _db;

    public SmtpEmailService(
        IOptions<SmtpOptions> options,
        IOptions<CampaignSmtpOptions> campaignOptions,
        ILogger<SmtpEmailService> logger,
        BikeHausDbContext db)
    {
        _options = options.Value;
        _campaignOptions = campaignOptions.Value;
        _logger = logger;
        _db = db;
    }

    /// <summary>Optional per-send identity override (used by the campaign mailbox).</summary>
    private sealed record SenderIdentity(string Username, string Password, string FromEmail, string FromName);

    public Task SendSaleReceiptAsync(string toEmail, string toName, string belegNummer, byte[] pdfBytes)
    {
        var subject = $"Rechnung - {belegNummer} | Karaarslan Bike";
        var body = $@"Hallo {toName},

vielen Dank fuer deinen Einkauf bei uns.

anbei schicken wir dir deine Rechnung als PDF.

Belegnummer: {belegNummer}

Wenn du noch Fragen hast, antworte einfach auf diese E-Mail oder ruf kurz durch.

Viele Gruesse
Dein Team vom Karaarslan Bike";

        return SendAsync(
            toEmail,
            toName,
            subject,
            body,
            "Verkaufsrechnung",
            new[]
            {
                (Bytes: pdfBytes, FileName: $"Rechnung-{belegNummer}.pdf")
            });
    }

    public Task SendNewsletterAsync(string toEmail, string toName, string subject, string textBody)
    {
        // Plain text, no List-Unsubscribe headers, no HTML — deliberately
        // looks like a one-to-one personal mail so Gmail does not file it
        // under "Promotions". Sent from the dedicated campaign mailbox
        // (falls back to the default sender when not configured).
        return SendAsync(
            toEmail,
            toName,
            subject,
            textBody,
            "Newsletter",
            attachments: null,
            sender: ResolveCampaignSender());
    }

    /// <summary>
    /// The campaign is sent from a dedicated mailbox so the review newsletter
    /// goes out under a real person's name, while ALL transactional mail keeps
    /// using the default sender. Returns null — and thus falls back to the
    /// default sender — when the campaign account is not configured.
    /// </summary>
    private SenderIdentity? ResolveCampaignSender()
    {
        var c = _campaignOptions;
        if (string.IsNullOrWhiteSpace(c.Username) || string.IsNullOrWhiteSpace(c.Password))
            return null;

        return new SenderIdentity(
            c.Username.Trim(),
            c.Password,
            FirstConfigured(c.FromEmail, c.Username),
            FirstConfigured(c.FromName, _options.FromName));
    }

    /// <summary>
    /// Resolves the SMTP login. Username and password are resolved as a PAIR,
    /// never field by field: pairing a DB username with the configured
    /// password would authenticate as neither account. A default DB account
    /// whose login is incomplete therefore falls back to the configured login
    /// as a whole, instead of shadowing it with a half-filled one.
    /// </summary>
    private (string Username, string Password) ResolveLogin(EmailAccount? dbAccount)
    {
        if (dbAccount is null)
            return (FirstConfigured(_options.Username), FirstConfigured(_options.Password));

        if (!string.IsNullOrWhiteSpace(dbAccount.Username) && !string.IsNullOrWhiteSpace(dbAccount.Password))
            return (dbAccount.Username.Trim(), dbAccount.Password);

        _logger.LogWarning(
            "Default email account {AccountId} ({Name}) has an incomplete login; falling back to the configured SMTP credentials.",
            dbAccount.Id,
            dbAccount.Name);

        return (FirstConfigured(_options.Username), FirstConfigured(_options.Password));
    }

    private async Task SendAsync(
        string toEmail,
        string toName,
        string subject,
        string body,
        string emailType = "",
        IEnumerable<(byte[] Bytes, string FileName)>? attachments = null,
        SenderIdentity? sender = null)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
            throw new InvalidOperationException("Recipient email address is required.");

        var dbAccount = await _db.EmailAccounts
            .Where(a => a.IsDefault && a.IsActive)
            .FirstOrDefaultAsync();

        // Host/Port/TLS always come from the server config (same SMTP server).
        var host = dbAccount is not null
            ? FirstConfigured(dbAccount.Host, _options.Host)
            : FirstConfigured(_options.Host);
        var port = dbAccount?.Port > 0 ? dbAccount.Port : _options.Port;
        var useSsl = dbAccount?.UseSsl ?? _options.UseSsl;

        // Identity (login + From) resolution order:
        //   1. explicit per-send override (campaign mailbox), else
        //   2. the active default DB account, else
        //   3. the config sender. The override never affects the path 2/3
        //      used by all transactional mail.
        var (username, password) = sender is not null
            ? (sender.Username, sender.Password)
            : ResolveLogin(dbAccount);
        var fromEmail = sender is not null
            ? sender.FromEmail
            : dbAccount is not null
                ? FirstConfigured(dbAccount.FromEmail, _options.FromEmail)
                : FirstConfigured(_options.FromEmail);
        var fromName = sender is not null
            ? sender.FromName
            : dbAccount is not null
                ? FirstConfigured(dbAccount.FromName, _options.FromName)
                : FirstConfigured(_options.FromName);

        if (string.IsNullOrWhiteSpace(fromEmail))
        {
            _logger.LogError("SMTP from address is not configured. Email to {To} cannot be sent.", toEmail);
            await LogEmailAsync(toEmail, toName, subject, emailType, "Fehler", "SMTP Absender fehlt.", dbAccount?.Id);
            throw new InvalidOperationException("SMTP from address is not configured.");
        }

        if (string.IsNullOrWhiteSpace(host))
        {
            _logger.LogError("SMTP host is not configured. Email to {To} cannot be sent.", toEmail);
            await LogEmailAsync(toEmail, toName, subject, emailType, "Fehler", "SMTP host nicht konfiguriert.", dbAccount?.Id);
            throw new InvalidOperationException("SMTP host is not configured.");
        }

        if (!string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(password))
        {
            _logger.LogError("SMTP password is empty. Email to {To} cannot be sent.", toEmail);
            await LogEmailAsync(toEmail, toName, subject, emailType, "Fehler", "SMTP Passwort fehlt.", dbAccount?.Id);
            throw new InvalidOperationException("SMTP password is empty.");
        }

        Exception? lastException = null;

        for (var attempt = 1; attempt <= MaxSendAttempts; attempt++)
        {
            try
            {
                var validAttachments = attachments?
                    .Where(a => a.Bytes is { Length: > 0 } && !string.IsNullOrWhiteSpace(a.FileName))
                    .ToList();

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                message.To.Add(new MailboxAddress(toName, toEmail));
                message.Subject = subject;

                if (validAttachments is { Count: > 0 })
                {
                    var multipart = new Multipart("mixed");
                    multipart.Add(new TextPart("plain") { Text = body });

                    foreach (var attachment in validAttachments)
                    {
                        multipart.Add(new MimePart("application", "pdf")
                        {
                            Content = new MimeContent(new MemoryStream(attachment.Bytes), ContentEncoding.Default),
                            ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                            ContentTransferEncoding = ContentEncoding.Base64,
                            FileName = attachment.FileName
                        });
                    }

                    message.Body = multipart;
                }
                else
                {
                    message.Body = new TextPart("plain") { Text = body };
                }

                using var client = new SmtpClient
                {
                    Timeout = 20000,
                    ServerCertificateValidationCallback = (_, _, _, sslPolicyErrors) =>
                        sslPolicyErrors == SslPolicyErrors.None || sslPolicyErrors == SslPolicyErrors.RemoteCertificateChainErrors
                };

                // Port-aware TLS selection. Mailcow (and most submission servers)
                // reject plain auth on 587 — STARTTLS is mandatory. The legacy
                // useSsl=false branch silently disabled encryption and broke auth.
                SecureSocketOptions socketOptions = port switch
                {
                    465 => SecureSocketOptions.SslOnConnect,
                    587 or 2525 => SecureSocketOptions.StartTls,
                    _ => useSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto
                };

                _logger.LogInformation(
                    "Sending email to {To}, subject: {Subject}, attempt {Attempt}/{MaxAttempts}",
                    toEmail,
                    subject,
                    attempt,
                    MaxSendAttempts);
                await client.ConnectAsync(host, port, socketOptions);

                if (!string.IsNullOrWhiteSpace(username))
                    await client.AuthenticateAsync(username, password);

                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                _logger.LogInformation("Email sent successfully to {To}", toEmail);

                await LogEmailAsync(toEmail, toName, subject, emailType, "Gesendet", null, dbAccount?.Id);
                return;
            }
            catch (Exception ex) when (attempt < MaxSendAttempts && IsTransientFailure(ex) && !IsAuthenticationFailure(ex))
            {
                lastException = ex;
                _logger.LogWarning(
                    ex,
                    "Transient SMTP failure while sending email to {To} via {Host}:{Port}. Retrying attempt {NextAttempt}/{MaxAttempts}",
                    toEmail,
                    host,
                    port,
                    attempt + 1,
                    MaxSendAttempts);
                await Task.Delay(TimeSpan.FromSeconds(attempt));
            }
            catch (Exception ex)
            {
                lastException = ex;
                break;
            }
        }

        _logger.LogError(lastException, "Failed to send email to {To} via {Host}:{Port}", toEmail, host, port);
        await LogEmailAsync(toEmail, toName, subject, emailType, "Fehler", lastException?.Message, dbAccount?.Id);
        throw lastException ?? new InvalidOperationException("SMTP send failed without an exception.");
    }

    private static string FirstConfigured(params string?[] values)
    {
        foreach (var value in values)
        {
            if (!string.IsNullOrWhiteSpace(value))
                return value;
        }

        return string.Empty;
    }

    private static bool IsAuthenticationFailure(Exception ex)
    {
        return ex.Message.Contains("authentication failed", StringComparison.OrdinalIgnoreCase)
            || ex.Message.Contains("auth failed", StringComparison.OrdinalIgnoreCase)
            || ex.Message.Contains("535", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsTransientFailure(Exception ex)
    {
        return ex switch
        {
            TimeoutException => true,
            IOException => true,
            SocketException => true,
            SmtpProtocolException => true,
            SmtpCommandException smtpCommandException => (int)smtpCommandException.StatusCode >= 400
                && (int)smtpCommandException.StatusCode < 500,
            _ when ex.Message.Contains("try again later", StringComparison.OrdinalIgnoreCase) => true,
            _ => false
        };
    }

    private async Task LogEmailAsync(string toEmail, string toName, string subject, string emailType, string status, string? error, int? accountId)
    {
        try
        {
            _db.EmailLogs.Add(new EmailLog
            {
                ToEmail = toEmail,
                ToName = toName,
                Subject = subject,
                EmailType = emailType,
                Status = status,
                ErrorMessage = error,
                EmailAccountId = accountId,
            });
            await _db.SaveChangesAsync();
        }
        catch (Exception logEx)
        {
            _logger.LogWarning(logEx, "Failed to log email to database.");
        }
    }
}
