import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorMessage from "./ErrorMessage";

const API_URL = 'http://localhost:5000/api';

const InvoiceList = ({ token }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoices on mount
  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data);
    } catch {
      setError('Failed to fetch invoices');
    }
    setLoading(false);
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
                <td>
                  {(() => {
                    const url = inv.pdf_path || inv.file || inv.url;
                    return url ? (
                      <a
                        href={url.startsWith('http') ? url : `http://localhost:5000${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={e => e.stopPropagation()}
                      >
                        {inv.invoice_number}
                      </a>
                    ) : (
                      inv.invoice_number
                    );
                  })()}
                </td>
                <td>{inv.deal_id}</td>
                <td>{inv.contact_id}</td>
                <td>{inv.amount}</td>
                <td>{inv.total}</td>
                <td>{inv.issue_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default InvoiceList;