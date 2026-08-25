public class TransferRequestValidator : AbstractValidator<TransferRequest>
{
    public TransferRequestValidator()
    {
        RuleFor(x => x.FromAccountId).NotEmpty().WithMessage("FromAccountId is required.");
        RuleFor(x => x.ToAccountId).NotEmpty().WithMessage("ToAccountId is required.");
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Amount must be greater than zero.").LessThanOrEqualTo(1000000).WithMessage("Amount must be less than or equal to 1,000,000.");
        RuleFor(x => x).Must(x.FromAccountId != x.ToAccountId).WithMessage("FromAccountId and ToAccountId cannot be the same.");
    }
}