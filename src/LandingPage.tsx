import React from 'react';
import { Users, MessageSquare, FolderOpen, Shield, Zap, Lock, ArrowRight, Star, Github, Twitter, Linkedin } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Collabris</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">How it Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Collaborate Smarter,
              <span className="text-blue-600"> Achieve Together</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The comprehensive collaboration platform that brings teams together with real-time messaging, 
              project management, and seamless user authentication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to collaborate effectively, manage projects, and communicate in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600">Create and manage teams with flexible member assignments and role-based access control.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-gray-600">WebSocket-based messaging system with instant communication and file sharing capabilities.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Management</h3>
              <p className="text-gray-600">Complete project lifecycle management with task assignment, progress tracking, and deadline management.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">JWT-based authentication with enterprise-grade security and user management.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Built with modern technologies for optimal performance and scalability.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">Role-based access control and comprehensive security measures to protect your data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Collabris Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your team up and running in minutes with our simple onboarding process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account and set up your organization in just a few clicks.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Invite Your Team</h3>
              <p className="text-gray-600">Add team members and assign roles to get everyone collaborating.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Collaborating</h3>
              <p className="text-gray-600">Create projects, chat in real-time, and watch your productivity soar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience with Collabris.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Collabris has transformed how our team collaborates. The real-time chat feature alone has saved us countless hours in meetings."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">CEO, TechCorp</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The project management features are intuitive and powerful. We've seen a 40% increase in project completion rates since switching."
              </p>
              <div className="flex items-center">
                <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Miller</p>
                  <p className="text-sm text-gray-600">Project Manager, DesignHub</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Security was our top priority, and Collabris delivered. The authentication system is robust and gives us peace of mind."
              </p>
              <div className="flex items-center">
                <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  RJ
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Robert Johnson</p>
                  <p className="text-sm text-gray-600">CTO, SecureNet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Team's Collaboration?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already using Collabris to work smarter and achieve more together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Collabris</h3>
              <p className="text-gray-400">
                The modern collaboration platform for teams that want to achieve more together.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2024 Collabris. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
