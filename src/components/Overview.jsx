import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, BookOpen, Clock, Trophy, Star, ArrowRight, Sparkles, Flame, Target, TrendingUp, Award, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Overview() {
    const { user, lastVisited, setMode, stats, achievements, progress, getUserGrade, canSwitchGrades } = useApp();
    const navigate = useNavigate();
    const userGrade = getUserGrade();
    const canSwitch = canSwitchGrades();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleNavigation = (path, mode) => {
        setMode(mode);
        navigate(path);
    };

    return (
        <motion.div
            className="p-6 max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {user?.schoolName && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase mb-2">
                            <Building2 className="w-3 h-3" />
                            {user.schoolName}
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, <span className="text-lantern-red">{user?.displayName || user?.email?.split('@')[0] || 'Student'}</span>! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {userGrade && !canSwitch
                            ? `Ready for your ${userGrade.replace('primary', 'Primary ')} lessons today?`
                            : 'Ready to continue your adventure today?'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                        <div>
                            <p className="text-xs text-orange-400 font-bold uppercase">Streak</p>
                            <p className="text-sm font-bold text-gray-900">{stats?.streak || 0} Days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                            <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Level {stats?.level || 1}</p>
                            <p className="text-sm font-bold text-gray-900">{stats?.points || 0} XP</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Continue Learning Section */}
            <motion.div variants={itemVariants}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-lantern-red" />
                    Continue Learning
                </h2>
                {lastVisited ? (
                    <div
                        onClick={() => navigate(lastVisited.link)}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-lantern-red/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lantern-red/10 text-lantern-red text-xs font-bold uppercase mb-3">
                                    {lastVisited.subjectId || 'Activity'}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-lantern-red transition-colors">
                                    {lastVisited.title}
                                </h3>
                                <p className="text-gray-500 text-sm">{lastVisited.subtitle}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-lantern-red group-hover:text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-lantern-red to-orange-500 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Start your first lesson!</h3>
                            <p className="text-white/80 mb-6 max-w-md">
                                Dive into our interactive curriculum or explore the library. Your adventure begins now.
                            </p>
                            <button
                                onClick={() => handleNavigation('/dashboard/classroom', 'academic')}
                                className="bg-white text-lantern-red px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Go to Class
                            </button>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <Sparkles className="w-64 h-64" />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Daily Goal & Progress Section */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                {/* Daily Goal */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Target className="w-5 h-5 text-lantern-red" />
                            Daily Goal
                        </h3>
                        <span className="text-xs font-bold bg-lantern-red/10 text-lantern-red px-2 py-1 rounded-full">
                            {Math.round((stats?.dailyGoal?.current / stats?.dailyGoal?.target) * 100)}%
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Minutes Learned</span>
                            <span>{stats?.dailyGoal?.current} / {stats?.dailyGoal?.target}m</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-lantern-red rounded-full transition-all duration-500"
                                style={{ width: `${(stats?.dailyGoal?.current / stats?.dailyGoal?.target) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Keep it up! You're doing great.</p>
                    </div>
                </div>

                {/* Subject Progress */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Subject Progress
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-700">Quantitative</span>
                                <span className="text-sm text-gray-500">Ch. {progress?.quantitative || 1}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${((progress?.quantitative || 1) / 20) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-700">Verbal</span>
                                <span className="text-sm text-gray-500">Ch. {progress?.verbal || 1}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${((progress?.verbal || 1) / 20) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                {/* My Class Card */}
                <div
                    onClick={() => handleNavigation('/dashboard/classroom', 'academic')}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-lantern-red/20 transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-lantern-red mb-4 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">My Class</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Master Quantitative and Verbal Reasoning. Track your progress and earn badges.
                    </p>
                    <span className="text-lantern-red font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Go to Class <ArrowRight className="w-4 h-4" />
                    </span>
                </div>

                {/* The Library Card */}
                <div
                    onClick={() => handleNavigation('/dashboard/library', 'leisure')}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-lantern-yellow/20 transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Library</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Explore hundreds of storybooks and educational resources. Read for fun!
                    </p>
                    <span className="text-yellow-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Visit Library <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </motion.div>

            {/* Stats / Badges Preview */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Your Achievements
                    </h2>
                    <button className="text-sm text-gray-400 hover:text-gray-600">View All</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {achievements?.map((badge) => (
                        <div key={badge.id} className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[80px]">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${badge.unlocked
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-500 shadow-sm'
                                : 'bg-gray-50 border-gray-100 text-gray-300 grayscale'
                                }`}>
                                <Star className={`w-8 h-8 ${badge.unlocked ? 'fill-current' : ''}`} />
                            </div>
                            <span className={`text-xs font-medium text-center ${badge.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                                {badge.name}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
