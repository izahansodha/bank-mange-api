namespace BankApi.Dto.AI;

public class BudgetRecommendationDto
{
    public decimal TotalMonthlySpending { get; set; }

    public decimal RecommendedMonthlyBudget { get; set; }

    public List<BudgetCategoryDto> Categories { get; set; }
        = new();
}

public class BudgetCategoryDto
{
    public string Category { get; set; } = string.Empty;

    public decimal CurrentSpending { get; set; }

    public decimal RecommendedBudget { get; set; }
}