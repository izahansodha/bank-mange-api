namespace BankApi.Dto.AI;

public class AITransferRequest
{
    public int SourceAccountId { get; set; }

    public int DestinationAccountId { get; set; }

    public decimal Amount { get; set; }

    public string Description { get; set; } = string.Empty;
}