import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import type { Ticket, TicketComment } from '../types';

class SignalRService {
  private connection: HubConnection | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  async start(): Promise<void> {
    if (this.connection?.state === 'Connected') {
      return;
    }

    const hubUrl = import.meta.env.VITE_HUB_URL || '/ticketHub';
    
    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Set up event handlers
    this.connection.on('TicketCreated', (ticket: Ticket) => {
      this.notifyListeners('TicketCreated', ticket);
    });

    this.connection.on('TicketUpdated', (ticket: Ticket) => {
      this.notifyListeners('TicketUpdated', ticket);
    });

    this.connection.on('TicketDeleted', (ticketId: number) => {
      this.notifyListeners('TicketDeleted', ticketId);
    });

    this.connection.on('CommentAdded', (comment: TicketComment) => {
      this.notifyListeners('CommentAdded', comment);
    });

    this.connection.onreconnecting(() => {
      console.log('SignalR: Attempting to reconnect...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR: Reconnected successfully');
    });

    this.connection.onclose(() => {
      console.log('SignalR: Connection closed');
    });

    try {
      await this.connection.start();
      console.log('SignalR: Connection started successfully');
    } catch (error) {
      console.error('SignalR: Failed to start connection:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  on(eventName: string, callback: (data: any) => void): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(callback);
  }

  off(eventName: string, callback: (data: any) => void): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private notifyListeners(eventName: string, data: any): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  get connectionState(): string {
    return this.connection?.state || 'Disconnected';
  }
}

export const signalRService = new SignalRService();
export default signalRService;