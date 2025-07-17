import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PromptProvider } from './contexts/PromptContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import AddPrompt from './pages/AddPrompt';
import EditPrompt from './pages/EditPrompt';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PromptProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-prompt" element={
              <ProtectedRoute>
                <AddPrompt />
              </ProtectedRoute>
            } />
            <Route path="/edit-prompt/:promptId" element={
              <ProtectedRoute>
                <EditPrompt />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          </Routes>
        </PromptProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

