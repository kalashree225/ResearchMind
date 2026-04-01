import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, ArrowRight, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary flex items-center justify-center shadow-lg">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">Research<span className="text-secondary">Mind</span></span>
          </Link>
          <p className="text-text-secondary mt-2">Welcome back! Sign in to continue</p>
        </div>

        {/* Form Card */}
        <div className="glass-panel rounded-3xl p-8 border border-border/50 shadow-2xl">
          <div className="mb-6">
            <button
              onClick={() => {
                localStorage.setItem('demo_mode', 'true');
                navigate('/dashboard');
              }}
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
            >
              Continue to Dashboard <ArrowRight size={18} />
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">Or sign in with</span>
            </div>
          </div>

          <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-200">
                <p className="font-semibold">OAuth Setup Required</p>
                <p className="text-yellow-300/80">Configure credentials in backend settings</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white text-gray-800 rounded-xl font-semibold shadow-lg border border-gray-200 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={20} />
              Google
            </button>
            <button
              onClick={handleGithubLogin}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg border border-gray-700 flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
            >
              <FaGithub size={20} />
              GitHub
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
