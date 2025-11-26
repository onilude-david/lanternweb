import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { academicData } from '../data/academicData';
import { cn } from '../lib/utils';
import { Lock, CheckCircle, Circle, Star, Trophy, Clock, ArrowRight, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import Quiz from './Quiz';
import LanternButton from './ui/LanternButton';

export default function ClassroomDashboard() {
    const { progress, unlockNextChapter, lastVisited, user, canSwitchGrades, getUserGrade } = useApp();
    const [activeQuizId, setActiveQuizId] = useState(null);

    // Determine if user can switch grades (teachers and admins can, students cannot)
    const canSwitch = canSwitchGrades();
    const userGrade = getUserGrade(); // Get student's assigned grade

    // Set initial selected grade based on user role
    const [selectedGrade, setSelectedGrade] = useState(() => {
        if (!canSwitch && userGrade) {
            return userGrade; // Students start with their assigned grade
        }
        return 'primary4'; // Default for teachers/admins
    });

    const navigate = useNavigate();

    const currentGradeData = academicData[selectedGrade];
    // Only show recent activity if it exists in user history
    const recentActivity = lastVisited;

    const handleQuizComplete = (score) => {
        let subjectKey = null;
        Object.entries(currentGradeData.subjects).forEach(([key, subject]) => {
            subject.chapters.forEach(chapter => {
                if (chapter.quizzes.some(q => q.id === activeQuizId)) {
                    subjectKey = key;
                }
            });
        });

        if (subjectKey) {
            unlockNextChapter(subjectKey);
        }
        setActiveQuizId(null);
    };

    const handleGradeChange = (gradeId) => {
        // Only allow grade changes for teachers and admins
        if (canSwitch) {
            setSelectedGrade(gradeId);
        }
    };

    // Get grade display name
    const getGradeDisplayName = () => {
        if (!canSwitch && userGrade) {
            return `My ${currentGradeData?.title || 'Class'}`;
        }
        return currentGradeData?.title || 'Select Grade';
    };

    return (
        <div className="space-y-8">
            {activeQuizId && (
                <Quiz
                    quizId={activeQuizId}
                    onClose={() => setActiveQuizId(null)}
                    onComplete={handleQuizComplete}
                />
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {getGradeDisplayName()}
                </h1>
                <p className="text-gray-500 mt-2">
                    {canSwitch
                        ? 'Pick up where you left off or start a new subject.'
                        : 'Continue your learning journey!'}
                </p>
            </div>

            {/* Recent Activity Card */}
            {recentActivity && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(recentActivity.link)}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-lantern-red/10 rounded-xl flex items-center justify-center text-lantern-red">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jump Back In</div>
                            <h3 className="font-bold text-gray-900">{recentActivity.title}</h3>
                            <p className="text-sm text-gray-500">{recentActivity.subtitle || recentActivity.chapter}</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
            )}

            {/* Grade Selector - Only shown for teachers and school admins */}
            {canSwitch && (
                <div className="flex items-center space-x-2 border-b border-gray-200 pb-4 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {Object.values(academicData).map((grade) => (
                        <button
                            key={grade.id}
                            onClick={() => handleGradeChange(grade.id)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                                selectedGrade === grade.id
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            {grade.title}
                        </button>
                    ))}
                </div>
            )}

            {/* Student-only: Grade Badge */}
            {!canSwitch && userGrade && (
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lantern-red/10 text-lantern-red border border-lantern-red/20">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-bold">{currentGradeData?.title}</span>
                    </div>
                    <p className="text-xs text-gray-400">You're enrolled in {currentGradeData?.title}</p>
                </div>
            )}

            {/* Subjects Grid */}
            {currentGradeData ? (
                <div className="grid grid-cols-1 gap-6">
                    {Object.entries(currentGradeData.subjects).map(([key, subject]) => (
                        <SubjectCard
                            key={key}
                            gradeId={selectedGrade}
                            subjectKey={key}
                            data={subject}
                            progress={progress[key] || 1}
                            onStartQuiz={setActiveQuizId}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    Select a grade to view subjects.
                </div>
            )}
        </div>
    );
}

function SubjectCard({ gradeId, subjectKey, data, progress, onStartQuiz }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <img src={data.cover} alt={data.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{data.title}</h2>
                        <p className="text-sm text-gray-500">{data.chapters.length} Chapters</p>
                    </div>
                </div>
                {data.pdfUrl && (
                    <LanternButton
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/dashboard/textbook/${gradeId}/${subjectKey}`)}
                        className="w-full sm:w-auto justify-center"
                    >
                        Read Textbook
                    </LanternButton>
                )}
            </div>

            <div className="divide-y divide-gray-100">
                {data.chapters?.map((chapter, index) => {
                    const isUnlocked = chapter.id <= progress;
                    const isCompleted = chapter.id < progress;
                    const isCurrent = chapter.id === progress;

                    return (
                        <div
                            key={chapter.id}
                            className={cn(
                                "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
                                isUnlocked ? "hover:bg-gray-50 cursor-pointer" : "opacity-60 bg-gray-50/50"
                            )}
                            onClick={() => isUnlocked && navigate(`/dashboard/chapter/${gradeId}/${subjectKey}/${chapter.id}`)}
                        >
                            <div className="flex items-start sm:items-center gap-4">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                                    isCompleted ? "bg-green-100 border-green-200 text-green-700" :
                                        isCurrent ? "bg-lantern-yellow/20 border-lantern-yellow text-lantern-dark" :
                                            "bg-gray-100 border-gray-200 text-gray-400"
                                )}>
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                </div>
                                <div>
                                    <h3 className={cn("font-medium", isUnlocked ? "text-gray-900" : "text-gray-500")}>
                                        {chapter.title}
                                    </h3>
                                    <p className="text-xs text-gray-400">{chapter.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isUnlocked && (
                                    <div className="flex gap-2">
                                        {chapter.quizzes.map(quiz => (
                                            <button
                                                key={quiz.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (quiz.pdfPage) {
                                                        navigate(`/dashboard/workbook/${gradeId}/${subjectKey}/${chapter.id}`);
                                                    } else {
                                                        onStartQuiz(quiz.id);
                                                    }
                                                }}
                                                className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                {quiz.pdfPage ? 'Workbook' : 'Quiz'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {!isUnlocked && <Lock className="w-4 h-4 text-gray-300" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
