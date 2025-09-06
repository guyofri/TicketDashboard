import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import type {
  Ticket,
  TicketStatus,
  TicketPriority
} from '../types';
import {
  getStatusLabel,
  getPriorityLabel
} from '../types';
import { statusColors, priorityColors } from '../theme';

interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticketId: number) => void;
  onView?: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onEdit,
  onDelete,
  onView
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: TicketStatus) => {
    return statusColors[status] || 'default';
  };

  const getPriorityColor = (priority: TicketPriority) => {
    return priorityColors[priority] || 'default';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      onDelete?.(ticket.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(ticket);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
      onClick={() => onView?.(ticket)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with ID and Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h3" noWrap sx={{ flexGrow: 1, mr: 1 }}>
            #{ticket.id} {ticket.title}
          </Typography>
          <Box display="flex" gap={0.5}>
            {onEdit && (
              <Tooltip title="Edit ticket">
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete ticket">
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {ticket.description}
        </Typography>

        {/* Status and Priority Chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={getStatusLabel(ticket.status)}
            color={getStatusColor(ticket.status)}
            size="small"
            variant="filled"
          />
          <Chip
            label={getPriorityLabel(ticket.priority)}
            color={getPriorityColor(ticket.priority)}
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Details */}
        <Stack spacing={1}>
          {ticket.assignedToName && (
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {ticket.assignedToName}
              </Typography>
            </Box>
          )}
          
          {ticket.customerEmail && (
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {ticket.customerEmail}
              </Typography>
            </Box>
          )}

          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(ticket.createdAt)}
            </Typography>
          </Box>

          {ticket.updatedAt !== ticket.createdAt && (
            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Updated: {formatDate(ticket.updatedAt)}
              </Typography>
            </Box>
          )}

          {ticket.commentCount > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <CommentIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {ticket.commentCount} comment{ticket.commentCount !== 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      {/* Footer with Created By */}
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Box display="flex" alignItems="center" gap={1} width="100%">
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
            {ticket.createdByName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            Created by {ticket.createdByName}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
};