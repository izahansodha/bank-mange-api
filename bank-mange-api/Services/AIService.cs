using BankApi.Dto.AI;
using Google.GenAI;
using System.Text.Json;

namespace BankApi.Services;

public class AIService : IAIService
{
    private readonly Client _client;
    private readonly BankingAITools _bankingTools;
    private readonly AIPendingTransferService _pendingTransferService;
    public AIService(
    IConfiguration configuration,
    BankingAITools bankingTools,
    AIPendingTransferService pendingTransferService)
{
    var apiKey =
        configuration["Gemini:ApiKey"];

    if (string.IsNullOrWhiteSpace(apiKey))
    {
        throw new InvalidOperationException(
            "Gemini API key is not configured."
        );
    }

    _client = new Client(
        apiKey: apiKey
    );

    _bankingTools = bankingTools;

    _pendingTransferService =
        pendingTransferService;
}

    public async Task<ChatResponse> ChatAsync(
        ChatRequest request,
        int customerId)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return new ChatResponse
            {
                Message = "Please enter a message."
            };
        }

        try
        {
            var userMessage =
                request.Message.Trim();
            // =============================================
            // BALANCE QUESTION
            // =============================================

            if (IsBalanceQuestion(userMessage))
            {
                var accounts =
                    await _bankingTools
                        .GetMyBalanceAsync(customerId);

                if (accounts == null || accounts.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "You don't have any active accounts."
                    };
                }

                var accountInfo =
                    string.Join(
                        "\n",
                        accounts.Select(account =>
                            $"{account.AccountType}: ₹{account.Balance:N2}"
                        )
                    );

                var prompt = $"""
                    You are a helpful banking assistant.

                    The following is the customer's actual
                    account information:

                    {accountInfo}

                    Customer question:
                    {userMessage}

                    Rules:

                    - Answer using only the account information
                      provided above.
                    - Clearly distinguish Savings and Current
                      accounts.
                    - If the user asks about Savings, give the
                      Savings balance.
                    - If the user asks about Current, give the
                      Current balance.
                    - If the user asks for total balance,
                      calculate the total of all accounts.
                    - Never invent account information.
                    - Keep the answer clear and concise.
                    """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                var text =
                    response.Text;

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(text)
                            ? "I couldn't generate a response."
                            : text
                };
            }

            // =============================================
            // TRANSACTION QUESTION
            // =============================================

            if (IsTransactionQuestion(userMessage))
            {
                var transactions =
                    await _bankingTools
                        .GetMyTransactionsAsync(
                            customerId,
                            5
                        );

                if (transactions == null ||
                    transactions.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "You don't have any transactions."
                    };
                }
                Console.WriteLine(
    "TRANSACTION QUESTION DETECTED"
);


                Console.WriteLine(
                    $"Customer ID: {customerId}"
                );


                var transactionInfo =
                    string.Join(
                        "\n",
                        transactions.Select(transaction =>
                            $"""
                Amount: ₹{transaction.Amount:N2}
                Type: {transaction.Type}
                Description: {transaction.Description}
                Date: {transaction.CreatedAt:g}
                Reference: {transaction.ReferenceNumber}
                """
                        )
                    );

                var prompt = $"""
        You are a helpful banking assistant.

        These are the customer's actual recent
        transactions:

        {transactionInfo}

        Customer question:
        {userMessage}

        Rules:

        - Answer only using the transaction information
          provided above.
        - Do not invent transactions.
        - Clearly show the amount, type and description.
        - If the user asks for recent transactions,
          summarize the transactions clearly.
        - Keep the response concise.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                var text =
                    response.Text;

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(text)
                            ? "I couldn't generate a response."
                            : text
                };

            }
            // =============================================
            // TRANSACTION SEARCH
            // =============================================

            if (IsTransactionSearchQuestion(userMessage))
            {
                var transactions =
                    await _bankingTools
                        .SearchMyTransactionsAsync(
                            customerId
                        );

                if (transactions.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "I couldn't find any matching transactions."
                    };
                }

                var transactionInfo =
                    string.Join(
                        "\n",
                        transactions.Select(t =>
                            $"""
                Amount: ₹{t.Amount:N2}
                Type: {t.Type}
                Description: {t.Description}
                Date: {t.CreatedAt:g}
                Reference: {t.ReferenceNumber}
                """
                        )
                    );

                var prompt = $"""
        You are a banking transaction assistant.

        These are transactions belonging ONLY to the
        currently authenticated customer:

        {transactionInfo}

        Customer question:
        {userMessage}

        Answer using only these transactions.

        If a matching transaction exists, show it clearly.

        If there is no matching transaction, say that
        you couldn't find one.

        Never invent transaction information.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't generate a response."
                            : response.Text
                };
            }
            // =============================================
            // MONTHLY SPENDING
            // =============================================

            if (IsSpendingQuestion(userMessage))
            {
                var now = DateTime.UtcNow;

                var spending =
                    await _bankingTools
                        .GetMonthlySpendingAsync(
                            customerId,
                            now.Year,
                            now.Month
                        );

                var prompt = $"""
        You are a banking assistant.

        The customer's total debit spending
        for the current month is:

        ₹{spending:N2}

        Customer question:
        {userMessage}

        Answer clearly and concisely.

        Do not invent any other financial information.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? $"You have spent ₹{spending:N2} this month."
                            : response.Text
                };
            }
            // =============================================
            // MONTHLY SPENDING COMPARISON
            // =============================================

            if (IsSpendingComparisonQuestion(userMessage))
            {
                var currentMonthStart =
                    new DateTime(
                        DateTime.UtcNow.Year,
                        DateTime.UtcNow.Month,
                        1
                    );

                var previousMonthStart =
                    currentMonthStart.AddMonths(-1);

                var currentMonthSpending =
                    await _bankingTools
                        .GetMonthlySpendingForPeriodAsync(
                            customerId,
                            currentMonthStart,
                            currentMonthStart.AddMonths(1)
                        );

                var previousMonthSpending =
                    await _bankingTools
                        .GetMonthlySpendingForPeriodAsync(
                            customerId,
                            previousMonthStart,
                            currentMonthStart
                        );

                var difference =
                    currentMonthSpending -
                    previousMonthSpending;

                var percentageChange =
                    previousMonthSpending == 0
                        ? 0
                        : (difference /
                           previousMonthSpending) * 100;

                var prompt = $"""
        You are a banking assistant.

        Actual customer spending data:

        Current month:
        ₹{currentMonthSpending:N2}

        Previous month:
        ₹{previousMonthSpending:N2}

        Difference:
        ₹{difference:N2}

        Percentage change:
        {percentageChange:N2}%

        Customer question:
        {userMessage}

        Explain whether the customer spent more
        or less this month compared with last month.

        Use only the provided numbers.
        Do not invent financial information.
        Keep the answer concise.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't compare your spending."
                            : response.Text
                };
            }

            // =============================================
            // UNUSUAL TRANSACTION ANALYSIS
            // =============================================

            if (IsUnusualTransactionQuestion(userMessage))
            {
                var unusualTransactions =
                    await _bankingTools
                        .GetUnusualTransactionsAsync(
                            customerId
                        );

                if (unusualTransactions.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "I couldn't find any unusually large transactions in your recent activity."
                    };
                }

                var transactionInfo =
                    string.Join(
                        "\n",
                        unusualTransactions.Select(t =>
                            $"""
                Transaction ID: {t.TransactionId}
                Amount: ₹{t.Amount:N2}
                Description: {t.Description}
                Date: {t.CreatedAt:g}
                Customer's recent average: ₹{t.AverageAmount:N2}
                Above average: {t.DifferencePercentage:N2}%
                """
                        )
                    );

                var prompt = $"""
        You are a banking assistant.

        The following transactions were flagged by
        the bank's rules as unusually large:

        {transactionInfo}

        Customer question:
        {userMessage}

        Explain the unusual transactions clearly.

        IMPORTANT:
        - Do not call them fraudulent.
        - Do not claim that the customer was hacked.
        - Say they were flagged because they are
          significantly larger than recent transactions.
        - Recommend that the customer review them if
          they don't recognize them.
        - Use only the provided information.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't analyze your transactions."
                            : response.Text
                };
            }
            // =============================================
            // FINANCIAL SUMMARY
            // =============================================

            if (IsFinancialSummaryQuestion(userMessage))
            {
                var summary =
                    await _bankingTools
                        .GetFinancialSummaryAsync(
                            customerId
                        );

                var categories =
                    string.Join(
                        "\n",
                        summary.TopCategories.Select(category =>
                            $"{category.Category}: ₹{category.Amount:N2}"
                        )
                    );

                var prompt = $"""
        You are a helpful banking assistant.

        Here is the customer's actual financial data:

        Total balance:
        ₹{summary.TotalBalance:N2}

        Current month spending:
        ₹{summary.CurrentMonthSpending:N2}

        Previous month spending:
        ₹{summary.PreviousMonthSpending:N2}

        Spending difference:
        ₹{summary.SpendingDifference:N2}

        Percentage change:
        {summary.SpendingPercentageChange:N2}%

        Top spending categories:
        {categories}

        Customer question:
        {userMessage}

        Give the customer a short financial summary.

        Explain:
        1. Their current total balance.
        2. Their current-month spending.
        3. Whether spending increased or decreased.
        4. Their largest spending categories.

        IMPORTANT:
        - Use only the provided data.
        - Never invent financial information.
        - Do not make investment recommendations.
        - Do not claim the customer is financially healthy
          or unhealthy based only on this data.
        - Keep the response clear and concise.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't generate your financial summary."
                            : response.Text
                };
            }
            // =============================================
            // SPENDING PATTERN
            // =============================================

            if (IsSpendingPatternQuestion(userMessage))
            {
                var pattern =
                    await _bankingTools
                        .GetSpendingPatternAsync(
                            customerId
                        );

                if (pattern.TransactionCount == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "I don't have enough spending data to analyze your spending pattern."
                    };
                }

                var prompt = $"""
        You are a banking financial assistant.

        Here is the customer's actual spending data
        for the current month:

        Total spending:
        ₹{pattern.TotalSpending:N2}

        Number of transactions:
        {pattern.TransactionCount}

        Average transaction:
        ₹{pattern.AverageTransactionAmount:N2}

        Largest transaction:
        ₹{pattern.LargestTransaction:N2}

        Largest spending category:
        {pattern.MostUsedCategory}

        Amount spent in that category:
        ₹{pattern.MostUsedCategoryAmount:N2}

        Customer question:
        {userMessage}

        Analyze the customer's spending pattern.

        Explain:
        - Their total spending.
        - Their average transaction size.
        - Their largest transaction.
        - Their biggest spending category.

        IMPORTANT:
        - Use only the provided data.
        - Do not invent information.
        - Do not claim something is fraudulent.
        - Do not give investment advice.
        - Keep the response concise and useful.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't analyze your spending pattern."
                            : response.Text
                };
            }
            // =============================================
            // SAVINGS RECOMMENDATIONS
            // =============================================

            if (IsSavingsRecommendationQuestion(userMessage))
            {
                var recommendations =
                    await _bankingTools
                        .GetSavingsRecommendationsAsync(
                            customerId
                        );

                if (recommendations.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "I don't have enough spending data to provide savings recommendations."
                    };
                }

                var recommendationInfo =
                    string.Join(
                        "\n",
                        recommendations.Select(r =>
                            $"""
                Category: {r.Category}
                Current spending: ₹{r.CurrentSpending:N2}
                Suggested reduction: {r.SuggestedReduction:N2}%
                Potential savings: ₹{r.PotentialSavings:N2}
                """
                        )
                    );

                var prompt = $"""
        You are a helpful banking assistant.

        These are recommendations calculated from
        the customer's actual spending:

        {recommendationInfo}

        Customer question:
        {userMessage}

        Explain practical ways the customer could
        reduce spending and potentially save money.

        IMPORTANT:
        - Use only the provided spending information.
        - Do not invent expenses.
        - Do not promise that the customer will save
          a specific amount.
        - Clearly say potential savings are estimates.
        - Do not give investment advice.
        - Do not make financial transactions.
        - Keep the answer concise.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't generate savings recommendations."
                            : response.Text
                };
            }
            // =============================================
            // BUDGET ASSISTANT
            // =============================================

            if (IsBudgetQuestion(userMessage))
            {
                var budget =
                    await _bankingTools
                        .GetBudgetRecommendationAsync(
                            customerId
                        );

                if (budget.Categories.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "I don't have enough spending data to create a budget."
                    };
                }

                var categoryInfo =
                    string.Join(
                        "\n",
                        budget.Categories.Select(category =>
                            $"""
                Category: {category.Category}
                Current spending: ₹{category.CurrentSpending:N2}
                Recommended budget: ₹{category.RecommendedBudget:N2}
                """
                        )
                    );

                var prompt = $"""
        You are a helpful banking assistant.

        The customer's actual current-month spending is:

        Total spending:
        ₹{budget.TotalMonthlySpending:N2}

        Suggested total monthly budget:
        ₹{budget.RecommendedMonthlyBudget:N2}

        Category information:

        {categoryInfo}

        Customer question:
        {userMessage}

        Create a simple and understandable budget
        based on the customer's spending.

        Explain:
        - Total suggested monthly budget.
        - Each major spending category.
        - Where the customer could reduce spending.

        IMPORTANT:
        - These are estimates based on spending history.
        - Do not guarantee savings.
        - Do not give investment advice.
        - Do not make transactions.
        - Do not invent financial information.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't create your budget."
                            : response.Text
                };
            }
            
            // =============================================
            // FINANCIAL ALERTS
            // =============================================

            if (IsFinancialAlertQuestion(userMessage))
            {
                var alerts =
                    await _bankingTools
                        .GetFinancialAlertsAsync(
                            customerId
                        );

                if (alerts.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "I don't see any important financial alerts right now."
                    };
                }

                var alertInfo =
                    string.Join(
                        "\n",
                        alerts.Select(alert =>
                            $"""
                Alert type: {alert.AlertType}
                Title: {alert.Title}
                Message: {alert.Message}
                Severity: {alert.Severity}
                """
                        )
                    );

                var prompt = $"""
        You are a banking assistant.

        These are alerts generated from the customer's
        actual banking data:

        {alertInfo}

        Customer question:
        {userMessage}

        Explain the alerts clearly.

        IMPORTANT:
        - Do not invent additional alerts.
        - Do not call a transaction fraudulent.
        - Explain that unusual transactions are only
          flagged for review.
        - Do not give investment advice.
        - Keep the response concise.
        """;

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                return new ChatResponse
                {
                    Message =
                        string.IsNullOrWhiteSpace(response.Text)
                            ? "I couldn't retrieve your financial alerts."
                            : response.Text
                };
            }
            // =============================================
            // AI TRANSFER REQUEST
            // =============================================

            if (IsTransferQuestion(userMessage))
            {
                var accounts =
                    await _bankingTools
                        .GetMyAccountsAsync(customerId);

                if (accounts.Count == 0)
                {
                    return new ChatResponse
                    {
                        Message =
                            "You don't have any active accounts available for transfer."
                    };
                }

                var accountInfo =
                    string.Join(
                        "\n",
                        accounts.Select(a =>
                            $"Account Type: {a.AccountType}"
                        )
                    );

                var prompt =
                    "You are a banking assistant.\n\n" +
                    "Customer accounts:\n" +
                    accountInfo +
                    "\n\nCustomer request:\n" +
                    userMessage +
                    "\n\n" +
                    "Extract the transfer information.\n\n" +
                    "Return ONLY valid JSON.\n\n" +
                    "Required format:\n" +
                    "{\n" +
                    "  \"sourceAccountType\": \"\",\n" +
                    "  \"destinationAccountType\": \"\",\n" +
                    "  \"amount\": 0,\n" +
                    "  \"description\": \"\"\n" +
                    "}\n\n" +
                    "Rules:\n" +
                    "- Extract the source account type.\n" +
                    "- Extract the destination account type.\n" +
                    "- Extract the amount.\n" +
                    "- Do not invent missing information.\n" +
                    "- If source is missing, use an empty string.\n" +
                    "- If destination is missing, use an empty string.\n" +
                    "- If amount is missing, use 0.\n" +
                    "- Amount must be a number.\n" +
                    "- Return JSON only.";

                var response =
                    await _client.Models.GenerateContentAsync(
                        model: "gemini-3.6-flash",
                        contents: prompt
                    );

                var json =
                    response.Text?.Trim();
                var intent =
    ParseTransferIntent(json);

if (intent == null)
{
    return new ChatResponse
    {
        Message =
            "I couldn't understand the transfer request."
    };
}

if (intent.Amount <= 0)
{
    return new ChatResponse
    {
        Message =
            "Please provide a valid transfer amount."
    };
}

                if (string.IsNullOrWhiteSpace(
                        intent.SourceAccountType))
                {
                    return new ChatResponse
                    {
                        Message =
                            "Which account should the money come from?"
                    };
                }


                if (string.IsNullOrWhiteSpace(
                        intent.DestinationAccountType))
                {
                    return new ChatResponse
                    {
                        Message =
                            "Which account should receive the money?"
                    };
                }


                if (string.IsNullOrWhiteSpace(json))
                {
                    return new ChatResponse
                    {
                        Message =
                            "I couldn't understand the transfer request."
                    };
                }
                var sourceAccount =
    await _bankingTools.FindAccountByTypeAsync(
        customerId,
        intent.SourceAccountType
    );

var destinationAccount =
    await _bankingTools.FindAccountByTypeAsync(
        customerId,
        intent.DestinationAccountType
    );

if (sourceAccount == null)
{
    return new ChatResponse
    {
        Message =
            $"I couldn't find your {intent.SourceAccountType} account."
    };
}

if (destinationAccount == null)
{
    return new ChatResponse
    {
        Message =
            $"I couldn't find your {intent.DestinationAccountType} account."
    };
}

if (sourceAccount.AccountId ==
    destinationAccount.AccountId)
{
    return new ChatResponse
    {
        Message =
            "The source and destination accounts must be different."
    };
}

if (sourceAccount.Balance <
    intent.Amount)
{
    return new ChatResponse
    {
        Message =
            $"You don't have enough balance in your {sourceAccount.AccountType} account."
    };
}

                Console.WriteLine(
                    "================================="
                );

                Console.WriteLine(
                    "GEMINI TRANSFER INTENT"
                );

                Console.WriteLine(json);

                Console.WriteLine(
                    "================================="
                );

               var confirmationId =
    _pendingTransferService.CreateTransfer(
        sourceAccount.AccountId,
        destinationAccount.AccountId,
        intent.Amount,
        string.IsNullOrWhiteSpace(intent.Description)
            ? "AI Transfer"
            : intent.Description
    );

                return new ChatResponse
{
    Message =
        $"Transfer request is ready.\n\n" +
        $"From: {sourceAccount.AccountType}\n" +
        $"To: {destinationAccount.AccountType}\n" +
        $"Amount: ₹{intent.Amount:N2}\n\n" +
        "Please confirm this transfer.",

    ConfirmationId = confirmationId,
    TransferPending = true,
    SourceAccountId = sourceAccount.AccountId,
    DestinationAccountId = destinationAccount.AccountId,
    Amount = intent.Amount
};

            }
            

            // =============================================
            // normal chat response
            // =============================================

           var normalResponse =
                await _client.Models.GenerateContentAsync(
                    model: "gemini-3.6-flash",
                    contents: userMessage
                );

            var normalText =
                normalResponse.Text;

            return new ChatResponse
            {
                Message =
                    string.IsNullOrWhiteSpace(normalText)
                        ? "I couldn't generate a response."
                        : normalText
            };  
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                "================================="
            );

            Console.WriteLine(
                "GEMINI ERROR"
            );

            Console.WriteLine(
                ex.ToString()
            );

            Console.WriteLine(
                "================================="
            );

            return new ChatResponse
            {
                Message =
                    "The AI service is temporarily unavailable."
            };
        }
    }

    // =============================================
    // DETECT BALANCE QUESTION
    // =============================================
    private static AITransferIntent?
    ParseTransferIntent(string json)
{
    try
    {
        return JsonSerializer.Deserialize<AITransferIntent>(
            json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
    }
    catch
    {
        return null;
    }
}
    private static bool IsBalanceQuestion(
        string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("balance") ||
            text.Contains("how much money") ||
            text.Contains("how much do i have") ||
            text.Contains("money do i have");
    }
    private static bool IsTransactionQuestion(
    string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("transaction") ||
            text.Contains("transactions") ||
            text.Contains("recent transaction") ||
            text.Contains("last transaction") ||
            text.Contains("recent payment") ||
            text.Contains("last payment") ||
            text.Contains("recent payments") ||
            text.Contains("show my payments");
    }
    private static bool IsTransactionSearchQuestion(
        string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("find") ||
            text.Contains("search") ||
            text.Contains("did i pay") ||
            text.Contains("did i receive") ||
            text.Contains("from august") ||
            text.Contains("in august");
    }
    private static bool IsSpendingQuestion(
        string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("spending") ||
            text.Contains("spent") ||
            text.Contains("expenses") ||
            text.Contains("expense") ||
            text.Contains("how much did i spend");
    }
    private static bool IsSpendingPatternQuestion(
    string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("spending habits") ||
            text.Contains("spending pattern") ||
            text.Contains("spending patterns") ||
            text.Contains("spending behavior") ||
            text.Contains("how do i spend") ||
            text.Contains("my spending habits") ||
            text.Contains("analyze my spending");
    }
private static bool IsSavingsRecommendationQuestion(
    string message)
{
    var text =
        message.ToLowerInvariant();

    return
        text.Contains("save money") ||
        text.Contains("save more") ||
        text.Contains("savings") ||
        text.Contains("reduce my spending") ||
        text.Contains("reduce expenses") ||
        text.Contains("how can i save") ||
        text.Contains("saving recommendation") ||
        text.Contains("saving recommendations");
}
    private static bool IsSpendingCategoryQuestion(
        string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("where am i spending") ||
            text.Contains("spending most") ||
            text.Contains("biggest expense") ||
            text.Contains("largest expense") ||
            text.Contains("spending category") ||
            text.Contains("expense category");
    }
    private static bool IsSpendingComparisonQuestion(
        string message)
    {
        var text = message.ToLowerInvariant();

        return
            text.Contains("compare") ||
            text.Contains("last month") ||
            text.Contains("more this month") ||
            text.Contains("less this month") ||
            text.Contains("spent more") ||
            text.Contains("spent less");
    }
    private static bool IsUnusualTransactionQuestion(
        string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("unusual transaction") ||
            text.Contains("unusual transactions") ||
            text.Contains("suspicious transaction") ||
            text.Contains("suspicious transactions") ||
            text.Contains("strange transaction") ||
            text.Contains("unusual payment");
    }
    private static bool IsFinancialSummaryQuestion(
        string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("financial summary") ||
            text.Contains("finance summary") ||
            text.Contains("financial overview") ||
            text.Contains("financial situation") ||
            text.Contains("summarize my finances") ||
            text.Contains("summary of my finances") ||
            text.Contains("how am i doing financially");
    }
    private static bool IsBudgetQuestion(
        string message)
    {
        var text =
            message.ToLowerInvariant();

        return
            text.Contains("budget") ||
            text.Contains("monthly budget") ||
            text.Contains("create a budget") ||
            text.Contains("make a budget") ||
            text.Contains("budget plan");
    }
    private static bool IsFinancialAlertQuestion(
    string message)
{
    var text =
        message.ToLowerInvariant();

    return
        text.Contains("alert") ||
        text.Contains("alerts") ||
        text.Contains("financial alert") ||
        text.Contains("financial alerts") ||
        text.Contains("anything important") ||
        text.Contains("anything unusual") ||
        text.Contains("important activity") ||
        text.Contains("notify me");
}
private static bool IsTransferQuestion(string message)
{
    var text = message.ToLowerInvariant();

    return
        text.Contains("transfer") ||
        text.Contains("send money") ||
        text.Contains("move money") ||
        text.Contains("send ₹") ||
        text.Contains("send rs") ||
        text.Contains("send inr");
}
}