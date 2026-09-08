namespace BankApi.Dto.AI;

public class UnusualTransactionDto
{
    public int TransactionId { get; set; }

    public decimal Amount { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public decimal AverageAmount { get; set; }

    public decimal DifferencePercentage { get; set; }
}