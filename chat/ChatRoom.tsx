
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  limit 
} from 'firebase/firestore';
import { Message } from '../types';

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = auth?.currentUser;

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Message));
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Smooth scroll to bottom on new message
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !db || isSending) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        uid: user.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSignOut = () => {
    if (auth) auth.signOut();
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-700 flex items-center justify-center rounded-xl">
            <i className="fas fa-briefcase text-xl text-slate-200"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">CIO Shared Room</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Verified Executives Only</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <span>Sign Out</span>
          <i className="fas fa-right-from-bracket"></i>
        </button>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
            <i className="fas fa-comments text-5xl mb-4"></i>
            <p>No messages yet. Be the first to speak.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.uid === user?.uid;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`text-[10px] font-bold text-slate-500 mb-1 mx-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {isMe ? 'YOU' : msg.username.toUpperCase()}
                </div>
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    isMe 
                      ? 'bg-slate-800 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-lg transition-all ${
              !newMessage.trim() || isSending 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-slate-800 hover:bg-slate-900 active:scale-95'
            }`}
          >
            {isSending ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
