import React, { useState, useEffect } from 'react';
import { Users, Star, Shield, Zap, CheckCircle, ExternalLink, Sparkles, Crown, Rocket } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

import Header from '../components/Header';
import TeamCard from '../components/TeamCard';
import JoinModal from '../components/JoinModal';
// import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

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
    setSelectedTeam(team);
    setShowJoinModal(true);
  };

  const handleJoinSuccess = () => {
    setShowJoinModal(false);
    setSelectedTeam(null);
    fetchTeams(); // Refresh team data
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #1a1a3e 75%, #0f0f23 100%)'
    }}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{position: 'relative', zIndex: 10}}>
        {/* Premium Badge */}
        <div className="flex justify-center pt-8">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 rounded-full px-6 py-2 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">Premium Access Available</span>
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Hero Content */}
            <div className="animate-fadeIn">
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="text-white">Join Our</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">
                  Canva Pro Team
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Unlock premium design features, collaborate with professionals, and create stunning visuals 
                with unlimited access to <span className="text-purple-300 font-semibold">Canva Pro</span>.
              </p>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 animate-glow flex items-center space-x-2">
                  <Rocket className="w-5 h-5 group-hover:animate-pulse" />
                  <span>Explore Teams Below</span>
                </button>
                <div className="text-gray-400 text-sm">
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>100% Free • No Credit Card Required</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-12">
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 animate-fadeIn">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Premium Templates</h3>
                <p className="text-gray-300 leading-relaxed">Access 100M+ premium photos, videos, graphics, and professionally designed templates</p>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-green-400/30 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 animate-fadeIn" style={{animationDelay: '200ms'}}>
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '1s'}}>
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Brand Kit Pro</h3>
                <p className="text-gray-300 leading-relaxed">Maintain consistent branding with custom fonts, colors, and professional brand guidelines</p>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-400/30 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 animate-fadeIn" style={{animationDelay: '400ms'}}>
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-float" style={{animationDelay: '2s'}}>
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Magic Resize</h3>
                <p className="text-gray-300 leading-relaxed">Instantly resize designs for any platform with AI-powered smart formatting</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fadeIn" style={{animationDelay: '600ms'}}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100M+</div>
                <div className="text-gray-400">Premium Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">420K+</div>
                <div className="text-gray-400">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">$120</div>
                <div className="text-gray-400">Value/Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">FREE</div>
                <div className="text-gray-400">For You</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20 relative" style={{position: 'relative', zIndex: 10}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-300 text-sm font-medium">Available Now</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Premium Teams
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join one of our exclusive Canva Pro teams and unlock professional design capabilities instantly
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No Teams Available</h3>
              <p className="text-gray-300">Check back later for available Canva Pro teams!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-20 relative" style={{position: 'relative', zIndex: 10}}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-full px-4 py-2 mb-6">
              <span className="text-green-300 text-sm font-medium">Premium Benefits</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              What You Get
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Premium features worth <span className="text-yellow-400 font-bold">$120/year</span> - completely free!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              'Access to 100M+ premium photos, videos, audio, and graphics',
              'Unlimited folders to organize your designs professionally',
              'Remove backgrounds from images with one-click AI',
              'Resize designs instantly with Magic Resize technology',
              'Upload custom fonts and maintain brand consistency',
              'Create teams and collaborate with other designers',
              'Download designs in premium formats (PNG, PDF, SVG)',
              'Access to premium animations and video effects'
            ].map((benefit, index) => (
              <div key={index} className="group flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-400/30 transition-all duration-300 animate-fadeIn" style={{animationDelay: `${index * 100}ms`}}>
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-gray-200 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border border-yellow-400/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">Total Value</h3>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-4xl font-bold text-yellow-400">$120/year</span>
                <span className="text-2xl text-gray-400 line-through">Regular Price</span>
              </div>
              <div className="text-5xl font-bold text-green-400 mb-2">FREE</div>
              <p className="text-gray-300">When you join our team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              This is an independent team invitation platform. We are not affiliated with Canva.
            </p>
            <a 
              href="/admin/login" 
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Access
            </a>
          </div>
        </div>
      </footer>

      {/* Join Modal */}
      {showJoinModal && selectedTeam && (
        <JoinModal
          team={selectedTeam}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
};

export default HomePage;
