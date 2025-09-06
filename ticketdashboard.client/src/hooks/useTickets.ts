import { useState, useEffect, useCallback } from 'react';
import { ticketApi } from '../services/api';
import { signalRService } from '../services/signalr';
import type {
  Ticket,
  CreateTicket,
  UpdateTicket,
  TicketFilter,
  PagedResult
} from '../types';

export const useTickets = (initialFilter: TicketFilter = {}) => {
  const [tickets, setTickets] = useState<PagedResult<Ticket>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TicketFilter>({ 
    page: 1, 
    pageSize: 20, 
    sortBy: 'createdAt', 
    sortDirection: 'desc',
    ...initialFilter 
  });

  const fetchTickets = useCallback(async (currentFilter: TicketFilter = filter) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ticketApi.getTickets(currentFilter);
      setTickets(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const createTicket = async (ticketData: CreateTicket): Promise<Ticket | null> => {
    try {
      const newTicket = await ticketApi.createTicket(ticketData);
      // Refresh the tickets list
      await fetchTickets();
      return newTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      return null;
    }
  };

  const updateTicket = async (id: number, ticketData: UpdateTicket): Promise<Ticket | null> => {
    try {
      const updatedTicket = await ticketApi.updateTicket(id, ticketData);
      // Update the ticket in the current list
      setTickets(prev => ({
        ...prev,
        items: prev.items.map(ticket => 
          ticket.id === id ? updatedTicket : ticket
        )
      }));
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
      return null;
    }
  };

  const deleteTicket = async (id: number): Promise<boolean> => {
    try {
      await ticketApi.deleteTicket(id);
      // Remove the ticket from the current list
      setTickets(prev => ({
        ...prev,
        items: prev.items.filter(ticket => ticket.id !== id),
        totalCount: prev.totalCount - 1
      }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ticket');
      return false;
    }
  };

  const updateFilter = (newFilter: Partial<TicketFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    fetchTickets(updatedFilter);
  };

  const resetFilter = () => {
    const defaultFilter = { 
      page: 1, 
      pageSize: 20, 
      sortBy: 'createdAt', 
      sortDirection: 'desc' 
    };
    setFilter(defaultFilter);
    fetchTickets(defaultFilter);
  };

  // Set up SignalR listeners
  useEffect(() => {
    const handleTicketCreated = (ticket: Ticket) => {
      setTickets(prev => ({
        ...prev,
        items: [ticket, ...prev.items.slice(0, prev.pageSize - 1)],
        totalCount: prev.totalCount + 1
      }));
    };

    const handleTicketUpdated = (ticket: Ticket) => {
      setTickets(prev => ({
        ...prev,
        items: prev.items.map(t => t.id === ticket.id ? ticket : t)
      }));
    };

    const handleTicketDeleted = (ticketId: number) => {
      setTickets(prev => ({
        ...prev,
        items: prev.items.filter(t => t.id !== ticketId),
        totalCount: prev.totalCount - 1
      }));
    };

    signalRService.on('TicketCreated', handleTicketCreated);
    signalRService.on('TicketUpdated', handleTicketUpdated);
    signalRService.on('TicketDeleted', handleTicketDeleted);

    return () => {
      signalRService.off('TicketCreated', handleTicketCreated);
      signalRService.off('TicketUpdated', handleTicketUpdated);
      signalRService.off('TicketDeleted', handleTicketDeleted);
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    filter,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    updateFilter,
    resetFilter
  };
};