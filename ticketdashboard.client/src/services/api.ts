import axios from 'axios';
import type {
  Ticket,
  CreateTicket,
  UpdateTicket,
  TicketFilter,
  Agent,
  CreateAgent,
  TicketComment,
  CreateTicketComment,
  PagedResult
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'ticket_dashboard_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // If we get a 401, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('ticket_dashboard_token');
      localStorage.removeItem('ticket_dashboard_refresh_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const ticketApi = {
  // Ticket endpoints
  getTickets: async (filter: TicketFilter = {}): Promise<PagedResult<Ticket>> => {
    const params = new URLSearchParams();
    
    if (filter.status !== undefined) params.append('status', filter.status.toString());
    if (filter.priority !== undefined) params.append('priority', filter.priority.toString());
    if (filter.assignedToId !== undefined) params.append('assignedToId', filter.assignedToId.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.page !== undefined) params.append('page', filter.page.toString());
    if (filter.pageSize !== undefined) params.append('pageSize', filter.pageSize.toString());
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortDirection) params.append('sortDirection', filter.sortDirection);

    const response = await api.get(`/tickets?${params.toString()}`);
    return response.data;
  },

  getTicket: async (id: number): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticket: CreateTicket): Promise<Ticket> => {
    const response = await api.post('/tickets', ticket);
    return response.data;
  },

  updateTicket: async (id: number, ticket: UpdateTicket): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}`, ticket);
    return response.data;
  },

  deleteTicket: async (id: number): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  getTicketComments: async (ticketId: number): Promise<TicketComment[]> => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  addComment: async (comment: CreateTicketComment): Promise<TicketComment> => {
    const response = await api.post('/tickets/comments', comment);
    return response.data;
  },

  // Agent endpoints
  getAgents: async (): Promise<Agent[]> => {
    const response = await api.get('/agents');
    return response.data;
  },

  getAgent: async (id: number): Promise<Agent> => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },

  createAgent: async (agent: CreateAgent): Promise<Agent> => {
    const response = await api.post('/agents', agent);
    return response.data;
  },
};

export default api;