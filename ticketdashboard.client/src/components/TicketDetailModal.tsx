import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import type { Ticket, CreateTicketComment } from '../types';
import { useTicketComments } from '../hooks/useTicketComments';
import { statusColors, priorityColors } from '../theme';

interface TicketDetailModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onEdit?: (ticket: Ticket) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  isOpen,
  ticket,
  onClose,
  onEdit
}) => {
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  const { comments, loading: commentsLoading, addComment } = useTicketComments(ticket?.id || 0);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !ticket) return;

    setAddingComment(true);
    try {
      const commentData: CreateTicketComment = {
        ticketId: ticket.id,
        content: newComment.trim(),
        isInternal
      };

      const result = await addComment(commentData);
      if (result) {
        setNewComment('');
        setIsInternal(false);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setAddingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: number) => {
    return statusColors[status] || 'default';
  };

  const getPriorityColor = (priority: number) => {
    return priorityColors[priority] || 'default';
  };

  if (!ticket) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Typography variant="h5" component="h2">
              #{ticket.id} {ticket.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={ticket.status}
                color={getStatusColor(ticket.status)}
                size="small"
                variant="filled"
              />
              <Chip
                label={ticket.priority}
                color={getPriorityColor(ticket.priority)}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
          
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              <strong>Created by:</strong> {ticket.createdByName} • {formatDate(ticket.createdAt)}
            </Typography>
            {ticket.assignedToName && (
              <Typography variant="body2" color="text.secondary">
                <strong>Assigned to:</strong> {ticket.assignedToName}
              </Typography>
            )}
            {ticket.customerEmail && (
              <Typography variant="body2" color="text.secondary">
                <strong>Customer:</strong> {ticket.customerEmail}
              </Typography>
            )}
          </Stack>
        </Box>
        
        <Stack direction="row" spacing={1}>
          {onEdit && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(ticket)}
            >
              Edit
            </Button>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Description */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </Typography>
          </Paper>
        </Box>

        {/* Comments */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CommentIcon />
            <Typography variant="h6">
              Comments ({comments.length})
            </Typography>
          </Box>

          {commentsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
              {comments.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No comments yet. Be the first to add one!
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {comments.map((comment) => (
                    <Paper
                      key={comment.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: comment.isInternal ? 'warning.50' : 'background.paper',
                        borderColor: comment.isInternal ? 'warning.200' : 'divider',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {comment.authorName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {comment.authorName}
                          </Typography>
                          {comment.isInternal && (
                            <Chip label="Internal" size="small" color="warning" />
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                          <ScheduleIcon fontSize="small" />
                          <Typography variant="caption">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {/* Add comment form */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box component="form" onSubmit={handleAddComment}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Add Comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={addingComment}
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      disabled={addingComment}
                    />
                  }
                  label="Internal comment"
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={addingComment ? <CircularProgress size={16} /> : <SendIcon />}
                  disabled={!newComment.trim() || addingComment}
                >
                  {addingComment ? 'Adding...' : 'Add Comment'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};