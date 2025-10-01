"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatBoxUi() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Helper: detect links and make them clickable
  function formatMessage(text) {
    if (!text || typeof text !== "string") return null; // prevent crash
    const urlRegex = /(https?:\/\/[^\s]+|\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  }


  // Auto scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Start new chat session when widget opens
  useEffect(() => {
    if (isOpen && !conversationId) {
      fetch("/api/chat/start", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setConversationId(data.conversationId);
          setMessages([{ role: "system", content: data.reply }]);
        })
        .catch((err) => console.error("Chat start error:", err));
    }
  }, [isOpen, conversationId]);


  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: input }),
      });

      const data = await res.json();
      const botMessage = { role: "bot", content: data.reply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(messages)

  return (
    <>
      {/* Floating Button */}
      <button
        className={`fixed z-1000 bottom-22 right-6 bg-blue-600 text-white p-[14px] rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all ${!isOpen ? "animate-pulseScale" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-40 right-5 w-80 h-[450px] bg-white dark:bg-gray-800 border rounded-lg shadow-lg flex flex-col z-1000">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Customer Support</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[78%] text-sm ${
                    msg.role === "user"
                      ? "bg-blue-400 dark:bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white  rounded-bl-none"
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t py-4 px-2">
            <input
              type="text"
              className="flex-1 border rounded-l-lg px-2 py-1 outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-r-lg hover:bg-blue-700"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
