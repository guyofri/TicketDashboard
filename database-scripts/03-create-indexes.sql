USE TicketDashboardDb;
GO

CREATE NONCLUSTERED INDEX [IX_Users_Role] 
ON [dbo].[Users] ([Role] ASC)
INCLUDE ([IsActive], [FirstName], [LastName], [Email]);
GO

CREATE NONCLUSTERED INDEX [IX_Users_IsActive] 
ON [dbo].[Users] ([IsActive] ASC)
WHERE ([IsActive] = 1);
GO

CREATE NONCLUSTERED INDEX [IX_Users_LastLoginAt] 
ON [dbo].[Users] ([LastLoginAt] DESC)
WHERE ([LastLoginAt] IS NOT NULL);
GO

CREATE NONCLUSTERED INDEX [IX_Tickets_Status] 
ON [dbo].[Tickets] ([Status] ASC)
INCLUDE ([Priority], [CreatedAt], [AssignedToId]);
GO

CREATE NONCLUSTERED INDEX [IX_Tickets_Priority] 
ON [dbo].[Tickets] ([Priority] DESC)
INCLUDE ([Status], [CreatedAt], [AssignedToId]);
GO

CREATE NONCLUSTERED INDEX [IX_Tickets_CreatedById] 
ON [dbo].[Tickets] ([CreatedById] ASC)
INCLUDE ([Status], [Priority], [CreatedAt]);
GO

CREATE NONCLUSTERED INDEX [IX_Tickets_AssignedToId] 
ON [dbo].[Tickets] ([AssignedToId] ASC)
INCLUDE ([Status], [Priority], [CreatedAt])
WHERE ([AssignedToId] IS NOT NULL);
GO

CREATE NONCLUSTERED INDEX [IX_Tickets_CreatedAt] 
ON [dbo].[Tickets] ([CreatedAt] DESC)
INCLUDE ([Status], [Priority], [AssignedToId]);
GO

CREATE NONCLUSTERED INDEX [IX_Tickets_SlaId] 
ON [dbo].[Tickets] ([SlaId] ASC)
INCLUDE ([Status], [Priority], [CreatedAt])
WHERE ([SlaId] IS NOT NULL);
GO

CREATE NONCLUSTERED INDEX [IX_Tickets_CustomerEmail] 
ON [dbo].[Tickets] ([CustomerEmail] ASC)
INCLUDE ([Status], [Priority], [CreatedAt])
WHERE ([CustomerEmail] IS NOT NULL);
GO

CREATE FULLTEXT CATALOG [TicketFullTextCatalog] AS DEFAULT;
GO

CREATE FULLTEXT INDEX ON [dbo].[Tickets] 
(
    [Title] LANGUAGE 1033,
    [Description] LANGUAGE 1033,
    [Tags] LANGUAGE 1033
)
KEY INDEX [PK_Tickets]
ON [TicketFullTextCatalog]
WITH CHANGE_TRACKING AUTO;
GO

CREATE NONCLUSTERED INDEX [IX_TicketComments_TicketId] 
ON [dbo].[TicketComments] ([TicketId] ASC)
INCLUDE ([AuthorId], [CreatedAt], [IsInternal]);
GO

CREATE NONCLUSTERED INDEX [IX_TicketComments_AuthorId] 
ON [dbo].[TicketComments] ([AuthorId] ASC)
INCLUDE ([TicketId], [CreatedAt]);
GO

CREATE NONCLUSTERED INDEX [IX_TicketComments_CreatedAt] 
ON [dbo].[TicketComments] ([CreatedAt] DESC)
INCLUDE ([TicketId], [AuthorId]);
GO

CREATE NONCLUSTERED INDEX [IX_SLA_Priority] 
ON [dbo].[ServiceLevelAgreements] ([Priority] ASC)
INCLUDE ([IsActive], [ResponseTime], [ResolutionTime])
WHERE ([IsActive] = 1);
GO

CREATE NONCLUSTERED INDEX [IX_SLA_IsActive] 
ON [dbo].[ServiceLevelAgreements] ([IsActive] ASC)
WHERE ([IsActive] = 1);
GO

CREATE NONCLUSTERED INDEX [IX_SlaViolations_TicketId] 
ON [dbo].[SlaViolations] ([TicketId] ASC)
INCLUDE ([ViolationType], [ViolationTime], [IsResolved]);
GO

CREATE NONCLUSTERED INDEX [IX_SlaViolations_SlaId] 
ON [dbo].[SlaViolations] ([SlaId] ASC)
INCLUDE ([ViolationType], [ViolationTime], [IsResolved]);
GO

CREATE NONCLUSTERED INDEX [IX_SlaViolations_ViolationType] 
ON [dbo].[SlaViolations] ([ViolationType] ASC)
INCLUDE ([TicketId], [ViolationTime], [IsResolved]);
GO

CREATE NONCLUSTERED INDEX [IX_SlaViolations_IsResolved] 
ON [dbo].[SlaViolations] ([IsResolved] ASC)
INCLUDE ([TicketId], [ViolationType], [ViolationTime])
WHERE ([IsResolved] = 0);
GO

CREATE NONCLUSTERED INDEX [IX_RoutingRules_Priority] 
ON [dbo].[TicketRoutingRules] ([Priority] DESC)
INCLUDE ([IsActive], [AssignToUserId])
WHERE ([IsActive] = 1);
GO

CREATE NONCLUSTERED INDEX [IX_RoutingRules_IsActive] 
ON [dbo].[TicketRoutingRules] ([IsActive] ASC)
WHERE ([IsActive] = 1);
GO

CREATE NONCLUSTERED INDEX [IX_RoutingRules_AssignToUserId] 
ON [dbo].[TicketRoutingRules] ([AssignToUserId] ASC)
INCLUDE ([Priority], [IsActive])
WHERE ([AssignToUserId] IS NOT NULL);
GO

CREATE NONCLUSTERED INDEX [IX_RoutingLogs_TicketId] 
ON [dbo].[TicketRoutingLogs] ([TicketId] ASC)
INCLUDE ([RoutingRuleId], [CreatedAt]);
GO

CREATE NONCLUSTERED INDEX [IX_RoutingLogs_RoutingRuleId] 
ON [dbo].[TicketRoutingLogs] ([RoutingRuleId] ASC)
INCLUDE ([TicketId], [CreatedAt]);
GO

CREATE NONCLUSTERED INDEX [IX_RoutingLogs_CreatedAt] 
ON [dbo].[TicketRoutingLogs] ([CreatedAt] DESC)
INCLUDE ([TicketId], [RoutingRuleId]);
GO

CREATE NONCLUSTERED INDEX [IX_Agents_IsActive] 
ON [dbo].[Agents] ([IsActive] ASC)
WHERE ([IsActive] = 1);
GO

PRINT 'All indexes created successfully.';