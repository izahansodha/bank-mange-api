using System.Text;
using BankApi.data;
using BankApi.Services;
using FluentValidation;
using Google.GenAI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// CONTROLLERS
// =====================================================

builder.Services.AddControllers();

// =====================================================
// FLUENT VALIDATION
// =====================================================

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// =====================================================
// DATABASE
// =====================================================

builder.Services.AddDbContext<BankContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        )
    )
);

// =====================================================
// APPLICATION SERVICES
// =====================================================

builder.Services.AddScoped<IAuthServices, AuthService>();

builder.Services.AddScoped<IAccountService, AccountService>();

builder.Services.AddScoped<ITransactionService, TransactionService>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<BankingAITools>();
builder.Services.AddSingleton<AIPendingTransferService>();

// =====================================================
// GEMINI AI
// =====================================================

builder.Services.AddSingleton(sp =>
{
    var configuration =
        sp.GetRequiredService<IConfiguration>();

    var apiKey =
        configuration["Gemini:ApiKey"];

    if (string.IsNullOrWhiteSpace(apiKey))
    {
        throw new InvalidOperationException(
            "Gemini API key is not configured."
        );
    }

    return new Client(
        apiKey: apiKey
    );
});

// =====================================================
// CORS
// =====================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// =====================================================
// SWAGGER
// =====================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",

            Type =
                Microsoft.OpenApi.Models.SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            In =
                Microsoft.OpenApi.Models.ParameterLocation.Header,

            Description =
                "Enter: Bearer {your JWT token}"
        }
    );

    options.AddSecurityRequirement(
        new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference =
                        new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type =
                                Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,

                            Id = "Bearer"
                        }
                },

                Array.Empty<string>()
            }
        }
    );
});

// =====================================================
// JWT AUTHENTICATION
// =====================================================

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme
    )
    .AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer =
                builder.Configuration["Jwt:Issuer"],

            ValidAudience =
                builder.Configuration["Jwt:Audience"],

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:Key"]!
                    )
                )
        };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine(
                "================================"
            );

            Console.WriteLine(
                "JWT AUTHENTICATION FAILED"
            );

            Console.WriteLine(
                context.Exception.ToString()
            );

            Console.WriteLine(
                "================================"
            );

            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine(
                $"JWT CHALLENGE: {context.Error}"
            );

            Console.WriteLine(
                $"JWT DESCRIPTION: {context.ErrorDescription}"
            );

            return Task.CompletedTask;
        }
    };
});
// =====================================================
// AUTHORIZATION
// =====================================================

builder.Services.AddAuthorization();

// =====================================================
// BUILD APP
// =====================================================

var app = builder.Build();

// =====================================================
// DEVELOPMENT
// =====================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

// =====================================================
// MIDDLEWARE
// =====================================================

app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthentication();

app.UseAuthorization();

// =====================================================
// CONTROLLERS
// =====================================================

app.MapControllers();

// =====================================================
// RUN
// =====================================================

app.Run();