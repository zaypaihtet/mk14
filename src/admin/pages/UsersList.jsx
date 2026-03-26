import React, { useEffect, useState } from "react";
import { Edit, Trash2, Ban, UserX } from "lucide-react";
import { api } from "../../utils/api";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getUsers()
      .then((data) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBan = async (id) => {
    try {
      const result = await api.admin.banUser(id);
      setUsers(users.map((u) => u.id === id ? { ...u, is_banned: result.is_banned } : u));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm("ဖျက်မှာသေချာပါသလား?")) return;
    try {
      await api.admin.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage registered users</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && <tr><td colSpan="5" className="text-center py-6">Loading...</td></tr>}
              {!loading && users.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-gray-500">No users found.</td></tr>}
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50 ${user.is_banned ? "opacity-50 line-through" : ""}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Number(user.balance).toLocaleString()} MMK</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_banned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {user.is_banned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleBan(user.id)}
                        className={`p-2 rounded-lg ${user.is_banned ? "text-green-600 hover:bg-green-50" : "text-orange-500 hover:bg-orange-50"}`}>
                        {user.is_banned ? <UserX className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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

export default UsersList;
