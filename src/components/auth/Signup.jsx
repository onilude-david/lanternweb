import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../lib/firebase';
import { Loader2 } from 'lucide-react';
import LanternButton from '../ui/LanternButton';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [grade, setGrade] = useState('primary4');
    const [displayName, setDisplayName] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const q = query(collection(db, "users"), where("role", "==", "school"));
                const querySnapshot = await getDocs(q);
                const schoolList = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    schoolList.push({
                        id: doc.id,
                        name: data.schoolName || data.displayName || "Unknown School"
                    });
                });
                setSchools(schoolList);
            } catch (err) {
                console.error("Error fetching schools:", err);
            }
        };

        fetchSchools();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create User Document in Firestore
            const userData = {
                uid: user.uid,
                email: user.email,
                role: role,
                displayName: displayName || (role === 'student' ? 'Student' : role === 'teacher' ? 'Teacher' : 'Admin'),
                createdAt: new Date(),
            };

            if (role === 'student') {
                userData.grade = grade;
                userData.progress = { quantitative: 1, verbal: 1 };
                userData.quizScores = [];
                if (selectedSchool) {
                    const school = schools.find(s => s.id === selectedSchool);
                    userData.schoolId = selectedSchool;
                    userData.schoolName = school?.name;
                }
            } else if (role === 'teacher') {
                userData.assignedClasses = [];
                userData.assignedGrades = [];
                if (selectedSchool) {
                    const school = schools.find(s => s.id === selectedSchool);
                    userData.schoolId = selectedSchool;
                    userData.schoolName = school?.name;
                }
            } else if (role === 'school') {
                userData.schoolName = displayName;
            }

            await setDoc(doc(db, "users", user.uid), userData);

            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to create account. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user doc exists
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (!userDoc.exists()) {
                // Create new user doc
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    role: role,
                    displayName: user.displayName || displayName,
                    createdAt: new Date(),
                };

                if (role === 'student') {
                    userData.grade = grade;
                    userData.progress = { quantitative: 1, verbal: 1 };
                    userData.quizScores = [];
                }

                await setDoc(doc(db, "users", user.uid), userData);
            }

            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to sign up with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-lantern-light p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-lantern-yellow rounded-xl flex items-center justify-center text-lantern-dark font-bold text-2xl mx-auto mb-4">
                        L
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Join Lantern Hub</h1>
                    <p className="text-gray-500">Start your adventure today!</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {['student', 'teacher', 'school'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${role === r
                                        ? 'bg-lantern-dark text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {r === 'school' ? 'School' : r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {role === 'school' ? 'School Name' : 'Full Name'}
                        </label>
                        <input
                            type="text"
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lantern-yellow focus:border-transparent outline-none transition-all"
                            placeholder={role === 'school' ? 'Lantern Academy' : 'John Doe'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lantern-yellow focus:border-transparent outline-none transition-all"
                            placeholder={role === 'school' ? 'admin@school.com' : 'user@lantern.com'}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lantern-yellow focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {role === 'student' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                            <select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lantern-yellow focus:border-transparent outline-none transition-all"
                            >
                                <option value="primary1">Primary 1</option>
                                <option value="primary2">Primary 2</option>
                                <option value="primary3">Primary 3</option>
                                <option value="primary4">Primary 4</option>
                                <option value="primary5">Primary 5</option>
                                <option value="primary6">Primary 6</option>
                            </select>
                        </div>
                    )}

                    {(role === 'student' || role === 'teacher') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select School</label>
                            <select
                                value={selectedSchool}
                                onChange={(e) => setSelectedSchool(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lantern-yellow focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Select your school...</option>
                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">
                                Can't find your school? Ask your administrator to sign up first.
                            </p>
                        </div>
                    )}

                    <LanternButton
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                    </LanternButton>
                </form>

                <div className="mt-4">
                    <LanternButton
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        variant="ghost"
                        className="w-full border-2 border-gray-200"
                        size="lg"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Sign up with Google
                    </LanternButton>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-lantern-dark font-bold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
