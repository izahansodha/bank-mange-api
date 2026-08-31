
using BankApi.Dto.Transaction;

namespace BankApi.Services;

public interface ITransactionService
{
    Task DepositAsync(
        DepositRequest request,
        int customerId);

    Task WithdrawAsync(
        WithdrawRequest request,
        int customerId);

    Task TransferAsync(
        TransferRequest request,
        int customerId);
}

