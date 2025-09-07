USE TicketDashboardDb;
GO

CREATE TABLE [dbo].[Users] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Username] nvarchar(50) NOT NULL,
    [Email] nvarchar(200) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Role] nvarchar(20) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT 1,
    [LastLoginAt] datetime2(7) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [IX_Users_Username] UNIQUE NONCLUSTERED ([Username] ASC),
    CONSTRAINT [IX_Users_Email] UNIQUE NONCLUSTERED ([Email] ASC),
    CONSTRAINT [CK_Users_Role] CHECK ([Role] IN ('Admin', 'Agent', 'Customer'))
);
GO

CREATE TABLE [dbo].[Agents] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Email] nvarchar(200) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT 1,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_Agents] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [IX_Agents_Email] UNIQUE NONCLUSTERED ([Email] ASC)
);
GO

CREATE TABLE [dbo].[ServiceLevelAgreements] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Priority] int NOT NULL,
    [ResponseTime] bigint NOT NULL,
    [ResolutionTime] bigint NOT NULL,
    [IsActive] bit NOT NULL DEFAULT 1,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_ServiceLevelAgreements] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_SLA_Priority] CHECK ([Priority] IN (0, 1, 2, 3)),
    CONSTRAINT [CK_SLA_ResponseTime] CHECK ([ResponseTime] > 0),
    CONSTRAINT [CK_SLA_ResolutionTime] CHECK ([ResolutionTime] > 0)
);
GO

CREATE TABLE [dbo].[TicketRoutingRules] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Priority] int NOT NULL DEFAULT 1,
    [IsActive] bit NOT NULL DEFAULT 1,
    [ConditionsJson] nvarchar(max) NOT NULL,
    [AssignToUserId] int NULL,
    [AssignToDepartment] nvarchar(100) NULL,
    [AddTags] nvarchar(500) NULL,
    [SetPriority] int NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_TicketRoutingRules] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TicketRoutingRules_AssignToUser] FOREIGN KEY ([AssignToUserId]) 
        REFERENCES [dbo].[Users] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [CK_RoutingRule_SetPriority] CHECK ([SetPriority] IN (0, 1, 2, 3) OR [SetPriority] IS NULL),
    CONSTRAINT [CK_RoutingRule_Priority] CHECK ([Priority] > 0)
);
GO

CREATE TABLE [dbo].[Tickets] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(2000) NOT NULL,
    [Status] int NOT NULL DEFAULT 0,
    [Priority] int NOT NULL DEFAULT 1,
    [CreatedById] int NOT NULL,
    [AssignedToId] int NULL,
    [CustomerEmail] nvarchar(200) NULL,
    [ClosedAt] datetime2(7) NULL,
    [FirstResponseAt] datetime2(7) NULL,
    [SlaId] int NULL,
    [Tags] nvarchar(500) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_Tickets] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Tickets_CreatedBy] FOREIGN KEY ([CreatedById]) 
        REFERENCES [dbo].[Users] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Tickets_AssignedTo] FOREIGN KEY ([AssignedToId]) 
        REFERENCES [dbo].[Users] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Tickets_Sla] FOREIGN KEY ([SlaId]) 
        REFERENCES [dbo].[ServiceLevelAgreements] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [CK_Ticket_Status] CHECK ([Status] IN (0, 1, 2, 3, 4)),
    CONSTRAINT [CK_Ticket_Priority] CHECK ([Priority] IN (0, 1, 2, 3))
);
GO

CREATE TABLE [dbo].[TicketComments] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TicketId] int NOT NULL,
    [AuthorId] int NOT NULL,
    [Content] nvarchar(1000) NOT NULL,
    [IsInternal] bit NOT NULL DEFAULT 0,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_TicketComments] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TicketComments_Ticket] FOREIGN KEY ([TicketId]) 
        REFERENCES [dbo].[Tickets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TicketComments_Author] FOREIGN KEY ([AuthorId]) 
        REFERENCES [dbo].[Users] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [dbo].[SlaViolations] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TicketId] int NOT NULL,
    [SlaId] int NOT NULL,
    [ViolationType] int NOT NULL,
    [ViolationTime] datetime2(7) NOT NULL,
    [ActualTime] bigint NOT NULL,
    [ExpectedTime] bigint NOT NULL,
    [IsResolved] bit NOT NULL DEFAULT 0,
    [Notes] nvarchar(1000) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_SlaViolations] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_SlaViolations_Ticket] FOREIGN KEY ([TicketId]) 
        REFERENCES [dbo].[Tickets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_SlaViolations_Sla] FOREIGN KEY ([SlaId]) 
        REFERENCES [dbo].[ServiceLevelAgreements] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [CK_SlaViolation_ViolationType] CHECK ([ViolationType] IN (0, 1))
);
GO

CREATE TABLE [dbo].[TicketRoutingLogs] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TicketId] int NOT NULL,
    [RoutingRuleId] int NOT NULL,
    [ActionTaken] nvarchar(500) NOT NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    
    CONSTRAINT [PK_TicketRoutingLogs] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TicketRoutingLogs_Ticket] FOREIGN KEY ([TicketId]) 
        REFERENCES [dbo].[Tickets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TicketRoutingLogs_RoutingRule] FOREIGN KEY ([RoutingRuleId]) 
        REFERENCES [dbo].[TicketRoutingRules] ([Id]) ON DELETE CASCADE
);
GO

PRINT 'All tables created successfully.';