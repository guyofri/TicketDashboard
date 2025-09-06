using Microsoft.EntityFrameworkCore;
using TicketDashboard.Infrastructure.Data;

namespace TicketDashboard.DatabaseMigration;

/// <summary>
/// Utility class to add missing columns to existing database
/// Run this as a console application or integration test
/// </summary>
public class DatabaseColumnAdder
{
    public static async Task AddMissingColumnsAsync(string connectionString)
    {
        var options = new DbContextOptionsBuilder<TicketDbContext>()
            .UseSqlServer(connectionString)
            .Options;

        using var context = new TicketDbContext(options);

        try
        {
            Console.WriteLine("Checking and adding missing columns...");

            // Add FirstResponseAt column if it doesn't exist
            await AddColumnIfNotExists(context, "Tickets", "FirstResponseAt", "datetime2(7) NULL");

            // Add SlaId column if it doesn't exist
            await AddColumnIfNotExists(context, "Tickets", "SlaId", "int NULL");

            // Add Tags column if it doesn't exist
            await AddColumnIfNotExists(context, "Tickets", "Tags", "nvarchar(500) NULL");

            // Add CustomerEmail column if it doesn't exist (in case it's missing)
            await AddColumnIfNotExists(context, "Tickets", "CustomerEmail", "nvarchar(200) NULL");

            // Add IsInternal column to TicketComments if it doesn't exist
            await AddColumnIfNotExists(context, "TicketComments", "IsInternal", "bit NOT NULL DEFAULT 0");

            // Add foreign key constraint for SlaId if needed
            await AddForeignKeyIfNotExists(context);

            Console.WriteLine("? All missing columns have been added successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"? Error: {ex.Message}");
            throw;
        }
    }

    private static async Task AddColumnIfNotExists(TicketDbContext context, string tableName, string columnName, string columnDefinition)
    {
        var checkSql = $@"
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = '{tableName}' AND COLUMN_NAME = '{columnName}'";

        var columnExists = await context.Database.SqlQueryRaw<int>(checkSql).FirstOrDefaultAsync();

        if (columnExists == 0)
        {
            var alterSql = $"ALTER TABLE [{tableName}] ADD [{columnName}] {columnDefinition}";
            await context.Database.ExecuteSqlRawAsync(alterSql);
            Console.WriteLine($"? Added {columnName} column to {tableName} table");
        }
        else
        {
            Console.WriteLine($"?? {columnName} column already exists in {tableName} table");
        }
    }

    private static async Task AddForeignKeyIfNotExists(TicketDbContext context)
    {
        var checkConstraintSql = @"
            SELECT COUNT(*) 
            FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
            WHERE CONSTRAINT_NAME = 'FK_Tickets_ServiceLevelAgreements_SlaId'";

        var constraintExists = await context.Database.SqlQueryRaw<int>(checkConstraintSql).FirstOrDefaultAsync();

        if (constraintExists == 0)
        {
            // Check if both tables exist
            var checkTablesSql = @"
                SELECT COUNT(*) 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME IN ('Tickets', 'ServiceLevelAgreements')";

            var tablesExist = await context.Database.SqlQueryRaw<int>(checkTablesSql).FirstOrDefaultAsync();

            if (tablesExist == 2)
            {
                var addFkSql = @"
                    ALTER TABLE [Tickets] 
                    ADD CONSTRAINT [FK_Tickets_ServiceLevelAgreements_SlaId] 
                    FOREIGN KEY ([SlaId]) REFERENCES [ServiceLevelAgreements]([Id]) ON DELETE SET NULL";

                await context.Database.ExecuteSqlRawAsync(addFkSql);
                Console.WriteLine("? Added foreign key constraint for SlaId");
            }
        }
        else
        {
            Console.WriteLine("?? Foreign key constraint already exists");
        }
    }
}