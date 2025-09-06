-- Script to check existing columns and add missing ones
-- This script is safer than running the full migration on an existing database

PRINT 'Checking existing database schema and adding missing columns...';

-- Check if Tickets table exists
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Tickets')
BEGIN
    PRINT 'Tickets table exists. Checking for missing columns...';
    
    -- Check and add FirstResponseAt column
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'FirstResponseAt')
    BEGIN
        ALTER TABLE Tickets ADD FirstResponseAt datetime2(7) NULL;
        PRINT '? Added FirstResponseAt column to Tickets table';
    END
    ELSE
    BEGIN
        PRINT '?? FirstResponseAt column already exists';
    END

    -- Check and add SlaId column
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'SlaId')
    BEGIN
        ALTER TABLE Tickets ADD SlaId int NULL;
        PRINT '? Added SlaId column to Tickets table';
    END
    ELSE
    BEGIN
        PRINT '?? SlaId column already exists';
    END

    -- Check and add Tags column
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'Tags')
    BEGIN
        ALTER TABLE Tickets ADD Tags nvarchar(500) NULL;
        PRINT '? Added Tags column to Tickets table';
    END
    ELSE
    BEGIN
        PRINT '?? Tags column already exists';
    END

    -- Check and add CustomerEmail column
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'CustomerEmail')
    BEGIN
        ALTER TABLE Tickets ADD CustomerEmail nvarchar(200) NULL;
        PRINT '? Added CustomerEmail column to Tickets table';
    END
    ELSE
    BEGIN
        PRINT '?? CustomerEmail column already exists';
    END
END
ELSE
BEGIN
    PRINT '? Tickets table does not exist. You may need to run the full migration.';
END

-- Check for ServiceLevelAgreements table and add foreign key if needed
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ServiceLevelAgreements') 
   AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'SlaId')
   AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Tickets_ServiceLevelAgreements_SlaId')
BEGIN
    ALTER TABLE Tickets ADD CONSTRAINT FK_Tickets_ServiceLevelAgreements_SlaId 
    FOREIGN KEY (SlaId) REFERENCES ServiceLevelAgreements(Id) ON DELETE SET NULL;
    PRINT '? Added foreign key constraint for SlaId';
END

-- Check if TicketComments table exists and has IsInternal column
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TicketComments')
BEGIN
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'TicketComments' AND COLUMN_NAME = 'IsInternal')
    BEGIN
        ALTER TABLE TicketComments ADD IsInternal bit NOT NULL DEFAULT 0;
        PRINT '? Added IsInternal column to TicketComments table';
    END
    ELSE
    BEGIN
        PRINT '?? IsInternal column already exists in TicketComments';
    END
END

PRINT 'Schema check completed!';

-- Display current Tickets table structure
PRINT 'Current Tickets table columns:';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Tickets'
ORDER BY ORDINAL_POSITION;