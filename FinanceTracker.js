import React, { useState, useEffect } from 'react';

const FinanceTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');

  // Load initial data
  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Failed to load:", err));
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), date: new Date() }),
      });

      if (response.ok) {
        const newTransaction = await response.json();
        
        // CORRECT WAY: Create a new array reference to trigger re-render
        setTransactions(prev => [newTransaction, ...prev]);
        setAmount(''); // Clear input
      }
    } catch (error) {
      console.error("Error adding amount:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleAddTransaction}>
        <input 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Enter amount" 
        />
        <button type="submit">Add Amount</button>
      </form>

      <ul>
        {transactions.map(item => (
          <li key={item._id}>${item.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default FinanceTracker;