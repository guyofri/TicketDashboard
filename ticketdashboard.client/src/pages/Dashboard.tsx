import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Chip,
  Grid,
  Paper,
  Backdrop,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Error as ErrorIcon,
  AccountCircle,
  Logout,
  Person,
  Settings,
} from '@mui/icons-material';
import { TicketCard } from '../components/TicketCard';
import { TicketFilters } from '../components/TicketFilters';
import { Pagination } from '../components/Pagination';
import { TicketModal } from '../components/TicketModal';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { useTickets } from '../hooks/useTickets';
import { useAgents } from '../hooks/useAgents';
import { useAuth } from '../contexts/AuthContext';
import { signalRService } from '../services/signalr';
import type { Ticket, CreateTicket, UpdateTicket } from '../types';

export const Dashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user, logout } = useAuth();

  const {
    tickets,
    loading: ticketsLoading,
    error: ticketsError,
    filter,
    createTicket,
    updateTicket,
    deleteTicket,
    updateFilter,
    resetFilter
  } = useTickets();

  const {
    agents,
    loading: agentsLoading,
    error: agentsError
  } = useAgents();

  // Initialize SignalR connection with authentication
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        setConnectionStatus('connecting');
        await signalRService.start();
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
        setConnectionStatus('disconnected');
      }
    };

    if (user) {
      initializeSignalR();
    }

    return () => {
      signalRService.stop();
    };
  }, [user]);

  const handleCreateTicket = async (ticketData: CreateTicket): Promise<boolean> => {
    const result = await createTicket(ticketData);
    return !!result;
  };

  const handleUpdateTicket = async (ticketData: UpdateTicket): Promise<boolean> => {
    if (!editingTicket) return false;
    const result = await updateTicket(editingTicket.id, ticketData);
    return !!result;
  };

  const handleModalSave = async (data: CreateTicket | UpdateTicket): Promise<boolean> => {
    if (editingTicket) {
      return handleUpdateTicket(data as UpdateTicket);
    } else {
      return handleCreateTicket(data as CreateTicket);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setViewingTicket(null);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setViewingTicket(ticket);
  };

  const handleDeleteTicket = async (ticketId: number) => {
    await deleteTicket(ticketId);
  };

  const handlePageChange = (page: number) => {
    updateFilter({ page });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <WifiIcon color="success" />;
      case 'connecting':
        return <CircularProgress size={20} />;
      case 'disconnected':
        return <WifiOffIcon color="error" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live updates active';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Offline';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'warning';
      case 'disconnected':
        return 'error';
    }
  };

  if (agentsLoading && ticketsLoading) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box textAlign="center">
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h1">
              Support Ticket Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Welcome back, {user?.firstName} {user?.lastName}
            </Typography>
          </Box>
          
          {/* Connection status */}
          <Chip
            icon={getConnectionStatusIcon()}
            label={getConnectionStatusText()}
            color={getConnectionStatusColor()}
            variant="outlined"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              mr: 2
            }}
          />

          {/* User menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={`${user?.firstName} ${user?.lastName}`}
                secondary={user?.role}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Error messages */}
        {(ticketsError || agentsError) && (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6">Error Loading Data</Typography>
            <Typography variant="body2">
              {ticketsError || agentsError}
            </Typography>
          </Alert>
        )}

        {/* Filters */}
        <TicketFilters
          filter={filter}
          agents={agents}
          onFilterChange={updateFilter}
          onResetFilter={resetFilter}
          onCreateTicket={() => setShowCreateModal(true)}
        />

        {/* Loading state */}
        {ticketsLoading && (
          <Box display="flex" justifyContent="center" py={6}>
            <Box textAlign="center">
              <CircularProgress size={40} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading tickets...
              </Typography>
            </Box>
          </Box>
        )}

        {/* Empty state */}
        {!ticketsLoading && tickets.items.length === 0 && (
          <Box display="flex" justifyContent="center" py={6}>
            <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
              <Typography variant="h6" gutterBottom>
                No tickets found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {filter.search || filter.status || filter.priority || filter.assignedToId
                  ? 'Try adjusting your filters to see more tickets.'
                  : 'Get started by creating your first support ticket.'}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Tickets grid */}
        {!ticketsLoading && tickets.items.length > 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {tickets.items.map((ticket) => (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={ticket.id}>
                  <TicketCard
                    ticket={ticket}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                    onView={handleViewTicket}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Pagination
              currentPage={tickets.page}
              totalPages={tickets.totalPages}
              totalItems={tickets.totalCount}
              itemsPerPage={tickets.pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Container>

      {/* Modals */}
      <TicketModal
        isOpen={showCreateModal}
        agents={agents}
        onClose={() => setShowCreateModal(false)}
        onSave={handleModalSave}
      />

      <TicketModal
        isOpen={!!editingTicket}
        ticket={editingTicket}
        agents={agents}
        onClose={() => setEditingTicket(null)}
        onSave={handleModalSave}
      />

      <TicketDetailModal
        isOpen={!!viewingTicket}
        ticket={viewingTicket}
        onClose={() => setViewingTicket(null)}
        onEdit={handleEditTicket}
      />
    </Box>
  );
};