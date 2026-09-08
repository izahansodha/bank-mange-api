namespace BankApi.Dto.AI;

public class FinancialSummaryDto
{
    public decimal TotalBalance { get; set; }

    public decimal CurrentMonthSpending { get; set; }

    public decimal PreviousMonthSpending { get; set; }

    public decimal SpendingDifference { get; set; }

    public decimal SpendingPercentageChange { get; set; }

    public List<SpendingCategoryDto> TopCategories { get; set; }
        = new();
}