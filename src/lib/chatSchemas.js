// Schema definitions for chat system
export const conversationSchema = {
  participants: [
    {
      email: String,
      role: { type: String, enum: ['user', 'rider', 'admin'] },
      name: String,
      avatar: String
    }
  ],
  lastMessage: String,
  lastMessageTime: { type: Date, default: Date.now },
  orderId: String,
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  unreadCount: Object // { email: count }
};

export const messageSchema = {
  conversationId: String,
  senderEmail: String,
  senderRole: { type: String, enum: ['user', 'rider', 'admin'] },
  receiverEmail: String,
  content: String,
  messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  read: { type: Boolean, default: false },
  readAt: Date,
  timestamp: { type: Date, default: Date.now }
};