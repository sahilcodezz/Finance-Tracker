import React from 'react';

const MobileDashboard = ({ transactions = [] }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      {/* Header Area */}
      <header className="p-6 bg-indigo-600 text-white rounded-b-3xl shadow-lg">
        <p className="text-sm opacity-80">Total Balance</p>
        <h1 className="text-3xl font-bold mt-1">$4,250.00</h1>
        
        <div className="flex justify-between mt-6 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div>
            <p className="text-xs opacity-70">Income</p>
            <p className="font-semibold text-green-300">+$1,200</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div>
            <p className="text-xs opacity-70">Expenses</p>
            <p className="font-semibold text-red-300">-$450</p>
          </div>
        </div>
      </header>

      {/* Transaction List Area */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
          <button className="text-indigo-600 text-sm font-medium">See All</button>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx._id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  {/* Icon placeholder */}
                  <span>💸</span>
                </div>
                <div>
                  <p className="font-semibold">{tx.description}</p>
                  <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button className="text-indigo-600">🏠</button>
        <button className="text-gray-400">📊</button>
        <button className="bg-indigo-600 w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center -mt-10 border-4 border-gray-50 text-xl font-bold">
          +
        </button>
        <button className="text-gray-400">🕒</button>
        <button className="text-gray-400">👤</button>
      </nav>
    </div>
  );
};

export default MobileDashboard;