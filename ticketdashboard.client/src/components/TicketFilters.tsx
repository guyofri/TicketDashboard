import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import type { TicketFilter, Agent } from '../types';
import { TicketStatus, TicketPriority } from '../types';

interface TicketFiltersProps {
  filter: TicketFilter;
  agents: Agent[];
  onFilterChange: (filter: Partial<TicketFilter>) => void;
  onResetFilter: () => void;
  onCreateTicket: () => void;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filter,
  agents,
  onFilterChange,
  onResetFilter,
  onCreateTicket
}) => {
  const [searchValue, setSearchValue] = useState(filter.search || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchValue, page: 1 });
  };

  const handleFilterChange = (key: keyof TicketFilter, value: any) => {
    onFilterChange({ [key]: value, page: 1 });
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: TicketStatus.Open, label: 'Open' },
    { value: TicketStatus.InProgress, label: 'In Progress' },
    { value: TicketStatus.Resolved, label: 'Resolved' },
    { value: TicketStatus.Closed, label: 'Closed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: TicketPriority.Low, label: 'Low' },
    { value: TicketPriority.Medium, label: 'Medium' },
    { value: TicketPriority.High, label: 'High' },
    { value: TicketPriority.Critical, label: 'Critical' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' }
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
      {/* Main filter row */}
      <Box component="form" onSubmit={handleSearchSubmit}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          {/* Search */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search tickets..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ flex: 1 }}
          />

          {/* Action buttons */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Advanced Filters">
              <IconButton
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                color={showAdvancedFilters ? 'primary' : 'default'}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Reset Filters">
              <IconButton onClick={onResetFilter} color="default">
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateTicket}
              sx={{ whiteSpace: 'nowrap' }}
            >
              New Ticket
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Advanced filters */}
      <Collapse in={showAdvancedFilters}>
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            {/* Status filter */}
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value ? Number(e.target.value) : undefined)}
                  label="Status"
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Priority filter */}
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filter.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value ? Number(e.target.value) : undefined)}
                  label="Priority"
                >
                  {priorityOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Assigned to filter */}
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={filter.assignedToId || ''}
                  onChange={(e) => handleFilterChange('assignedToId', e.target.value ? Number(e.target.value) : undefined)}
                  label="Assigned To"
                >
                  <MenuItem value="">All Agents</MenuItem>
                  {agents && agents.map(agent => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort by */}
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filter.sortBy || 'createdAt'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  label="Sort By"
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort direction */}
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Direction</InputLabel>
                <Select
                  value={filter.sortDirection || 'desc'}
                  onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                  label="Direction"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Page size */}
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={filter.pageSize || 20}
                  onChange={(e) => handleFilterChange('pageSize', Number(e.target.value))}
                  label="Per Page"
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};