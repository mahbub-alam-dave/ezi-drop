'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/Hooks/useChat';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * RiderChat Component
 * This component displays a chat interface for a rider, handling conversations, messages,
 * and starting new chats. It is designed to be fully responsive and uses an external
 * 'onClose' prop to manage its visibility, offering a clear close button outside the modal.
 * * @param {function} onClose - Function to call when the chat box should be closed.
 */
export default function RiderChat({ onClose }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userRole = 'rider';
  const router = useRouter();

  const {
    conversations,
    messages,
    selectedConversation,
    loading,
    setSelectedConversation,
    sendMessage,
    getOrCreateConversation,
    markConversationRead,
  } = useChat(userEmail, userRole);

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const messagesEndRef = useRef(null);

  // Lock body scroll when component is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Auto-scroll to the latest message
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
    // Mark conversation as read
    await markConversationRead(conversation._id, userEmail);
  };

  const handleStartNewChat = async (customerEmail, customerName) => {
    const participants = [
      { email: userEmail, role: 'rider', name: session?.user?.name || 'Rider' },
      { email: customerEmail, role: 'user', name: customerName }
    ];
    await getOrCreateConversation(participants);
    setActiveTab('chats');
  };

const handleGoHome = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/'); // fallback to home if no history
  }
};

  const currentChatParticipant = selectedConversation?.participants?.find(p => p.email !== userEmail);
  const isConversationSelected = !!selectedConversation;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-0 sm:p-4 z-[60]">
      <div className="relative bg-white rounded-none sm:rounded-2xl shadow-2xl w-full max-w-4xl h-full sm:h-[95vh] flex overflow-hidden">
        
        {/* === EXTERNAL CLOSE BUTTON (Highly Visible) === */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute -top-10 sm:-top-4 -right-0 sm:-right-4 p-2 bg-white rounded-full shadow-lg text-gray-800 hover:bg-gray-100 transition duration-150 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close full chat box"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* === SIDEBAR (Conversation List & New Chat) === */}
        <div className={`
          w-full sm:w-80 bg-gray-50 border-r border-gray-200 flex flex-col
          ${isConversationSelected ? 'hidden sm:flex' : 'flex'}
        `}>
          
          {/* Header & Tabs */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex justify-between items-center mb-3">
              <button 
                onClick={handleGoHome}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition duration-150 flex items-center justify-center"
                aria-label="Go back to home"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="font-bold text-lg">Rider Messages</h2>
              <div className="w-10"></div> {/* Spacer for balance */}
            </div>
            <div className="flex space-x-1">
              <button onClick={() => setActiveTab('chats')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'chats' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}>My Chats</button>
              <button onClick={() => setActiveTab('newChat')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${activeTab === 'newChat' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}>New Chat</button>
            </div>
          </div>

          {/* Conversation List / New Chat Form */}
          <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 && <p className="p-4 text-center text-gray-500">Loading chats...</p>}

            {activeTab === 'chats' ? (
              <div className="p-2">
                {conversations.map(conv => {
                  const other = conv.participants.find(p => p.email !== userEmail);
                  const unread = conv.unreadCount?.[userEmail] || 0;
                  return (
                    <div 
                      key={conv._id} 
                      className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer ${selectedConversation?._id === conv._id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}`} 
                      onClick={() => handleSelectConversation(conv)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mr-3">{other?.name?.split(' ').map(n => n[0]).join('') || 'C'}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">{other?.name || 'Customer'}</h3>
                        <p className="text-xs text-gray-600 truncate">{conv.lastMessage || 'No messages yet'}</p>
                      </div>
                      {unread > 0 && <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{unread}</div>}
                    </div>
                  );
                })}
                {!loading && conversations.length === 0 && <p className="p-4 text-center text-gray-500">No conversations yet</p>}
              </div>
            ) : (
              <NewChatTab onStartNewChat={handleStartNewChat} />
            )}
          </div>
        </div>

        {/* === CHAT AREA (Active Conversation) === */}
        <div className={`
          flex-1 flex flex-col 
          ${isConversationSelected ? 'flex' : 'hidden sm:flex'}
        `}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center space-x-3">
                {/* Back Button for Mobile */}
                <button 
                  onClick={() => setSelectedConversation(null)} 
                  className="sm:hidden p-1 rounded-full text-gray-600 hover:bg-gray-100"
                  aria-label="Back to chat list"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">{currentChatParticipant?.name?.split(' ').map(n => n[0]).join('') || 'C'}</div>
                <div className='flex-1 min-w-0'>
                  <h2 className="font-bold text-gray-800 truncate">{currentChatParticipant?.name || 'Customer'}</h2>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                {loading && messages.length === 0 && <p className="text-center text-gray-500">Loading messages...</p>}
                {messages.map(msg => (
                  <div key={msg._id} className={`flex ${msg.senderEmail === userEmail ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-3 max-w-[80%] md:max-w-[70%] rounded-2xl ${msg.senderEmail === userEmail ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'}`}>
                      <p className="text-sm break-words">{msg.content}</p>
                      <span className={`text-[10px] block mt-1 ${msg.senderEmail === userEmail ? 'text-white/70 text-right' : 'text-gray-500 text-left'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  <button type="submit" disabled={!newMessage.trim()} className={`px-5 py-3 rounded-full font-semibold text-sm transition-colors ${newMessage.trim() ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Send</button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p className='p-4 text-center'>Select a conversation from the left or start a new chat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * NewChatTab Component
 * Simple form for starting a new conversation by specifying customer details.
 * * @param {function} onStartNewChat - Handler to create the new conversation.
 */
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
        <input 
          type="email" 
          value={customerEmail} 
          onChange={(e) => setCustomerEmail(e.target.value)} 
          placeholder="customer@example.com" 
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          required 
        />
        <input 
          type="text" 
          value={customerName} 
          onChange={(e) => setCustomerName(e.target.value)} 
          placeholder="Customer Name" 
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          required 
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors text-sm"
        >
          Start Chat
        </button>
      </form>
    </div>
  );
}