namespace BikeHaus.Infrastructure.Services;

/// <summary>
/// Config for the automatic review-request flow (<see cref="ReviewAutomationBackgroundService"/>).
/// Bound from the "ReviewAutomation" section.
/// </summary>
public class ReviewAutomationOptions
{
    /// <summary>Master switch. When false the background service stays idle.</summary>
    public bool Enabled { get; set; } = false;

    /// <summary>How long after a Sale is created the mail is sent.</summary>
    public int DelayHours { get; set; } = 4;

    /// <summary>Minimum days between two review requests to the same address (shared with the manual campaign).</summary>
    public int MinIntervalDays { get; set; } = 90;

    /// <summary>Transactions older than this are no longer retried (bounds the scan + avoids infinite retries on bad addresses).</summary>
    public int MaxAgeDays { get; set; } = 7;

    /// <summary>How often the background service scans for matured transactions.</summary>
    public int ScanIntervalMinutes { get; set; } = 30;
}
