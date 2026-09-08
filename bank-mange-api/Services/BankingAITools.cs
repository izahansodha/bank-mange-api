using BankApi.data;
using BankApi.Dto.AI;
using Microsoft.EntityFrameworkCore;

namespace BankApi.Services;

public class BankingAITools
{
    private readonly BankContext _context;

    public BankingAITools(BankContext context)
    {
        _context = context;
    }

    public async Task<List<AccountBalanceDto>> GetMyBalanceAsync(
        int customerId)
    {
        return await _context.Accounts
            .Where(a => a.CustomerId == customerId)
            .Select(a => new AccountBalanceDto
            {
                AccountType = a.AccountType.ToString(),
                Balance = a.Balance
            })
            .ToListAsync();
    }
    public async Task<SpendingPatternDto> GetSpendingPatternAsync(
    int customerId)
    {
        var now = DateTime.UtcNow;

        var startDate =
            new DateTime(
                now.Year,
                now.Month,
                1
            );

        var endDate =
            startDate.AddMonths(1);

        var transactions =
            await _context.Transactions
                .Where(t =>
                    t.Account != null &&
                    t.Account.CustomerId == customerId &&
                    t.CreatedAt >= startDate &&
                    t.CreatedAt < endDate &&
                    t.Type.ToString().ToLower() == "debit")
                .Select(t => new
                {
                    t.Amount,
                    t.Description
                })
                .ToListAsync();

        if (transactions.Count == 0)
        {
            return new SpendingPatternDto();
        }

        var totalSpending =
            transactions.Sum(t => t.Amount);

        var averageAmount =
            transactions.Average(t => t.Amount);

        var largestTransaction =
            transactions.Max(t => t.Amount);

        var category =
            transactions
                .GroupBy(t =>
                    string.IsNullOrWhiteSpace(t.Description)
                        ? "Other"
                        : t.Description)
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderByDescending(x => x.Amount)
                .FirstOrDefault();

        return new SpendingPatternDto
        {
            AverageTransactionAmount =
                averageAmount,

            TotalSpending =
                totalSpending,

            TransactionCount =
                transactions.Count,

            MostUsedCategory =
                category?.Category ?? "Other",

            MostUsedCategoryAmount =
                category?.Amount ?? 0,

            LargestTransaction =
                largestTransaction
        };
    }
    public async Task<List<SavingsRecommendationDto>>
        GetSavingsRecommendationsAsync(
            int customerId)
    {
        var now = DateTime.UtcNow;

        var startDate =
            new DateTime(
                now.Year,
                now.Month,
                1
            );

        var endDate =
            startDate.AddMonths(1);

        var categories =
            await _context.Transactions
                .Where(t =>
                    t.Account != null &&
                    t.Account.CustomerId == customerId &&
                    t.CreatedAt >= startDate &&
                    t.CreatedAt < endDate &&
                    t.Type.ToString().ToLower() == "debit")
                .GroupBy(t =>
                    string.IsNullOrWhiteSpace(t.Description)
                        ? "Other"
                        : t.Description)
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderByDescending(x => x.Amount)
                .Take(5)
                .ToListAsync();

        return categories
            .Select(category =>
            {
                var suggestedReduction =
                    category.Amount * 0.10m;

                return new SavingsRecommendationDto
                {
                    Category =
                        category.Category,

                    CurrentSpending =
                        category.Amount,

                    SuggestedReduction =
                        10,

                    PotentialSavings =
                        suggestedReduction,

                    Recommendation =
                        $"Consider reducing {category.Category} spending by around 10%."
                };
            })
            .ToList();
    }

    public async Task<List<TransactionAIDto>> GetMyTransactionsAsync(
    int customerId,
    int limit = 5)
    {
        return await _context.Transactions
            .Where(t =>
                t.Account != null &&
                t.Account.CustomerId == customerId)
            .OrderByDescending(t => t.CreatedAt)
            .Take(limit)
            .Select(t => new TransactionAIDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Type = t.Type.ToString(),
                Description = t.Description ?? "",
                CreatedAt = t.CreatedAt,
                ReferenceNumber = t.ReferenceNumber ?? ""
            })
            .ToListAsync();
    }
    public async Task<List<UnusualTransactionDto>>
    GetUnusualTransactionsAsync(
        int customerId)
{
    var transactions =
        await _context.Transactions
            .Where(t =>
                t.Account != null &&
                t.Account.CustomerId == customerId &&
                t.Type.ToString().ToLower() == "debit")
            .OrderByDescending(t => t.CreatedAt)
            .Take(50)
            .Select(t => new
            {
                t.Id,
                t.Amount,
                t.Type,
                t.Description,
                t.CreatedAt
            })
            .ToListAsync();

    if (transactions.Count < 3)
    {
        return new List<UnusualTransactionDto>();
    }

    var average =
        transactions.Average(t => t.Amount);

    if (average <= 0)
    {
        return new List<UnusualTransactionDto>();
    }

    return transactions
        .Where(t =>
            t.Amount >= average * 2)
        .Select(t => new UnusualTransactionDto
        {
            TransactionId = t.Id,

            Amount = t.Amount,

            Type = t.Type.ToString(),

            Description =
                t.Description ?? "",

            CreatedAt = t.CreatedAt,

            AverageAmount = average,

            DifferencePercentage =
                ((t.Amount - average) / average) * 100
        })
        .ToList();
}
    public async Task<List<TransactionAIDto>> SearchMyTransactionsAsync(
        int customerId,
        decimal? amount = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        var query = _context.Transactions
            .Where(t =>
                t.Account != null &&
                t.Account.CustomerId == customerId);

        if (amount.HasValue)
        {
            query = query.Where(t =>
                t.Amount == amount.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(t =>
                t.CreatedAt >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(t =>
                t.CreatedAt < toDate.Value);
        }

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .Take(20)
            .Select(t => new TransactionAIDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Type = t.Type.ToString(),
                Description = t.Description ?? "",
                CreatedAt = t.CreatedAt,
                ReferenceNumber = t.ReferenceNumber ?? ""
            })
            .ToListAsync();
    }
    public async Task<decimal> GetMonthlySpendingAsync(
    int customerId,
    int year,
    int month)
    {
        var startDate = new DateTime(year, month, 1);

        var endDate = startDate.AddMonths(1);

        var spending =
            await _context.Transactions
                .Where(t =>
                    t.Account != null &&
                    t.Account.CustomerId == customerId &&
                    t.CreatedAt >= startDate &&
                    t.CreatedAt < endDate &&
                    t.Type.ToString().ToLower() == "debit")
                .SumAsync(t => (decimal?)t.Amount) ?? 0;

        return spending;
    }
    public async Task<FinancialSummaryDto>
    GetFinancialSummaryAsync(
        int customerId)
{
    var accounts =
        await GetMyBalanceAsync(customerId);

    var totalBalance =
        accounts.Sum(a => a.Balance);

    var currentMonthStart =
        new DateTime(
            DateTime.UtcNow.Year,
            DateTime.UtcNow.Month,
            1
        );

    var previousMonthStart =
        currentMonthStart.AddMonths(-1);

    var currentMonthSpending =
        await GetMonthlySpendingForPeriodAsync(
            customerId,
            currentMonthStart,
            currentMonthStart.AddMonths(1)
        );

    var previousMonthSpending =
        await GetMonthlySpendingForPeriodAsync(
            customerId,
            previousMonthStart,
            currentMonthStart
        );

    var difference =
        currentMonthSpending -
        previousMonthSpending;

    var percentageChange =
        previousMonthSpending == 0
            ? 0
            : (difference / previousMonthSpending) * 100;

    var categories =
        await GetSpendingCategoriesAsync(
            customerId,
            currentMonthStart.Year,
            currentMonthStart.Month
        );

    return new FinancialSummaryDto
    {
        TotalBalance = totalBalance,

        CurrentMonthSpending =
            currentMonthSpending,

        PreviousMonthSpending =
            previousMonthSpending,

        SpendingDifference =
            difference,

        SpendingPercentageChange =
            percentageChange,

        TopCategories =
            categories.Take(5).ToList()
    };
}
    public async Task<List<SpendingCategoryDto>>
    GetSpendingCategoriesAsync(
        int customerId,
        int year,
        int month)
    {
        var startDate =
            new DateTime(year, month, 1);

        var endDate =
            startDate.AddMonths(1);

        var result =
            await _context.Transactions
                .Where(t =>
                    t.Account != null &&
                    t.Account.CustomerId == customerId &&
                    t.CreatedAt >= startDate &&
                    t.CreatedAt < endDate &&
                    t.Type.ToString().ToLower() == "debit")
                .GroupBy(t =>
                    t.Description ?? "Other")
                .Select(g => new SpendingCategoryDto
                {
                    Category = g.Key,
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderByDescending(x => x.Amount)
                .ToListAsync();

        return result;
    }
    public async Task<List<AccountBalanceDto>> GetMyAccountsAsync(
    int customerId)
{
    return await _context.Accounts
        .Where(a => a.CustomerId == customerId)
        .Select(a => new AccountBalanceDto
        {
            AccountId = a.Id,
            AccountType = a.AccountType.ToString(),
            Balance = a.Balance
        })
        .ToListAsync();
}

public async Task<decimal> GetMonthlySpendingForPeriodAsync(
    int customerId,
    DateTime startDate,
    DateTime endDate)
{
    return await _context.Transactions
        .Where(t =>
            t.Account != null &&
            t.Account.CustomerId == customerId &&
            t.CreatedAt >= startDate &&
            t.CreatedAt < endDate &&
            t.Type.ToString().ToLower() == "debit")
        .SumAsync(t => (decimal?)t.Amount) ?? 0;
}
    public async Task<BudgetRecommendationDto>
        GetBudgetRecommendationAsync(
            int customerId)
    {
        var now = DateTime.UtcNow;

        var startDate =
            new DateTime(
                now.Year,
                now.Month,
                1
            );

        var endDate =
            startDate.AddMonths(1);

        var categories =
            await _context.Transactions
                .Where(t =>
                    t.Account != null &&
                    t.Account.CustomerId == customerId &&
                    t.CreatedAt >= startDate &&
                    t.CreatedAt < endDate &&
                    t.Type.ToString().ToLower() == "debit")
                .GroupBy(t =>
                    string.IsNullOrWhiteSpace(t.Description)
                        ? "Other"
                        : t.Description)
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderByDescending(x => x.Amount)
                .ToListAsync();

        var totalSpending =
            categories.Sum(x => x.Amount);

        var recommendedBudget =
            totalSpending * 0.90m;

        var categoryBudgets =
            categories
                .Select(category => new BudgetCategoryDto
                {
                    Category =
                        category.Category,

                    CurrentSpending =
                        category.Amount,

                    RecommendedBudget =
                        category.Amount * 0.90m
                })
                .ToList();

        return new BudgetRecommendationDto
        {
            TotalMonthlySpending =
                totalSpending,

            RecommendedMonthlyBudget =
                recommendedBudget,

            Categories =
                categoryBudgets
        };
    }
    public async Task<List<FinancialAlertDto>>
        GetFinancialAlertsAsync(
            int customerId)
    {
        var alerts =
            new List<FinancialAlertDto>();

        var currentMonthStart =
            new DateTime(
                DateTime.UtcNow.Year,
                DateTime.UtcNow.Month,
                1
            );

        var previousMonthStart =
            currentMonthStart.AddMonths(-1);

        // =============================================
        // CURRENT MONTH SPENDING
        // =============================================

        var currentSpending =
            await GetMonthlySpendingForPeriodAsync(
                customerId,
                currentMonthStart,
                currentMonthStart.AddMonths(1)
            );

        // =============================================
        // PREVIOUS MONTH SPENDING
        // =============================================

        var previousSpending =
            await GetMonthlySpendingForPeriodAsync(
                customerId,
                previousMonthStart,
                currentMonthStart
            );

        // =============================================
        // SPENDING INCREASE ALERT
        // =============================================

        if (previousSpending > 0)
        {
            var percentageChange =
                ((currentSpending - previousSpending)
                / previousSpending) * 100;

            if (percentageChange >= 20)
            {
                alerts.Add(
                    new FinancialAlertDto
                    {
                        AlertType =
                            "SpendingIncrease",

                        Title =
                            "Spending increased",

                        Message =
                            $"Your spending increased by {percentageChange:N1}% compared with last month.",

                        Severity =
                            "Warning"
                    }
                );
            }
        }

        // =============================================
        // UNUSUAL TRANSACTION ALERT
        // =============================================

        var unusualTransactions =
            await GetUnusualTransactionsAsync(
                customerId
            );

        if (unusualTransactions.Count > 0)
        {
            alerts.Add(
                new FinancialAlertDto
                {
                    AlertType =
                        "UnusualTransaction",

                    Title =
                        "Unusually large transaction",

                    Message =
                        $"You have {unusualTransactions.Count} unusually large recent transaction(s).",

                    Severity =
                        "Warning"
                }
            );
        }

        // =============================================
        // LOW BALANCE ALERT
        // =============================================

        var accounts =
            await GetMyBalanceAsync(customerId);

        foreach (var account in accounts)
        {
            if (account.Balance < 1000)
            {
                alerts.Add(
                    new FinancialAlertDto
                    {
                        AlertType =
                            "LowBalance",

                        Title =
                            $"{account.AccountType} balance is low",

                        Message =
                            $"Your {account.AccountType} account balance is ₹{account.Balance:N2}.",

                        Severity =
                            "Warning"
                    }
                );
            }
        }

        return alerts;
    }
    public async Task<AccountBalanceDto?> FindAccountByTypeAsync(
    int customerId,
    string accountType)
{
    if (string.IsNullOrWhiteSpace(accountType))
    {
        return null;
    }

    var normalizedType =
        accountType.Trim().ToLowerInvariant();

    var accounts =
        await _context.Accounts
            .Where(a =>
                a.CustomerId == customerId)
            .Select(a => new AccountBalanceDto
            {
                AccountId = a.Id,
                AccountType = a.AccountType.ToString(),
                Balance = a.Balance
            })
            .ToListAsync();

    return accounts.FirstOrDefault(a =>
        a.AccountType.ToLowerInvariant()
            .Contains(normalizedType));
}
    

}