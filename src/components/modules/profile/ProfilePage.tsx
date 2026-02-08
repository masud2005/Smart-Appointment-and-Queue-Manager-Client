import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    Loader2, Lock, Trash2, AlertCircle, LogOut, User, Mail,
    CheckCircle2, Key, Settings, Sparkles, X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { useNavigate } from 'react-router';
import { logout, setCredentials } from '@/features/auth/authSlice';
import {
    useChangePasswordMutation,
    useDeleteProfileMutation,
    useGetCurrentUserQuery,
    useUpdateProfileMutation
} from '@/api/auth.api';
import { Button } from '@/components/ui/button';

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
                email: profileData.data.email || '',
            });
        }
    }, [profileData]);

    // Auto-dismiss messages
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        if (profileSuccess || profileError) {
            timers.push(setTimeout(() => {
                setProfileSuccess(null);
                setProfileError(null);
            }, 5000));
        }
        if (passwordSuccess || passwordError) {
            timers.push(setTimeout(() => {
                setPasswordSuccess(null);
                setPasswordError(null);
            }, 5000));
        }
        if (deleteSuccess || deleteError) {
            timers.push(setTimeout(() => {
                setDeleteSuccess(null);
                setDeleteError(null);
            }, 5000));
        }
        return () => timers.forEach(clearTimeout);
    }, [profileSuccess, profileError, passwordSuccess, passwordError, deleteSuccess, deleteError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
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
            const response = await updateProfile({ name: formData.name.trim() }).unwrap();
            if (response?.data) {
                dispatch(setCredentials({ user: response.data }));
                setProfileSuccess('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (err: any) {
            setProfileError(err?.data?.message || 'Failed to update profile');
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
            setPasswordSuccess('Password changed successfully');
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setPasswordError(err?.data?.message || 'Failed to change password');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProfile().unwrap();
            setDeleteSuccess('Account permanently deleted');
            dispatch(logout());
            navigate('/login', { replace: true });
        } catch (err: any) {
            setDeleteError(err?.data?.message || 'Failed to delete account');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
            {/* Background animation - consistent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
                <motion.div
                    animate={{ x: [0, 120, 0], y: [0, -120, 0], scale: [1, 1.25, 1] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 140, 0], scale: [1, 1.35, 1] }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[160px]"
                />
            </div>

            <div className="relative z-10 min-h-screen p-6 lg:p-10">
                <div className="space-y-10">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='flex justify-between items-center flex-wrap'
                    >
                        <div>
                            <h1 className="text-4xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                                    <Sparkles className="h-8 w-8 text-cyan-400" />
                                </div>
                                Profile Settings
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm text-left">Manage your personal details, security, and account preferences</p>
                        </div>

                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm mb-5">
                            <Sparkles className="h-5 w-5 text-cyan-400" />
                            <span className="text-cyan-300 font-medium text-sm tracking-wide">ACCOUNT</span>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-8">

                        {/* Profile Overview Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-4 relative h-fit"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-3xl blur-2xl opacity-70" />
                            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8">
                                <div className="text-center mb-8">
                                    <div className="mx-auto mb-5 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                        <User className="h-12 w-12 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h2>
                                    <p className="text-slate-400 flex items-center justify-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {user?.email}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                                        <span className="text-slate-300">Status</span>
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-300 text-sm">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Active
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                                        <span className="text-slate-300">Email Verified</span>
                                        {user?.isVerified ? (
                                            <span className="text-emerald-400 font-medium">Verified</span>
                                        ) : (
                                            <span className="text-amber-400 font-medium">Pending</span>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full py-6 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content - Edit & Password */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="lg:col-span-8 space-y-8"
                        >
                            {/* Personal Information */}
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-3xl blur-2xl opacity-60" />
                                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <User className="h-6 w-6 text-cyan-400" />
                                            Personal Information
                                        </h3>
                                        {!isEditing && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsEditing(true)}
                                                className="text-cyan-400 hover:bg-cyan-950/40"
                                            >
                                                <Settings className="h-5 w-5" />
                                            </Button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {(profileError || profileSuccess) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm ${profileError
                                                    ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                                                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                                                    }`}
                                            >
                                                {profileError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                                {profileError || profileSuccess}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!isEditing ? (
                                        <div className="space-y-6 text-left">
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Full Name</label>
                                                <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl px-5 py-3.5 text-white">
                                                    {user?.name || '—'}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-slate-400">Email Address</label>
                                                <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-700/60 rounded-xl px-5 py-3.5 text-white">
                                                    <Mail className="h-5 w-5 text-slate-500" />
                                                    {user?.email || '—'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdate} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Email Address</label>
                                                <input
                                                    type="email"
                                                    disabled
                                                    value={formData.email}
                                                    className="w-full px-5 py-3.5 bg-slate-900/40 border border-slate-700/40 rounded-xl text-slate-400 cursor-not-allowed"
                                                />
                                                <p className="text-xs text-slate-500 mt-1.5">Email cannot be changed</p>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={isUpdatingProfile}
                                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-6 rounded-xl shadow-lg hover:shadow-cyan-500/30"
                                                >
                                                    {isUpdatingProfile ? (
                                                        <span className="flex items-center gap-2">
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            Saving...
                                                        </span>
                                                    ) : 'Save Changes'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-8 py-6 border-slate-700 hover:bg-slate-800"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-60" />
                                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Key className="h-6 w-6 text-cyan-400" />
                                            Change Password
                                        </h3>
                                        {!isChangingPassword && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsChangingPassword(true)}
                                                className="text-cyan-400 hover:bg-cyan-950/40"
                                            >
                                                <Lock className="h-5 w-5" />
                                            </Button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {(passwordError || passwordSuccess) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm ${passwordError
                                                    ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                                                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                                                    }`}
                                            >
                                                {passwordError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                                {passwordError || passwordSuccess}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!isChangingPassword ? (
                                        <div className="space-y-6">
                                            <p className="text-slate-400 text-left">
                                                We recommend changing your password regularly to keep your account secure.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="w-full py-6 border-cyan-500/40 hover:bg-cyan-950/40 text-cyan-300 hover:text-white"
                                                onClick={() => setIsChangingPassword(true)}
                                            >
                                                Change Password
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdatePassword} className="space-y-6 text-left">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Current Password</label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                />
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">New Password</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-5 py-3.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-400">Minimum 8 characters • Use a strong password</p>

                                            <div className="flex gap-4 pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={isChangingPasswordApi}
                                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-6 rounded-xl shadow-lg hover:shadow-cyan-500/30"
                                                >
                                                    {isChangingPasswordApi ? (
                                                        <span className="flex items-center gap-2">
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            Updating...
                                                        </span>
                                                    ) : 'Update Password'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsChangingPassword(false)}
                                                    className="px-8 py-6 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Danger Zone */}
                    {!isEditing && !isChangingPassword && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-br from-red-600/10 to-rose-600/10 rounded-3xl blur-3xl opacity-50" />
                            <div className="relative bg-gradient-to-br from-slate-900/95 to-black/90 backdrop-blur-2xl border border-red-900/40 rounded-3xl shadow-2xl p-8">
                                <h3 className="text-2xl font-bold text-red-400 flex items-center gap-3 mb-6">
                                    <AlertCircle className="h-6 w-6" />
                                    Danger Zone
                                </h3>

                                <p className="text-slate-300 mb-8 leading-relaxed text-left">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>

                                <AnimatePresence>
                                    {(deleteError || deleteSuccess) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 text-sm ${deleteError
                                                ? 'bg-red-500/15 border border-red-500/40 text-red-300'
                                                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                                                }`}
                                        >
                                            {deleteError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                                            {deleteError || deleteSuccess}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {showDeleteConfirm ? (
                                    <div className="space-y-6">
                                        <p className="text-red-300 font-medium">
                                            Are you 100% sure? This will delete everything permanently.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Button
                                                onClick={handleDelete}
                                                disabled={isDeletingProfile}
                                                className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 py-6 rounded-xl shadow-lg hover:shadow-red-500/30"
                                            >
                                                {isDeletingProfile ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Deleting...
                                                    </span>
                                                ) : 'Yes, Delete Account'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex-1 border-red-900/50 hover:bg-red-950/40 text-red-300 hover:text-red-200 py-6"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full py-6 border-red-400/50 hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center justify-center gap-2"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                        Delete My Account
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;