using BankApi.Dto.AI;

namespace BankApi.Services;

public class AIPendingTransferService
{
    private readonly Dictionary<Guid, PendingTransferDto>
        _transfers = new();

    public Guid CreateTransfer(
        int sourceAccountId,
        int destinationAccountId,
        decimal amount,
        string description)
    {
        var confirmationId = Guid.NewGuid();

        var transfer = new PendingTransferDto
        {
            ConfirmationId = confirmationId,
            SourceAccountId = sourceAccountId,
            DestinationAccountId = destinationAccountId,
            Amount = amount,
            Description = description,
            Status = "Pending"
        };

        _transfers[confirmationId] = transfer;

        return confirmationId;
    }

    public PendingTransferDto? GetTransfer(
        Guid confirmationId)
    {
        _transfers.TryGetValue(
            confirmationId,
            out var transfer);

        return transfer;
    }

    public bool RemoveTransfer(
        Guid confirmationId)
    {
        return _transfers.Remove(
            confirmationId);
    }
}