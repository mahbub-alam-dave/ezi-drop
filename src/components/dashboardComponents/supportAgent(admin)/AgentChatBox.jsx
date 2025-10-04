// components/TicketChatClient.jsx
"use client";
import { useEffect, useState, useRef } from "react";

export default function TicketChatClient({
  ticketId,
  setOpenChat,
  currentRole,
}) {
  const [ticket, setTicket] = useState({});
  const [input, setInput] = useState("");
  const [uiMessages, setUiMessages] = useState([]);
  const refInterval = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages || []]);

  async function fetchTicket() {
    const res = await fetch(`/api/tickets/${ticketId}`);
    if (res.ok) {
      const { ticket } = await res.json();
      setTicket(ticket);
      setUiMessages(ticket);
    }
  }

  useEffect(() => {
    fetchTicket();
    // refInterval.current = setInterval(fetchTicket, 3000); // poll every 3s
    // return () => clearInterval(refInterval.current);
  }, [ticketId]);

  async function sendMessage() {
    if (!input.trim()) return;
    await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderRole: currentRole, content: input }),
    });
/*     setUiMessages((prev) => [
      ...prev,
      { senderRole: currentRole, content: input, timestamp: new Date() },
    ]); */
    setInput("");
    fetchTicket(); // refresh immediately
  }

  console.log(input);

  // if (!ticket) return <div className="">Loading...</div>;

  return (
    <div className="fixed max-w-96 w-full  bottom-60 right-5 z-5000 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
      <div className="bg-blue-600  text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
        <h3>
          {ticket.ticketId} — {ticket.status}
        </h3>
        <button onClick={() => setOpenChat(false)}>✖</button>
      </div>
      <div className="h-[450px] overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
        {(ticket.messages || []).map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.senderRole === currentRole ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-2 rounded-lg ${
                m.senderRole === currentRole
                  ? "rounded-br-none"
                  : "rounded-bl-none"
              } bg-gray-100 dark:bg-gray-700 text-sm shadow-sm `}
            >
              <small>{(m.senderRole === "user" || m.senderRole === "rider") && m.senderRole === currentRole ? "you" : m.senderRole}</small>
              <br />
              {m.content}
              <div className="text-xs text-gray-400">
                {new Date(m.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t gap-2 py-3 px-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-l-lg p-2 border outline-none"
          placeholder="Enter your message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-3 py-1 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
