using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TicketDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Agents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceLevelAgreements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    ResponseTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ResolutionTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceLevelAgreements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TicketRoutingRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ConditionsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AssignToUserId = table.Column<int>(type: "int", nullable: true),
                    AssignToDepartment = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AddTags = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SetPriority = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketRoutingRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketRoutingRules_Users_AssignToUserId",
                        column: x => x.AssignToUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: false),
                    AssignedToId = table.Column<int>(type: "int", nullable: true),
                    CustomerEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ClosedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FirstResponseAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SlaId = table.Column<int>(type: "int", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AgentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tickets_Agents_AgentId",
                        column: x => x.AgentId,
                        principalTable: "Agents",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tickets_ServiceLevelAgreements_SlaId",
                        column: x => x.SlaId,
                        principalTable: "ServiceLevelAgreements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Tickets_Users_AssignedToId",
                        column: x => x.AssignedToId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Tickets_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SlaViolations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketId = table.Column<int>(type: "int", nullable: false),
                    SlaId = table.Column<int>(type: "int", nullable: false),
                    ViolationType = table.Column<int>(type: "int", nullable: false),
                    ViolationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActualTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ExpectedTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    IsResolved = table.Column<bool>(type: "bit", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlaViolations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SlaViolations_ServiceLevelAgreements_SlaId",
                        column: x => x.SlaId,
                        principalTable: "ServiceLevelAgreements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SlaViolations_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TicketComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketId = table.Column<int>(type: "int", nullable: false),
                    AuthorId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    IsInternal = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AgentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketComments_Agents_AgentId",
                        column: x => x.AgentId,
                        principalTable: "Agents",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TicketComments_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketComments_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TicketRoutingLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketId = table.Column<int>(type: "int", nullable: false),
                    RoutingRuleId = table.Column<int>(type: "int", nullable: false),
                    ActionTaken = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AppliedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketRoutingLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketRoutingLogs_TicketRoutingRules_RoutingRuleId",
                        column: x => x.RoutingRuleId,
                        principalTable: "TicketRoutingRules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketRoutingLogs_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Agents",
                columns: new[] { "Id", "CreatedAt", "Email", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 12, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7489), "john.doe@company.com", true, "John Doe", null },
                    { 2, new DateTime(2025, 8, 17, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7492), "jane.smith@company.com", true, "Jane Smith", null },
                    { 3, new DateTime(2025, 8, 22, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7494), "bob.johnson@company.com", true, "Bob Johnson", null }
                });

            migrationBuilder.InsertData(
                table: "ServiceLevelAgreements",
                columns: new[] { "Id", "CreatedAt", "Description", "IsActive", "Name", "Priority", "ResolutionTime", "ResponseTime", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 7, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7601), "Service Level Agreement for Critical priority tickets", true, "Critical Priority SLA", 3, new TimeSpan(0, 4, 0, 0, 0), new TimeSpan(0, 1, 0, 0, 0), null },
                    { 2, new DateTime(2025, 8, 7, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7604), "Service Level Agreement for High priority tickets", true, "High Priority SLA", 2, new TimeSpan(1, 0, 0, 0, 0), new TimeSpan(0, 4, 0, 0, 0), null },
                    { 3, new DateTime(2025, 8, 7, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7608), "Service Level Agreement for Medium priority tickets", true, "Medium Priority SLA", 1, new TimeSpan(3, 0, 0, 0, 0), new TimeSpan(0, 8, 0, 0, 0), null },
                    { 4, new DateTime(2025, 8, 7, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7611), "Service Level Agreement for Low priority tickets", true, "Low Priority SLA", 0, new TimeSpan(7, 0, 0, 0, 0), new TimeSpan(1, 0, 0, 0, 0), null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastLoginAt", "LastName", "PasswordHash", "Role", "UpdatedAt", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 7, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7223), "admin@company.com", "System", true, null, "Administrator", "AQAAAAIAAYagAAAAEGwGGCBvPtT4WF3U7v7uD7ixqf7fy8yHQP7Q9tP3QJ7VJ7qJ7yQ7Z7", "Admin", null, "admin" },
                    { 2, new DateTime(2025, 8, 12, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7232), "john.doe@company.com", "John", true, null, "Doe", "AQAAAAIAAYagAAAAEGwGGCBvPtT4WF3U7v7uD7ixqf7fy8yHQP7Q9tP3QJ7VJ7qJ7yQ7Z7", "Agent", null, "john.doe" },
                    { 3, new DateTime(2025, 8, 17, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7236), "jane.smith@company.com", "Jane", true, null, "Smith", "AQAAAAIAAYagAAAAEGwGGCBvPtT4WF3U7v7uD7ixqf7fy8yHQP7Q9tP3QJ7VJ7qJ7yQ7Z7", "Agent", null, "jane.smith" }
                });

            migrationBuilder.InsertData(
                table: "Tickets",
                columns: new[] { "Id", "AgentId", "AssignedToId", "ClosedAt", "CreatedAt", "CreatedById", "CustomerEmail", "Description", "FirstResponseAt", "Priority", "SlaId", "Status", "Tags", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, 2, null, new DateTime(2025, 8, 8, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501), 2, "customer1@example.com", "User cannot log into the system", null, 2, null, 0, null, "Login Issue", null },
                    { 2, null, 3, null, new DateTime(2025, 8, 9, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501), 2, "customer2@example.com", "Add dark mode support to the application", null, 1, null, 1, null, "Feature Request: Dark Mode", null },
                    { 3, null, 1, new DateTime(2025, 8, 12, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501), new DateTime(2025, 8, 10, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501), 3, "customer3@example.com", "Monthly reports are not generating properly", null, 3, null, 2, null, "Bug: Report Generation Fails", new DateTime(2025, 8, 12, 20, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501) }
                });

            migrationBuilder.InsertData(
                table: "TicketComments",
                columns: new[] { "Id", "AgentId", "AuthorId", "Content", "CreatedAt", "IsInternal", "TicketId", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, 2, "I've started investigating this issue. Will update soon.", new DateTime(2025, 8, 8, 22, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501), false, 1, null },
                    { 2, null, 3, "Working on the dark mode implementation. Should be ready for testing next week.", new DateTime(2025, 8, 10, 0, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501), true, 2, null },
                    { 3, null, 1, "Fixed the report generation issue. The problem was with the date filtering logic.", new DateTime(2025, 8, 12, 21, 0, 19, 298, DateTimeKind.Utc).AddTicks(7501), false, 3, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agents_Email",
                table: "Agents",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SlaViolations_SlaId",
                table: "SlaViolations",
                column: "SlaId");

            migrationBuilder.CreateIndex(
                name: "IX_SlaViolations_TicketId",
                table: "SlaViolations",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketComments_AgentId",
                table: "TicketComments",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketComments_AuthorId",
                table: "TicketComments",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketComments_TicketId",
                table: "TicketComments",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketRoutingLogs_RoutingRuleId",
                table: "TicketRoutingLogs",
                column: "RoutingRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketRoutingLogs_TicketId",
                table: "TicketRoutingLogs",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketRoutingRules_AssignToUserId",
                table: "TicketRoutingRules",
                column: "AssignToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_AgentId",
                table: "Tickets",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_AssignedToId",
                table: "Tickets",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CreatedById",
                table: "Tickets",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_SlaId",
                table: "Tickets",
                column: "SlaId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SlaViolations");

            migrationBuilder.DropTable(
                name: "TicketComments");

            migrationBuilder.DropTable(
                name: "TicketRoutingLogs");

            migrationBuilder.DropTable(
                name: "TicketRoutingRules");

            migrationBuilder.DropTable(
                name: "Tickets");

            migrationBuilder.DropTable(
                name: "Agents");

            migrationBuilder.DropTable(
                name: "ServiceLevelAgreements");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
