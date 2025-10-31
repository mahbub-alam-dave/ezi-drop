"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, MessageSquare, Users, Filter } from "lucide-react";
import TicketChatClient from "./AgentChatBox";

const SupportsTicket = ({ displayArea }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [district, setDistrict] = useState("");
  const [stats, setStats] = useState({ open: 0, in_progress: 0, resolved: 0, total: 0 });
  const [mentionedCount, setMentionedCount] = useState(0);
  const router = useRouter();

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [showMentioned, setShowMentioned] = useState(false);
  const [districts, setDistricts] = useState([]);

  // Chat modal
  const [openChat, setOpenChat] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  async function fetchTickets() {
    setLoading(true);
    try {
      let url = "/api/support-agent/tickets";
      const params = new URLSearchParams();

      // For dashboard overview, only show open tickets
      if (displayArea !== undefined) {
        params.append("status", "open");
      } else {
        // For full page, apply filters
        if (selectedStatus) params.append("status", selectedStatus);
        if (selectedPriority) params.append("priority", selectedPriority);
        if ( role === 'admin') {
          if (selectedDistrict && selectedDistrict !== 'all') {
            params.append("districtId", selectedDistrict);
          }
          if (showMentioned) {
            params.append("mentionedAdmin", "true");
          }
        }
      }

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await fetch(url);
      const data = await res.json();
      
      setTickets(data.tickets || []);
      setRole(data.role);
      setDistrict(data.district);
      setStats(data.stats || { open: 0, in_progress: 0, resolved: 0, total: 0 });
      setMentionedCount(data.mentionedCount || 0);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch districts for main admin
  async function fetchDistricts() {
    if ( role === 'admin') {
      try {
        const res = await fetch("/api/districts");
        const data = await res.json();
        setDistricts(data.districts || []);
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    }
  }

  useEffect(() => {
    fetchTickets();
  }, [displayArea, selectedDistrict, selectedStatus, selectedPriority, showMentioned]);

  useEffect(() => {
    if (role) {
      fetchDistricts();
    }
  }, [role]);

  const handleAgentChat = (ticketId) => {
    setTicketId(ticketId);
    setOpenChat(true);
  };

  const handleEscalateToAdmin = async (ticketId) => {
    if (window.confirm("Escalate this ticket to main admin?")) {
      try {
        const res = await fetch(`/api/tickets/${ticketId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignToAdmin: true }),
        });
        
        if (res.ok) {
          alert("Ticket escalated to main admin successfully!");
          fetchTickets();
        } else {
          alert("Failed to escalate ticket");
        }
      } catch (err) {
        console.error("Error escalating ticket:", err);
        alert("Error escalating ticket");
      }
    }
  };

  const handleMentionAdmin = async (ticketId) => {
    if (window.confirm("Mention main admin for this ticket?")) {
      try {
        const res = await fetch(`/api/tickets/${ticketId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mentionAdmin: true }),
        });
        
        if (res.ok) {
          alert("Main admin mentioned successfully!");
          fetchTickets();
        } else {
          alert("Failed to mention admin");
        }
      } catch (err) {
        console.error("Error mentioning admin:", err);
        alert("Error mentioning admin");
      }
    }
  };

  const handleResolveTicket = async (ticketId) => {
    if (window.confirm("Mark this ticket as resolved?")) {
      try {
        const res = await fetch(`/api/tickets/${ticketId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "resolved" }),
        });
        
        if (res.ok) {
          fetchTickets();
        } else {
          alert("Failed to resolve ticket");
        }
      } catch (err) {
        console.error("Error resolving ticket:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className={`${displayArea ? "bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm" : "pt-8"}`}>
        <p className="text-gray-500 dark:text-gray-400">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div
      className={`${
        displayArea
          ? "bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
          : "p-6"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Support Tickets
            {role === 'admin' && mentionedCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {mentionedCount} needs attention
              </span>
            )}
          </h2>
          {!displayArea && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {role === 'admin' ? 'All districts' : `District: ${district}`}
            </p>
          )}
        </div>
        {displayArea && (
          <button
            onClick={() => {
              if(role=== "admin"){
              router.push("/dashboard/admin/resulation-center")
            } else {
            router.push("/dashboard/district-agent/resulation-center")
            }
          }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            View All
          </button>
        )}
      </div>

      {/* Stats (only for full page) */}
      {!displayArea && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-600 dark:text-blue-400">Open</p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.open}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">In Progress</p>
            <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{stats.in_progress}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400">Resolved</p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.resolved}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-600 dark:text-purple-400">Total</p>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{stats.total}</p>
          </div>
        </div>
      )}

      {/* Filters (only for full page) */}
      {!displayArea && (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-800 dark:text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* District Filter (Main Admin Only) */}
            {( role === 'admin') && (
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              >
                <option value="all">All Districts</option>
                {districts.map((d) => (
                  <option key={d.districtId} value={d.districtId}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Show Mentioned (Main Admin Only) */}
            {( role === 'admin') && (
              <button
                onClick={() => setShowMentioned(!showMentioned)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showMentioned
                    ? 'bg-red-500 text-white border-red-600'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                }`}
              >
                {showMentioned ? '✓ Mentioned Only' : 'Show Mentioned'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="">
        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket, i) => (
              <div
                key={i}
                className={`p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow ${
                  !displayArea && "bg-white dark:bg-gray-800"
                } ${ticket.mentionedRoles === 'admin' ? 'border-l-4 border-l-red-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-4 flex-wrap items-center">
                    <span className="font-medium text-slate-800 dark:text-white">
                      ID: {ticket?.ticketId}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        ticket.status === "open"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : ticket.status === "in_progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                    {ticket.mentionedRoles === 'admin' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Admin Mentioned
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                  {ticket.message}
                </p>

                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>by {ticket.customer || "Unknown"}</span>
                    {!displayArea && <span>• {ticket.district}</span>}
                    <span
                      className={`px-2 py-1 rounded-full ${
                        ticket.priority === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : ticket.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => handleAgentChat(ticket.ticketId)}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium flex items-center gap-1"
                  >
                    <MessageSquare size={14} />
                    Open Chat
                  </button>

                  {/* District Admin Actions */}
                  {role === 'district_admin' && (
                    <>
                      {ticket.status !== "resolved" && !ticket.mentionedRoles && (
                        <button
                          onClick={() => handleMentionAdmin(ticket.ticketId)}
                          className="px-4 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-800 dark:text-orange-400 text-sm font-medium flex items-center gap-1"
                        >
                          <Users size={14} />
                          Mention Admin
                        </button>
                      )}
                      
                      {ticket.status !== "resolved" && ticket.priority === "high" && (
                        <button
                          onClick={() => handleEscalateToAdmin(ticket.ticketId)}
                          className="px-4 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-400 text-sm font-medium flex items-center gap-1"
                        >
                          <AlertCircle size={14} />
                          Escalate
                        </button>
                      )}
                    </>
                  )}

                  {/* Resolve Button (Admin & District Admin) */}
                  {(role === 'district_admin' || role === 'admin') &&
                    ticket.status === "in_progress" && (
                      <button
                        onClick={() => handleResolveTicket(ticket.ticketId)}
                        className="px-4 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-400 text-sm font-medium"
                      >
                        Mark as Resolved
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-600" />
            <h4 className="text-gray-600 dark:text-gray-400">No tickets available</h4>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {displayArea ? "All tickets are being handled" : "Try adjusting your filters"}
            </p>
          </div>
        )}
      </div>

      {/* Chat Modal */}
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