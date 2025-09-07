USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'TicketDashboardDb')
BEGIN
    ALTER DATABASE TicketDashboardDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE TicketDashboardDb;
END
GO

CREATE DATABASE TicketDashboardDb
ON 
(
    NAME = 'TicketDashboardDb',
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\TicketDashboardDb.mdf',
    SIZE = 100MB,
    MAXSIZE = 1GB,
    FILEGROWTH = 10MB
)
LOG ON 
(
    NAME = 'TicketDashboardDb_Log',
    FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\TicketDashboardDb_Log.ldf',
    SIZE = 10MB,
    MAXSIZE = 100MB,
    FILEGROWTH = 5MB
);
GO

ALTER DATABASE TicketDashboardDb SET RECOVERY SIMPLE;
ALTER DATABASE TicketDashboardDb SET AUTO_CLOSE OFF;
ALTER DATABASE TicketDashboardDb SET AUTO_SHRINK OFF;
ALTER DATABASE TicketDashboardDb SET AUTO_UPDATE_STATISTICS ON;
ALTER DATABASE TicketDashboardDb SET AUTO_CREATE_STATISTICS ON;
GO

USE TicketDashboardDb;
GO

PRINT 'Database TicketDashboardDb created successfully.';