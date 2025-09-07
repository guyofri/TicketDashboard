# Ticket Dashboard Database Scripts

This directory contains SQL Server scripts to set up the complete database for the Ticket Dashboard application.

## Files Overview

| File | Description |
|------|-------------|
| `00-setup-all.sql` | Master script that runs all other scripts in order |
| `01-create-database.sql` | Creates the main database with proper settings |
| `02-create-tables.sql` | Creates all tables with relationships and constraints |
| `03-create-indexes.sql` | Creates indexes for optimal performance |

## Quick Setup

### Option 1: Run All Scripts at Once
```sql
-- Execute the master script in SQL Server Management Studio
:r 00-setup-all.sql
```

### Option 2: Run Scripts Individually
Execute the scripts in order (01 through 03) using SQL Server Management Studio or sqlcmd.

## Database Schema

### Core Tables

**Users**
- Stores user accounts (Admin, Agent, Customer roles)
- Handles authentication and user management

**Tickets**
- Main ticket entity with status, priority, assignments
- Links to users, SLAs, and routing rules

**TicketComments**
- Comments and updates on tickets
- Internal/external comment support

**ServiceLevelAgreements**
- SLA definitions with response and resolution times
- Priority-based SLA assignments

**TicketRoutingRules**
- Automated routing rules with JSON conditions
- Priority-based rule execution

### Supporting Tables

**TicketRoutingLogs**
- Audit trail of routing rule executions

**SlaViolations**
- Tracks SLA breaches and violations

**Agents** (Legacy)
- Backward compatibility table

## Data Population

The database will be created empty. Use Entity Framework migrations or the application's data seeding functionality to populate initial data.

## Performance Features

### Indexes
- Optimized for common query patterns
- Full-text search on ticket titles and descriptions
- Filtered indexes for active records

## Connection String

After setup, use this connection string format:

```
Server=localhost;Database=TicketDashboardDb;Trusted_Connection=true;MultipleActiveResultSets=true
```

For SQL Server Authentication:
```
Server=localhost;Database=TicketDashboardDb;User Id=your_user;Password=your_password;MultipleActiveResultSets=true
```

## Maintenance

### Regular Maintenance Tasks

1. **Update Statistics**
   ```sql
   USE TicketDashboardDb;
   EXEC sp_updatestats;
   ```

2. **Rebuild Indexes** (monthly)
   ```sql
   ALTER INDEX ALL ON [dbo].[Tickets] REBUILD;
   ```

### Backup Strategy

Recommended backup schedule:
- Full backup: Weekly
- Differential backup: Daily
- Log backup: Every 15 minutes

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure SQL Server service account has proper permissions
   - Grant db_owner rights to application user

2. **Performance Issues**
   - Check index fragmentation
   - Update statistics
   - Consider partitioning for large datasets

3. **Connection Issues**
   - Verify SQL Server is running
   - Check firewall settings
   - Validate connection string

### Monitoring Queries

**Check Database Size**
```sql
SELECT 
    DB_NAME() AS DatabaseName,
    SUM(size * 8 / 1024) AS SizeMB
FROM sys.database_files;
```

**Check Table Sizes**
```sql
SELECT 
    t.NAME AS TableName,
    s.Name AS SchemaName,
    p.rows AS RowCounts,
    CAST(ROUND(((SUM(a.total_pages) * 8) / 1024.00), 2) AS NUMERIC(36, 2)) AS TotalSpaceMB
FROM sys.tables t
INNER JOIN sys.indexes i ON t.OBJECT_ID = i.object_id
INNER JOIN sys.partitions p ON i.object_id = p.OBJECT_ID AND i.index_id = p.index_id
INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
GROUP BY t.Name, s.Name, p.Rows
ORDER BY TotalSpaceMB DESC;
```

## Security Considerations

1. **Use SQL Server Authentication** for production
2. **Create dedicated application user** with minimal permissions
3. **Enable encryption** for sensitive data
4. **Regular security updates** for SQL Server
5. **Audit trail** configuration for compliance

## Support

For issues with these scripts:
1. Check SQL Server error logs
2. Verify script execution order
3. Ensure proper permissions
4. Contact database administrator