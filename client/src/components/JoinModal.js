import React, { useState } from 'react';
import { X, ExternalLink, Mail, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

// Configure axios base URL and headers
// For Vercel deployment, API calls will be relative to the domain
// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const JoinModal = ({ team, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  
  console.log('JoinModal rendering with team:', team);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Join button clicked, team:', team);

    try {
      console.log('Making request to:', `/api/teams/${team.id}/join`);
      const response = await axios.post(`/api/teams/${team.id}/join`, {
        email: email || undefined
      });
      console.log('Response received:', response.data);

      if (response.data.success) {
        setInviteLink(response.data.inviteLink);
        setJoined(true);
        toast.success(response.data.message);
        onSuccess();
      }
    } catch (error) {
      console.error('Join error:', error);
      if (error.response?.status === 429) {
        toast.error('Too many join attempts. Please try again later.');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to join team. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkipEmail = async () => {
    setLoading(true);
    console.log('Skip email clicked, team:', team);
    try {
      console.log('Making request to:', `/api/teams/${team.id}/join`);
      const response = await axios.post(`/api/teams/${team.id}/join`, {});
      console.log('Response received:', response.data);
      if (response.data.success) {
        setInviteLink(response.data.inviteLink);
        setJoined(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Skip email error:', error);
      if (error.response?.status === 429) {
        toast.error('Too many join attempts. Please try again later.');
      } else {
        toast.error('Failed to get invite link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 9999
    }}>
      <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Join Team</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!joined ? (
          <>
            {/* Team Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">{team.name}</h3>
              </div>
              {team.description && (
                <p className="text-gray-600 text-sm">{team.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {team.current_members} / {team.max_members} members
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Providing your email helps us track usage and prevent spam
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  {loading ? 'Joining...' : 'Join with Email'}
                </button>
                <button
                  type="button"
                  onClick={handleSkipEmail}
                  disabled={loading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Skip Email
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By joining, you agree to use Canva Pro responsibly and follow team guidelines.
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Successfully Joined!
            </h3>
            
            <p className="text-gray-600 mb-6">
              Click the link below to join the Canva Pro team
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 truncate flex-1 mr-2">
                  {inviteLink}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <a
                href={inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Open Canva</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span>Save this link - you'll need it to access the team</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinModal;
