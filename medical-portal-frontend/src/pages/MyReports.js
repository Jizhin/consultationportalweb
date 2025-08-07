import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Reports.css';

function MyReports() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState('');

  const fetchReports = async () => {
    try {
      const res = await API.get('/reports/my/');
      setReports(res.data.reports || []);
      setSummary(res.data.summary_pdf);
    } catch {
      alert('Could not load reports');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="report-list-container">
      <div className="report-list-card">
        <h2>My Uploaded Reports</h2>
        {reports.length === 0 ? (
          <p>No reports uploaded yet.</p>
        ) : (
          <ul className="report-list">
            {reports.map((r) => (
              <li key={r.id}>
                <strong>{r.title}</strong> <br />
                <a href={r.file} target="_blank" rel="noreferrer">View File</a>
              </li>
            ))}
          </ul>
        )}
        {summary && (
          <div style={{ marginTop: '20px' }}>
            <a href={summary} target="_blank" rel="noreferrer">
              📄 Download Summary PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;
