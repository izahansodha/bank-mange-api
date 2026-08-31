using FluentValidation;
using BankApi.Dto.Transaction;

namespace BankApi.Validators;
public class DepositRequestValidator : AbstractValidator<DepositRequest>
{
    public DepositRequestValidator()
    {
        RuleFor(x => x.AccountId).NotEmpty().WithMessage("AccountId is required.");
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Amount must be greater than zero.").LessThanOrEqualTo(1000000).WithMessage("Amount must be less than or equal to 1,000,000.");
    }
}