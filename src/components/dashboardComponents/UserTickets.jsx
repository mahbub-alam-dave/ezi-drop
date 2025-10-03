"use client";
import { useEffect, useState } from "react";
import TicketChatClient from "./supportAgent(admin)/AgentChatBox";


export default function UserTickets({ userId }) {
  const [tickets, setTickets] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [role, setRole] = useState("")

  async function fetchTickets() {
    const res = await fetch(`/api/tickets/user-tickets`);
    if (res.ok) {
      const data = await res.json();
      setTickets(data.tickets);
      setRole(data.role)
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const openTicket = tickets.find((t) => t.status !== "resolved");

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Support Tickets</h2>

      {/* If an open ticket exists */}
      {openTicket ? (
        <div className="mb-4 p-4 border rounded bg-yellow-50">
          <p>
            You have an active ticket: <b>{openTicket.ticketId}</b> ({openTicket.status})
          </p>
          <button
            onClick={() => {
              setActiveTicket(openTicket);
              setOpenChat(true);
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Continue Chat
          </button>
        </div>
      ) : (
        // No open ticket → allow creating new
        <button
          onClick={async () => {
            const res = await fetch("/api/tickets/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, subject: "General Issue" })
            });
            if (res.ok) {
              fetchTickets();
            } else {
              const data = await res.json();
              alert(data.message);
            }
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create New Ticket
        </button>
      )}

      {/* Ticket history */}
      <div>
        <h3 className="text-lg font-medium mt-6 mb-2">Ticket History</h3>
        <ul className="space-y-2">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="p-3 border rounded bg-gray-50">
              <b>{ticket.ticketId}</b> — {ticket.status}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat window */}
      {openChat && activeTicket && (
        <TicketChatClient
          ticketId={activeTicket.ticketId}
          setOpenChat={setOpenChat}
          currentRole={role}
        />
      )}
    </div>
  );
}
