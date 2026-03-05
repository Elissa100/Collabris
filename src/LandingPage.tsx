import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, FolderOpen, Shield, Zap, Lock, ArrowRight, Star, Github, Twitter, Linkedin, Menu, X, ChevronRight, Globe, Clock, Award, CheckCircle, TrendingUp, BarChart3, Rocket, Sparkles } from 'lucide-react';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900">
      {/* Navigation */}
      <nav className={`relative z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Collabris</h1>
                  <p className="text-xs text-gray-500 font-medium">Enterprise Collaboration</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium relative group">
                How it Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium relative group">
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <button 
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-lg border-t border-gray-200 shadow-xl">
            <div className="px-6 py-6 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2">How it Works</a>
              <a href="#testimonials" className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2">Testimonials</a>
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-8">
              <Rocket className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-700 text-sm font-semibold">Trusted by 10,000+ teams worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block mb-2">Where Great Teams</span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Achieve Extraordinary</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The collaboration platform that brings together intelligent project management, real-time communication, 
              and enterprise-grade security. Built for teams that demand excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center group">
                Start Your Free Trial
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-gray-700 px-10 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center justify-center shadow-lg hover:shadow-xl">
                <Globe className="mr-3 h-5 w-5 text-gray-600" />
                Watch 2-Min Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center group">
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">10K+</div>
                <div className="text-gray-600 font-medium">Active Teams</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">99.9%</div>
                <div className="text-gray-600 font-medium">Uptime SLA</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">2M+</div>
                <div className="text-gray-600 font-medium">Messages Daily</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">24/7</div>
                <div className="text-gray-600 font-medium">Enterprise Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful features that scale with your ambition. Everything you need to collaborate effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Team Management</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Create and manage teams with flexible member assignments, role-based permissions, and departmental organization.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time Chat</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  WebSocket-based messaging with instant communication, file sharing, and persistent conversation history.
                </p>
                <div className="flex items-center text-green-600 font-medium">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FolderOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Project Management</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Complete project lifecycle with task assignment, progress tracking, and deadline management.
                </p>
                <div className="flex items-center text-purple-600 font-medium">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Secure Authentication</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  JWT-based authentication with enterprise-grade security and comprehensive user management.
                </p>
                <div className="flex items-center text-red-600 font-medium">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-yellow-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Optimized for performance with sub-second response times and global CDN distribution.
                </p>
                <div className="flex items-center text-yellow-600 font-medium">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Enterprise Security</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Role-based access control and comprehensive security measures to protect your data.
                </p>
                <div className="flex items-center text-indigo-600 font-medium">
                  <span>Learn more</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple Setup, Powerful Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get your team up and running in minutes with our streamlined onboarding process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your account and set up your organization in just a few clicks. No credit card required.
              </p>
            </div>
            
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-purple-100 rounded-full scale-150 opacity-20"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Invite Your Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Add team members and assign roles to get everyone collaborating effectively.
              </p>
            </div>
            
            <div className="text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-20"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Start Collaborating</h3>
              <p className="text-gray-600 leading-relaxed">
                Create projects, chat in real-time, and watch your productivity soar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what our customers have to say.
            </p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`bg-gradient-to-br ${activeTestimonial === 0 ? 'from-blue-50 to-indigo-50 border-blue-200' : 'from-gray-50 to-white border-gray-200'} p-10 rounded-2xl border transition-all duration-500 relative`}>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                  "Collabris has transformed how our team collaborates. The real-time chat feature alone has saved us countless hours in meetings and improved our project delivery times by 40%."
                </p>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">Jonathan Davis</p>
                    <p className="text-sm text-gray-600">CEO, TechCorp Industries</p>
                  </div>
                </div>
              </div>
              
              <div className={`bg-gradient-to-br ${activeTestimonial === 1 ? 'from-green-50 to-teal-50 border-green-200' : 'from-gray-50 to-white border-gray-200'} p-10 rounded-2xl border transition-all duration-500 relative`}>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                  "The project management features are intuitive and powerful. We've seen a significant increase in team productivity since switching to Collabris."
                </p>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg">
                    SM
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">Sarah Miller</p>
                    <p className="text-sm text-gray-600">Project Manager, DesignHub</p>
                  </div>
                </div>
              </div>
              
              <div className={`bg-gradient-to-br ${activeTestimonial === 2 ? 'from-purple-50 to-pink-50 border-purple-200' : 'from-gray-50 to-white border-gray-200'} p-10 rounded-2xl border transition-all duration-500 relative`}>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                  "Security was our top priority, and Collabris delivered. The authentication system is robust and gives us complete peace of mind."
                </p>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg">
                    RJ
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">Robert Johnson</p>
                    <p className="text-sm text-gray-600">CTO, SecureNet Solutions</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`
        }}></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-8">
            <Sparkles className="h-5 w-5 text-yellow-300 mr-2" />
            <span className="text-white font-semibold">Limited Time: 30-Day Free Trial</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Team's
            <span className="block text-yellow-300">Collaboration?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of teams already using Collabris to work smarter, communicate better, and achieve more together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center group">
              <Rocket className="mr-3 h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
              Start Your Free Trial
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center">
              <Clock className="mr-3 h-5 w-5" />
              Schedule Personal Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors duration-300">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-white font-medium">No Credit Card Required</p>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors duration-300">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-white font-medium">Cancel Anytime</p>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors duration-300">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-white font-medium">24/7 Premium Support</p>
            </div>
            <div className="text-center group">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/30 transition-colors duration-300">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-white font-medium">Enterprise Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Collabris</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                The modern collaboration platform for teams that demand excellence in communication and project management.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Twitter className="h-5 w-5 text-gray-400" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Github className="h-5 w-5 text-gray-400" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Linkedin className="h-5 w-5 text-gray-400" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Status Page</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"><ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />Support Center</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2024 Collabris. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
