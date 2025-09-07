import React, { useState } from 'react';
import { Users, ChevronRight, Crown, Zap, Star } from 'lucide-react';

// Configure axios base URL
// For Vercel deployment, API calls will be relative to the domain
// axios.defaults.baseURL = 'http://localhost:5000';

const TeamCard = ({ team, onJoin, delay = 0 }) => {
  const [loading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [ripples, setRipples] = useState([]);
  const availableSpots = team.max_members - team.current_members;
  const fillPercentage = (team.current_members / team.max_members) * 100;
  const isAlmostFull = fillPercentage > 80;
  const isPopular = team.current_members > 20;

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
    
    console.log('Creating ripple:', newRipple);
    setRipples(prev => {
      const newRipples = [...prev, newRipple];
      console.log('Ripples state updated:', newRipples);
      return newRipples;
    });
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => {
        const filtered = prev.filter(ripple => ripple.id !== newRipple.id);
        console.log('Ripple removed, remaining:', filtered);
        return filtered;
      });
    }, 1000);
  };

  const handleJoinClick = (event) => {
    console.log('🚀 BUTTON CLICKED - STARTING ANIMATIONS!');
    setClicked(true);
    console.log('✅ CLICKED STATE SET TO TRUE!');
    createRipple(event);
    console.log('✅ RIPPLE CREATED!');
    
    // Reset clicked state after animation
    setTimeout(() => {
      setClicked(false);
      console.log('Clicked state reset to false');
    }, 500);
    
    // Call the parent's onJoin function to show Telegram popup
    onJoin();
  };

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        border: '1px solid rgba(255,255,255,0.15)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        marginBottom: '1rem'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
      }}
    >
      {/* Background Gradient Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      }}></div>
      
      {/* Popular Badge */}
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
          animation: 'pulse 2s infinite'
        }}>
          <Star size={12} />
          <span>Popular</span>
        </div>
      )}

      {/* Almost Full Badge */}
      {isAlmostFull && !isPopular && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'linear-gradient(45deg, #ef4444, #ec4899)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
          animation: 'pulse 2s infinite'
        }}>
          <Zap size={12} />
          <span>Almost Full</span>
        </div>
      )}

      <div style={{position: 'relative', zIndex: 10}}>
        {/* Team Header */}
        <div style={{marginBottom: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
            <div style={{
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              padding: '0.5rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}>
              <Crown size={20} color="white" />
            </div>
            <h3 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
              fontWeight: 'bold',
              color: '#f8fafc',
              margin: 0
            }}>
              {team.name}
            </h3>
          </div>
          {team.description && (
            <p style={{
              color: '#cbd5e1',
              lineHeight: '1.6',
              margin: 0,
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
            }}>
              {team.description}
            </p>
          )}
        </div>

        {/* Member Stats */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              flex: '1',
              minWidth: '200px'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #3b82f6, #1e40af)',
                padding: '0.5rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={16} color="white" />
              </div>
              <span style={{
                color: '#e2e8f0',
                fontWeight: '500',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
              }}>
                {team.current_members} / {team.max_members} members
              </span>
            </div>
            <div style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '50px',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              fontWeight: 'bold',
              background: availableSpots > 10 
                ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))'
                : availableSpots > 5 
                  ? 'linear-gradient(45deg, rgba(14, 165, 233, 0.2), rgba(6, 182, 212, 0.1))'
                  : 'linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
              color: availableSpots > 10 ? '#3b82f6' : availableSpots > 5 ? '#0ea5e9' : '#ef4444',
              border: `1px solid ${availableSpots > 10 ? 'rgba(59, 130, 246, 0.4)' : availableSpots > 5 ? 'rgba(14, 165, 233, 0.4)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              {availableSpots} spot{availableSpots !== 1 ? 's' : ''} left
            </div>
          </div>

          {/* Enhanced Progress bar */}
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              borderRadius: '50px',
              transition: 'all 1s ease',
              background: fillPercentage > 80 
                ? 'linear-gradient(90deg, #ef4444, #ec4899)' 
                : fillPercentage > 50 
                  ? 'linear-gradient(90deg, #0ea5e9, #06b6d4)'
                  : 'linear-gradient(90deg, #3b82f6, #1e40af)',
              width: `${fillPercentage}%`,
              boxShadow: fillPercentage > 80 
                ? '0 0 10px rgba(239, 68, 68, 0.5)' 
                : fillPercentage > 50 
                  ? '0 0 10px rgba(14, 165, 233, 0.5)'
                  : '0 0 10px rgba(59, 130, 246, 0.5)'
            }}></div>
          </div>
        </div>

        {/* Enhanced Join button */}
        {console.log('Button state:', { clicked, loading, ripplesCount: ripples.length })}
        <button
          onClick={handleJoinClick}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? 'linear-gradient(45deg, #6b7280, #4b5563)' : (clicked ? 'linear-gradient(45deg, #ff0000, #ff6600)' : 'linear-gradient(45deg, #3b82f6, #06b6d4)'),
            color: 'white',
            fontWeight: 'bold',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: loading ? '0 5px 15px rgba(107, 114, 128, 0.3)' : '0 10px 30px rgba(59, 130, 246, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            opacity: loading ? 0.7 : 1,
            transform: clicked ? 'scale(0.9) rotate(5deg)' : 'scale(1) rotate(0deg)',
            animation: loading ? 'pulse 1.5s ease-in-out infinite' : (clicked ? 'buttonBounce 0.5s ease-out' : 'none')
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.6)';
              e.target.style.background = 'linear-gradient(45deg, #1d4ed8, #0891b2)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
              e.target.style.background = 'linear-gradient(45deg, #3b82f6, #06b6d4)';
            }
          }}
        >
          {/* Ripple Effects */}
          {console.log('Rendering ripples:', ripples.length, 'ripples')}
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 0, 0, 0.8) 0%, rgba(255, 255, 0, 0.6) 50%, rgba(0, 255, 255, 0.3) 100%)',
                transform: 'scale(0)',
                animation: 'ripple 1s ease-out',
                pointerEvents: 'none',
                zIndex: 10,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
              }}
            />
          ))}
          
          {/* Button Content */}
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'relative',
            zIndex: 1
          }}>
            {loading ? '⏳ Getting Link...' : '🌊 Join Team Now'}
            {!loading && <ChevronRight size={20} />}
          </span>
        </button>

        {/* Enhanced Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '0.875rem'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#3b82f6',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{color: '#3b82f6', fontWeight: '500'}}>Available Now</span>
          </div>
          <span style={{color: 'rgba(255,255,255,0.4)'}}>•</span>
            <span style={{color: '#06b6d4', fontWeight: '500'}}>🌊 Instant Access</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
