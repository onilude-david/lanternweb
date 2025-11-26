import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academicData } from '../data/academicData';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import LanternButton from './ui/LanternButton';

export default function ChapterView() {
    const { gradeId, subjectId, chapterId } = useParams();
    const navigate = useNavigate();

    // Helper to find data (in a real app, this would be an API call or context lookup)
    const grade = academicData[gradeId];
    const subject = grade?.subjects[subjectId];
    const chapter = subject?.chapters.find(c => c.id === parseInt(chapterId));

    if (!chapter) return <div>Chapter not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <LanternButton
                onClick={() => navigate('/')}
                variant="ghost"
                className="flex items-center text-gray-500 hover:text-gray-900"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
            </LanternButton>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <h1 className="text-3xl font-bold text-gray-900">{chapter.title}</h1>
                    <p className="text-gray-500 mt-2">{chapter.description}</p>
                </div>

                <div className="p-8 prose prose-lg max-w-none text-gray-700">
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
                        onClick={() => navigate('/')} // In real app, this might open the quiz modal directly
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
