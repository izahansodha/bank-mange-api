namespace BankApi.Dto.AI;

public class ChatResponse
{
    public string Message { get; set; } = string.Empty;
    public Guid? ConfirmationId { get; set; }

public bool TransferPending { get; set; }

public int? SourceAccountId { get; set; }

public int? DestinationAccountId { get; set; }

public decimal? Amount { get; set; }

}