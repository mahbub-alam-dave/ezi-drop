// components/TicketChatClient.jsx
"use client";
import { useEffect, useState, useRef } from "react";

export default function TicketChatClient({ ticketId }) {
  const [ticket, setTicket] = useState(null);
  const [input, setInput] = useState("");
  const refInterval = useRef(null);

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
    <div className="p-4">
      <h3>{ticket.ticketId} — {ticket.status}</h3>
      <div className="h-64 overflow-y-auto border p-2 space-y-2">
        {(ticket.messages || []).map((m, i) => (
          <div key={i} className={m.senderRole === "agent" ? "text-right" : ""}>
            <div className="inline-block p-2 rounded bg-gray-100">
              <small>{m.senderRole}</small><br />
              {m.content}
              <div className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-2 border" />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4">Send</button>
      </div>
    </div>
  );
}
