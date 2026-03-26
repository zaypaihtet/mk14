import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { api } from "../../utils/api";

const AdminDepositPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getDeposits()
      .then((data) => setDeposits(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.admin.updateDepositStatus(id, status);
      setDeposits(deposits.map((d) => d.id === id ? { ...d, status } : d));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deposits</h1>
        <p className="text-gray-600">Manage user deposit requests</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && <tr><td colSpan="6" className="text-center py-6">Loading...</td></tr>}
              {!loading && deposits.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-500">No deposits found.</td></tr>}
              {deposits.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{d.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Number(d.amount).toLocaleString()} MMK</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{d.method}</td>
                  <td className="px-6 py-4 text-sm">
                    {d.status === "approved" && <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Approved</span>}
                    {d.status === "rejected" && <span className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" /> Rejected</span>}
                    {d.status === "pending" && <span className="text-yellow-600">Pending</span>}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {d.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatus(d.id, "approved")} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs">Approve</button>
                        <button onClick={() => handleStatus(d.id, "rejected")} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs">Reject</button>
                      </div>
                    )}
                    {d.receipt_image && (
                      <a href={`http://localhost:8000${d.receipt_image}`} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs block mt-1">View Receipt</a>
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

export default AdminDepositPage;
