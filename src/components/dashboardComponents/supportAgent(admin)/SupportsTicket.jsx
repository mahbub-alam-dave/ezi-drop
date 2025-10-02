"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import TicketChatClient from './AgentChatBox';

const SupportsTicket = ({supportTickets}) => { 

    const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  // const router = useRouter()

  const [openChat, setOpenChat] = useState(false)
  const [ticketId, setTicketId] = useState(false)

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/support-agent/tickets");
        const data = await res.json();
        setTickets(data.tickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const handleAgentChat = (ticketId) => {
    setTicketId(ticketId)
    setOpenChat(p => !p)
  }

  if (loading) return <p>Loading tickets...</p>;

    return (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Support Tickets</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {tickets.map((ticket, i) => (
              <div onClick={() => handleAgentChat(ticket.ticketId)} key={i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-800 dark:text-white">{ticket?.ticketId}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">{ticket.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">by {ticket.customer || "Unknown"}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

              </div>
            ))}
          </div>
                          {
                  openChat &&
                  <TicketChatClient ticketId={ticketId} setOpenChat={setOpenChat} />
                }
        </div>
    );
};

export default SupportsTicket;