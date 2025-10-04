import { useState, useEffect, useRef } from 'react';

export const useUserChat = (userEmail, userRole = 'user') => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableRiders, setAvailableRiders] = useState([]);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/chat/conversations?email=${userEmail}&role=${userRole}`);
      const data = await response.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch available riders
  const fetchAvailableRiders = async () => {
    try {
      // This would be your API to get available riders
      const response = await fetch('/api/riders/available');
      const data = await response.json();
      if (data.riders) {
        setAvailableRiders(data.riders);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (content, receiverEmail) => {
    if (!selectedConversation) return;

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderEmail: userEmail,
          senderRole: userRole,
          receiverEmail,
          content
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        
        setConversations(prev => 
          prev.map(conv => 
            conv._id === selectedConversation._id 
              ? { 
                  ...conv, 
                  lastMessage: content,
                  lastMessageTime: new Date()
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Create or get conversation with support/rider
  const getOrCreateConversation = async (participants, orderId = null) => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants,
          orderId
        }),
      });

      const data = await response.json();
      if (data.conversation) {
        setSelectedConversation(data.conversation);
        await fetchMessages(data.conversation._id);
        await fetchConversations();
        return data.conversation;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Start chat with support
  const startSupportChat = async (userName) => {
    const participants = [
      { email: userEmail, role: 'user', name: userName },
      { email: 'support@ezidrop.com', role: 'admin', name: 'EziDrop Support' }
    ];
    
    return await getOrCreateConversation(participants);
  };

  // Start chat with specific rider
  const startRiderChat = async (riderEmail, riderName, userName) => {
    const participants = [
      { email: userEmail, role: 'user', name: userName },
      { email: riderEmail, role: 'rider', name: riderName }
    ];
    
    return await getOrCreateConversation(participants);
  };

  // Mark messages as read
  const markAsRead = async (conversationId) => {
    try {
      await fetch('/api/chat/messages/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          userEmail
        }),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Real-time polling
  useEffect(() => {
    if (!userEmail) return;

    const interval = setInterval(() => {
      if (selectedConversation) {
        fetchMessages(selectedConversation._id);
      }
      fetchConversations();
    }, 3000);

    return () => clearInterval(interval);
  }, [userEmail, selectedConversation]);

  // Initial fetch
  useEffect(() => {
    if (userEmail) {
      fetchConversations();
      fetchAvailableRiders();
    }
  }, [userEmail]);

  return {
    conversations,
    messages,
    selectedConversation,
    loading,
    availableRiders,
    setSelectedConversation,
    sendMessage,
    getOrCreateConversation,
    startSupportChat,
    startRiderChat,
    fetchMessages,
    fetchConversations,
    markAsRead
  };
};