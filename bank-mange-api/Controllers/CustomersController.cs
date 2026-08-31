using BankApi.data;
using BankApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BankApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly BankContext _context;

    public CustomersController(BankContext context)
    {
        _context = context;
    }


    // =====================================================
    // GET ALL CUSTOMERS
    // ADMIN ONLY
    // =====================================================

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetCustomers()
    {
        var customers = await _context.Customers
            .AsNoTracking()
            .ToListAsync();

        return Ok(customers);
    }


    // =====================================================
    // GET CUSTOMER BY ID
    // ADMIN OR OWN CUSTOMER
    // =====================================================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomer(int id)
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();


        var customer = await _context.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
            return NotFound("Customer not found");


        // Admin can view any customer.
        if (User.IsInRole("Admin"))
        {
            return Ok(customer);
        }


        // Customer can only view their own profile.
        if (customer.UserId != userId)
        {
            return Forbid();
        }


        return Ok(customer);
    }


    // =====================================================
    // CREATE CUSTOMER
    // ADMIN ONLY
    // =====================================================

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCustomer(
        Customer customer)
    {
        var userExists = await _context.Users
            .AnyAsync(u => u.Id == customer.UserId);

        if (!userExists)
        {
            return BadRequest(
                "The specified User does not exist.");
        }


        var existingCustomer = await _context.Customers
            .AnyAsync(c => c.UserId == customer.UserId);

        if (existingCustomer)
        {
            return BadRequest(
                "This User already has a Customer profile.");
        }


        customer.Id = 0;
        customer.Balance = 0;

        _context.Customers.Add(customer);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Customer created successfully",
            customer
        });
    }


    // =====================================================
    // UPDATE CUSTOMER
    // ADMIN OR OWN CUSTOMER
    // =====================================================

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(
        int id,
        Customer updatedCustomer)
    {
        var userIdString = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized();


        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
        {
            return NotFound("Customer not found");
        }


        // Customer can only update their own profile.
        if (!User.IsInRole("Admin") &&
            customer.UserId != userId)
        {
            return Forbid();
        }


        customer.Name = updatedCustomer.Name;

        // Do NOT allow normal customers to change
        // their banking balance.
        if (User.IsInRole("Admin"))
        {
            customer.Balance = updatedCustomer.Balance;
        }


        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Customer updated successfully",
            customer
        });
    }


    // =====================================================
    // DELETE CUSTOMER
    // ADMIN ONLY
    // =====================================================

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
        {
            return NotFound("Customer not found");
        }


        _context.Customers.Remove(customer);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Customer deleted successfully",
            customer
        });
    }


    // =====================================================
    // SEARCH CUSTOMERS
    // ADMIN ONLY
    // =====================================================

    [HttpGet("search")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SearchCustomer(
        string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest("Name is required");
        }


        var result = await _context.Customers
            .AsNoTracking()
            .Where(c => c.Name.Contains(name))
            .ToListAsync();


        if (result.Count == 0)
        {
            return NotFound("Customer not found");
        }


        return Ok(result);
    }
}
