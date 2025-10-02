// hooks/useChat.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useChat = (userEmail, userRole, pollingInterval = 2500) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);

  const pollRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/chat/conversations?email=${encodeURIComponent(userEmail)}&role=${encodeURIComponent(userRole || '')}`);
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch (err) {
      console.error('fetchConversations error', err);
    }
  }, [userEmail, userRole]);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/chat/messages?conversationId=${encodeURIComponent(conversationId)}`);
      const data = await res.json();
      if (Array.isArray(data.messages)) setMessages(data.messages);
    } catch (err) {
      console.error('fetchMessages error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content, receiverEmail) => {
    if (!selectedConversation) return { error: 'no conversation selected' };
    try {
      const optimisticMsg = {
        _id: `temp-${Date.now()}`,
        conversationId: selectedConversation._id,
        senderEmail: userEmail,
        senderRole: userRole,
        receiverEmail,
        content,
        messageType: 'text',
        read: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, optimisticMsg]);

      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderEmail: userEmail,
          senderRole: userRole,
          receiverEmail,
          content
        })
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages(prev => prev.map(m => (m._id === optimisticMsg._id ? data.message : m)));
        setConversations(prev => prev.map(conv => conv._id === selectedConversation._id
          ? { ...conv, lastMessage: content, lastMessageTime: new Date().toISOString() }
          : conv));
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'failed to send');
      }
    } catch (err) {
      console.error('sendMessage error', err);
      return { error: err.message || 'send failed' };
    }
  }, [selectedConversation, userEmail, userRole]);

  // ✅ Renamed function to match component
  const getOrCreateConversation = useCallback(async (participants, orderId = null) => {
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants, orderId })
      });
      const data = await res.json();
      if (data.conversation) {
        setSelectedConversation(data.conversation);
        await fetchMessages(data.conversation._id);
        await fetchConversations();
        return data.conversation;
      } else {
        console.error('getOrCreateConversation error', data);
      }
    } catch (err) {
      console.error('getOrCreateConversation error', err);
    }
  }, [fetchConversations, fetchMessages]);

  const markConversationRead = useCallback(async (conversationId, readerEmail) => {
    try {
      await fetch(`/api/chat/conversations/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, readerEmail })
      });
      setConversations(prev => prev.map(c => c._id === conversationId ? { ...c, unreadCount: { ...c.unreadCount, [readerEmail]: 0 } } : c));
    } catch (err) {
      console.error('markConversationRead error', err);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    fetchConversations();
    if (selectedConversation) fetchMessages(selectedConversation._id);

    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      await fetchConversations();
      if (selectedConversation) await fetchMessages(selectedConversation._id);
    }, pollingInterval);

    return () => clearInterval(pollRef.current);
  }, [userEmail, selectedConversation, fetchConversations, fetchMessages, pollingInterval]);

  useEffect(() => {
    if (selectedConversation) fetchMessages(selectedConversation._id);
    else setMessages([]);
  }, [selectedConversation, fetchMessages]);

  return {
    conversations,
    messages,
    selectedConversation,
    loading,
    setSelectedConversation,
    sendMessage,
    getOrCreateConversation, // ✅ fixed
    fetchMessages,
    fetchConversations,
    markConversationRead
  };
};
