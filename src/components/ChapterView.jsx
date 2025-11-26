import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { academicData } from '../data/academicData';
import { BookOpen, ArrowLeft, FileText, Play, PlayCircle } from 'lucide-react';
import Quiz from './Quiz';
import LanternButton from './ui/LanternButton';

export default function ChapterView() {
    const { gradeId, subjectId, chapterId } = useParams();
    const { updateLastVisited, unlockNextChapter, canAccessGrade, awardPoints } = useApp();
    const navigate = useNavigate();
    const [showQuiz, setShowQuiz] = useState(false);

    // Check if user can access this grade
    if (!canAccessGrade(gradeId)) {
        return <Navigate to="/dashboard/classroom" replace />;
    }

    // Helper to find data (in a real app, this would be an API call or context lookup)
    const grade = academicData[gradeId];
    const subject = grade?.subjects[subjectId];
    const chapter = subject?.chapters.find(c => c.id === parseInt(chapterId));

    useEffect(() => {
        if (chapter && subject) {
            updateLastVisited(
                gradeId,
                subjectId,
                chapter.id,
                chapter.title,
                subject.title,
                `/dashboard/chapter/${gradeId}/${subjectId}/${chapter.id}`
            );

            // Award a small amount of points for reading a chapter (e.g., 5 points)
            // In a real app, we'd check if they've already read it to avoid spamming points
            awardPoints(5);
        }
    }, [chapter, subject, gradeId, subjectId, updateLastVisited, awardPoints]);

    if (!chapter) return <div>Chapter not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <LanternButton
                onClick={() => navigate('/dashboard/classroom')}
                variant="ghost"
                className="flex items-center text-gray-500 hover:text-gray-900"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Classroom
            </LanternButton>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{chapter.title}</h1>
                    <p className="text-gray-500 mt-2">{chapter.description}</p>
                </div>

                <div className="p-6 md:p-8 prose prose-lg max-w-none text-gray-700">
                    {/* Mock Content */}
                    <p>
                        Welcome to the chapter on <strong>{chapter.title}</strong>. In this lesson, we will explore the fundamental concepts
                        essential for your understanding of {subject.title}.
                    </p>
                    <div className="my-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
                        <h3 className="text-lg font-bold mb-2">Key Concepts</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Understanding the core principles.</li>
                            <li>Applying logic to solve problems.</li>
                            <li>Recognizing patterns and relationships.</li>
                        </ul>
                    </div>
                    <p>
                        Study the examples below carefully before attempting the quiz. Remember, practice is key to mastering
                        Quantitative Reasoning.
                    </p>
                    {/* Placeholder for actual lesson content/images */}
                    <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 my-8">
                        Interactive Lesson Content / Video Placeholder
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <LanternButton
                        onClick={() => navigate('/dashboard/classroom')}
                        variant="dark"
                        className="px-8 py-3 flex items-center"
                    >
                        <PlayCircle className="w-5 h-5 mr-2" /> Start Quiz
                    </LanternButton>
                </div>
            </div>
        </div>
    );
}
