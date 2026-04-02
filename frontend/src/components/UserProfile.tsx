import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Bell, Shield, Database, LogOut, Camera, Edit2, Save, X, Check, AlertCircle } from 'lucide-react';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';
import { useNotifications } from './NotificationSystem';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  institution?: string;
  bio?: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    autoSave: boolean;
    language: string;
    timezone: string;
  };
}

const UserProfile = () => {
  const { theme, setTheme, themeName } = useSimpleTheme();
  const { addNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  
  // Create color mapping from theme
  const colors = {
    bgCard: theme.surface,
    border: `1px solid ${theme.border}`,
    borderColor: theme.border,
    borderLight: `1px solid ${theme.border}`,
    shadow: '0 2px 8px rgba(0,0,0,0.1)',
    primary: theme.primary,
    bg: theme.background,
    bgSecondary: theme.surface,
    text: theme.text,
    textMuted: theme.textSecondary,
    textSecondary: theme.textSecondary,
    success: '#10b981',
    successHover: '#059669',
    primaryHover: 'rgba(0,0,0,0.1)',
    errorLight: 'rgba(239, 68, 68, 0.1)',
  };
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'User',
    email: 'user@example.com',
    avatar: '',
    institution: '',
    bio: '',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      autoSave: true,
      language: 'en',
      timezone: 'UTC'
    }
  });

  const [editProfile, setEditProfile] = useState<UserProfile>(profile);

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setIsEditing(false);
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.'
    });
  };

  const handleSavePreferences = () => {
    // Save preferences logic here
    addNotification({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Your preferences have been saved successfully.'
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle avatar upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditProfile(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-2 rounded-lg ${colors.bgCard} ${colors.border} ${colors.shadow} hover:scale-105 transition-all`}
      >
        <div className={`w-8 h-8 rounded-full ${colors.primary} flex items-center justify-center text-white font-semibold`}>
          {profile.name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className={`text-sm font-medium ${colors.text}`}>{profile.name}</span>
      </button>

      {/* Profile Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`fixed top-20 right-4 w-96 max-h-[80vh] rounded-2xl ${colors.bgCard} ${colors.border} ${colors.shadow} z-50 overflow-hidden`}
            >
              {/* Header */}
              <div className={`p-6 border-b ${colors.borderLight}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User size={20} className={colors.textSecondary} />
                    <h2 className={`text-xl font-semibold ${colors.text}`}>Profile</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg ${colors.bgSecondary} hover:${colors.bg} transition-colors`}
                  >
                    <X size={18} className={colors.textMuted} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className={`flex border-b ${colors.borderLight}`}>
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'preferences', label: 'Preferences', icon: Settings },
                  { id: 'security', label: 'Security', icon: Shield }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-all ${
                      activeTab === tab.id
                        ? `${colors.primary} text-white`
                        : `${colors.bgSecondary} ${colors.textMuted} hover:${colors.bg} hover:${colors.text}`
                    }`}
                  >
                    <tab.icon size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-full ${colors.bgCard} ${colors.border} border-2 flex items-center justify-center`}>
                          {editProfile.avatar ? (
                            <img src={editProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User size={32} className={colors.textMuted} />
                          )}
                        </div>
                        <button
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          className={`absolute bottom-0 right-0 w-6 h-6 ${colors.primary} rounded-full flex items-center justify-center text-white ${colors.shadow} hover:scale-110 transition-all`}
                        >
                          <Camera size={12} />
                        </button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        {!isEditing ? (
                          <div>
                            <h3 className={`text-lg font-semibold ${colors.text}`}>{profile.name}</h3>
                            <p className={`text-sm ${colors.textMuted}`}>{profile.email}</p>
                            {profile.institution && (
                              <p className={`text-sm ${colors.textSecondary}`}>{profile.institution}</p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editProfile.name}
                              onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                              className={`w-full px-3 py-2 ${colors.bgSecondary} ${colors.border} rounded-lg ${colors.text} outline-none focus:${colors.borderLight}`}
                            />
                            <input
                              type="email"
                              value={editProfile.email}
                              onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                              className={`w-full px-3 py-2 ${colors.bgSecondary} ${colors.border} rounded-lg ${colors.text} outline-none focus:${colors.borderLight}`}
                            />
                            <input
                              type="text"
                              value={editProfile.institution || ''}
                              onChange={(e) => setEditProfile(prev => ({ ...prev, institution: e.target.value }))}
                              placeholder="Institution"
                              className={`w-full px-3 py-2 ${colors.bgSecondary} ${colors.border} rounded-lg ${colors.text} outline-none focus:${colors.borderLight}`}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          isEditing
                            ? `${colors.success} text-white hover:${colors.successHover}`
                            : `${colors.bgSecondary} ${colors.text} hover:${colors.bg}`
                        }`}
                      >
                        {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
                      </button>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className={`block text-sm font-medium ${colors.text} mb-2`}>Bio</label>
                      {!isEditing ? (
                        <p className={`${colors.textMuted} leading-relaxed`}>{profile.bio}</p>
                      ) : (
                        <textarea
                          value={editProfile.bio || ''}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                          className={`w-full px-3 py-2 ${colors.bgSecondary} ${colors.border} rounded-lg ${colors.text} outline-none focus:${colors.borderLight} resize-none`}
                        />
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${colors.text}`}>Notifications</h3>
                      
                      <label className="flex items-center justify-between">
                        <span className={`${colors.text}`}>Email Notifications</span>
                        <input
                          type="checkbox"
                          checked={editProfile.preferences.emailNotifications}
                          onChange={(e) => setEditProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, emailNotifications: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <span className={`${colors.text}`}>Push Notifications</span>
                        <input
                          type="checkbox"
                          checked={editProfile.preferences.pushNotifications}
                          onChange={(e) => setEditProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, pushNotifications: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <span className={`${colors.text}`}>Auto-save</span>
                        <input
                          type="checkbox"
                          checked={editProfile.preferences.autoSave}
                          onChange={(e) => setEditProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, autoSave: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                      </label>
                    </div>

                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${colors.text}`}>Appearance</h3>
                      
                      <div>
                        <label className={`block text-sm font-medium ${colors.text} mb-2`}>Theme</label>
                        <select
                          value={theme}
                          onChange={(e) => setTheme(e.target.value as any)}
                          className={`w-full px-3 py-2 ${colors.bgSecondary} ${colors.border} rounded-lg ${colors.text} outline-none focus:${colors.borderLight}`}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="blue">Ocean Blue</option>
                          <option value="purple">Royal Purple</option>
                          <option value="green">Forest Green</option>
                          <option value="orange">Sunset Orange</option>
                          <option value="pink">Rose Pink</option>
                          <option value="teal">Ocean Teal</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleSavePreferences}
                      className={`w-full px-4 py-3 ${colors.primary} text-white rounded-lg font-medium hover:${colors.primaryHover} transition-all flex items-center justify-center gap-2`}
                    >
                      <Save size={16} />
                      Save Preferences
                    </button>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${colors.text}`}>Security Settings</h3>
                      
                      <button className={`w-full text-left p-4 ${colors.bgSecondary} ${colors.border} rounded-lg hover:${colors.bg} transition-all flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <Database className={colors.textMuted} size={20} />
                          <div>
                            <p className={`font-medium ${colors.text}`}>Export Data</p>
                            <p className={`text-sm ${colors.textMuted}`}>Download all your research data</p>
                          </div>
                        </div>
                        <AlertCircle className={colors.textMuted} size={16} />
                      </button>

                      <button className={`w-full text-left p-4 ${colors.errorLight} ${colors.borderLight} rounded-lg hover:${colors.bg} transition-all flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <LogOut className="text-red-600" size={20} />
                          <div>
                            <p className={`font-medium ${colors.text}`}>Sign Out</p>
                            <p className={`text-sm ${colors.textMuted}`}>Sign out of your account</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
