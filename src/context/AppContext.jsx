import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { mockUsers } from '../data/mockUsers';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Mode: 'academic' or 'leisure'
    const [mode, setMode] = useState('academic');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // User Progress: Track unlocked chapters for each subject
    // Structure: { 'quantitative': 1, 'verbal': 1 } (Value is the highest unlocked chapter)
    const [progress, setProgress] = useState({
        quantitative: 1,
        verbal: 1
    });

    // Gamification Stats
    const [stats, setStats] = useState({
        streak: 5,
        dailyGoal: { current: 15, target: 30 }, // minutes
        points: 1250,
        level: 5
    });

    // Achievements
    const [achievements, setAchievements] = useState([
        { id: 1, name: "First Steps", icon: "star", unlocked: true },
        { id: 2, name: "Bookworm", icon: "book", unlocked: true },
        { id: 3, name: "Math Whiz", icon: "calculator", unlocked: true },
        { id: 4, name: "Early Bird", icon: "sun", unlocked: false },
        { id: 5, name: "Night Owl", icon: "moon", unlocked: false }
    ]);

    useEffect(() => {
        // Safety timeout in case Firebase hangs
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("Firebase auth timed out");
                setLoading(false);
            }
        }, 2000); // 2 seconds timeout

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            clearTimeout(timeoutId);
            if (firebaseUser) {
                // Fetch user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser(userData);
                        // Sync progress from Firestore if available
                        if (userData.progress) {
                            setProgress(userData.progress);
                        }
                        if (userData.stats) {
                            setStats(userData.stats);
                        }
                    } else {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: 'student',
                            grade: 'primary4'
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Fallback to basic user info
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        role: 'student',
                        grade: 'primary4'
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const toggleMode = () => {
        setMode(prev => prev === 'academic' ? 'leisure' : 'academic');
    };

    const unlockNextChapter = async (subject) => {
        const newProgress = {
            ...progress,
            [subject]: (progress[subject] || 0) + 1
        };
        setProgress(newProgress);

        if (user && user.uid) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    progress: newProgress
                });
            } catch (error) {
                console.error("Error updating progress:", error);
            }
        }
    };

    const [lastVisited, setLastVisited] = useState(null);

    const updateLastVisited = async (gradeId, subjectId, chapterId, title, subtitle, link) => {
        const newLastVisited = {
            gradeId,
            subjectId,
            chapterId,
            title,
            subtitle,
            link,
            timestamp: Date.now()
        };
        setLastVisited(newLastVisited);

        if (user && user.uid) {
            try {
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                    lastVisited: newLastVisited
                }, { merge: true });
            } catch (error) {
                console.error("Error updating last visited:", error);
            }
        }
    };

    const awardPoints = async (amount) => {
        if (!user) return;

        const newPoints = (stats.points || 0) + amount;
        const newLevel = Math.floor(newPoints / 1000) + 1; // Simple level formula: 1 level per 1000 points

        const newStats = {
            ...stats,
            points: newPoints,
            level: newLevel
        };

        setStats(newStats);

        if (user.uid) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    stats: newStats
                });
            } catch (error) {
                console.error("Error awarding points:", error);
            }
        }
    };

    const updateStreak = async () => {
        if (!user || !user.uid) return;

        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem(`lastLogin_${user.uid}`);

        if (lastLogin === today) return; // Already logged in today

        let newStreak = stats.streak || 0;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLogin === yesterday.toDateString()) {
            newStreak += 1;
        } else {
            newStreak = 1; // Reset streak if missed a day (or first login)
        }

        const newStats = {
            ...stats,
            streak: newStreak
        };

        setStats(newStats);
        localStorage.setItem(`lastLogin_${user.uid}`, today);

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                stats: newStats,
                lastLogin: today // Persist last login date for School Dashboard
            });
        } catch (error) {
            console.error("Error updating streak:", error);
        }
    };

    // Check streak on load
    useEffect(() => {
        if (user) {
            updateStreak();
        }
    }, [user?.uid]);

    const switchRole = (newRole, grade = null) => {
        let updatedUser;
        if (newRole === 'student') {
            const targetGrade = grade || 'primary4';
            const mockKey = `student_${targetGrade.replace('primary', 'p')}`;
            updatedUser = mockUsers[mockKey] || mockUsers.student_p4;
        } else if (newRole === 'teacher') {
            updatedUser = mockUsers.teacher;
        } else if (newRole === 'school') {
            updatedUser = mockUsers.school_admin;
        } else {
            updatedUser = { ...user, role: newRole };
        }
        setUser(updatedUser);
    };

    // PERMISSION HELPER FUNCTIONS

    /**
     * Check if the current user can access a specific grade's content
     * @param {string} gradeId - The grade ID to check (e.g., 'primary1', 'primary4')
     * @returns {boolean} - True if user can access the grade
     */
    const canAccessGrade = (gradeId) => {
        if (!user) return false;

        const role = user.role || 'student';

        // Teachers and school admins can access all grades
        if (role === 'teacher' || role === 'school') {
            return true;
        }

        // Students can only access their assigned grade
        if (role === 'student') {
            return user.grade === gradeId;
        }

        return false;
    };

    /**
     * Get list of all grades the current user can access
     * @returns {string[]} - Array of grade IDs
     */
    const getAccessibleGrades = () => {
        if (!user) return [];

        const role = user.role || 'student';
        const allGrades = ['primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6'];

        // Teachers and school admins can access all grades
        if (role === 'teacher' || role === 'school') {
            return allGrades;
        }

        // Students can only access their grade
        if (role === 'student' && user.grade) {
            return [user.grade];
        }

        return [];
    };

    /**
     * Check if current user is a student in a specific grade
     * @param {string} gradeId - The grade ID to check
     * @returns {boolean} - True if user is a student in that grade
     */
    const isStudentInGrade = (gradeId) => {
        if (!user) return false;
        return user.role === 'student' && user.grade === gradeId;
    };

    /**
     * Get the user's current grade (for students) or null
     * @returns {string|null} - Grade ID or null
     */
    const getUserGrade = () => {
        if (!user || user.role !== 'student') return null;
        return user.grade || null;
    };

    /**
     * Check if user can switch between grades (teachers and admins can)
     * @returns {boolean} - True if user can switch grades
     */
    const canSwitchGrades = () => {
        if (!user) return false;
        const role = user.role || 'student';
        return role === 'teacher' || role === 'school';
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AppContext.Provider value={{
            mode,
            setMode,
            toggleMode,
            progress,
            unlockNextChapter,
            user,
            loading,
            lastVisited,
            updateLastVisited,
            awardPoints,
            stats,
            achievements,
            switchRole,
            // Permission helpers
            canAccessGrade,
            getAccessibleGrades,
            isStudentInGrade,
            getUserGrade,
            canSwitchGrades,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
