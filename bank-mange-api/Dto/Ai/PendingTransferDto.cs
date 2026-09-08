namespace BankApi.Dto.AI;

public class PendingTransferDto
{
    public Guid ConfirmationId { get; set; }

    public int SourceAccountId { get; set; }

    public int DestinationAccountId { get; set; }

    public decimal Amount { get; set; }

    public string Description { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";
}