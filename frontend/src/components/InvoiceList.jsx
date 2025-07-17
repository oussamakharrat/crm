import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const InvoiceList = ({ token }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch invoices on mount
  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data);
    } catch {
      alert('Failed to fetch invoices');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      try {
        await axios.delete(`${API_URL}/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchInvoices();
      } catch {
        alert('Failed to delete invoice');
      }
    }
  };

  return (
    <div>
      <h2>Invoices</h2>
      {loading ? (
        <p>Loading...</p>
      ) : invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Deal ID</th>
              <th>Contact ID</th>
              <th>Amount</th>
              <th>Total</th>
              <th>Issue Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invoice_number}</td>
                <td>{inv.deal_id}</td>
                <td>{inv.contact_id}</td>
                <td>{inv.amount}</td>
                <td>{inv.total}</td>
                <td>{inv.issue_date}</td>
                <td>
                  <button onClick={() => handleDelete(inv.id)}>Delete</button>
                  {inv.pdf_path && (
                    <a
                      href={`http://localhost:5000${inv.pdf_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: '8px' }}
                      download
                    >
                      Download PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceList;