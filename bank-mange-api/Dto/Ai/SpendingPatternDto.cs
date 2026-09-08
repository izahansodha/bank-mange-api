namespace BankApi.Dto.AI;

public class SpendingPatternDto
{
    public decimal AverageTransactionAmount { get; set; }

    public decimal TotalSpending { get; set; }

    public int TransactionCount { get; set; }

    public string MostUsedCategory { get; set; } = string.Empty;

    public decimal MostUsedCategoryAmount { get; set; }

    public decimal LargestTransaction { get; set; }
}