using Microsoft.EntityFrameworkCore;
using ToDoList.Data;
using ToDoList.Helpers;
using System.ComponentModel;
using ToDoList.Models;

namespace ToDoList;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDbContext<TodoContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddEndpointsApiExplorer();

        bool isDesignTime = LicenseManager.UsageMode == LicenseUsageMode.Designtime;

        if (!isDesignTime)
        {  
            builder.Services.AddHostedService<DatabaseSeeder>();
        }

        var app = builder.Build();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.MapPost("/todo", async (TodoItem item, TodoContext db) =>
        {
            db.TodoItems.Add(item);
            await db.SaveChangesAsync();
            return Results.Created($"/todo/{item.Id}", item);
        });

        app.MapGet("/todo", async (TodoContext db) =>
        {
            return await db.TodoItems.ToListAsync();
        });

        app.MapPut("/todo/{id}", async (int id, TodoItem item, TodoContext db) =>
        {
            var existingItem = await db.TodoItems.FindAsync(id);
            if (existingItem is null)
            {
                return Results.NotFound();
            }
            existingItem.Title = item.Title;
            existingItem.IsCompleted = item.IsCompleted;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapDelete("/todo/{id}", async (int id, TodoContext db) =>
        {
            var existingItem = await db.TodoItems.FindAsync(id);
            if (existingItem is null)
            {
                return Results.NotFound();
            }
            db.TodoItems.Remove(existingItem);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.Run();
    }
}

public class DatabaseSeeder : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public DatabaseSeeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var services = scope.ServiceProvider;
            SeedDatabase.Initialize(services);
        }
        await Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
