// components/TicketChatClient.jsx
"use client";
import { useEffect, useState, useRef } from "react";

export default function TicketChatClient({ ticketId, setOpenChat }) {
  const [ticket, setTicket] = useState(null);
  const [input, setInput] = useState("");
  const refInterval = useRef(null);

  console.log(ticketId)

  async function fetchTicket() {
    const res = await fetch(`/api/tickets/${ticketId}`);
    if (res.ok) {
      const { ticket } = await res.json();
      setTicket(ticket);
    }
  }

  useEffect(() => {
    fetchTicket();
    refInterval.current = setInterval(fetchTicket, 3000); // poll every 3s
    return () => clearInterval(refInterval.current);
  }, [ticketId]);

  async function sendMessage() {
    if (!input.trim()) return;
    await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderRole: "agent", content: input })
    });
    setInput("");
    fetchTicket(); // refresh immediately
  }

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="fixed bottom-60 right-5 z-5000 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
    <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
      <h3>{ticket.ticketId} — {ticket.status}</h3>
      <button onClick={() => setOpenChat(false)}>✖</button>
        </div>
      <div className="h-92 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
        {(ticket.messages || []).map((m, i) => (
          <div key={i} className={m.senderRole === "agent" ? "text-right" : ""}>
            <div className="inline-block p-2 rounded bg-gray-100 shadow-sm">
              <small>{m.senderRole}</small><br />
              {m.content}
              <div className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-t gap-2 py-3 px-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 rounded-l-lg p-2 border outline-none" placeholder="Enter your message" />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-3 py-1 rounded-r-lg hover:bg-blue-700">Send</button>
      </div>
    </div>
  );
}
