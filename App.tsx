
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebase';
import Login from './auth/Login';
import ChatRoom from './chat/ChatRoom';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-800 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-500 font-medium tracking-wide">Initializing CIO Chat Portal...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="antialiased text-slate-900 min-h-screen">
        {user ? <ChatRoom /> : <Login />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
