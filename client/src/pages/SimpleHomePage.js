import React, { useState, useEffect } from 'react';
import { Users, Star, Shield, Zap, CheckCircle, Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

import TeamCard from '../components/TeamCard';
import JoinModal from '../components/JoinModal';

// Configure axios base URL and headers
// For Vercel deployment, API calls will be relative to the domain
// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const SimpleHomePage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [keySequence, setKeySequence] = useState('');
  const [showTelegramPopup, setShowTelegramPopup] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    fetchTeams();
    
    // Show popup after a short delay to let the page load
    // Show popup every time user visits
    const timer = setTimeout(() => {
      setShowTelegramPopup(true);
    }, 2000); // 2 second delay
    
    // Secret admin access
    const handleKeyPress = (event) => {
      const newSequence = keySequence + event.key.toLowerCase();
      setKeySequence(newSequence);
      
      if (newSequence.includes('admin123')) {
        window.location.href = '/admin/login';
        setKeySequence('');
      } else if (newSequence.length > 10) {
        setKeySequence('');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [keySequence]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('/api/teams');
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to load teams');
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = (team) => {
    console.log('handleJoinTeam called with:', team);
    console.log('Setting showTelegramPopup to true');
    // Show Telegram popup first
    setShowTelegramPopup(true);
    setSelectedTeam(team);
    console.log('Popup should be showing now');
  };

  const handleJoinSuccess = () => {
    setShowJoinModal(false);
    setSelectedTeam(null);
    fetchTeams();
  };

  const handleTelegramJoin = () => {
    window.open('https://t.me/crackinghubbysamk', '_blank');
    setShowTelegramPopup(false);
    toast.success('Thank you for joining our Telegram channel! You can now access Canva Pro teams.');
    // After joining Telegram, show the join modal
    if (selectedTeam) {
      setShowJoinModal(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 60%, #475569 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Telegram Popup */}
      {console.log('Rendering popup, showTelegramPopup:', showTelegramPopup)}
      {showTelegramPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 'clamp(0.5rem, 3vw, 2rem)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: 'clamp(16px, 4vw, 24px)',
            padding: 'clamp(1.5rem, 6vw, 2.5rem)',
            maxWidth: 'clamp(320px, 90vw, 450px)',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {/* Close button for mobile */}
            <button
              onClick={() => setShowTelegramPopup(false)}
              style={{
                position: 'absolute',
                top: 'clamp(0.75rem, 3vw, 1rem)',
                right: 'clamp(0.75rem, 3vw, 1rem)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(32px, 8vw, 40px)',
                height: 'clamp(32px, 8vw, 40px)',
                color: '#94a3b8',
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onTouchStart={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>

            <div style={{
              fontSize: 'clamp(3rem, 15vw, 5rem)',
              marginBottom: 'clamp(1.5rem, 6vw, 2rem)',
              animation: 'pulse 2s infinite, float 4s ease-in-out infinite',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
            }}>📱</div>
            
            <h3 style={{
              fontSize: 'clamp(1.5rem, 7vw, 2.25rem)',
              fontWeight: '800',
              marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
              background: 'linear-gradient(45deg, #60a5fa, #3b82f6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              Join Our Telegram Channel
            </h3>
            
            <p style={{
              color: '#e2e8f0',
              marginBottom: 'clamp(2rem, 8vw, 2.5rem)',
              lineHeight: '1.7',
              fontSize: 'clamp(1rem, 4vw, 1.2rem)',
              padding: '0 clamp(0.5rem, 2vw, 1rem)',
              fontWeight: '400'
            }}>
              🚀 Get <span style={{color: '#60a5fa', fontWeight: '600'}}>exclusive access</span> to Canva Pro teams and stay updated with the latest design resources!
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.75rem, 3vw, 1rem)',
              alignItems: 'center'
            }}>
              <button
                onClick={handleTelegramJoin}
                style={{
                  background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                  color: 'white',
                  padding: 'clamp(0.875rem, 4vw, 1rem) clamp(1.5rem, 6vw, 2rem)',
                  borderRadius: 'clamp(25px, 6vw, 50px)',
                  border: 'none',
                  fontSize: 'clamp(0.95rem, 4vw, 1.1rem)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  maxWidth: '280px',
                  minHeight: 'clamp(44px, 10vw, 48px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onTouchStart={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(0.98)';
                  e.target.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.4)';
                }}
                onTouchEnd={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span>🚀 Join Channel</span>
                <span style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>📱</span>
              </button>
              
              <button
                onClick={() => setShowTelegramPopup(false)}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  padding: 'clamp(0.75rem, 3vw, 0.875rem) clamp(1.25rem, 5vw, 1.5rem)',
                  borderRadius: 'clamp(25px, 6vw, 50px)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  fontSize: 'clamp(0.9rem, 4vw, 1rem)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minHeight: 'clamp(40px, 9vw, 44px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onTouchStart={(e) => {
                  e.target.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                  e.target.style.transform = 'scale(0.98)';
                }}
                onTouchEnd={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                  e.target.style.transform = 'scale(1)';
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {showAboutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 'clamp(0.5rem, 3vw, 2rem)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: 'clamp(16px, 4vw, 24px)',
            padding: 'clamp(1.5rem, 6vw, 2.5rem)',
            maxWidth: 'clamp(320px, 90vw, 500px)',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowAboutModal(false)}
              style={{
                position: 'absolute',
                top: 'clamp(0.75rem, 3vw, 1rem)',
                right: 'clamp(0.75rem, 3vw, 1rem)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(32px, 8vw, 40px)',
                height: 'clamp(32px, 8vw, 40px)',
                color: '#94a3b8',
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              ×
            </button>

            <div style={{
              fontSize: 'clamp(3rem, 12vw, 4rem)',
              marginBottom: 'clamp(1rem, 4vw, 1.5rem)',
              animation: 'pulse 2s infinite'
            }}>👨‍💻</div>
            
            <h3 style={{
              fontSize: 'clamp(1.5rem, 6vw, 2rem)',
              fontWeight: 'bold',
              marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
              color: '#60a5fa',
              lineHeight: '1.3'
            }}>
              About Us
            </h3>
            
            <div style={{
              marginBottom: 'clamp(1.5rem, 6vw, 2rem)',
              textAlign: 'left'
            }}>
              <div style={{
                background: 'rgba(96, 165, 250, 0.1)',
                padding: 'clamp(1rem, 4vw, 1.5rem)',
                borderRadius: 'clamp(12px, 3vw, 16px)',
                border: '1px solid rgba(96, 165, 250, 0.2)',
                marginBottom: 'clamp(1rem, 4vw, 1.5rem)'
              }}>
                <h4 style={{
                  color: '#60a5fa',
                  fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  Sam Khan
                </h4>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  margin: '0.25rem 0',
                  lineHeight: '1.5'
                }}>
                  <strong>Web & Android Developer</strong>
                </p>
                <p style={{
                  color: '#cbd5e1',
                  fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                  margin: '0.25rem 0',
                  lineHeight: '1.5'
                }}>
                  Specializing in modern web applications and mobile development
                </p>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: 'clamp(1rem, 4vw, 1.5rem)',
                borderRadius: 'clamp(12px, 3vw, 16px)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <h4 style={{
                  color: '#3b82f6',
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                  fontWeight: '600',
                  marginBottom: '0.75rem'
                }}>
                  Contact Information
                </h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>📱</span>
                  <a
                    href="https://t.me/IAMMSAMKHANOFFICIAL"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#60a5fa',
                      fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = '#3b82f6';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = '#60a5fa';
                      e.target.style.textDecoration = 'none';
                    }}
                  >
                    Telegram: @IAMMSAMKHANOFFICIAL
                  </a>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>💼</span>
                  <span style={{
                    color: '#e2e8f0',
                    fontSize: 'clamp(0.9rem, 3vw, 1rem)'
                  }}>
                    Web & Android Development Services
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowAboutModal(false)}
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                color: 'white',
                padding: 'clamp(0.75rem, 3vw, 0.875rem) clamp(1.5rem, 6vw, 2rem)',
                borderRadius: 'clamp(25px, 6vw, 50px)',
                border: 'none',
                fontSize: 'clamp(0.9rem, 4vw, 1rem)',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                minHeight: 'clamp(40px, 9vw, 44px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DRAMATICALLY ENHANCED BACKGROUND EFFECTS - HIGHLY VISIBLE */}
      
      {/* SUPER VISIBLE Large floating orbs */}
      <div style={{
        position: 'absolute',
        top: '3%',
        left: '3%',
        width: 'clamp(300px, 35vw, 600px)',
        height: 'clamp(300px, 35vw, 600px)',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 197, 253, 0.25) 40%, rgba(59, 130, 246, 0.15) 70%, transparent 90%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 1,
        boxShadow: '0 0 100px rgba(59, 130, 246, 0.3)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '3%',
        width: 'clamp(280px, 32vw, 550px)',
        height: 'clamp(280px, 32vw, 550px)',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(34, 211, 238, 0.22) 40%, rgba(6, 182, 212, 0.12) 70%, transparent 90%)',
        borderRadius: '50%',
        filter: 'blur(18px)',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 1,
        boxShadow: '0 0 120px rgba(6, 182, 212, 0.25)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '20%',
        width: 'clamp(250px, 28vw, 500px)',
        height: 'clamp(250px, 28vw, 500px)',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(56, 189, 248, 0.18) 40%, rgba(14, 165, 233, 0.1) 70%, transparent 90%)',
        borderRadius: '50%',
        filter: 'blur(15px)',
        animation: 'float 10s ease-in-out infinite',
        zIndex: 1,
        boxShadow: '0 0 90px rgba(14, 165, 233, 0.2)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: 'clamp(220px, 25vw, 450px)',
        height: 'clamp(220px, 25vw, 450px)',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.32) 0%, rgba(59, 130, 246, 0.2) 40%, rgba(37, 99, 235, 0.12) 70%, transparent 90%)',
        borderRadius: '50%',
        filter: 'blur(12px)',
        animation: 'float 7s ease-in-out infinite reverse',
        zIndex: 1,
        boxShadow: '0 0 110px rgba(37, 99, 235, 0.22)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '35%',
        width: 'clamp(200px, 22vw, 400px)',
        height: 'clamp(200px, 22vw, 400px)',
        background: 'radial-gradient(circle, rgba(29, 78, 216, 0.28) 0%, rgba(37, 99, 235, 0.16) 40%, rgba(29, 78, 216, 0.08) 70%, transparent 90%)',
        borderRadius: '50%',
        filter: 'blur(10px)',
        animation: 'float 12s ease-in-out infinite',
        zIndex: 1,
        boxShadow: '0 0 80px rgba(29, 78, 216, 0.18)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '75%',
        right: '40%',
        width: 'clamp(180px, 20vw, 350px)',
        height: 'clamp(180px, 20vw, 350px)',
        background: 'radial-gradient(circle, rgba(30, 64, 175, 0.26) 0%, rgba(59, 130, 246, 0.14) 40%, rgba(30, 64, 175, 0.07) 70%, transparent 90%)',
        borderRadius: '50%',
        filter: 'blur(8px)',
        animation: 'float 9s ease-in-out infinite reverse',
        zIndex: 1,
        boxShadow: '0 0 70px rgba(30, 64, 175, 0.16)'
      }}></div>

      {/* Medium floating elements - More visible */}
      <div style={{
        position: 'absolute',
        top: '75%',
        right: '55%',
        width: 'clamp(120px, 15vw, 200px)',
        height: 'clamp(120px, 15vw, 200px)',
        background: 'radial-gradient(circle, rgba(8, 145, 178, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(18px)',
        animation: 'float 18s ease-in-out infinite',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '70%',
        width: 'clamp(100px, 12vw, 180px)',
        height: 'clamp(100px, 12vw, 180px)',
        background: 'radial-gradient(circle, rgba(30, 64, 175, 0.14) 0%, rgba(37, 99, 235, 0.07) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(15px)',
        animation: 'float 20s ease-in-out infinite reverse',
        zIndex: 1
      }}></div>

      {/* SUPER BRIGHT GLOWING PARTICLES - MAXIMUM VISIBILITY */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: 'clamp(15px, 2vw, 25px)',
        height: 'clamp(15px, 2vw, 25px)',
        background: '#3b82f6',
        borderRadius: '50%',
        boxShadow: '0 0 30px #3b82f6, 0 0 60px #3b82f6, 0 0 90px rgba(59, 130, 246, 0.5)',
        animation: 'float 8s ease-in-out infinite, pulse 3s ease-in-out infinite',
        zIndex: 3
      }}></div>
      <div style={{
        position: 'absolute',
        top: '65%',
        left: '80%',
        width: 'clamp(18px, 2.5vw, 30px)',
        height: 'clamp(18px, 2.5vw, 30px)',
        background: '#06b6d4',
        borderRadius: '50%',
        boxShadow: '0 0 35px #06b6d4, 0 0 70px #06b6d4, 0 0 105px rgba(6, 182, 212, 0.5)',
        animation: 'float 12s ease-in-out infinite reverse, pulse 4s ease-in-out infinite',
        zIndex: 3
      }}></div>
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '85%',
        width: 'clamp(12px, 1.8vw, 20px)',
        height: 'clamp(12px, 1.8vw, 20px)',
        background: '#1e40af',
        borderRadius: '50%',
        boxShadow: '0 0 25px #1e40af, 0 0 50px #1e40af, 0 0 75px rgba(30, 64, 175, 0.5)',
        animation: 'float 15s ease-in-out infinite, pulse 2.5s ease-in-out infinite',
        zIndex: 3
      }}></div>
      <div style={{
        position: 'absolute',
        top: '80%',
        left: '5%',
        width: 'clamp(14px, 2.2vw, 22px)',
        height: 'clamp(14px, 2.2vw, 22px)',
        background: '#0ea5e9',
        borderRadius: '50%',
        boxShadow: '0 0 28px #0ea5e9, 0 0 56px #0ea5e9, 0 0 84px rgba(14, 165, 233, 0.5)',
        animation: 'float 10s ease-in-out infinite reverse, pulse 3.5s ease-in-out infinite',
        zIndex: 3
      }}></div>
      <div style={{
        position: 'absolute',
        top: '22%',
        left: '2%',
        width: 'clamp(10px, 1.5vw, 18px)',
        height: 'clamp(10px, 1.5vw, 18px)',
        background: '#2563eb',
        borderRadius: '50%',
        boxShadow: '0 0 20px #2563eb, 0 0 40px #2563eb, 0 0 60px rgba(37, 99, 235, 0.5)',
        animation: 'float 11s ease-in-out infinite, pulse 2.8s ease-in-out infinite',
        zIndex: 3
      }}></div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '92%',
        width: 'clamp(8px, 1.2vw, 15px)',
        height: 'clamp(8px, 1.2vw, 15px)',
        background: '#1d4ed8',
        borderRadius: '50%',
        boxShadow: '0 0 18px #1d4ed8, 0 0 36px #1d4ed8, 0 0 54px rgba(29, 78, 216, 0.5)',
        animation: 'float 18s ease-in-out infinite reverse, pulse 4.2s ease-in-out infinite',
        zIndex: 3
      }}></div>
      <div style={{
        position: 'absolute',
        top: '90%',
        left: '45%',
        width: 'clamp(13px, 2vw, 20px)',
        height: 'clamp(13px, 2vw, 20px)',
        background: '#0284c7',
        borderRadius: '50%',
        boxShadow: '0 0 26px #0284c7, 0 0 52px #0284c7, 0 0 78px rgba(2, 132, 199, 0.5)',
        animation: 'float 13s ease-in-out infinite, pulse 3.2s ease-in-out infinite',
        zIndex: 3
      }}></div>
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '60%',
        width: 'clamp(11px, 1.7vw, 17px)',
        height: 'clamp(11px, 1.7vw, 17px)',
        background: '#0369a1',
        borderRadius: '50%',
        boxShadow: '0 0 22px #0369a1, 0 0 44px #0369a1, 0 0 66px rgba(3, 105, 161, 0.5)',
        animation: 'float 16s ease-in-out infinite reverse, pulse 2.2s ease-in-out infinite',
        zIndex: 3
      }}></div>

      {/* SUPER VISIBLE WAVE EFFECTS - DRAMATIC MOVEMENT */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 'clamp(80px, 12vw, 150px)',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), rgba(14, 165, 233, 0.25), rgba(6, 182, 212, 0.2), transparent)',
        animation: 'float 15s ease-in-out infinite',
        zIndex: 1,
        boxShadow: '0 -20px 40px rgba(59, 130, 246, 0.1)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: 'clamp(70px, 10vw, 130px)',
        background: 'linear-gradient(270deg, transparent, rgba(14, 165, 233, 0.28), rgba(6, 182, 212, 0.22), rgba(37, 99, 235, 0.18), transparent)',
        animation: 'float 20s ease-in-out infinite reverse',
        zIndex: 1,
        boxShadow: '0 20px 40px rgba(14, 165, 233, 0.1)'
      }}></div>
      <div style={{
        position: 'absolute',
        left: 0,
        top: '45%',
        width: '100%',
        height: 'clamp(40px, 6vw, 80px)',
        background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.2), transparent, rgba(29, 78, 216, 0.18), transparent, rgba(59, 130, 246, 0.16))',
        animation: 'float 25s ease-in-out infinite',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        right: 0,
        top: '25%',
        width: '100%',
        height: 'clamp(30px, 5vw, 60px)',
        background: 'linear-gradient(270deg, rgba(6, 182, 212, 0.15), transparent, rgba(14, 165, 233, 0.12), transparent)',
        animation: 'float 35s ease-in-out infinite reverse',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        left: 0,
        top: '75%',
        width: '100%',
        height: 'clamp(25px, 4vw, 50px)',
        background: 'linear-gradient(90deg, transparent, rgba(30, 64, 175, 0.14), transparent, rgba(29, 78, 216, 0.12), transparent)',
        animation: 'float 40s ease-in-out infinite',
        zIndex: 1
      }}></div>

      {/* Enhanced Header with Mobile Menu */}
      <header style={{
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        padding: '1rem 0',
        position: 'relative',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo Section */}
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{
              background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
              padding: '0.75rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.2)'
            }}>
              <Star size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', 
                fontWeight: 'bold', 
                margin: 0,
                color: '#f8fafc'
              }}>
                Canva Pro Teams
              </h1>
              <p style={{
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                margin: 0, 
                color: '#94a3b8',
                fontWeight: '500'
              }}>
                🎨 Premium Design Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{
            display: 'none',
            alignItems: 'center', 
            gap: '1rem',
            '@media (min-width: 768px)': {
              display: 'flex'
            }
          }}
          className="desktop-nav"
          >
            <button
              onClick={() => setShowAboutModal(true)}
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                fontSize: '0.875rem',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                e.target.style.color = '#60a5fa';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                e.target.style.color = '#e2e8f0';
              }}
            >
              About Us
            </button>
            <a 
              href="https://t.me/crackinghubbysamk" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                fontSize: '0.875rem',
                border: '1px solid rgba(148, 163, 184, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                e.target.style.color = '#60a5fa';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                e.target.style.color = '#e2e8f0';
              }}
            >
              Contact Us
            </a>
            <a 
              href="https://canva.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                transition: 'all 0.3s ease',
                fontSize: '0.875rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.3)';
                e.target.style.background = 'linear-gradient(45deg, #1d4ed8, #1e3a8a)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                e.target.style.background = 'linear-gradient(45deg, #3b82f6, #1e40af)';
              }}
            >
              Visit Canva ↗
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            className="mobile-menu-btn"
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 40
          }}>
            <button
              onClick={() => {
                setShowAboutModal(true);
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                textAlign: 'center',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              About Us
            </button>
            <a 
              href="https://t.me/crackinghubbysamk" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                textAlign: 'center',
                border: '1px solid rgba(148, 163, 184, 0.3)'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </a>
            <a 
              href="https://canva.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                textAlign: 'center'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Visit Canva ↗
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={{
        padding: 'clamp(3rem, 8vw, 5rem) 1rem', 
        position: 'relative', 
        zIndex: 5
      }}>
        <div style={{
          maxWidth: '1200px', 
          margin: '0 auto', 
          textAlign: 'center'
        }}>
          {/* Premium Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            fontWeight: '500',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
            color: '#e2e8f0'
          }}>
            <span style={{fontSize: '1.2rem'}}>💎</span>
            <span>Premium Access Available</span>
            <span style={{fontSize: '1rem'}}>🌊</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            color: '#f8fafc',
            lineHeight: '1.1',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Join Our<br />
            <span style={{
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Canva Pro Team
            </span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            marginBottom: '3rem',
            maxWidth: '700px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.7',
            color: '#cbd5e1',
            fontWeight: '400'
          }}>
            Unlock premium design features, collaborate with professionals, and create 
            <span style={{
              color: '#60a5fa',
              fontWeight: '600'
            }}> stunning visuals</span> with unlimited access to Canva Pro.
          </p>

          {/* Call to Action */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '4rem'
          }}>
            <button
              onClick={() => document.getElementById('teams-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                color: 'white',
                padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2.5rem)',
                borderRadius: '50px',
                border: 'none',
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
                e.target.style.background = 'linear-gradient(45deg, #1d4ed8, #1e3a8a)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                e.target.style.background = 'linear-gradient(45deg, #3b82f6, #1e40af)';
              }}
            >
              🌊 Explore Teams Below
            </button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#3b82f6', fontSize: '1.2rem'}}>✓</span>
                <span>100% Free</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#3b82f6', fontSize: '1.2rem'}}>✓</span>
                <span>No Credit Card</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#3b82f6', fontSize: '1.2rem'}}>✓</span>
                <span>Instant Access</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {[
              {number: '100M+', label: 'Premium Assets', icon: '📸'},
              {number: '420K+', label: 'Templates', icon: '🎨'},
              {number: '$120', label: 'Value/Year', icon: '💰'},
              {number: 'FREE', label: 'For You', icon: '🎁', highlight: true}
            ].map((stat, index) => (
              <div key={index} style={{
                background: stat.highlight 
                  ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))'
                  : 'rgba(96, 165, 250, 0.1)',
                padding: '1.5rem 1rem',
                borderRadius: '16px',
                border: stat.highlight 
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid rgba(96, 165, 250, 0.2)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '1.5rem', marginBottom: '0.5rem', filter: 'hue-rotate(200deg)'}}>{stat.icon}</div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: stat.highlight ? '#3b82f6' : '#60a5fa',
                  marginBottom: '0.25rem'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '0.875rem', 
                  color: stat.highlight ? 'rgba(59, 130, 246, 0.9)' : 'rgba(96, 165, 250, 0.8)'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginTop: '5rem'
          }}>
            {[
              {
                icon: <Star size={56} color="#60a5fa" />,
                title: 'Premium Templates',
                description: 'Access 100M+ premium photos, videos, graphics, and professionally designed templates',
                gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.08))',
                border: 'rgba(96, 165, 250, 0.3)'
              },
              {
                icon: <Shield size={56} color="#60a5fa" />,
                title: 'Brand Kit Pro',
                description: 'Maintain consistent branding with custom fonts, colors, and professional guidelines',
                gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.08))',
                border: 'rgba(96, 165, 250, 0.3)'
              },
              {
                icon: <Zap size={56} color="#60a5fa" />,
                title: 'Magic Resize',
                description: 'Instantly resize designs for any platform with AI-powered smart formatting',
                gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.08))',
                border: 'rgba(96, 165, 250, 0.3)'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: feature.gradient,
                padding: '2.5rem',
                borderRadius: '24px',
                textAlign: 'center',
                border: `1px solid ${feature.border}`,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '1rem',
                  display: 'inline-flex',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.4rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#60a5fa'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section id="teams-section" style={{
        padding: 'clamp(3rem, 8vw, 5rem) 1rem', 
        background: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            {/* Section Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              fontWeight: '500',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
              color: '#e2e8f0'
            }}>
              <span style={{fontSize: '1.2rem'}}>🌟</span>
              <span>Available Now</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.75rem, 6vw, 3rem)',
              fontWeight: '800',
              marginBottom: '1.5rem',
              color: '#f8fafc'
            }}>
              Premium Teams
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
              color: '#cbd5e1',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Join one of our exclusive Canva Pro teams and unlock professional design capabilities instantly
            </p>
          </div>

          {loading ? (
            <div style={{textAlign: 'center'}}>
              <div style={{
                border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                margin: '2rem auto',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : teams.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem'}}>
              <Users size={64} color="rgba(255,255,255,0.5)" style={{marginBottom: '1rem'}} />
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem'}}>No Teams Available</h3>
              <p style={{opacity: 0.8}}>Check back later for available Canva Pro teams!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
              gap: 'clamp(1rem, 3vw, 2rem)'
            }}>
              {teams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onJoin={() => handleJoinTeam(team)}
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{padding: '4rem 2rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>What You Get</h2>
            <p style={{fontSize: '1.125rem', opacity: 0.8}}>Premium features worth $120/year - completely free!</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              'Access to 100M+ premium photos, videos, audio, and graphics',
              'Unlimited folders to organize your designs',
              'Remove backgrounds from images with one click',
              'Resize designs instantly with Magic Resize',
              'Upload custom fonts and maintain brand consistency',
              'Create teams and collaborate with others',
              'Download designs in premium formats (PNG, PDF, etc.)',
              'Access to premium animations and effects'
            ].map((benefit, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <CheckCircle size={20} color="#3b82f6" style={{marginTop: '2px', flexShrink: 0}} />
                <span style={{lineHeight: '1.5'}}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <p style={{opacity: 0.6, marginBottom: '1rem'}}>
          This is an independent team invitation platform. We are not affiliated with Canva.
        </p>
      </footer>

      {/* Join Modal */}
      {showJoinModal && selectedTeam && (
        <JoinModal
          team={selectedTeam}
          onClose={() => {
            console.log('Closing modal');
            setShowJoinModal(false);
          }}
          onSuccess={handleJoinSuccess}
        />
      )}
      {console.log('Modal state:', { showJoinModal, selectedTeam: selectedTeam?.name })}
    </div>
  );
};

export default SimpleHomePage;
