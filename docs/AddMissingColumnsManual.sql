-- Direct SQL script to add missing columns to existing database
-- Run this script in SQL Server Management Studio or similar tool

USE TicketDashboardDb; -- Change to your actual database name
GO

PRINT 'Adding missing columns to Tickets table...';

-- Add FirstResponseAt column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'FirstResponseAt')
BEGIN
    ALTER TABLE [dbo].[Tickets] ADD [FirstResponseAt] datetime2(7) NULL;
    PRINT 'Added FirstResponseAt column';
END
ELSE
BEGIN
    PRINT 'FirstResponseAt column already exists';
END

-- Add SlaId column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'SlaId')
BEGIN
    ALTER TABLE [dbo].[Tickets] ADD [SlaId] int NULL;
    PRINT 'Added SlaId column';
END
ELSE
BEGIN
    PRINT 'SlaId column already exists';
END

-- Add Tags column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'Tags')
BEGIN
    ALTER TABLE [dbo].[Tickets] ADD [Tags] nvarchar(500) NULL;
    PRINT 'Added Tags column';
END
ELSE
BEGIN
    PRINT 'Tags column already exists';
END

-- Check if ServiceLevelAgreements table exists and add foreign key
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'ServiceLevelAgreements')
   AND EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'SlaId')
   AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Tickets_ServiceLevelAgreements_SlaId')
BEGIN
    ALTER TABLE [dbo].[Tickets] 
    ADD CONSTRAINT [FK_Tickets_ServiceLevelAgreements_SlaId] 
    FOREIGN KEY ([SlaId]) REFERENCES [dbo].[ServiceLevelAgreements]([Id]) ON DELETE SET NULL;
    PRINT 'Added foreign key constraint for SlaId';
END

-- Check if TicketComments has IsInternal column
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'TicketComments')
   AND NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[TicketComments]') AND name = 'IsInternal')
BEGIN
    ALTER TABLE [dbo].[TicketComments] ADD [IsInternal] bit NOT NULL DEFAULT 0;
    PRINT 'Added IsInternal column to TicketComments';
END

PRINT 'Script completed successfully!';

-- Show current Tickets table structure
SELECT 
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.IS_NULLABLE,
    c.COLUMN_DEFAULT,
    c.CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS c
WHERE c.TABLE_NAME = 'Tickets'
ORDER BY c.ORDINAL_POSITION;