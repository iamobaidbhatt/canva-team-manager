import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  BarChart3, 
  Settings,
  Eye,
  EyeOff,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({});
  const [recentJoins, setRecentJoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [teamsRes, statsRes, joinsRes] = await Promise.all([
        axios.get('/api/admin/teams', config),
        axios.get('/api/admin/stats', config),
        axios.get('/api/admin/recent-joins', config)
      ]);

      setTeams(teamsRes.data);
      setStats(statsRes.data);
      setRecentJoins(joinsRes.data);
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
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage Canva Pro teams</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_teams || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teams</p>
                <p className="text-3xl font-bold text-blue-600">{stats.active_teams || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Joins</p>
                <p className="text-3xl font-bold text-purple-600">{stats.total_joins || 0}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-3xl font-bold text-orange-600">{stats.unique_users || 0}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teams Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Teams</h2>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Team</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {teams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No teams created yet</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Create your first team
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
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

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Joins</h2>
              </div>
              
              <div className="p-6">
                {recentJoins.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {recentJoins.slice(0, 10).map((join, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {join.email || 'Anonymous'}
                          </p>
                          <p className="text-gray-500">{join.team_name}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(join.joined_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="font-medium text-gray-900">{team.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              team.is_active 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {team.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {team.description && (
            <p className="text-sm text-gray-500 mt-1">{team.description}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>{team.current_members} / {team.max_members} members</span>
            <span>{team.actual_joins || 0} actual joins</span>
            <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
          </div>

          {/* Invite Link */}
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLink(!showLink)}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                {showLink ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showLink ? 'Hide Link' : 'Show Link'}</span>
              </button>
              
              {showLink && (
                <>
                  <button
                    onClick={copyLink}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    Copy
                  </button>
                  <a
                    href={team.invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    <span>Test</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
            
            {showLink && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 break-all">
                {team.invite_link}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(team)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(team.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
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
        // Update existing team
        await axios.put(`/api/admin/teams/${team.id}`, formData, config);
        toast.success('Team updated successfully');
      } else {
        // Create new team
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {team ? 'Edit Team' : 'Create New Team'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Design Team Alpha"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Brief description of the team..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canva Invite Link *
            </label>
            <input
              type="url"
              name="invite_link"
              value={formData.invite_link}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://www.canva.com/brand/join?token=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Get this link from Canva Pro team settings
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Members
            </label>
            <input
              type="number"
              name="max_members"
              value={formData.max_members}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Team is active and accepting new members
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              {loading ? 'Saving...' : (team ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
