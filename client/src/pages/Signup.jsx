import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const validate = () => {
    const errors = {};
    
    if (!formData.username) errors.username = 'Username is required';
    else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Email is invalid';
    
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validate();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const result = await register(formData.username, formData.email, formData.password);
        if (result.success) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Registration error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-purple-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Create an Account
            </h1>
            <p className="text-gray-300 mt-2">Join PromptPal to create and share AI prompts</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-900 border ${
                  formErrors.username ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                placeholder="Choose a username"
              />
              {formErrors.username && (
                <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-900 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                placeholder="your.email@example.com"
              />
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-900 border ${
                  formErrors.password ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                placeholder="••••••••"
              />
              {formErrors.password && (
                <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-900 border ${
                  formErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white`}
                placeholder="••••••••"
              />
              {formErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 via-orange-400 to-yellow-400 text-white py-2 px-4 rounded-md font-medium hover:from-purple-600 hover:via-orange-500 hover:to-yellow-500 transition-all duration-200 shadow-lg flex justify-center"
            >
              {isSubmitting ? (
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Signup;
