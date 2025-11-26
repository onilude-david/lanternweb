import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function TeacherDashboard() {
    const { user } = useApp();
    const navigate = useNavigate();

    // State for real students
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for teacher's classes (in a real app, this would come from Firestore)
    const teacherClasses = user?.assignedClasses || ['primary4-a', 'primary4-b'];

    const [selectedClass, setSelectedClass] = useState(teacherClasses[0]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!user?.schoolId) {
                setLoading(false);
                return;
            }

            try {
                // Fetch students belonging to this school
                // In a real app, we'd also filter by classId if we had that structure set up fully
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "student"),
                    where("schoolId", "==", user.schoolId)
                );

                const querySnapshot = await getDocs(q);
                const fetchedStudents = [];
                querySnapshot.forEach((doc) => {
                    fetchedStudents.push({ id: doc.id, ...doc.data() });
                });
                setStudents(fetchedStudents);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
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

    // Calculate class stats
    const totalStudents = students.length;
    const avgProgress = students.length > 0
        ? Math.round(students.reduce((sum, s) => sum + (s.progress?.quantitative || 0), 0) / students.length)
        : 0;

    return (
        <motion.div
            className="p-6 max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                {user?.schoolName && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase mb-2">
                        <Building2 className="w-3 h-3" />
                        {user.schoolName}
                    </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Welcome, {user?.displayName || 'Teacher'}! 👨‍🏫
                </h1>
                <p className="text-gray-500 mt-2">Manage your classes and track student progress</p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Total Students</span>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Active Classes</span>
                        <GraduationCap className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{teacherClasses.length}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Avg Progress</span>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{avgProgress}%</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Completion Rate</span>
                        <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">85%</p>
                </div>
            </motion.div>

            {/* Class Selector */}
            <motion.div variants={itemVariants}>
                <h2 className="text-lg font-bold text-gray-900 mb-4">My Classes</h2>
                <div className="flex gap-3 flex-wrap">
                    {teacherClasses.map((classId) => (
                        <button
                            key={classId}
                            onClick={() => setSelectedClass(classId)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedClass === classId
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {classId.replace(/-/g, ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Students List */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Students in {selectedClass.toUpperCase()}</h2>
                    <span className="text-sm text-gray-500">{students.length} students</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                    {students.length > 0 ? students.map((student, index) => (
                        <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {student.grade.replace('primary', 'Primary ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                    {/* Progress Indicators */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 mb-1">Quantitative</p>
                                            <div className="flex items-center gap-1">
                                                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${(student.progress?.quantitative || 0) * 10}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">
                                                    Ch.{student.progress?.quantitative || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 mb-1">Verbal</p>
                                            <div className="flex items-center gap-1">
                                                <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${(student.progress?.verbal || 0) * 10}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">
                                                    Ch.{student.progress?.verbal || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No students assigned to this class yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                <div
                    onClick={() => navigate('/dashboard/classroom')}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-lantern-red/20 transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Curriculum</h3>
                    <p className="text-gray-500 text-sm">
                        Access all course materials and resources across all grade levels.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm opacity-60">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Assign Homework</h3>
                    <p className="text-gray-500 text-sm">
                        Create and assign homework to your students. (Coming Soon)
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
