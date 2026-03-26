import React from 'react'

const LotteryHistory2D = () => {
  return (
     <div className="bg-white rounded-lg border border-gray-200 p-4 h-screen">
            <h3 className="font-semibold text-lg mb-3">ရလဒ်များ</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">12-09-2023</p>
                  <p className="text-sm text-gray-500">မနက်</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">87</p>
                  <p className="text-sm text-gray-500">ထီပေါက်ဂဏန်း</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">11-09-2023</p>
                  <p className="text-sm text-gray-500">ညနေ</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">35</p>
                  <p className="text-sm text-gray-500">ထီပေါက်ဂဏန်း</p>
                </div>
              </div>
            </div>
          </div>
  )
}

export default LotteryHistory2D