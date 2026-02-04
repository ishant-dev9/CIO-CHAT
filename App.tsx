import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, getMissingEnvVars } from "./firebase/firebase";
import Login from "./auth/Login";
import ChatRoom from "./chat/ChatRoom";
import { ErrorBoundary } from "./components/ErrorBoundary";

/* =======================
   Preview / Safe Mode UI
======================= */
const PreviewMode: React.FC = () => {
  const missingVars = getMissingEnvVars();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
            <span className="text-3xl">🔌</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            CIO Chat Portal
          </h1>
          <p className="text-slate-400">Configuration Required</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-left">
          <p className="text-slate-300 text-sm mb-4">
            The app is running in{" "}
            <span className="text-amber-400 font-mono">Preview Mode</span>.
            Configure Firebase environment variables to enable live chat:
          </p>

          <ul className="space-y-2 mb-6">
            {[
              "VITE_FIREBASE_API_KEY",
              "VITE_FIREBASE_PROJECT_ID",
              "VITE_FIREBASE_AUTH_DOMAIN",
            ].map((v) => {
              const missing = missingVars.includes(v);
              return (
                <li
                  key={v}
                  className={`text-xs font-mono ${
                    missing ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {missing ? "✖" : "✔"} {v}
                </li>
              );
            })}
          </ul>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400">
              Add these in <b>Vercel → Settings → Environment Variables</b> and
              redeploy.
            </p>
          </div>
        </div>

        <p className="mt-8 text-slate-600 text-[10px] uppercase">
          © CIO Executive Network Shared Room
        </p>
      </div>
    </div>
  );
};

/* =======================
   Main App Logic
======================= */
const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔑 compute validity at RUNTIME
  const hasFirebase =
    !!auth &&
    getMissingEnvVars().length === 0;

  useEffect(() => {
    if (!hasFirebase || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hasFirebase]);

  if (!hasFirebase) {
    return <PreviewMode />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        <p className="mt-6 text-slate-500">
          Initializing CIO Chat Portal…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased text-slate-900">
      {user ? <ChatRoom /> : <Login />}
    </div>
  );
};

/* =======================
   Root App
======================= */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
