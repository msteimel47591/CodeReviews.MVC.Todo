using ToDoList.Data;
using ToDoList.Models;
using Microsoft.EntityFrameworkCore;

namespace ToDoList.Helpers;

public static class SeedDatabase
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new TodoContext(
            serviceProvider.GetRequiredService<DbContextOptions<TodoContext>>()))
        {
            if (context.TodoItems.Any())
            {
                return;
            }
            var todoItems = new TodoItem[]
            {
                new TodoItem { Title = "Learn ASP.NET Core", IsCompleted = false },
                new TodoItem { Title = "Build a web API", IsCompleted = false },
                new TodoItem { Title = "Deploy to Azure", IsCompleted = false },
                new TodoItem { Title = "Write unit tests", IsCompleted = false },
                new TodoItem { Title = "Refactor codebase", IsCompleted = false },
                new TodoItem { Title = "Create documentation", IsCompleted = false },
                new TodoItem { Title = "Set up CI/CD pipeline", IsCompleted = false },
                new TodoItem { Title = "Optimize database queries", IsCompleted = false },
                new TodoItem { Title = "Learn Blazor", IsCompleted = false },
                new TodoItem { Title = "Explore .NET 9 features", IsCompleted = false }
            };
            context.TodoItems.AddRange(todoItems);
            context.SaveChanges();
        }
    }
}
