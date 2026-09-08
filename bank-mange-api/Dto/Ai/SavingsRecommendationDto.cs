namespace BankApi.Dto.AI;

public class SavingsRecommendationDto
{
    public string Category { get; set; } = string.Empty;

    public decimal CurrentSpending { get; set; }

    public decimal SuggestedReduction { get; set; }

    public decimal PotentialSavings { get; set; }

    public string Recommendation { get; set; } = string.Empty;
}