using BankApi.Dto.Transaction;
using FluentValidation;

namespace BankApi.Validators;

public class WithdrawRequestValidator : AbstractValidator<WithdrawRequest>
{
    public WithdrawRequestValidator()
    {
        RuleFor(x => x.AccountId).NotEmpty().WithMessage("AccountId is required.");
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Amount must be greater than zero.").LessThanOrEqualTo(1000000).WithMessage("Amount must be less than or equal to 1,000,000.");
    }
}