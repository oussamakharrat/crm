import React, { useState, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { ThemeContext } from "../ThemeContext";
import {
  generateLeadsFromText,
  generateLeadsFromWebsite,
  generateLeadsFromIndustry,
  previewGeneratedLeads
} from "../api";
import ErrorMessage from "./ErrorMessage";

const AILeadGenerator = ({ onLeadsGenerated, onClose }) => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewLeads, setPreviewLeads] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Form states for different tabs
  const [textForm, setTextForm] = useState({
    text: "",
    count: 5
  });

  const [websiteForm, setWebsiteForm] = useState({
    url: "",
    count: 5
  });

  const [industryForm, setIndustryForm] = useState({
    industry: "",
    location: "",
    count: 5
  });

  const handleTextChange = (e) => {
    setTextForm({ ...textForm, [e.target.name]: e.target.value });
  };

  const handleWebsiteChange = (e) => {
    setWebsiteForm({ ...websiteForm, [e.target.name]: e.target.value });
  };

  const handleIndustryChange = (e) => {
    setIndustryForm({ ...industryForm, [e.target.name]: e.target.value });
  };

  const handlePreview = async (type) => {
    setLoading(true);
    setError(null);
    setShowPreview(false);

    try {
      const token = localStorage.getItem('token');
      let response;

      switch (type) {
        case 'text':
          response = await previewGeneratedLeads(token, 'text', textForm.text, textForm.count);
          break;
        case 'website':
          response = await previewGeneratedLeads(token, 'website', websiteForm.url, websiteForm.count);
          break;
        case 'industry':
          response = await previewGeneratedLeads(token, 'industry', industryForm, industryForm.count);
          break;
        default:
          throw new Error('Invalid type');
      }

      setPreviewLeads(response.data.leads);
      setShowPreview(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to preview leads");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (type) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      let response;

      switch (type) {
        case 'text':
          response = await generateLeadsFromText(token, textForm.text, textForm.count, user?.user_id);
          break;
        case 'website':
          response = await generateLeadsFromWebsite(token, websiteForm.url, websiteForm.count, user?.user_id);
          break;
        case 'industry':
          response = await generateLeadsFromIndustry(token, industryForm.industry, industryForm.location, industryForm.count, user?.user_id);
          break;
        default:
          throw new Error('Invalid type');
      }

      if (onLeadsGenerated) {
        onLeadsGenerated(response.data.leads);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate leads");
    } finally {
      setLoading(false);
    }
  };

  const renderTextTab = () => (
    <div className="mb-3">
      <label className="form-label">Text Content</label>
      <textarea
        className="form-control"
        name="text"
        value={textForm.text}
        onChange={handleTextChange}
        rows="6"
        placeholder="Paste any text content here (emails, documents, conversations, etc.) to generate leads from..."
        required
      />
      <div className="mt-2">
        <label className="form-label">Number of leads to generate</label>
        <input
          type="number"
          className="form-control"
          name="count"
          value={textForm.count}
          onChange={handleTextChange}
          min="1"
          max="20"
        />
      </div>
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary me-2"
          onClick={() => handlePreview('text')}
          disabled={loading || !textForm.text}
        >
          Preview
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleGenerate('text')}
          disabled={loading || !textForm.text}
        >
          Generate Leads
        </button>
      </div>
    </div>
  );

  const renderWebsiteTab = () => (
    <div className="mb-3">
      <label className="form-label">Website URL</label>
      <input
        type="url"
        className="form-control"
        name="url"
        value={websiteForm.url}
        onChange={handleWebsiteChange}
        placeholder="https://example.com"
        required
      />
      <div className="mt-2">
        <label className="form-label">Number of leads to generate</label>
        <input
          type="number"
          className="form-control"
          name="count"
          value={websiteForm.count}
          onChange={handleWebsiteChange}
          min="1"
          max="20"
        />
      </div>
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary me-2"
          onClick={() => handlePreview('website')}
          disabled={loading || !websiteForm.url}
        >
          Preview
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleGenerate('website')}
          disabled={loading || !websiteForm.url}
        >
          Generate Leads
        </button>
      </div>
    </div>
  );

  const renderIndustryTab = () => (
    <div className="mb-3">
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Industry</label>
          <input
            type="text"
            className="form-control"
            name="industry"
            value={industryForm.industry}
            onChange={handleIndustryChange}
            placeholder="e.g., Technology, Healthcare, Finance"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={industryForm.location}
            onChange={handleIndustryChange}
            placeholder="e.g., New York, California, Remote"
            required
          />
        </div>
      </div>
      <div className="mt-2">
        <label className="form-label">Number of leads to generate</label>
        <input
          type="number"
          className="form-control"
          name="count"
          value={industryForm.count}
          onChange={handleIndustryChange}
          min="1"
          max="20"
        />
      </div>
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary me-2"
          onClick={() => handlePreview('industry')}
          disabled={loading || !industryForm.industry || !industryForm.location}
        >
          Preview
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleGenerate('industry')}
          disabled={loading || !industryForm.industry || !industryForm.location}
        >
          Generate Leads
        </button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="mt-4">
      <h6>Preview Generated Leads</h6>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {previewLeads.map((lead, index) => (
              <tr key={index}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{lead.company}</td>
                <td>{lead.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-robot me-2"></i>
              AI Lead Generator
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <ErrorMessage message={error} />}
            
            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-3" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                  type="button"
                >
                  <i className="fas fa-file-text me-1"></i>
                  From Text
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'website' ? 'active' : ''}`}
                  onClick={() => setActiveTab('website')}
                  type="button"
                >
                  <i className="fas fa-globe me-1"></i>
                  From Website
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'industry' ? 'active' : ''}`}
                  onClick={() => setActiveTab('industry')}
                  type="button"
                >
                  <i className="fas fa-industry me-1"></i>
                  From Industry
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'text' && renderTextTab()}
              {activeTab === 'website' && renderWebsiteTab()}
              {activeTab === 'industry' && renderIndustryTab()}
            </div>

            {/* Preview Section */}
            {showPreview && renderPreview()}

            {loading && (
              <div className="text-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Generating leads with AI...</p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILeadGenerator; 