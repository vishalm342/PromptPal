import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[rgba(10,10,15,0.9)] backdrop-blur-lg sticky top-0 z-50 border-b border-[#FFD700]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-xl font-bold hover:opacity-80 transition-all duration-300"
            >
              <img 
                src="/logo.png" 
                alt="PromptPal Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <span className="text-white">Prompt</span>
                <span className="text-[#FFD700]">Pal</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                to="/explore"
                className="text-gray-100 hover:text-[#FFD700] transition-colors duration-300 px-3 py-2 hover:bg-[#FFD700]/10 rounded-md"
              >
                Explore
              </Link>
              
              {/* Show these links only when user is logged in */}
              {currentUser && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-100 hover:text-[#FFD700] transition-colors duration-300 px-3 py-2 hover:bg-[#FFD700]/10 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/add-prompt"
                    className="text-gray-100 hover:text-[#FFD700] transition-colors duration-300 px-3 py-2 hover:bg-[#FFD700]/10 rounded-md"
                  >
                    Create Prompt
                  </Link>
                </>
              )}

              {/* Show these links only when user is not logged in */}
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-100 hover:text-[#FFD700] transition-colors duration-300 px-3 py-2 hover:bg-[#FFD700]/10 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#FFD700] text-black px-6 py-2 rounded-md hover:bg-[#FFC700] transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50 transform hover:scale-105 font-semibold"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <span className="text-[#FFD700] mr-3 font-medium">@{currentUser.username}</span>
                    <button
                      onClick={handleLogout}
                      className="text-red-300 hover:text-red-400 transition-colors duration-300 px-3 py-1 hover:bg-red-500/10 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-100 hover:text-[#FFD700] transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[rgba(10,10,15,0.95)] backdrop-blur-lg border-t border-[#FFD700]/30 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/explore"
              className="block text-gray-100 hover:text-[#FFD700] px-3 py-2 hover:bg-[#FFD700]/10 rounded-md transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            
            {/* Show these links only when user is logged in */}
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-100 hover:text-[#FFD700] px-3 py-2 hover:bg-[#FFD700]/10 rounded-md transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-prompt"
                  className="block text-gray-100 hover:text-[#FFD700] px-3 py-2 hover:bg-[#FFD700]/10 rounded-md transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Prompt
                </Link>
              </>
            )}

            {/* Show these links only when user is not logged in */}
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="block text-gray-100 hover:text-[#FFD700] px-3 py-2 hover:bg-[#FFD700]/10 rounded-md transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-gray-100 hover:text-[#FFD700] px-3 py-2 hover:bg-[#FFD700]/10 rounded-md transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <div className="px-3 py-2">
                  <span className="block text-[#FFD700] mb-2 font-medium">@{currentUser.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
