import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

    useEffect(() => {
        // Safety timeout in case Firebase hangs
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("Firebase auth timed out, forcing dev mode");
                setUser({
                    uid: 'dev-user',
                    email: 'dev@lantern.com',
                    grade: 'primary4'
                });
                setLoading(false);
            }
        }, 3000); // 3 seconds timeout

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
                    } else {
                        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // Fallback to basic user info
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
                }
            } else {
                // DEV MODE: Auto-login as dev user
                console.log("Dev Mode: Auto-logged in");
                setUser({
                    uid: 'dev-user',
                    email: 'dev@lantern.com',
                    grade: 'primary4'
                });
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

    const unlockNextChapter = (subject) => {
        setProgress(prev => ({
            ...prev,
            [subject]: (prev[subject] || 0) + 1
        }));
        // TODO: Persist to Firestore
    };

    const [lastVisited, setLastVisited] = useState(null);

    const updateLastVisited = (gradeId, subjectId, chapterId, title, subtitle, link) => {
        setLastVisited({
            gradeId,
            subjectId,
            chapterId,
            title,
            subtitle,
            link,
            timestamp: Date.now()
        });
        // TODO: Persist to Firestore
    };

    return (
        <AppContext.Provider value={{ mode, setMode, toggleMode, progress, unlockNextChapter, user, loading, lastVisited, updateLastVisited }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
