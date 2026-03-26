import React, { useState } from "react";
import { Search, Edit, Trash2, Save, X, Ban, UserX } from "lucide-react";

const AgentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allAgents] = useState([
    {
      id: 1,
      name: "Aung Aung",
      email: "aungaung@example.com",
      phNo: "0987766567",
      agentCode: "A00101",
      users: "10",
      balance: "20000000 MMK",
      banned: false,
    },
    {
      id: 2,
      name: "Su Su",
      email: "susu@example.com",
      phNo: "096538778",
      agentCode: "A00102",
      users: "20",
      balance: "5000000 MMK",
      banned: false,
    },
  ]);
  const [agentsLists, setAgentsLists] = useState(allAgents);
  const [editAgentId, setEditAgentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    balance: "",
  });

  const handleEditClick = (agent) => {
    setEditAgentId(agent.id);
    setEditFormData({
      balance: agent.balance,
    });
  };

  const handleCancelClick = () => {
    setEditAgentId(null);
    setEditFormData({ balance: "" });
  };

  const handleSaveClick = (id) => {
    const updatedAgents = agentsLists.map((agent) =>
      agent.id === id
        ? {
            ...agent,
            balance: editFormData.balance,
          }
        : agent
    );
    setAgentsLists(updatedAgents);
    setEditAgentId(null);
  };

  const handleDeleteClick = (id) => {
    const updatedAgents = agentsLists.filter((agent) => agent.id !== id);
    setAgentsLists(updatedAgents);
  };

  const handleToggleBan = (id) => {
    const updatedAgents = agentsLists.map((agent) =>
      agent.id === id ? { ...agent, banned: !agent.banned } : agent
    );
    setAgentsLists(updatedAgents);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setAgentsLists(allAgents);
    } else {
      const filteredAgents = allAgents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(value.toLowerCase()) ||
          agent.email.toLowerCase().includes(value.toLowerCase()) ||
          agent.phNo.toLowerCase().includes(value.toLowerCase()) ||
          agent.agentCode.toLowerCase().includes(value.toLowerCase())
      );
      setAgentsLists(filteredAgents);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-600">Manage agent accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 w-1/2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Agent Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Users
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Deposit Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agentsLists.map((agent) => (
                <tr
                  key={agent.id}
                  className={`hover:bg-gray-50 ${
                    agent.banned ? "line-through text-gray-400" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-gray-500">{agent.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {agent.phNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {agent.agentCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {agent.users}
                  </td>
                  {/* Deposit */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editAgentId === agent.id ? (
                      <input
                        type="text"
                        value={editFormData.balance}
                        
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            balance: e.target.value,
                          })
                        }
                        className="w-28 px-2 py-1 border rounded-md"
                      />
                    ) : (
                      agent.balance
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {editAgentId === agent.id ? (
                        <>
                          <button
                            onClick={() => handleSaveClick(agent.id)}
                            className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(agent)}
                            disabled={agent.banned}
                            className={`p-2 rounded-lg ${
                          agent.banned
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                        }`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {/* Toggle Ban */}
                          <button
                            onClick={() => handleToggleBan(agent.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              agent.banned
                                ? "text-red-600 hover:bg-red-50"
                                : "text-orange-500 hover:bg-orange-50"
                            }`}
                            title={agent.banned ? "Unban Agent" : "Ban Agent"}
                          >
                            {agent.banned ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(agent.id)}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {agentsLists.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentsList;
