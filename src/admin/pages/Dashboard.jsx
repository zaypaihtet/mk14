import React, { useState } from "react";
import { FileText, Calendar, Mail, Receipt, TicketCheck, UserCheck, Users, RadioTower, BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { Link } from "react-router";

const Dashboard = () => {
  const statCards = [
    
    {
      title: "Agents",
      icon: Users,
      color: "bg-orange-500",
      totalNumber: "120",
    },
    {
      title: "Users",
      icon: UserCheck,
      color: "bg-purple-500",
      totalNumber: "300",
    },
    {
      title: "Deposit",
      icon: BanknoteArrowUp,
      color: "bg-fuchsia-500",
      totalAmount: "28000000 MMK",
    },
    {
      title: "WithDraw",
      icon: BanknoteArrowDown,
      color: "bg-red-500",
      totalAmount: "15000000 MMK",
    },
    {
      title: "MM 2D",
      icon: Receipt,
      color: "bg-yellow-500",
      totalNumber: "500",
    },
    {
      title: "MM 3D",
      icon: TicketCheck,
      color: "bg-gray-500",
      totalNumber: "180",
    },
     {
      title: "Dubai 2D",
      icon: Receipt,
      color: "bg-pink-500",
      totalNumber: "500",
    },
    {
      title: "Dubai 3D",
      icon: TicketCheck,
      color: "bg-green-500",
      totalNumber: "180",
    },
     {
      title: "Mega 2D",
      icon: Receipt,
      color: "bg-cyan-500",
      totalNumber: "500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 ">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
             
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-2xl bg-blue-500`}>
                    <RadioTower className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-medium text-gray-600">
                   21
                  </p>
                </div>
                <p className="font-medium text-gray-600 p-3 text-xl">
                  2D live
                </p>
              </div>
            </div>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-2xl ${card.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xl font-medium text-gray-600">
                    {card.title}
                  </p>
                </div>
                <p className="font-medium text-gray-600 p-3">
                  {card.totalNumber ? <span>Total Number :{" "}{card.totalNumber}</span> : <span>Total Amount :{" "}{card.totalAmount}</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/blogs/create"
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
            >
              <FileText className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Create Blog Post</h3>
              <p className="text-sm text-gray-600">Write a new blog article</p>
            </Link>
            <Link
              to="/admin/events/create"
              className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
            >
              <Calendar className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Add Event</h3>
              <p className="text-sm text-gray-600">Create a new event</p>
            </Link>
            <Link
              to="/admin/events/create"
              className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
            >
              <Calendar className="h-6 w-6 text-violet-600 mb-2" />
              <h3 className="font-medium text-gray-900">Add User</h3>
              <p className="text-sm text-gray-600">Create a new user</p>
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
