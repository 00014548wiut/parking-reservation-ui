import React, { useState, useEffect } from 'react';
import apiCall from '../Shared/Services/apiCalls';
import { useNavigate } from 'react-router-dom';
const EmailVerification = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
 const navigate = useNavigate()
  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleVerifyEmail = async () => {
    if (!email) {
      setMessage('No email provided in the URL.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
        const response = await apiCall({
            endpoint: `/api/Users/VerifyEmail/${email}`,
            method: 'PUT'
        });
        console.log(response);
        if (response === "Email verified successfully.") {
            setMessage('Email verified successfully! Redirecting you to login...');
            setTimeout(() => navigate("/login"), 3000);
        }      
    } catch (error) {
      setMessage('Failed to verify email. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Email Verification</h2>
      <p>Please click the button below to verify your email address.</p>
      <button 
        onClick={handleVerifyEmail} 
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>
      {message && <p style={{ marginTop: '15px', color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default EmailVerification;
