// Enums
export enum TicketStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4
}

export enum TicketPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export enum AgentRole {
  Agent = 1,
  Lead = 2,
  Manager = 3,
  Admin = 4
}

// Ticket Types
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedToId?: number;
  assignedToName?: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  customerEmail?: string;
  commentCount: number;
}

export interface CreateTicket {
  title: string;
  description: string;
  priority: TicketPriority;
  assignedToId?: number;
  customerEmail?: string;
}

export interface UpdateTicket {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: number;
  customerEmail?: string;
}

export interface TicketFilter {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

// Agent Types
export interface Agent {
  id: number;
  name: string;
  email: string;
  role: AgentRole;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAgent {
  name: string;
  email: string;
  role: AgentRole;
}

// Comment Types
export interface TicketComment {
  id: number;
  ticketId: number;
  authorId: number;
  authorName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CreateTicketComment {
  ticketId: number;
  content: string;
  isInternal: boolean;
}

// Utility Types
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Helper functions for enum display
export const getStatusLabel = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.Open: return 'Open';
    case TicketStatus.InProgress: return 'In Progress';
    case TicketStatus.Resolved: return 'Resolved';
    case TicketStatus.Closed: return 'Closed';
    default: return 'Unknown';
  }
};

export const getPriorityLabel = (priority: TicketPriority): string => {
  switch (priority) {
    case TicketPriority.Low: return 'Low';
    case TicketPriority.Medium: return 'Medium';
    case TicketPriority.High: return 'High';
    case TicketPriority.Critical: return 'Critical';
    default: return 'Unknown';
  }
};

export const getRoleLabel = (role: AgentRole): string => {
  switch (role) {
    case AgentRole.Agent: return 'Agent';
    case AgentRole.Lead: return 'Lead';
    case AgentRole.Manager: return 'Manager';
    case AgentRole.Admin: return 'Admin';
    default: return 'Unknown';
  }
};

export const getPriorityColor = (priority: TicketPriority): string => {
  switch (priority) {
    case TicketPriority.Low: return 'text-green-600';
    case TicketPriority.Medium: return 'text-yellow-600';
    case TicketPriority.High: return 'text-orange-600';
    case TicketPriority.Critical: return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.Open: return 'text-blue-600';
    case TicketStatus.InProgress: return 'text-yellow-600';
    case TicketStatus.Resolved: return 'text-green-600';
    case TicketStatus.Closed: return 'text-gray-600';
    default: return 'text-gray-600';
  }
};