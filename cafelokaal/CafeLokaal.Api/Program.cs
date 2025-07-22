using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Configure Azure AD B2C Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["AzureAdB2C:Authority"];
        options.Audience = builder.Configuration["AzureAdB2C:Audience"];
        
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["AzureAdB2C:Authority"],
            ValidAudience = builder.Configuration["AzureAdB2C:Audience"],
            NameClaimType = "name",
            RoleClaimType = "roles"
        };
    });

// Add authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireCafeManager", policy =>
        policy.RequireRole("CafeManager"));
        
    options.AddPolicy("RequireAdmin", policy =>
        policy.RequireRole("Admin"));
        
    options.AddPolicy("RequireCafeAccess", policy =>
        policy.RequireAssertion(context =>
        {
            var cafeId = context.User.Claims
                .FirstOrDefault(c => c.Type == "extension_CafeId")?.Value;
            
            return context.User.IsInRole("CafeManager") &&
                   !string.IsNullOrEmpty(cafeId);
        }));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add authentication & authorization to the pipeline
app.UseAuthentication();
app.UseAuthorization();
app.Run();