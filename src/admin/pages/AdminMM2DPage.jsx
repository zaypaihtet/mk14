import React, { useState } from "react";

const AdminMM2DPage = () => {
  const [mm2dData, setMm2dData] = useState([
    {
      id: 1,
      name: "Soe Thu",
      phone: "0987766567",
      numbers: "12, 34, 56",
      amount: "5000 MMK",
    },
    {
      id: 2,
      name: "Kyaw Kyaw",
      phone: "0965378",
      numbers: "01, 23, 45",
      amount: "10000 MMK",
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MM 2D Records</h1>
          <p className="text-gray-600">View 2D numbers and their amounts</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
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
                2D Numbers
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mm2dData.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {record.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {record.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {record.numbers}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{record.amount}</td>
              </tr>
            ))}
            {mm2dData.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMM2DPage;
