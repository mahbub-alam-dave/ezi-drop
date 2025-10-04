"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function UserChat() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [availableRiders, setAvailableRiders] = useState([]);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'riders'
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/chat/conversations?email=${userEmail}&role=user`);
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

  // Send message function
  const sendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      const receiver = selectedConversation.participants.find(p => p.email !== userEmail);
      if (!receiver) return;

      // Create temporary message for immediate UI update
      const tempMessage = {
        _id: Date.now().toString(),
        conversationId: selectedConversation._id,
        senderEmail: userEmail,
        senderRole: 'user',
        receiverEmail: receiver.email,
        content: content.trim(),
        messageType: 'text',
        read: false,
        timestamp: new Date()
      };

      // Add message to UI immediately
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // Send to API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderEmail: userEmail,
          senderRole: 'user',
          receiverEmail: receiver.email,
          content: content.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Replace temporary message with real one from server
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempMessage._id ? data.message : msg
          )
        );

        // Update conversation list
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
      } else {
        // If failed, remove temporary message
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      alert('Error sending message. Please check your connection.');
    }
  };

  // Start chat with rider
  const startRiderChat = async (riderEmail, riderName) => {
    try {
      const participants = [
        { email: userEmail, role: 'user', name: userName },
        { email: riderEmail, role: 'rider', name: riderName }
      ];

      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participants }),
      });

      const data = await response.json();
      if (data.conversation) {
        setSelectedConversation(data.conversation);
        setMessages([]);
        setActiveTab('chats');
        await fetchConversations(); // Refresh list
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  // Initial data fetch
  useEffect(() => {
    if (userEmail) {
      fetchConversations();
      fetchAvailableRiders();
    }
  }, [userEmail]);

  // Real-time polling for new messages
  useEffect(() => {
    if (!userEmail || !selectedConversation) return;

    const interval = setInterval(() => {
      fetchMessages(selectedConversation._id);
      fetchConversations();
    }, 3000);

    return () => clearInterval(interval);
  }, [userEmail, selectedConversation]);

  const currentChatParticipant = selectedConversation?.participants?.find(p => p.email !== userEmail);

  return (
    <div className="fixed inset-0 bg-blur bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white ml-76  rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">Customer Support</h2>
              <button
                onClick={() => window.history.back()}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'chats' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                My Chats
              </button>
              <button
                onClick={() => setActiveTab('riders')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'riders' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                Find Riders
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chats' ? (
              <div className="p-2">
                {conversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(p => p.email !== userEmail);
                  const unreadCount = conversation.unreadCount?.[userEmail] || 0;

                  return (
                    <div
                      key={conversation._id}
                      className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                        selectedConversation?._id === conversation._id 
                          ? 'bg-purple-50 border border-purple-200' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {otherParticipant?.name?.split(' ').map(n => n[0]).join('') || 'R'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">
                            {otherParticipant?.name || 'Rider'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {conversations.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs">Find riders to start chatting</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 mb-3">Available Riders</h3>
                <div className="space-y-2">
                  {availableRiders.map((rider) => (
                    <div 
                      key={rider._id}
                      className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => startRiderChat(rider.email, rider.name)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {rider.name?.split(' ').map(n => n[0]).join('') || 'R'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{rider.name}</h4>
                        <p className="text-xs text-gray-600">Available for delivery</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  ))}
                  
                  {availableRiders.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No riders available at the moment</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                        {currentChatParticipant?.name?.split(' ').map(n => n[0]).join('') || 'R'}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">{currentChatParticipant?.name || 'Rider'}</h2>
                      <p className="text-green-600 text-sm">Online • Active now</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.senderEmail === userEmail ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex max-w-xs lg:max-w-md">
                        {message.senderEmail !== userEmail && (
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs font-bold">
                            R
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.senderEmail === userEmail
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                              : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.senderEmail === userEmail ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.senderEmail === userEmail && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`px-5 rounded-full font-semibold transition-all transform hover:scale-105 ${
                      newMessage.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Chat Selected</h3>
                <p className="text-gray-500">Select a conversation or find a rider to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}