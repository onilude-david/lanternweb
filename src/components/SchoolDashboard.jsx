import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Building2, Users, GraduationCap, TrendingUp, BookOpen, Award, BarChart3, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function SchoolDashboard() {
    const { user } = useApp();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        avgCompletion: 0,
        activeToday: 0
    });
    const [gradeDistribution, setGradeDistribution] = useState([]);
    const [topPerformers, setTopPerformers] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchoolData = async () => {
            if (!user?.schoolId) {
                setLoading(false);
                return;
            }

            try {
                // Fetch all users in this school
                const q = query(
                    collection(db, "users"),
                    where("schoolId", "==", user.schoolId)
                );

                const querySnapshot = await getDocs(q);
                let students = [];
                let teachers = [];
                let activeCount = 0;
                const today = new Date().toDateString();

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.role === 'student') {
                        students.push({ id: doc.id, ...userData });
                    } else if (userData.role === 'teacher') {
                        teachers.push(userData);
                    }

                    // Check active today
                    if (userData.lastLogin === today) {
                        activeCount++;
                    }
                });

                setAllStudents(students);

                // Calculate Grade Distribution
                const gradeCounts = {};
                students.forEach(s => {
                    const grade = s.grade || 'Unknown';
                    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
                });

                const dist = Object.keys(gradeCounts).map(grade => ({
                    grade: grade.replace('primary', 'Primary '),
                    students: gradeCounts[grade],
                    color: 'bg-blue-500' // Simplified color logic
                }));
                setGradeDistribution(dist);

                // Calculate Top Performers
                const performers = students
                    .map(s => ({
                        name: s.displayName || s.email.split('@')[0],
                        grade: s.grade ? s.grade.replace('primary', 'Primary ') : 'N/A',
                        progress: s.progress ? Math.round(((s.progress.quantitative || 0) + (s.progress.verbal || 0)) / 2) : 0
                    }))
                    .sort((a, b) => b.progress - a.progress)
                    .slice(0, 3);
                setTopPerformers(performers);

                setStats({
                    totalStudents: students.length,
                    totalTeachers: teachers.length,
                    avgCompletion: 0, // Placeholder
                    activeToday: activeCount
                });

            } catch (error) {
                console.error("Error fetching school data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolData();
    }, [user?.schoolId]);

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

    // Use stats state instead of mock object
    const schoolStats = stats;

    return (
        <motion.div
            className="p-6 max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8 text-lantern-red" />
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {user?.schoolName || 'School Dashboard'}
                    </h1>
                </div>
                <p className="text-gray-500">Overview of school-wide performance and analytics</p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Total Students</span>
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{schoolStats.totalStudents}</p>
                    <p className="text-xs text-green-600 mt-1">↑ 5% from last term</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Teachers</span>
                        <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{schoolStats.totalTeachers}</p>
                    <p className="text-xs text-gray-400 mt-1">Across all grades</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Avg Completion</span>
                        <Award className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{schoolStats.avgCompletion}%</p>
                    <p className="text-xs text-green-600 mt-1">↑ 3% this month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Active Today</span>
                        <TrendingUp className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{schoolStats.activeToday}</p>
                    <p className="text-xs text-gray-400 mt-1">{Math.round((schoolStats.activeToday / schoolStats.totalStudents) * 100)}% of students</p>
                </div>
            </motion.div>

            {/* Grade Distribution */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-lantern-red" />
                        Student Distribution by Grade
                    </h2>
                </div>

                <div className="space-y-4">
                    {gradeDistribution.map((item, index) => {
                        const maxStudents = Math.max(...gradeDistribution.map(g => g.students));
                        const percentage = (item.students / maxStudents) * 100;

                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">{item.grade}</span>
                                    <span className="text-gray-500">{item.students} students</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Top Performers & Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Performers */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Top Performers This Month
                    </h2>

                    <div className="space-y-3">
                        {topPerformers.map((student, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.grade}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">{student.progress}%</p>
                                    <p className="text-xs text-gray-400">Complete</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <div
                        onClick={() => navigate('/dashboard/teacher')}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition-transform">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Teachers</h3>
                                <p className="text-sm text-gray-500">View and manage all teaching staff</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/dashboard/classroom')}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Curriculum Access</h3>
                                <p className="text-sm text-gray-500">Browse all course content</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Full Student Directory */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Student Directory
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Grade</th>
                                <th className="px-6 py-4">Progress</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allStudents.length > 0 ? (
                                allStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {student.displayName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {student.grade ? student.grade.replace('primary', 'Primary ') : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {student.progress ? Math.round(((student.progress.quantitative || 0) + (student.progress.verbal || 0)) / 2) : 0}%
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date().toLocaleDateString()} {/* Placeholder for joined date */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}
