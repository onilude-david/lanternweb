import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { academicData } from '../data/academicData';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import LanternButton from './ui/LanternButton';
import { cn } from '../lib/utils';

export default function WorkbookView() {
    const { gradeId, subjectId, chapterId } = useParams();
    const navigate = useNavigate();
    const { updateLastVisited } = useApp();
    const [pdfPage, setPdfPage] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [answers, setAnswers] = useState({});

    const grade = academicData[gradeId];
    const subject = grade?.subjects[subjectId];
    const chapter = subject?.chapters.find(c => c.id === parseInt(chapterId));

    const quiz = chapter?.quizzes.find(q => q.pdfPage) || chapter?.quizzes[0];

    useEffect(() => {
        if (quiz?.pdfPage) {
            setPdfPage(quiz.pdfPage);
        }
    }, [quiz]);

    useEffect(() => {
        if (chapter && quiz) {
            updateLastVisited(
                gradeId,
                subjectId,
                chapter.id,
                chapter.title,
                `Workbook: ${quiz.title}`,
                `/dashboard/workbook/${gradeId}/${subjectId}/${chapterId}`
            );
        }
    }, [chapter, quiz, gradeId, subjectId, chapterId, updateLastVisited]);

    if (!grade || !subject || !chapter || !quiz) {
        return <div className="p-8 text-center">Workbook exercise not found.</div>;
    }

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = () => {
        alert('Great job! Answers saved.');
        navigate(-1);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <LanternButton
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </LanternButton>
                    <div>
                        <h1 className="text-sm font-bold text-gray-800">{subject.title}</h1>
                        <p className="text-xs text-gray-500">{chapter.title} - {quiz.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setPdfPage(p => Math.max(1, p - 1))}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-xs font-medium w-16 text-center text-gray-600">Page {pdfPage}</span>
                        <button
                            onClick={() => setPdfPage(p => p + 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <LanternButton onClick={handleSubmit} variant="primary" size="sm">
                        Submit <CheckCircle className="w-4 h-4 ml-2" />
                    </LanternButton>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 bg-gray-200 relative border-r border-gray-300 h-1/2 md:h-auto">
                    <iframe
                        src={`${subject.pdfUrl}#page=${pdfPage}&zoom=${zoom}`}
                        className="w-full h-full border-none"
                        title="Textbook"
                    />
                </div>

                <div className="w-full md:w-96 bg-white flex flex-col border-l border-gray-200 shadow-xl z-10 h-1/2 md:h-auto">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-lantern-dark text-white flex items-center justify-center text-xs">?</span>
                            Answer Sheet
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Read the questions in the book and type your answers below.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {quiz.questions ? (
                            quiz.questions.map((q, idx) => (
                                <div key={q.id} className="p-3 rounded-xl border border-gray-100 hover:border-lantern-yellow/50 transition-colors bg-white shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-bold text-gray-700">Question {idx + 1}</label>
                                        <span className="text-xs text-gray-400">1 pt</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{q.text}</p>

                                    {q.options ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options.map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => handleAnswerChange(q.id, opt.id)}
                                                    className={cn(
                                                        "text-xs p-2 rounded-lg border text-left transition-all",
                                                        answers[q.id] === opt.id
                                                            ? "bg-lantern-dark text-white border-lantern-dark"
                                                            : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                                    )}
                                                >
                                                    <span className="font-bold mr-1">{opt.id}.</span> {opt.text}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lantern-yellow/50"
                                            placeholder="Type answer..."
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            Array.from({ length: quiz.questionCount || 10 }).map((_, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-500 w-6">{idx + 1}.</span>
                                    <input
                                        type="text"
                                        className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lantern-yellow/50 bg-gray-50"
                                        placeholder="Answer..."
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
