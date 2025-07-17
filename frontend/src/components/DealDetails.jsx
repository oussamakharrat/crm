import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const DealDetails = () => {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/deals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDeal(res.data);
        console.log("Deal details:", res.data); // Debug: log the deal object
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Deal not found.");
        } else {
          setError("An error occurred while fetching the deal.");
        }
      }
    };
    fetchDeal();
  }, [id]);
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!deal) return <div>Loading...</div>;
  return (
    <>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="/deals">Deals</a></li>
          <li className="breadcrumb-item active">Deal Details</li>
        </ol>
      </nav>
      <div className="card p-4">
        <h2 className="mb-3">{deal.title}</h2>
        <p><strong>Value:</strong> {deal.value}</p>
        <p><strong>Stage:</strong> {deal.stage}</p>
        <p><strong>Owner ID:</strong> {deal.owner_id}</p>
        <p><strong>Contact ID:</strong> {deal.contact_id}</p>
        <p><strong>Created At:</strong> {deal.created_at ? new Date(deal.created_at).toLocaleString() : ''}</p>
        <p><strong>Updated At:</strong> {deal.updated_at ? new Date(deal.updated_at).toLocaleString() : ''}</p>
      </div>
    </>
  );
};

export default DealDetails; 