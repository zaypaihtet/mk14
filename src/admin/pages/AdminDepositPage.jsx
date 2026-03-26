import React, { useState } from "react";
import { Edit, Trash2, Ban, UserX, CheckCircle, XCircle } from "lucide-react";

const AdminDepositPage = () => {
  const [deposits, setDeposits] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "0987766567",
      amount: "200000 MMK",
      status: "pending",
      banned: false,
    },
    {
      id: 2,
      name: "Olivia",
      phone: "0965378",
      amount: "350000 MMK",
      status: "approved",
      banned: false,
    },
  ]);

  const handleApprove = (id) => {
    setDeposits(
      deposits.map((d) =>
        d.id === id ? { ...d, status: "approved" } : d
      )
    );
  };

  const handleReject = (id) => {
    setDeposits(
      deposits.map((d) =>
        d.id === id ? { ...d, status: "rejected" } : d
      )
    );
  };

  const handleDelete = (id) => {
    setDeposits(deposits.filter((d) => d.id !== id));
  };

  const handleToggleBan = (id) => {
    setDeposits(
      deposits.map((d) =>
        d.id === id ? { ...d, banned: !d.banned } : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deposits</h1>
          <p className="text-gray-600">Manage user deposit requests</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Deposit Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deposits.map((deposit) => (
                <tr key={deposit.id} className={`hover:bg-gray-50 ${deposit.banned && "line-through opacity-50"}`}>
                  {/* Name */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {deposit.name}
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {deposit.phone}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {deposit.amount}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-sm">
                    {deposit.status === "approved" && (
                      <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Approved
                      </span>
                    )}
                    {deposit.status === "rejected" && (
                      <span className="flex items-center text-red-600 font-medium">
                        <XCircle className="w-4 h-4 mr-1" /> Rejected
                      </span>
                    )}
                    {deposit.status === "pending" && (
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApprove(deposit.id)}
                        disabled={deposit.banned}
                         className={`p-2 rounded-lg ${
                          deposit.banned
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-green-500 hover:bg-green-50"
                        }`}
                        
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(deposit.id)}
                       disabled={deposit.banned}
                         className={`p-2 rounded-lg ${
                          deposit.banned
                            ? "text-gray-500 cursor-not-allowed"
                            : "text-red-500 hover:bg-red-50"
                        }`}
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>

                      {/* Toggle Ban */}
                      <button
                        onClick={() => handleToggleBan(deposit.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          deposit.banned
                            ? "text-red-600 hover:bg-red-50"
                            : "text-orange-500 hover:bg-orange-50"
                        }`}
                        title={deposit.banned ? "Unban User" : "Ban User"}
                      >
                        {deposit.banned ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </button>

                      {/* <button
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button> */}
                      <button
                        onClick={() => handleDelete(deposit.id)}
                        className="p-2 text-red-500 hover:bg-gray-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {deposits.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No deposit records found.
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

export default AdminDepositPage;
