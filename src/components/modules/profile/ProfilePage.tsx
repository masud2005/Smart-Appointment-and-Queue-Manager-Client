import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Edit2, Trash2, AlertCircle, LogOut, User, Mail, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { useNavigate } from 'react-router';
import { logout } from '@/features/auth/authSlice';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        dispatch(logout());
        navigate('/login', { replace: true });
      }, 1000);
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex items-center justify-between"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-teal-600">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and profile information</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 backdrop-blur-sm p-6">
            <div className="text-center mb-6">
              <motion.div
                className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <User className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
            </div>

            {/* Status */}
            <div className="space-y-3 mb-6 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Active
                </motion.div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verified</span>
                {user?.isVerified ? (
                  <span className="text-xs font-bold text-teal-600">✓ Verified</span>
                ) : (
                  <span className="text-xs font-bold text-slate-600">⚠ Pending</span>
                )}
              </div>
            </div>

            <Button 
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 transition-all"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-teal-600">
                {isEditing ? '✏️ Edit Profile' : '👤 Profile Information'}
              </h3>
              {!isEditing && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-teal-100 text-teal-600"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2 mb-4"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start space-x-2 mb-4"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="bg-white/50 border border-slate-200 rounded-lg px-4 py-3">
                    <p className="text-gray-900 font-semibold">{user?.name}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="bg-white/50 border border-slate-200 rounded-lg px-4 py-3 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-teal-600" />
                    <p className="text-gray-900 font-semibold">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-700 mb-4">Change Password (Optional)</h4>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-teal-600 hover:shadow-lg transition-all"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                    }}
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Delete Account */}
            {!isEditing && (
              <div className="border-t mt-6 pt-6">
                <div className="bg-red-50 border-2 border-red-100 rounded-lg p-4">
                  <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone
                  </h4>
                  <p className="text-sm text-red-600 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  
                  {showDeleteConfirm ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-red-700">Are you sure? This action is irreversible!</p>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleDelete}
                          disabled={isLoading}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yes, Delete Account'}
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 text-gray-600"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete Account
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
