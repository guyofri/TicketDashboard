import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { 
  CreateTicket, 
  UpdateTicket, 
  Ticket, 
  TicketStatus, 
  TicketPriority, 
  Agent 
} from '../types';

interface TicketModalProps {
  isOpen: boolean;
  ticket?: Ticket | null;
  agents: Agent[];
  onClose: () => void;
  onSave: (data: CreateTicket | UpdateTicket) => Promise<boolean>;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  ticket,
  agents = [],
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CreateTicket & Partial<UpdateTicket>>({
    title: '',
    description: '',
    priority: TicketPriority.Medium,
    assignedToId: undefined,
    customerEmail: '',
    status: undefined
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!ticket;

  useEffect(() => {
    if (isOpen) {
      if (ticket) {
        setFormData({
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          assignedToId: ticket.assignedToId,
          customerEmail: ticket.customerEmail || '',
          status: ticket.status
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: TicketPriority.Medium,
          assignedToId: undefined,
          customerEmail: '',
          status: undefined
        });
      }
      setErrors({});
    }
  }, [isOpen, ticket]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const saveData = isEditing 
        ? formData as UpdateTicket
        : {
            title: formData.title!,
            description: formData.description!,
            priority: formData.priority,
            assignedToId: formData.assignedToId,
            customerEmail: formData.customerEmail
          } as CreateTicket;
          
      const success = await onSave(saveData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Ticket' : 'Create New Ticket'}
        </Typography>
        <IconButton onClick={onClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title || `${formData.title?.length || 0}/200 characters`}
              inputProps={{ maxLength: 200 }}
              disabled={loading}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              required
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description || `${formData.description?.length || 0}/2000 characters`}
              inputProps={{ maxLength: 2000 }}
              disabled={loading}
            />
          </Grid>

          {/* Priority and Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleChange('priority', Number(e.target.value))}
                label="Priority"
                disabled={loading}
              >
                <MenuItem value={TicketPriority.Low}>Low</MenuItem>
                <MenuItem value={TicketPriority.Medium}>Medium</MenuItem>
                <MenuItem value={TicketPriority.High}>High</MenuItem>
                <MenuItem value={TicketPriority.Critical}>Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {isEditing && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || TicketStatus.Open}
                  onChange={(e) => handleChange('status', Number(e.target.value))}
                  label="Status"
                  disabled={loading}
                >
                  <MenuItem value={TicketStatus.Open}>Open</MenuItem>
                  <MenuItem value={TicketStatus.InProgress}>In Progress</MenuItem>
                  <MenuItem value={TicketStatus.Resolved}>Resolved</MenuItem>
                  <MenuItem value={TicketStatus.Closed}>Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Assigned To and Customer Email */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={formData.assignedToId || ''}
                onChange={(e) => handleChange('assignedToId', e.target.value ? Number(e.target.value) : undefined)}
                label="Assign To"
                disabled={loading}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {agents && agents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Email"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleChange('customerEmail', e.target.value)}
              error={!!errors.customerEmail}
              helperText={errors.customerEmail}
              disabled={loading}
            />
          </Grid>
        </Grid>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the errors above before submitting.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')} Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};