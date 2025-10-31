"use client"
import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Ticket, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Send,
  Plus,
  History
} from "lucide-react";
import TicketChatClient from "./supportAgent(admin)/AgentChatBox";
import { showErrorAlert, showSuccessAlert } from "@/utility/alerts";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [role, setRole] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [customIssue, setCustomIssue] = useState("");
  const [creating, setCreating] = useState(false);

  async function fetchTickets() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tickets/user-tickets`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setRole(data.role);
      } else {
        console.error("Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async () => {
    const issue = customIssue || selectedIssue;
    if (!issue.trim()) {
      showErrorAlert("Alert", "Please select or enter an issue before creating a ticket.");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch("/api/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: issue })
      });

      if (res.ok) {
        setSelectedIssue("");
        setCustomIssue("");
        await fetchTickets();
        showSuccessAlert("Ticket created successfully!", data.message || "Our support team will contact you soon.");
      } else {
        const data = await res.json();
        // alert(data.message || "Failed to create ticket");
        showErrorAlert("Failed", "Failed to create ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      showErrorAlert("Failed", "Failed to create ticket. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const openTicket = tickets.find((t) => t.status !== "resolved");

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      open: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-400",
        icon: AlertCircle
      },
      in_progress: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-400",
        icon: Clock
      },
      resolved: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-400",
        icon: CheckCircle
      }
    };

    const { bg, text, icon: Icon } = config[status] || config.open;

    return (
      <span className={`${bg} ${text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}>
        <Icon size={12} />
        {status.replace("_", " ")}
      </span>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full">
          {/* Header skeleton */}
          <div className="mb-8 space-y-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
          </div>

          {/* Active ticket skeleton */}
          <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>

          {/* Tickets list skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <MessageSquare className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                24/7 Support Center
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get help from our district support team
              </p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Create a support ticket by selecting a reason or describing your issue. 
              Our support agents will connect with you via chat to resolve your problem. 
              <span className="font-semibold"> Please be patient as we process your inquiry.</span>
            </p>
          </div>
        </div>

        {/* Active Ticket Alert */}
        {openTicket && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-orange-500 text-white rounded-lg">
                  <AlertCircle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    Active Ticket
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    You have an open support ticket: <span className="font-semibold">{openTicket.ticketId}</span>
                  </p>
                  <StatusBadge status={openTicket.status} />
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTicket(openTicket);
                  setOpenChat(true);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
              >
                <MessageSquare size={18} />
                Continue Chat
              </button>
            </div>
          </div>
        )}

        {/* Create New Ticket Section */}
        {!openTicket && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="text-green-600 dark:text-green-400" size={24} />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Create New Support Ticket
              </h3>
            </div>

            <div className="space-y-5">
              {/* Common Issues Dropdown */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select a common issue:
                </label>
                <select
                  value={selectedIssue}
                  onChange={(e) => {
                    setSelectedIssue(e.target.value);
                    setCustomIssue(""); // Clear custom issue when selecting dropdown
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Choose an issue --</option>
                  <option value="Parcel not delivered">Parcel not delivered</option>
                  <option value="Parcel is damaged">Parcel is damaged</option>
                  <option value="Wrong parcel received">Wrong parcel received</option>
                  <option value="Delay in delivery">Delay in delivery</option>
                  <option value="Payment issue">Payment issue</option>
                  <option value="Tracking not working">Tracking not working</option>
                  <option value="Need to change delivery address">Need to change delivery address</option>
                </select>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              {/* Custom Issue Input */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Describe your issue:
                </label>
                <textarea
                  value={customIssue}
                  onChange={(e) => {
                    setCustomIssue(e.target.value);
                    setSelectedIssue(""); // Clear dropdown when typing
                  }}
                  placeholder="Type your issue here... (e.g., My parcel has been stuck for 3 days)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateTicket}
                disabled={creating}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Send size={18} />
                {creating ? "Creating Ticket..." : "Create Support Ticket"}
              </button>
            </div>
          </div>
        )}

        {/* Ticket History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <History className="text-purple-600 dark:text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              My Tickets
            </h3>
          </div>

          {tickets.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Ticket size={48} className="text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                No Support Tickets Yet
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't created any support tickets. Need help? Create your first ticket above.
              </p>
              {!openTicket && (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create First Ticket
                </button>
              )}
            </div>
          ) : (
            // Tickets List
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {ticket?.messages?.[0]?.content || "No message"}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Ticket ID: <span className="font-medium">{ticket.ticketId}</span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>

                  {/* View Chat Button */}
                  {ticket.messages && ticket.messages.length > 1 && (
                    <button
                      onClick={() => {
                        setActiveTicket(ticket);
                        setOpenChat(true);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <MessageSquare size={16} />
                      View Conversation
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
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