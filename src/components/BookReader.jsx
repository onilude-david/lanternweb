import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leisureData } from '../data/leisureData';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import LanternButton from './ui/LanternButton';

export default function BookReader() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    // Check if it's a leisure book (ID is number) or academic book (ID is string/path)
    // For this simple implementation, we'll assume if it's not in leisureData, it might be passed via state or we need a different route.
    // BUT, to keep it simple, let's check if we have a 'pdfUrl' passed in location state OR if we can find it.

    // Actually, let's modify how we find the book.
    const book = leisureData.find(b => b.id === parseInt(bookId));

    // If not found in leisure, maybe it's a PDF view request?
    // Let's rely on the component props or a query param for PDFs in a real app, 
    // but here let's just handle the leisure book logic as is, and add a check for PDF.

    // WAIT: The user wants to read the PDF. We should probably make a new component or adapt this one.
    // Let's adapt this one to accept a 'type' or just check if 'book' has a pdfUrl.

    // Since we are routing to /book/:bookId, this component expects a leisure book.
    // Let's create a new route /textbook/:gradeId/:subjectId for PDFs?
    // OR, let's just make this component flexible.

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    if (!book) return <div>Book not found</div>;

    return (
        <div className="min-h-screen bg-[#FDF6E3] flex flex-col font-display">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#FDF6E3]/90 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                <LanternButton
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="flex items-center text-stone-600 hover:text-stone-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Library
                </LanternButton>
                <h1 className="text-lg font-bold text-stone-800">{book.title}</h1>
                <div className="w-20"></div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-3xl mx-auto w-full p-8 md:p-12 flex flex-col">
                <div className="flex-1 bg-white shadow-sm border border-stone-100 rounded-lg p-8 md:p-16 leading-relaxed text-lg text-stone-800">
                    <h2 className="text-2xl font-bold mb-6 text-center">Chapter {currentPage}</h2>
                    <p className="mb-6">
                        Once upon a time, in a village not so far away, there lived a young boy named Kunle.
                        Kunle was known for his adventurous spirit and his kind heart. Every morning, he would wake up
                        with the sun, eager to explore the wonders of the world around him.
                    </p>
                    <p className="mb-6">
                        One day, while wandering near the edge of the forest, he stumbled upon a mysterious path
                        he had never seen before. The trees seemed to whisper secrets, and the air was filled with
                        the scent of unknown flowers.
                    </p>
                    <p>
                        "I wonder where this leads," Kunle thought to himself, his eyes sparkling with curiosity.
                        Without a second thought, he stepped onto the path, ready for whatever adventure lay ahead.
                    </p>

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
                        Page {currentPage} of {totalPages}
                    </div>

                    {currentPage === totalPages ? (
                        <LanternButton
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
