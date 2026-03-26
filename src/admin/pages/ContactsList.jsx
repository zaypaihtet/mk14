import React, { useState, useEffect } from "react";
import { Search, Eye, Trash2, Download, Mail, MailOpen, X } from "lucide-react";

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const apiUrl = "https://greatwalllc.com/api/api";
  const stored = localStorage.getItem("admin_user");
  const tokenData = stored ? JSON.parse(stored) : null;
  const token = tokenData?.token;

  useEffect(() => {
    fetchContacts();
     const interval = setInterval(fetchContacts, 5000);
  return () => clearInterval(interval);
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/contacts.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setContacts(result.data || []);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Frontend filtering
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.subject || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleReadStatus = async (contactId, currentStatus) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    try {
      const response = await fetch(`${apiUrl}/contacts.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: contactId, status: newStatus }),
      });
      if (response.ok) fetchContacts();
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      const response = await fetch(`${apiUrl}/contacts.php`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: contactId }),
      });
      if (response.ok) {
        fetchContacts();
        setShowDeleteModal(false);
        setContactToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleViewMessage = async (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    if (contact.status === "unread")
      await toggleReadStatus(contact.id, "unread");
  };

  const exportToCSV = () => {
    const headers = ["Name","Phone No", "Email", "Subject", "Message", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredContacts.map((contact) =>
        [
          `"${contact.name}"`,
          `"${contact.phno}"`,  
          `"${contact.email}"`,
          `"${contact.subject || ""}"`,
          `"${contact.message.replace(/"/g, '""')}"`,
          contact.status,
          new Date(contact.created_at).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status) =>
    status === "read" ? (
      <MailOpen className="h-4 w-4 text-blue-500" />
    ) : (
      <Mail className="h-4 w-4 text-orange-500" />
    );

  const getStatusBadge = (status) =>
    status === "read"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Manage incoming contact messages</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={`hover:bg-gray-50 ${
                        contact.status === "unread" ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <h3 className=" font-medium text-gray-900">
                            {contact.name}
                          </h3>
                          <p className=" text-gray-500">{contact.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className=" text-gray-600">{contact.phno}</p>
                      </td>
                      <td className="px-6 py-4">
                        {contact.subject || "No subject"}
                      </td>
                      <td className="px-6 py-4">
                        <p className=" text-gray-600 truncate max-w-xs">
                          {contact.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toggleReadStatus(contact.id, contact.status)
                          }
                          className={`inline-flex items-center px-2 py-1 font-semibold rounded-full transition-colors ${getStatusBadge(
                            contact.status
                          )}`}
                        >
                          {getStatusIcon(contact.status)}
                          <span className="ml-1">{contact.status}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4  text-gray-500">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewMessage(contact)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setContactToDelete(contact);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center  text-gray-500"
                    >
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Message
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {" "}
                <X className="h-5 w-5" />{" "}
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block  font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1  text-gray-900">{selectedContact.name}</p>
                </div>
               
                <div>
                  <label className="block  font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1  text-gray-900">{selectedContact.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                  <label className="block  font-medium text-gray-700">
                    Phone No
                  </label>
                  <p className="mt-1  text-gray-900">{selectedContact.phno}</p>
                </div>
              <div>
                <label className="block  font-medium text-gray-700">
                  Subject
                </label>
                <p className="mt-1  text-gray-900">
                  {selectedContact.subject || "No subject"}
                </p>
              </div>
              </div>
              <div>
                <label className="block  font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                  <p className=" text-gray-900 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
              <div>
                <label className="block  font-medium text-gray-700">Date</label>
                <p className="mt-1  text-gray-900">
                  {new Date(selectedContact.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message from "
              {contactToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(contactToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
