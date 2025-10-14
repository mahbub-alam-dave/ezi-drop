"use client";
import { useEffect, useState } from "react";
import TicketChatClient from "./supportAgent(admin)/AgentChatBox";


export default function UserTickets({ userId }) {
  const [tickets, setTickets] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [role, setRole] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [customIssue, setCustomIssue] = useState("")

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
    <div className="pt-8">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-bold ">Get 24/7 support From Our District Agent</h2>
        <p className="max-w-6xl">Create a support tickets by selecting a reason from dropdown menu or you can add by yourselves. Then, Our support agent will connect you on chat to resolve your issue. Remember, it takes some time to enquiry, so we want your patience.</p>
      </div>
      

      {/* If an open ticket exists */}
      {openTicket ? (
        <div className="mb-4 p-4 border rounded-lg background-color">
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
    <div>
    <h3 className="text-lg font-semibold mb-4">Create A New Support Ticket</h3>
  <div className="mb-4 p-4 border-color rounded-lg ">

    {/* Common issues */}
    <label className="block mb-2 text-sm ">Select a common issue:</label>
    <select
      value={selectedIssue}
      onChange={(e) => setSelectedIssue(e.target.value)}
      className="w-full input-style mb-4"
    >
      <option value="" className="background-color">-- Choose an issue --</option>
      <option value="Parcel not delivered" className="background-color">Parcel not delivered</option>
      <option value="Parcel is damaged" className="background-color">Parcel is damaged</option>
      <option value="Wrong parcel received" className="background-color">Wrong parcel received</option>
      <option value="Delay in delivery" className="background-color">Delay in delivery</option>
    </select>

    {/* Custom issue input */}
    <label className="block mb-2 text-sm">Or describe your issue:</label>
    <input
      type="text"
      value={customIssue}
      onChange={(e) => setCustomIssue(e.target.value)}
      placeholder="Type your issue here..."
      className="w-full input-style mb-4"
    />

    {/* Create button */}
    <button
      onClick={async () => {
        const issue = customIssue || selectedIssue;
        if (!issue) {
          alert("Please select or enter an issue before creating a ticket.");
          return;
        }

        const res = await fetch("/api/tickets/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: issue })
        });

        if (res.ok) {
          setSelectedIssue("");
          setCustomIssue("");
          fetchTickets();
        } else {
          const data = await res.json();
          alert(data.message);
        }
      }}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Create Ticket
    </button>
  </div>
  </div>
      )}

      {/* Ticket history */}
      <div>
        <h3 className="text-lg font-bold mt-6 mb-2">My Tickets</h3>
        {
          tickets.length < 1 ?
          <div>
            <h3 className="text-lg font-medium">You haven't any supports tickets!</h3>
          </div>
          :
        <ul className="space-y-2">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="p-3 border rounded-lg background-color">
              <p className="text-xl font-bold">{ticket?.messages[0]?.content}</p>
              <div className="flex justify-between">
                <span>ticket id: {ticket.ticketId}</span>
                <span className="bg-blue-100 px-3 py-1 text-sm rounded-2xl dark:bg-transparent dark:border dark:border-gray-700">{ticket.status}</span>
              </div>

            </li>
          ))}
        </ul>
        }
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
