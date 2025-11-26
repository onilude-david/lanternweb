import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, GraduationCap, Building2, Award, Star, Zap, BookOpen, Shield, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import GamifiedProgress from './ui/GamifiedProgress';

export default function Profile() {
    const { user, stats, achievements, progress } = useApp();

    if (!user) return null;

    const role = user.role || 'student';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center text-gray-400 overflow-hidden">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-16 h-16" />
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-lantern-red text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm capitalize">
                        {role}
                    </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-gray-500">
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        {role === 'student' && (
                            <div className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                <span className="capitalize">{user.grade?.replace('primary', 'Primary ')}</span>
                            </div>
                        )}
                        {role === 'school' && (
                            <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{user.schoolName}</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
                            Member since {new Date(user.createdAt?.seconds * 1000 || Date.now()).getFullYear()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Role Specific Content */}
            {role === 'student' && <StudentProfile stats={stats} achievements={achievements} progress={progress} />}
            {role === 'teacher' && <TeacherProfile user={user} />}
            {role === 'school' && <SchoolProfile user={user} />}
        </div>
    );
}

function StudentProfile({ stats, achievements, progress }) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {/* Stats Column */}
            <div className="md:col-span-2 space-y-6">
                {/* Gamification Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                        <div className="w-10 h-10 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-2">
                            <Star className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats?.level || 1}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Level</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                        <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                            <Award className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats?.points || 0}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">XP</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                        <div className="w-10 h-10 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stats?.streak || 0}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Day Streak</div>
                    </div>
                </div>

                {/* Academic Progress */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-lantern-red" />
                        Academic Progress
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Quantitative Reasoning</span>
                                <span className="text-sm text-gray-500">Chapter {progress?.quantitative || 1}</span>
                            </div>
                            <GamifiedProgress value={(progress?.quantitative || 1) * 10} />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Verbal Reasoning</span>
                                <span className="text-sm text-gray-500">Chapter {progress?.verbal || 1}</span>
                            </div>
                            <GamifiedProgress value={(progress?.verbal || 1) * 10} className="[&>div>div]:from-green-400 [&>div>div]:to-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements Column */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    Achievements
                </h3>
                <div className="space-y-4">
                    {achievements?.map((achievement) => (
                        <div key={achievement.id} className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all",
                            achievement.unlocked
                                ? "bg-yellow-50 border-yellow-100"
                                : "bg-gray-50 border-gray-100 opacity-60 grayscale"
                        )}>
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                                achievement.unlocked ? "bg-white shadow-sm" : "bg-gray-200"
                            )}>
                                {achievement.icon === 'star' && '⭐'}
                                {achievement.icon === 'book' && '📚'}
                                {achievement.icon === 'calculator' && '🧮'}
                                {achievement.icon === 'sun' && '☀️'}
                                {achievement.icon === 'moon' && '🌙'}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-gray-900">{achievement.name}</div>
                                <div className="text-xs text-gray-500">{achievement.unlocked ? 'Unlocked' : 'Locked'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TeacherProfile({ user }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    School Information
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">School ID</span>
                        <span className="font-medium">{user.schoolId || 'SCH-001'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Department</span>
                        <span className="font-medium">Primary Education</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium text-green-600 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Active
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-500" />
                    Assigned Classes
                </h3>
                <div className="flex flex-wrap gap-2">
                    {user.assignedClasses?.map((cls) => (
                        <span key={cls} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 uppercase">
                            {cls.replace('-', ' ')}
                        </span>
                    )) || <span className="text-gray-400 italic">No classes assigned</span>}
                </div>
            </div>
        </div>
    );
}

function SchoolProfile({ user }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Subscription Details
                </h3>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mb-4">
                    <div className="text-sm text-purple-600 font-bold uppercase tracking-wider mb-1">Current Plan</div>
                    <div className="text-2xl font-bold text-purple-900">Enterprise Standard</div>
                    <div className="text-sm text-purple-700 mt-1">Valid until Dec 31, 2025</div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Unlimited Student Accounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Advanced Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Priority Support</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    Academic Calendar
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="text-center bg-white p-2 rounded-lg shadow-sm min-w-[60px]">
                            <div className="text-xs text-gray-500 uppercase font-bold">Sep</div>
                            <div className="text-xl font-bold text-gray-900">12</div>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Term 1 Starts</div>
                            <div className="text-xs text-gray-500">2025/2026 Session</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="text-center bg-white p-2 rounded-lg shadow-sm min-w-[60px]">
                            <div className="text-xs text-gray-500 uppercase font-bold">Dec</div>
                            <div className="text-xl font-bold text-gray-900">15</div>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Term 1 Ends</div>
                            <div className="text-xs text-gray-500">Holiday Break</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}
