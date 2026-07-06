using BikeHaus.Application.DTOs;
using BikeHaus.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BikeHaus.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly IShopSettingsService _settingsService;

    public SettingsController(IShopSettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<ActionResult<ShopSettingsDto>> GetSettings()
    {
        var settings = await _settingsService.GetSettingsAsync();
        if (settings == null)
        {
            // Return default settings if none exist
            return Ok(new ShopSettingsDto
            {
                ShopName = "Karaarslan Bike"
            });
        }
        return Ok(settings);
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<ShopSettingsDto>> UpdateSettings([FromBody] UpdateShopSettingsDto dto)
    {
        var settings = await _settingsService.UpdateSettingsAsync(dto);
        return Ok(settings);
    }

    [Authorize]
    [HttpPost("company-emails")]
    public async Task<ActionResult<ShopSettingsDto>> CreateCompanyEmail([FromBody] CreateCompanyEmailDto dto)
    {
        try
        {
            var settings = await _settingsService.CreateCompanyEmailAsync(dto);
            return Ok(settings);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("company-emails/change-password")]
    public async Task<IActionResult> ChangeCompanyEmailPassword([FromBody] ChangeCompanyEmailPasswordDto dto)
    {
        try
        {
            await _settingsService.ChangeCompanyEmailPasswordAsync(dto);
            return Ok(new { message = "Passwort erfolgreich aktualisiert." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("logo")]
    public async Task<ActionResult<ShopSettingsDto>> UploadLogo([FromBody] UploadLogoDto dto)
    {
        if (string.IsNullOrEmpty(dto.LogoBase64))
        {
            return BadRequest("Logo data is required");
        }

        var settings = await _settingsService.UploadLogoAsync(dto);
        return Ok(settings);
    }

    [Authorize]
    [HttpDelete("logo")]
    public async Task<IActionResult> DeleteLogo()
    {
        await _settingsService.DeleteLogoAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPost("owner-signature")]
    public async Task<ActionResult<ShopSettingsDto>> UploadOwnerSignature([FromBody] UploadSignatureDto dto)
    {
        if (string.IsNullOrEmpty(dto.SignatureBase64))
        {
            return BadRequest("Signature data is required");
        }

        var settings = await _settingsService.UploadOwnerSignatureAsync(dto);
        return Ok(settings);
    }

    [Authorize]
    [HttpDelete("owner-signature")]
    public async Task<IActionResult> DeleteOwnerSignature()
    {
        await _settingsService.DeleteOwnerSignatureAsync();
        return NoContent();
    }

}
