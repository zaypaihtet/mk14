import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { api } from "../../utils/api";

const AdminWithdrawPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getWithdrawals()
      .then((data) => setWithdrawals(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.admin.updateWithdrawalStatus(id, status);
      setWithdrawals(withdrawals.map((w) => w.id === id ? { ...w, status } : w));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <p className="text-gray-600">Manage user withdrawal requests</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && <tr><td colSpan="7" className="text-center py-6">Loading...</td></tr>}
              {!loading && withdrawals.length === 0 && <tr><td colSpan="7" className="text-center py-6 text-gray-500">No withdrawals found.</td></tr>}
              {withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{w.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Number(w.amount).toLocaleString()} MMK</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.bank_method}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.account_number} ({w.account_name})</td>
                  <td className="px-6 py-4 text-sm">
                    {w.status === "approved" && <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Approved</span>}
                    {w.status === "rejected" && <span className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" /> Rejected</span>}
                    {w.status === "pending" && <span className="text-yellow-600">Pending</span>}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {w.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatus(w.id, "approved")} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs">Approve</button>
                        <button onClick={() => handleStatus(w.id, "rejected")} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs">Reject</button>
                      </div>
                    )}
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

export default AdminWithdrawPage;
