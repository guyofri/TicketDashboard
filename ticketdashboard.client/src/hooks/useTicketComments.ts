import { useState, useEffect } from 'react';
import { ticketApi } from '../services/api';
import { signalRService } from '../services/signalr';
import type { TicketComment, CreateTicketComment } from '../types';

export const useTicketComments = (ticketId: number) => {
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!ticketId) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await ticketApi.getTicketComments(ticketId);
      setComments(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData: CreateTicketComment): Promise<TicketComment | null> => {
    try {
      const newComment = await ticketApi.addComment(commentData);
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      return null;
    }
  };

  // Set up SignalR listener for new comments
  useEffect(() => {
    const handleCommentAdded = (comment: TicketComment) => {
      if (comment.ticketId === ticketId) {
        setComments(prev => {
          // Check if comment already exists to avoid duplicates
          if (prev.some(c => c.id === comment.id)) {
            return prev;
          }
          return [...prev, comment];
        });
      }
    };

    signalRService.on('CommentAdded', handleCommentAdded);

    return () => {
      signalRService.off('CommentAdded', handleCommentAdded);
    };
  }, [ticketId]);

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment
  };
};