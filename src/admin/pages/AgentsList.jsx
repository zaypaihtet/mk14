import React, { useEffect, useState } from "react";
import { Trash2, Ban, UserX } from "lucide-react";
import { api } from "../../utils/api";

const AgentsList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.admin.getAgents()
      .then((data) => setAgents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBan = async (id) => {
    try {
      const result = await api.admin.banUser(id);
      setAgents(agents.map((a) => a.id === id ? { ...a, is_banned: result.is_banned } : a));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm("ဖျက်မှာသေချာပါသလား?")) return;
    try {
      await api.admin.deleteUser(id);
      setAgents(agents.filter((a) => a.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const agent = await api.admin.createAgent(form);
      setAgents([agent, ...agents]);
      setForm({ name: "", phone: "", password: "" });
    } catch (err) { alert(err.message); }
    finally { setCreating(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <p className="text-gray-600">Manage agents</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Agent အသစ်ဖန်တီးရန်</h2>
        <form onSubmit={handleCreate} className="flex gap-3 flex-wrap">
          <input type="text" required placeholder="အမည်" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input type="text" required placeholder="ဖုန်းနံပါတ်" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input type="password" required placeholder="စကားဝှက်" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <button type="submit" disabled={creating} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
            {creating ? "Creating..." : "ဖန်တီးမည်"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && <tr><td colSpan="4" className="text-center py-6">Loading...</td></tr>}
              {!loading && agents.length === 0 && <tr><td colSpan="4" className="text-center py-6 text-gray-500">No agents found.</td></tr>}
              {agents.map((agent) => (
                <tr key={agent.id} className={`hover:bg-gray-50 ${agent.is_banned ? "opacity-50 line-through" : ""}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{agent.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{agent.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${agent.is_banned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {agent.is_banned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleBan(agent.id)} className={`p-2 rounded-lg ${agent.is_banned ? "text-green-600 hover:bg-green-50" : "text-orange-500 hover:bg-orange-50"}`}>
                        {agent.is_banned ? <UserX className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleDelete(agent.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentsList;
