-- ========================================
-- Ticket Dashboard Complete Setup Script
-- ========================================
-- Created for: TicketDashboard Application
-- Target: SQL Server 2019+
-- Description: Master script to run all database setup scripts in order
-- ========================================

PRINT '========================================';
PRINT 'Starting Ticket Dashboard Database Setup';
PRINT '========================================';

-- Check SQL Server version
DECLARE @Version NVARCHAR(128) = CAST(SERVERPROPERTY('ProductVersion') AS NVARCHAR(128));
DECLARE @Edition NVARCHAR(128) = CAST(SERVERPROPERTY('Edition') AS NVARCHAR(128));

PRINT 'SQL Server Version: ' + @Version;
PRINT 'SQL Server Edition: ' + @Edition;
PRINT '';

-- Step 1: Create Database
PRINT 'Step 1: Creating database...';
:r database-scripts\01-create-database.sql
PRINT 'Database creation completed.';
PRINT '';

-- Step 2: Create Tables
PRINT 'Step 2: Creating tables...';
:r database-scripts\02-create-tables.sql
PRINT 'Table creation completed.';
PRINT '';

-- Step 3: Create Indexes
PRINT 'Step 3: Creating indexes...';
:r database-scripts\03-create-indexes.sql
PRINT 'Index creation completed.';
PRINT '';

-- Final verification
USE TicketDashboardDb;
GO

PRINT '========================================';
PRINT 'Database Setup Verification';
PRINT '========================================';

-- Check table counts
PRINT 'Table verification:';
SELECT 
    t.TABLE_NAME,
    CASE 
        WHEN t.TABLE_NAME = 'Users' THEN (SELECT COUNT(*) FROM [dbo].[Users])
        WHEN t.TABLE_NAME = 'Tickets' THEN (SELECT COUNT(*) FROM [dbo].[Tickets])
        WHEN t.TABLE_NAME = 'TicketComments' THEN (SELECT COUNT(*) FROM [dbo].[TicketComments])
        WHEN t.TABLE_NAME = 'ServiceLevelAgreements' THEN (SELECT COUNT(*) FROM [dbo].[ServiceLevelAgreements])
        WHEN t.TABLE_NAME = 'TicketRoutingRules' THEN (SELECT COUNT(*) FROM [dbo].[TicketRoutingRules])
        WHEN t.TABLE_NAME = 'TicketRoutingLogs' THEN (SELECT COUNT(*) FROM [dbo].[TicketRoutingLogs])
        WHEN t.TABLE_NAME = 'SlaViolations' THEN (SELECT COUNT(*) FROM [dbo].[SlaViolations])
        WHEN t.TABLE_NAME = 'Agents' THEN (SELECT COUNT(*) FROM [dbo].[Agents])
        ELSE 0
    END AS RecordCount
FROM INFORMATION_SCHEMA.TABLES t
WHERE t.TABLE_TYPE = 'BASE TABLE'
    AND t.TABLE_SCHEMA = 'dbo'
ORDER BY t.TABLE_NAME;

PRINT '';
PRINT 'Index verification:';
SELECT 
    i.name AS IndexName,
    t.name AS TableName,
    i.type_desc AS IndexType
FROM sys.indexes i
INNER JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.schema_id = SCHEMA_ID('dbo')
    AND i.name IS NOT NULL
    AND i.name NOT LIKE 'PK_%'
ORDER BY t.name, i.name;

PRINT '';
PRINT '========================================';
PRINT 'Ticket Dashboard Database Setup Complete!';
PRINT '========================================';
PRINT '';
PRINT 'Next steps:';
PRINT '1. Update your application connection string to point to this database';
PRINT '2. Run Entity Framework migrations to populate initial data';
PRINT '3. Configure authentication and create initial users through the application';
PRINT '4. Customize SLA rules and routing rules as needed';
PRINT '';
PRINT 'Connection String Example:';
PRINT 'Server=localhost;Database=TicketDashboardDb;Trusted_Connection=true;MultipleActiveResultSets=true';
PRINT '';
PRINT 'Default Users:';
PRINT '- admin@company.com (Admin role)';
PRINT '- john.doe@company.com (Agent role)';
PRINT '- jane.smith@company.com (Agent role)';
PRINT '- mike.wilson@company.com (Agent role)';
PRINT '- customer1@example.com (Customer role)';
PRINT '';
PRINT 'Password for all users: Use your application to reset passwords';
PRINT '';