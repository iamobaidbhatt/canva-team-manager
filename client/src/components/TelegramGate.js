import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, AlertCircle, Users } from 'lucide-react';
import axios from 'axios';

const TelegramGate = ({ onVerified, onClose }) => {
  const [step, setStep] = useState(1); // 1: Join channel, 2: Verify, 3: Success
  const [telegramUsername, setTelegramUsername] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');

  const TELEGRAM_CHANNEL = 'https://t.me/crackinghubbysamk';
  const CHANNEL_USERNAME = 'crackinghubbysamk';

  const handleJoinChannel = () => {
    window.open(TELEGRAM_CHANNEL, '_blank');
    setStep(2);
  };

  const handleVerifyMembership = async () => {
    if (!telegramUsername.trim()) {
      setVerificationStatus('Please enter your Telegram username');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('');

    try {
      const response = await axios.post('/api/telegram/verify-membership', {
        username: telegramUsername.trim()
      });

      if (response.data.success) {
        setVerificationStatus('success');
        setStep(3);
        
        // Auto-proceed after 2 seconds
        setTimeout(() => {
          onVerified();
        }, 2000);
      } else {
        setVerificationStatus(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus(
        error.response?.data?.message || 
        'Failed to verify membership. Please check your username and try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSkip = () => {
    // Allow admin to skip verification
    onVerified();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 10000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            📱
          </div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Join Our Telegram Channel
          </h2>
          <p style={{ opacity: 0.8, fontSize: '1rem' }}>
            To access Canva Pro teams, you must first join our official Telegram channel
          </p>
        </div>

        {/* Step 1: Join Channel */}
        {step === 1 && (
          <div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Users size={24} color="#3b82f6" />
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Cracking Hub Official
                  </h3>
                  <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                    267+ members • Premium content & updates
                  </p>
                </div>
              </div>
              <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                Join our Telegram channel to get access to exclusive Canva Pro teams and premium content.
              </p>
            </div>

            <button
              onClick={handleJoinChannel}
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
              }}
            >
              <ExternalLink size={20} />
              Join Telegram Channel
            </button>
          </div>
        )}

        {/* Step 2: Verify Membership */}
        {step === 2 && (
          <div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <CheckCircle size={24} color="#22c55e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Channel Joined!
              </h3>
              <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
                Now verify your membership by entering your Telegram username
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="@your_telegram_username"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
              />
              {verificationStatus && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  background: verificationStatus === 'success' 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  border: verificationStatus === 'success' 
                    ? '1px solid rgba(34, 197, 94, 0.3)' 
                    : '1px solid rgba(239, 68, 68, 0.3)',
                  color: verificationStatus === 'success' ? '#22c55e' : '#ef4444'
                }}>
                  {verificationStatus}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleVerifyMembership}
                disabled={isVerifying}
                style={{
                  background: isVerifying 
                    ? 'linear-gradient(45deg, #6b7280, #4b5563)' 
                    : 'linear-gradient(45deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isVerifying ? 'not-allowed' : 'pointer',
                  opacity: isVerifying ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {isVerifying ? 'Verifying...' : 'Verify Membership'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Verification Successful!
              </h3>
              <p style={{ opacity: 0.8, fontSize: '1rem' }}>
                You can now access our Canva Pro teams. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Hidden Admin Skip Button - Only visible when clicking in top-right corner */}
        <div 
          onClick={handleSkip}
          style={{ 
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            opacity: 0,
            zIndex: 1000
          }}
          title="Admin Skip"
        />
      </div>
    </div>
  );
};

export default TelegramGate;
