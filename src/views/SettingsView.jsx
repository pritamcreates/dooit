import React from 'react';
import { logoutUser } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function SettingsView() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-text-dim">Manage your workspace preferences.</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Profile Section */}
        <section className="p-6 bg-white/[0.015] border border-white/5 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors mb-2">
                Change Avatar
              </button>
              <p className="text-xs text-text-dim">JPEG or PNG under 5MB</p>
            </div>
          </div>
          
          <div className="grid gap-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" defaultValue="Pritam Chhetri" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#F5B800]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">Email</label>
              <input type="email" defaultValue="hello@dooit.com" className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-text-dim opacity-50 cursor-not-allowed" disabled />
            </div>
          </div>
        </section>

        {/* Workspace Preferences */}
        <section className="p-6 bg-white/[0.015] border border-white/5 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <h3 className="font-semibold text-white">Dark Mode</h3>
              <p className="text-sm text-text-dim">Toggle dark/light theme (Coming soon)</p>
            </div>
            <div className="w-12 h-6 bg-[#F5B800] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-semibold text-white">Email Notifications</h3>
              <p className="text-sm text-text-dim">Receive daily summaries</p>
            </div>
            <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-6 bg-red-500/[0.02] border border-red-500/10 rounded-xl">
          <h2 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-xs text-text-dim mb-4">Actions here are immediate and affect your active session.</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-sm rounded-xl transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </section>

      </div>
    </div>
  );
}
