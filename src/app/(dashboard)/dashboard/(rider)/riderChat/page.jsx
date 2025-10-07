'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/Hooks/useChat';
import { useSession } from 'next-auth/react';

export default function RiderChat() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userRole = 'rider';

  const {
    conversations,
    messages,
    selectedConversation,
    loading,
    setSelectedConversation,
    sendMessage,
    getOrCreateConversation, // ✅ matches hook
    fetchMessages,
    fetchConversations,
    markConversationRead,
  } = useChat(userEmail, userRole);

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { if (messages.length > 0) scrollToBottom(); }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    const receiver = selectedConversation.participants.find(p => p.email !== userEmail);
    if (!receiver) return;
    await sendMessage(newMessage.trim(), receiver.email);
    setNewMessage('');
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await markConversationRead(conversation._id, userEmail);
  };

  const handleStartNewChat = async (customerEmail, customerName) => {
    const participants = [
      { email: userEmail, role: 'rider', name: session?.user?.name || 'Rider' },
      { email: customerEmail, role: 'user', name: customerName }
    ];
    await getOrCreateConversation(participants); // ✅ fixed
    setActiveTab('chats');
  };

  const currentChatParticipant = selectedConversation?.participants?.find(p => p.email !== userEmail);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[95vh] flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Header & Tabs */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">Rider Messages</h2>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => setActiveTab('chats')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'chats' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}>My Chats</button>
              <button onClick={() => setActiveTab('newChat')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'newChat' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}>New Chat</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chats' ? (
              <div className="p-2">
                {conversations.map(conv => {
                  const other = conv.participants.find(p => p.email !== userEmail);
                  const unread = conv.unreadCount?.[userEmail] || 0;
                  return (
                    <div key={conv._id} className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${selectedConversation?._id === conv._id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}`} onClick={() => handleSelectConversation(conv)}>
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">{other?.name?.split(' ').map(n => n[0]).join('') || 'C'}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">{other?.name || 'Customer'}</h3>
                        <p className="text-xs text-gray-600 truncate">{conv.lastMessage || 'No messages yet'}</p>
                      </div>
                      {unread > 0 && <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unread}</div>}
                    </div>
                  );
                })}
                {conversations.length === 0 && <p className="p-4 text-center text-gray-500">No conversations yet</p>}
              </div>
            ) : (
              <NewChatTab onStartNewChat={handleStartNewChat} />
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">{currentChatParticipant?.name?.split(' ').map(n => n[0]).join('') || 'C'}</div>
                <div>
                  <h2 className="font-bold text-gray-800">{currentChatParticipant?.name || 'Customer'}</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {messages.map(msg => (
                  <div key={msg._id} className={`flex ${msg.senderEmail === userEmail ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl ${msg.senderEmail === userEmail ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="submit" disabled={!newMessage.trim()} className={`px-5 rounded-full font-semibold ${newMessage.trim() ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Send</button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation or start a new chat</div>
          )}
        </div>
      </div>
    </div>
  );
}

// New Chat Tab
function NewChatTab({ onStartNewChat }) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!customerEmail.trim() || !customerName.trim()) return;
    await onStartNewChat(customerEmail.trim(), customerName.trim());
    setCustomerEmail('');
    setCustomerName('');
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Start New Chat</h3>
      <form onSubmit={handleStartChat} className="space-y-4">
        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@example.com" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Start Chat</button>
      </form>
    </div>
  );
}
