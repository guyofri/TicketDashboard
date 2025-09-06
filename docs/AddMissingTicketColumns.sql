-- Manual migration script to add missing columns to Tickets table
-- Run this script against your database to add the missing columns

-- Add FirstResponseAt column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'FirstResponseAt')
BEGIN
    ALTER TABLE Tickets ADD FirstResponseAt datetime2(7) NULL;
    PRINT 'Added FirstResponseAt column to Tickets table';
END
ELSE
BEGIN
    PRINT 'FirstResponseAt column already exists in Tickets table';
END

-- Add SlaId column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'SlaId')
BEGIN
    ALTER TABLE Tickets ADD SlaId int NULL;
    PRINT 'Added SlaId column to Tickets table';
END
ELSE
BEGIN
    PRINT 'SlaId column already exists in Tickets table';
END

-- Add Tags column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Tickets' AND COLUMN_NAME = 'Tags')
BEGIN
    ALTER TABLE Tickets ADD Tags nvarchar(500) NULL;
    PRINT 'Added Tags column to Tickets table';
END
ELSE
BEGIN
    PRINT 'Tags column already exists in Tickets table';
END

-- Add foreign key constraint for SlaId if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Tickets_ServiceLevelAgreements_SlaId')
BEGIN
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ServiceLevelAgreements')
    BEGIN
        ALTER TABLE Tickets ADD CONSTRAINT FK_Tickets_ServiceLevelAgreements_SlaId 
        FOREIGN KEY (SlaId) REFERENCES ServiceLevelAgreements(Id) ON DELETE SET NULL;
        PRINT 'Added foreign key constraint FK_Tickets_ServiceLevelAgreements_SlaId';
    END
    ELSE
    BEGIN
        PRINT 'ServiceLevelAgreements table does not exist, skipping foreign key constraint';
    END
END
ELSE
BEGIN
    PRINT 'Foreign key constraint FK_Tickets_ServiceLevelAgreements_SlaId already exists';
END

PRINT 'Migration completed successfully!';