import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leisureData } from '../data/leisureData';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import LanternButton from './ui/LanternButton';

export default function BookReader() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { updateLastVisited } = useApp();

    const [currentPage, setCurrentPage] = useState(1);

    const book = leisureData.find(b => b.id === parseInt(bookId));

    const currentChapter = book?.content.find(c => c.chapter === currentPage);
    const totalPages = book?.content.length || 0;

    React.useEffect(() => {
        if (book) {
            updateLastVisited(
                null, // No gradeId for leisure books
                null, // No subjectId
                book.id,
                book.title,
                'Leisure Reading',
                `/dashboard/book/${book.id}`
            );
        }
    }, [book, updateLastVisited]);

    if (!book) {
        return <div>Book not found</div>;
    }

    if (!currentChapter) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-stone-800">Chapter not found</h2>
                    <LanternButton
                        onClick={() => navigate('/dashboard/library')}
                        className="mt-4"
                    >
                        Return to Library
                    </LanternButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF6E3] flex flex-col font-display">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#FDF6E3]/90 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                <LanternButton
                    onClick={() => navigate('/dashboard/library')}
                    variant="ghost"
                    className="flex items-center text-stone-600 hover:text-stone-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Library
                </LanternButton>
                <h1 className="text-lg font-bold text-stone-800">{book.title}</h1>
                <div className="w-20"></div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-12 flex flex-col">
                <div className="flex-1 bg-white shadow-sm border border-stone-100 rounded-lg p-6 md:p-16 leading-relaxed text-lg text-stone-800">
                    <h2 className="text-2xl font-bold mb-6 text-center">{currentChapter.title}</h2>
                    {currentChapter.text.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-6 last:mb-0">
                            {paragraph}
                        </p>
                    ))}

                    <div className="mt-12 flex justify-center">
                        <span className="text-stone-400 text-sm">- {currentPage} -</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="sticky bottom-0 bg-[#FDF6E3] border-t border-stone-200 p-6">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <LanternButton
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        variant="ghost"
                        className="p-3 rounded-full hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft className="w-6 h-6 text-stone-700" />
                    </LanternButton>

                    <div className="text-stone-500 font-medium">
                        Chapter {currentPage} of {totalPages}
                    </div>

                    {currentPage === totalPages ? (
                        <LanternButton
                            onClick={() => navigate('/dashboard/library')}
                            className="px-6 py-2 rounded-full flex items-center shadow-md"
                        >
                            Finish <CheckCircle className="w-4 h-4 ml-2" />
                        </LanternButton>
                    ) : (
                        <LanternButton
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            variant="ghost"
                            className="p-3 rounded-full hover:bg-stone-200"
                        >
                            <ChevronRight className="w-6 h-6 text-stone-700" />
                        </LanternButton>
                    )}
                </div>
            </div>
        </div>
    );
}
