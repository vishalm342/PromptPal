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
    <nav className="bg-black/30 backdrop-blur-lg sticky top-0 z-50 border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold bg-gradient-to-r from-purple-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              PromptPal
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                to="/explore"
                className="text-gray-100 hover:text-orange-300 transition-colors duration-200 px-3 py-2"
              >
                Explore
              </Link>
              
              {/* Show these links only when user is logged in */}
              {currentUser && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-100 hover:text-purple-300 transition-colors duration-200 px-3 py-2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/add-prompt"
                    className="text-gray-100 hover:text-yellow-300 transition-colors duration-200 px-3 py-2"
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
                    className="text-gray-100 hover:text-yellow-300 transition-colors duration-200 px-3 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-purple-500 via-orange-400 to-yellow-400 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:via-orange-500 hover:to-yellow-500 transition-all duration-200 shadow-lg"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">@{currentUser.username}</span>
                    <button
                      onClick={handleLogout}
                      className="text-red-300 hover:text-red-400 transition-colors duration-200"
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
              className="text-gray-100 hover:text-orange-300"
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
        <div className="md:hidden bg-black/60 backdrop-blur-lg border-t border-purple-500/20 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/explore"
              className="block text-gray-100 hover:text-orange-300 px-3 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            
            {/* Show these links only when user is logged in */}
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-100 hover:text-purple-300 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-prompt"
                  className="block text-gray-100 hover:text-yellow-300 px-3 py-2"
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
                  className="block text-gray-100 hover:text-yellow-300 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block text-gray-100 hover:text-orange-300 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <div className="px-3 py-2">
                  <span className="block text-purple-400 mb-2">@{currentUser.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-400"
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
