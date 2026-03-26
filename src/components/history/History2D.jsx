import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/datepicker.css";
const History2D = () => {
      const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 min-h-screen">
            <p className="text-sm text-gray-600 mb-2">စစ်ဆေးမည့်ရက်စွဲကိုရွေးချယ်ပါ</p>
            
            <div className="flex flex-col space-y-3">
              {/* Dropdown */}
              <div className="relative">
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                  <option>မနက်</option>
                  <option>ညနေ</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Date Picker */}
              <div className="relative">
                <div 
                  className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <span>{selectedDate.toLocaleDateString()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>

                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setIsDatePickerOpen(false);
                      }}
                      inline
                      className="border-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
  )
}

export default History2D