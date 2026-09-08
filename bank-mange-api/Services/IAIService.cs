using BankApi.Dto.AI;

namespace BankApi.Services;

public interface IAIService
{
    Task<ChatResponse> ChatAsync(
        ChatRequest request,
        int customerId);
}