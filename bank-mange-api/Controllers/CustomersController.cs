using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankApi.Models;
using BankApi.data;

namespace BankApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly BankContext _context;

        public CustomersController(BankContext context)
        {
            _context = context;
        }

        // GET: api/customers
        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();

            return Ok(customers);
        }

        // GET: api/customers/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound("Customer not found");
            }

            return Ok(customer);
        }

        // POST: api/customers
        [HttpPost]
        public async Task<IActionResult> CreateCustomer(Customer customer)
        {
            _context.Customers.Add(customer);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Customer created successfully",
                customer = customer
            });
        }

        // PUT: api/customers/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(
            int id,
            Customer updatedCustomer)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound("Customer not found");
            }

            customer.Name = updatedCustomer.Name;
            customer.Balance = updatedCustomer.Balance;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Customer updated successfully",
                customer = customer
            });
        }

        // DELETE: api/customers/1
        [HttpDelete("{id}")]
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
                customer = customer
            });
        }

        // GET: api/customers/search?name=rahul
        [HttpGet("search")]
        public async Task<IActionResult> SearchCustomer(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Name is required");
            }

            var result = await _context.Customers
                .Where(c => c.Name.Contains(name))
                .ToListAsync();

            if (result.Count == 0)
            {
                return NotFound("Customer not found");
            }

            return Ok(result);
        }
    }
}