import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loader2, Lock, Trash2, AlertCircle, LogOut, User, Mail, CheckCircle2, Key, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { useNavigate } from 'react-router';
import { logout, setCredentials } from '@/features/auth/authSlice';
import { useChangePasswordMutation, useDeleteProfileMutation, useGetCurrentUserQuery, useUpdateProfileMutation } from '@/api/auth.api';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const { data: profileData } = useGetCurrentUserQuery();
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPasswordApi }] = useChangePasswordMutation();
    const [deleteProfile, { isLoading: isDeletingProfile }] = useDeleteProfileMutation();

    useEffect(() => {
        if (profileData?.data) {
            setFormData({
                name: profileData.data.name || '',
                email: profileData.data.email,
            });
        }
    }, [profileData]);

    // Auto-hide success/error messages after 5 seconds
    useEffect(() => {
        if (profileSuccess || profileError) {
            const timer = setTimeout(() => {
                setProfileSuccess(null);
                setProfileError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [profileSuccess, profileError]);

    useEffect(() => {
        if (passwordSuccess || passwordError) {
            const timer = setTimeout(() => {
                setPasswordSuccess(null);
                setPasswordError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [passwordSuccess, passwordError]);

    useEffect(() => {
        if (deleteSuccess || deleteError) {
            const timer = setTimeout(() => {
                setDeleteSuccess(null);
                setDeleteError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [deleteSuccess, deleteError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);

        if (!formData.name.trim()) {
            setProfileError('Name is required');
            return;
        }

        try {
            const response = await updateProfile({ name: formData.name }).unwrap();
            if (response?.data) {
                dispatch(setCredentials({ user: response.data }));
                setProfileSuccess(response.message || 'Profile updated successfully');
                setIsEditing(false);
                setFormData({
                    name: response.data.name || '',
                    email: response.data.email,
                });
            }
        } catch (err: any) {
            const message = err?.data?.message || 'Failed to update profile';
            setProfileError(message);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!passwordData.currentPassword) return setPasswordError('Current password is required');
        if (!passwordData.newPassword) return setPasswordError('New password is required');
        if (passwordData.newPassword !== passwordData.confirmPassword) return setPasswordError('Passwords do not match');
        if (passwordData.newPassword.length < 8) return setPasswordError('Password must be at least 8 characters');

        try {
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            }).unwrap();
            setPasswordSuccess(response.message || 'Password updated successfully');
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            const message = err?.data?.message || 'Failed to update password';
            setPasswordError(message);
        }
    };

    const handleDelete = async () => {
        setDeleteError(null);
        setDeleteSuccess(null);
        try {
            const response = await deleteProfile().unwrap();
            setDeleteSuccess(response.message || 'Account deleted');
            dispatch(logout());
            navigate('/login', { replace: true });
        } catch (err: any) {
            const message = err?.data?.message || 'Failed to delete account';
            setDeleteError(message);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-50/50 p-6 space-y-8 font-sans text-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Settings className="h-7 w-7 text-teal-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
                    </div>
                    <p className="text-slate-600 text-left">Manage your personal information and account security</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Overview */}
                    <motion.div 
                        className="lg:col-span-1 space-y-6"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <motion.div 
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="p-6 text-center border-b border-slate-100">
                                <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-teal-600 text-white shadow-md">
                                    <User className="h-10 w-10" />
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">{user?.name || 'User'}</h2>
                                <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-slate-600">Account Status</span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Active
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-slate-600">Email Verified</span>
                                    {user?.isVerified ? (
                                        <span className="text-sm font-medium text-emerald-600">Verified</span>
                                    ) : (
                                        <span className="text-sm font-medium text-amber-600">Pending Verification</span>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Edit & Password */}
                    <motion.div 
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Profile Edit Card */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7"
                            whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2.5">
                                    <User className="h-5 w-5 text-teal-600" />
                                    Personal Information
                                </h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition-colors"
                                    >
                                        <span className="sr-only">Edit</span>
                                        ✏️
                                    </button>
                                )}
                            </div>

                            {profileError && (
                                <motion.div 
                                    className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-start gap-3"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    {profileError}
                                </motion.div>
                            )}

                            {profileSuccess && (
                                <motion.div 
                                    className="mb-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 flex items-start gap-3"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    {profileSuccess}
                                </motion.div>
                            )}

                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1.5 text-left">Full Name</label>
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 text-left">
                                            {user?.name || '—'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1.5 text-left">Email Address</label>
                                        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">
                                            <Mail className="h-4 w-4 text-slate-500" />
                                            {user?.email || '—'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={formData.email}
                                            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-500 cursor-not-allowed"
                                        />
                                        <p className="mt-1.5 text-xs text-slate-500">Email cannot be changed</p>
                                    </div>

                                    <div className="flex items-center gap-4 pt-3">
                                        <button
                                            type="submit"
                                            disabled={isUpdatingProfile}
                                            className="flex-1 rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isUpdatingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setProfileError(null);
                                            }}
                                            className="flex-1 rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>

                        {/* Password Change Card */}
                        <motion.div 
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7"
                            whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2.5">
                                    <Key className="h-5 w-5 text-teal-600" />
                                    Change Password
                                </h3>
                                {!isChangingPassword && (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition-colors"
                                    >
                                        <Lock className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <div className='mb-3'>
                                {passwordError && (
                                    <motion.div 
                                        className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-start gap-3"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        {passwordError}
                                    </motion.div>
                                )}
                                {passwordSuccess && (
                                    <motion.div 
                                        className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 flex items-start gap-3"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        {passwordSuccess}
                                    </motion.div>
                                )}
                            </div>

                            {!isChangingPassword ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        For security reasons, we recommend updating your password periodically.
                                    </p>
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="w-full rounded-lg border border-teal-600 px-5 py-2.5 font-medium text-teal-600 hover:bg-teal-50 transition"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            ) : (

                                <form onSubmit={handleUpdatePassword} className="space-y-5">


                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-500">Minimum 8 characters required</p>

                                    <div className="flex items-center gap-4 pt-3">
                                        <button
                                            type="submit"
                                            disabled={isChangingPasswordApi}
                                            className="flex-1 rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-700 disabled:opacity-60 transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                                        >
                                            {isChangingPasswordApi && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Update Password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setPasswordError(null);
                                                setPasswordSuccess(null);
                                            }}
                                            className="flex-1 rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Danger Zone - Last Section */}
                {!isEditing && !isChangingPassword && (
                    <motion.div 
                        className="mt-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <motion.div 
                            className="rounded-2xl border border-red-200 bg-red-50/60 p-7"
                            whileHover={{ boxShadow: '0 10px 30px rgba(220,38,38,0.1)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-xl font-semibold text-red-800 flex items-center gap-2.5 mb-3">
                                <AlertCircle className="h-5 w-5" />
                                Danger Zone
                            </h3>
                            <p className="text-sm text-red-700 mb-6 leading-relaxed">
                                Deleting your account is permanent and will remove all your data. This action cannot be undone.
                            </p>

                            {deleteError && (
                                <motion.div 
                                    className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-start gap-3"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    {deleteError}
                                </motion.div>
                            )}
                            {deleteSuccess && (
                                <motion.div 
                                    className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 flex items-start gap-3"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    {deleteSuccess}
                                </motion.div>
                            )}

                            {showDeleteConfirm ? (
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-red-800">
                                        Are you absolutely sure you want to delete your account?
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeletingProfile}
                                            className="flex-1 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-60 transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                                        >
                                            {isDeletingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Yes, Delete My Account
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 rounded-lg border border-red-300 px-5 py-2.5 font-medium text-red-700 hover:bg-red-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full rounded-lg border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 hover:bg-red-100 transition flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Account
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfilePage;