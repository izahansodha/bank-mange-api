using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace BankApi.Models {
public class User{
    
    public Guid Id {get; set;}
    public string FullName {get;set;} = string.Empty;
    public string Email {get;set;}= string.Empty;
    public string PasswordHash {get;set;} = string.Empty;
    public string Role {get;set;} = "Customer";
    public DateTime CreatedAt {get;set;} = DateTime.UtcNow;    
}
}