namespace BankApi.Dto.AI;

public class AccountBalanceDto
{
    public string AccountType { get; set; } = string.Empty;
    public int AccountId { get; set; }

    public decimal Balance { get; set; }
}