namespace BankApi.Dto.AI;

public class TransactionAIDto
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public string ReferenceNumber { get; set; } = string.Empty;
}