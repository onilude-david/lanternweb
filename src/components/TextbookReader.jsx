import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { useApp } from '../context/AppContext';
import { academicData } from '../data/academicData';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import LanternButton from './ui/LanternButton';

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function TextbookReader() {
    const { gradeId, subjectId } = useParams();
    const navigate = useNavigate();
    const { updateLastVisited } = useApp();
    const canvasRef = useRef(null);

    const [pdf, setPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const grade = academicData[gradeId];
    const subject = grade?.subjects[subjectId];

    useEffect(() => {
        if (subject) {
            updateLastVisited(
                gradeId,
                subjectId,
                null,
                subject.title,
                'Textbook',
                `/dashboard/textbook/${gradeId}/${subjectId}`
            );
        }
    }, [subject, gradeId, subjectId, updateLastVisited]);

    useEffect(() => {
        if (!subject?.pdfUrl) return;

        const loadPdf = async () => {
            try {
                setLoading(true);
                const loadingTask = pdfjsLib.getDocument(subject.pdfUrl);
                const pdfDoc = await loadingTask.promise;
                setPdf(pdfDoc);
                setTotalPages(pdfDoc.numPages);
            } catch (error) {
                console.error("Error loading PDF:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPdf();
    }, [subject?.pdfUrl]);

    useEffect(() => {
        if (!pdf || !canvasRef.current) return;

        const renderPage = async () => {
            const page = await pdf.getPage(currentPage);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
        };

        renderPage();
    }, [pdf, currentPage]);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    if (!subject) {
        return <div className="p-8 text-center">Subject not found.</div>;
    }

    if (!subject.pdfUrl) {
        return <div className="p-8 text-center">Textbook not found for this subject.</div>;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm z-20">
                <LanternButton
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Class
                </LanternButton>
                <h1 className="text-lg font-bold text-gray-800 truncate px-4">{subject.title}</h1>
                <div className="w-20"></div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto">
                {loading ? (
                    <div className="min-h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lantern-red mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading Textbook...</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto py-8">
                        <canvas ref={canvasRef} className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                )}
            </div>

            {/* Controls */}
            {!loading && totalPages > 0 && (
                <div className="bg-white border-t border-gray-200 p-4 z-20 shadow-inner">
                    <div className="max-w-3xl mx-auto flex items-center justify-between">
                        <LanternButton
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            variant="ghost"
                            className="p-3 rounded-full hover:bg-gray-200 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </LanternButton>

                        <div className="text-gray-600 font-medium">
                            Page {currentPage} of {totalPages}
                        </div>

                        <LanternButton
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            variant="ghost"
                            className="p-3 rounded-full hover:bg-gray-200 disabled:opacity-30"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                        </LanternButton>
                    </div>
                </div>
            )}
        </div>
    );
}
