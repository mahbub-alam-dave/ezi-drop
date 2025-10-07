"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TicketChatClient from "./AgentChatBox";

const SupportsTicket = ({ displayArea }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const router = useRouter();

  const [openChat, setOpenChat] = useState(false);
  const [ticketId, setTicketId] = useState(false);

  async function fetchTickets() {
    let url = "/api/support-agent/tickets";
    try {
      if (displayArea !== undefined) {
        url += "?status=open";
      }
      const res = await fetch(url);
      const data = await res.json();
      setTickets(data.tickets);
      setRole(data.role);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, [displayArea]);

  const handleAgentChat = (ticketId) => {
    setTicketId(ticketId);
    setOpenChat((p) => !p);
  };

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div
      className={`${
        displayArea
          ? "bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm"
          : " pt-8"
      }`}
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Support Tickets
        </h2>
        {displayArea && (
          <button
            onClick={() => router.push("/dashboard/agent-resulation-center")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            View All
          </button>
        )}
      </div>
      <div className="">
        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket, i) => (
              <div
                key={i}
                className={`p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow ${!displayArea && "background-color"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex gap-4">
                    <span className="font-medium text-slate-800 dark:text-white"> Id: {ticket?.ticketId}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ticket.status === "open"
                          ? "bg-red-100 text-red-800"
                          : ticket.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>

                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                  {ticket.message}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    by {ticket.customer || "Unknown"}
                  </span>

                                    <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : ticket.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div className="flex items-center flex-col sm:flex-row gap-4 mt-2 cursor-pointer">
                <button
                  onClick={() => handleAgentChat(ticket.ticketId)}
                  className="px-4 py-1 cursor-pointer rounded-full background-color-primary border-none text-sm font-normal text-white"
                >
                  Open on chat
                </button>
                                  {displayArea === undefined &&
                    ticket.status === "in_progress" &&
                    role === "support_agent" && (
                      <button
                        onClick={async () => {
                          const res = await fetch(`/api/tickets/${ticketId}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ticketId: ticket.ticketId }),
                          });
                          if (res.ok) {
                            fetchTickets(); // refresh UI
                          }
                        }}
                        className="px-4 cursor-pointer rounded-full py-1 bg-transparent text-sm font-normal border hover:bg-gray-300 dark:hover:bg-gray-500 dark:bg-gray-800 dark:text-white"
                      >
                        Mark as Resolved
                      </button>
                    )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div>
            <h4>No available tickets at your area</h4>
          </div>
        )}
      </div>
      {openChat && (
        <TicketChatClient
          ticketId={ticketId}
          setOpenChat={setOpenChat}
          currentRole={role}
        />
      )}
    </div>
  );
};

export default SupportsTicket;
