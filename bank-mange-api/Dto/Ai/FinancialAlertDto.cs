namespace BankApi.Dto.AI;

public class FinancialAlertDto
{
    public string AlertType { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Severity { get; set; } = "Info";
}