import React, { useState } from 'react';
import API from '../services/api';
import './UploadReport.css';

function UploadReport() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) return alert('Please add title and file');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      await API.post('/reports/upload/', formData);
      alert('Report uploaded successfully');
      setTitle('');
      setFile(null);
    } catch {
      alert('Upload failed');
    }
  };

  return (
    <div className="report-upload-container">
      <form className="report-form" onSubmit={handleSubmit}>
        <h2>Upload Medical Report</h2>
        <input
          type="text"
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadReport;
