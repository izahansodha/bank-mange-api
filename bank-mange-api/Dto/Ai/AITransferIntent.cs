namespace BankApi.Dto.AI;

public class AITransferIntent
{
    public string SourceAccountType { get; set; } = string.Empty;

    public string DestinationAccountType { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Description { get; set; } = string.Empty;
}