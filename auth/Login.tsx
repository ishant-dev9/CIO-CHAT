
import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Authentication service is unavailable.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: username || email.split('@')[0],
        });
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = "An error occurred during authentication.";
      if (err.code === 'auth/user-not-found') message = "Account not found.";
      if (err.code === 'auth/wrong-password') message = "Incorrect password.";
      if (err.code === 'auth/email-already-in-use') message = "Email already registered.";
      if (err.code === 'auth/invalid-email') message = "Invalid email format.";
      if (err.code === 'auth/weak-password') message = "Password is too weak.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 text-white rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-comments-dollar text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">CIO Chat</h1>
          <p className="text-slate-500 mt-2">Executive Network Shared Room</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex mb-8 border-b border-slate-100">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${isLogin ? 'text-slate-900 border-b-2 border-slate-800' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold transition-colors ${!isLogin ? 'text-slate-900 border-b-2 border-slate-800' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                placeholder="email@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                <i className="fas fa-circle-exclamation mr-2"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white transition-all shadow-md ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 active:scale-[0.98]'}`}
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                isLogin ? 'Access Portal' : 'Create Account'
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          By continuing, you agree to the Executive Professional Terms.
        </p>
      </div>
    </div>
  );
};

export default Login;
