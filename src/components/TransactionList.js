import React, { useState, useEffect } from 'react';

const TransactionList = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = userId
      ? `http://127.0.0.1:5555/payments?user_id=${userId}`
      : 'http://127.0.0.1:5555/payments';

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  }, [userId]);

  const handleRefund = (paymentId, action) => {
    fetch('http://127.0.0.1:5555/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_id: paymentId, action }),
    })
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
        // Optionally refresh the list of transactions
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === paymentId
              ? {
                  ...transaction,
                  status: action === 'approve' ? 'refunded' : 'refund_denied',
                }
              : transaction
          )
        );
      })
      .catch((error) => console.error('Error processing refund:', error));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Transaction List</h2>
      {transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.user}</td>
                <td>{transaction.event}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.method}</td>
                <td>{transaction.status}</td>
                <td>{transaction.date}</td>
                <td>
                  {transaction.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleRefund(transaction.id, 'approve')}>
                        Approve Refund
                      </button>
                      <button
                        onClick={() => handleRefund(transaction.id, 'deny')}>
                        Deny Refund
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionList;
