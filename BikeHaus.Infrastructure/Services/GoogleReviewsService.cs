using System.Text.Json;
using BikeHaus.Application.DTOs;
using BikeHaus.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BikeHaus.Infrastructure.Services;

public class GoogleReviewsService : IGoogleReviewsService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GoogleReviewsService> _logger;

    private static GoogleReviewsResponse? _cache;
    private static DateTime _cacheExpiry = DateTime.MinValue;
    private static readonly SemaphoreSlim _semaphore = new(1, 1);

    public GoogleReviewsService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<GoogleReviewsService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<GoogleReviewsResponse?> GetReviewsAsync()
    {
        if (_cache != null && DateTime.UtcNow < _cacheExpiry)
            return _cache;

        await _semaphore.WaitAsync();
        try
        {
            // Double-check after acquiring lock
            if (_cache != null && DateTime.UtcNow < _cacheExpiry)
                return _cache;

            var apiKey = _configuration["GooglePlaces:ApiKey"];
            var placeId = _configuration["GooglePlaces:PlaceId"];

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(placeId))
            {
                _logger.LogWarning("GooglePlaces:ApiKey or GooglePlaces:PlaceId not configured");
                return null;
            }

            // Places API (New) — the legacy place/details endpoint cannot be
            // enabled on new Google Cloud projects anymore.
            var client = _httpClientFactory.CreateClient("GooglePlaces");
            using var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://places.googleapis.com/v1/places/{Uri.EscapeDataString(placeId)}?languageCode=de");
            request.Headers.Add("X-Goog-Api-Key", apiKey);
            request.Headers.Add("X-Goog-FieldMask", "rating,userRatingCount,reviews,googleMapsUri");

            var response = await client.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Google Places API returned {StatusCode}: {Body}", response.StatusCode, json);
                return _cache; // Return stale cache if available
            }

            using var doc = JsonDocument.Parse(json);
            var result = doc.RootElement;
            var reviews = new List<GoogleReviewDto>();

            if (result.TryGetProperty("reviews", out var reviewsElement))
            {
                foreach (var review in reviewsElement.EnumerateArray())
                {
                    review.TryGetProperty("authorAttribution", out var author);
                    var text = GetText(review, "text");
                    if (string.IsNullOrEmpty(text)) text = GetText(review, "originalText");
                    long time = 0;
                    if (review.TryGetProperty("publishTime", out var pt)
                        && DateTimeOffset.TryParse(pt.GetString(), out var published))
                        time = published.ToUnixTimeSeconds();

                    reviews.Add(new GoogleReviewDto
                    {
                        AuthorName = author.ValueKind == JsonValueKind.Object && author.TryGetProperty("displayName", out var an) ? an.GetString() ?? "" : "",
                        AuthorPhotoUrl = author.ValueKind == JsonValueKind.Object && author.TryGetProperty("photoUri", out var pp) ? pp.GetString() ?? "" : "",
                        Rating = review.TryGetProperty("rating", out var r) ? r.GetInt32() : 5,
                        Text = text,
                        RelativeTime = review.TryGetProperty("relativePublishTimeDescription", out var rt) ? rt.GetString() ?? "" : "",
                        Time = time,
                    });
                }
            }

            _cache = new GoogleReviewsResponse
            {
                Rating = result.TryGetProperty("rating", out var rating) ? rating.GetDouble() : 0,
                TotalReviews = result.TryGetProperty("userRatingCount", out var total) ? total.GetInt32() : 0,
                Reviews = reviews,
                PlaceUrl = result.TryGetProperty("googleMapsUri", out var placeUrl) ? placeUrl.GetString() ?? "" : "",
            };
            _cacheExpiry = DateTime.UtcNow.AddHours(24);

            _logger.LogInformation("Fetched {Count} Google reviews, rating {Rating}", reviews.Count, _cache.Rating);
            return _cache;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch Google reviews");
            return _cache; // Return stale cache if available
        }
        finally
        {
            _semaphore.Release();
        }
    }

    private static string GetText(JsonElement review, string property) =>
        review.TryGetProperty(property, out var el) && el.TryGetProperty("text", out var t)
            ? t.GetString() ?? ""
            : "";
}
