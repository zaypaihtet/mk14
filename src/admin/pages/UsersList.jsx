import React, { useState } from "react";
import { Search, Edit, Trash2, Save, X, UserX, Ban } from "lucide-react";

const UsersList = () => {
  const [allUsers, setAllUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "WYHdI@example.com",
      phNo: "0987766567",
      depositAmount: "200000 MMK",
      withdrawAmount: "50000 MMK",
      banned: false,
    },
    {
      id: 2,
      name: "Olivia",
      email: "olivia@example.com",
      phNo: "0965378",
      depositAmount: "350000 MMK",
      withdrawAmount: "100000 MMK",
      banned: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    depositAmount: "",
    withdrawAmount: "",
  });

  // Search filter (derived, not state)
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditFormData({
      depositAmount: user.depositAmount,
      withdrawAmount: user.withdrawAmount,
    });
  };

  const handleCancelClick = () => {
    setEditUserId(null);
    setEditFormData({ depositAmount: "", withdrawAmount: "" });
  };

  const handleSaveClick = (id) => {
    setAllUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              depositAmount: editFormData.depositAmount,
              withdrawAmount: editFormData.withdrawAmount,
            }
          : user
      )
    );
    setEditUserId(null);
  };

  const handleDeleteClick = (id) => {
    setAllUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleToggleBan = (id) => {
    setAllUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, banned: !user.banned } : user
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 w-1/2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                  Deposit Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Withdraw Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 ${
                    user.banned ? "line-through opacity-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.phNo}
                  </td>

                  {/* Deposit */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editUserId === user.id ? (
                      <input
                        type="text"
                        value={editFormData.depositAmount}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            depositAmount: e.target.value,
                          })
                        }
                        className="w-28 px-2 py-1 border rounded-md"
                      />
                    ) : (
                      user.depositAmount
                    )}
                  </td>

                  {/* Withdraw */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editUserId === user.id ? (
                      <input
                        type="text"
                        value={editFormData.withdrawAmount}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            withdrawAmount: e.target.value,
                          })
                        }
                        className="w-28 px-2 py-1 border rounded-md"
                      />
                    ) : (
                      user.withdrawAmount
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {editUserId === user.id ? (
                        <>
                          <button
                            onClick={() => handleSaveClick(user.id)}
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
                            onClick={() => handleEditClick(user)}
                            disabled={user.banned}
                            className={`p-2 rounded-lg ${
                              user.banned
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleBan(user.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.banned
                                ? "text-red-600 hover:bg-red-50"
                                : "text-orange-500 hover:bg-orange-50"
                            }`}
                            title={user.banned ? "Unban User" : "Ban User"}
                          >
                            {user.banned ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            disabled={user.banned}
                            className={`p-2 rounded-lg ${
                              user.banned
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-500 hover:text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No users found.
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

export default UsersList;
