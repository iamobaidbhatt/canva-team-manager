import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Settings,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const SimpleAdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [teamsRes, statsRes] = await Promise.all([
        axios.get('/api/admin/teams', config),
        axios.get('/api/admin/stats', config)
      ]);

      setTeams(teamsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Team deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete team');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#f9fafb'}}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{
              background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              padding: '0.5rem',
              borderRadius: '8px'
            }}>
              <Settings size={24} color="white" />
            </div>
            <div>
              <h1 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0}}>
                Admin Dashboard
              </h1>
              <p style={{fontSize: '0.875rem', color: '#6b7280', margin: 0}}>
                Manage Canva Pro teams
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button
              onClick={() => setShowSettingsModal(true)}
              style={{
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              <ExternalLink size={20} />
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0}}>
                  Total Teams
                </p>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0'}}>
                  {stats.total_teams || 0}
                </p>
              </div>
              <Users size={32} color="#3b82f6" />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0}}>
                  Active Teams
                </p>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: '0.25rem 0 0 0'}}>
                  {stats.active_teams || 0}
                </p>
              </div>
              <Users size={32} color="#059669" />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0}}>
                  Total Joins
                </p>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: '0.25rem 0 0 0'}}>
                  {stats.total_joins || 0}
                </p>
              </div>
              <Users size={32} color="#7c3aed" />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0}}>
                  Unique Users
                </p>
                <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#ea580c', margin: '0.25rem 0 0 0'}}>
                  {stats.unique_users || 0}
                </p>
              </div>
              <Users size={32} color="#ea580c" />
            </div>
          </div>
        </div>

        {/* Teams Management */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0}}>
              Teams
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '500'
              }}
            >
              <Plus size={16} />
              <span>Add Team</span>
            </button>
          </div>
          
          <div style={{padding: '1.5rem'}}>
            {teams.length === 0 ? (
              <div style={{textAlign: 'center', padding: '2rem'}}>
                <Users size={48} color="#9ca3af" style={{marginBottom: '1rem'}} />
                <p style={{color: '#6b7280', margin: 0}}>No teams created yet</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    marginTop: '0.5rem',
                    color: '#8b5cf6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Create your first team
                </button>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {teams.map((team) => (
                  <TeamRow 
                    key={team.id} 
                    team={team} 
                    onEdit={setEditingTeam}
                    onDelete={handleDeleteTeam}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <TeamModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}
      
      {editingTeam && (
        <TeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onSuccess={() => {
            setEditingTeam(null);
            fetchData();
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};

// Team Row Component
const TeamRow = ({ team, onEdit, onDelete }) => {
  const [showLink, setShowLink] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(team.invite_link);
    toast.success('Invite link copied!');
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem'
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
            <h3 style={{fontWeight: '500', color: '#111827', margin: 0, fontSize: '1rem'}}>
              {team.name}
            </h3>
            <span style={{
              padding: '0.125rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '9999px',
              backgroundColor: team.is_active ? '#dbeafe' : '#fee2e2',
              color: team.is_active ? '#1e40af' : '#991b1b'
            }}>
              {team.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {team.description && (
            <p style={{fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0'}}>
              {team.description}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <span>{team.current_members} / {team.max_members} members</span>
            <span>{team.actual_joins || 0} actual joins</span>
            <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
          </div>

          {/* Invite Link */}
          <div style={{marginTop: '0.5rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <button
                onClick={() => setShowLink(!showLink)}
                style={{
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showLink ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showLink ? 'Hide Link' : 'Show Link'}</span>
              </button>
              
              {showLink && (
                <>
                  <button
                    onClick={copyLink}
                    style={{
                      color: '#8b5cf6',
                      fontSize: '0.875rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Copy
                  </button>
                  <a
                    href={team.invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#059669',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Test</span>
                    <ExternalLink size={12} />
                  </a>
                </>
              )}
            </div>
            
            {showLink && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: '#6b7280',
                wordBreak: 'break-all'
              }}>
                {team.invite_link}
              </div>
            )}
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <button
            onClick={() => onEdit(team)}
            style={{
              padding: '0.5rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(team.id)}
            style={{
              padding: '0.5rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Team Modal Component
const TeamModal = ({ team, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
    invite_link: team?.invite_link || '',
    max_members: team?.max_members || 50,
    is_active: team?.is_active !== undefined ? team.is_active : true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (team) {
        await axios.put(`/api/admin/teams/${team.id}`, formData, config);
        toast.success('Team updated successfully');
      } else {
        await axios.post('/api/admin/teams', formData, config);
        toast.success('Team created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0}}>
            {team ? 'Edit Team' : 'Create New Team'}
          </h2>
          <button
            onClick={onClose}
            style={{
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Team Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              placeholder="e.g., Design Team Alpha"
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Brief description of the team..."
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Canva Invite Link *
            </label>
            <input
              type="url"
              name="invite_link"
              value={formData.invite_link}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              placeholder="https://www.canva.com/brand/join?token=..."
            />
            <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', margin: '0.25rem 0 0 0'}}>
              Get this link from Canva Pro team settings
            </p>
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Max Members
            </label>
            <input
              type="number"
              name="max_members"
              value={formData.max_members}
              onChange={handleChange}
              min="1"
              max="100"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{width: '1rem', height: '1rem'}}
              />
              <span style={{fontSize: '0.875rem', color: '#374151'}}>
                Team is active and accepting new members
              </span>
            </label>
          </div>

          <div style={{display: 'flex', gap: '0.75rem'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: loading ? '#9ca3af' : 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {loading ? 'Saving...' : (team ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const updateData = {
        currentPassword: formData.currentPassword,
        newUsername: formData.newUsername || undefined,
        newPassword: formData.newPassword || undefined
      };

      await axios.put('/api/admin/settings', updateData, config);
      toast.success('Settings updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0}}>
            Admin Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Current Password *
            </label>
            <div style={{position: 'relative'}}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '3rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              New Username
            </label>
            <input
              type="text"
              name="newUsername"
              value={formData.newUsername}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              placeholder="Leave empty to keep current username"
            />
          </div>

          <div style={{marginBottom: '1rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              New Password
            </label>
            <div style={{position: 'relative'}}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '3rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Leave empty to keep current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', margin: '0.25rem 0 0 0'}}>
              Minimum 6 characters
            </p>
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Confirm New Password
            </label>
            <div style={{position: 'relative'}}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '3rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{display: 'flex', gap: '0.75rem'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: loading ? '#9ca3af' : 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {loading ? 'Updating...' : 'Update Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;
