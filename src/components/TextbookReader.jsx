import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academicData } from '../data/academicData';
import { ArrowLeft } from 'lucide-react';
import LanternButton from './ui/LanternButton';

export default function TextbookReader() {
    const { gradeId, subjectId } = useParams();
    const navigate = useNavigate();

    const grade = academicData[gradeId];
    const subject = grade?.subjects[subjectId];

    if (!subject || !subject.pdfUrl) {
        return <div className="p-8 text-center">Textbook not found.</div>;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <LanternButton
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Class
                </LanternButton>
                <h1 className="text-lg font-bold text-gray-800">{subject.title}</h1>
                <div className="w-20"></div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 w-full h-full">
                <iframe
                    src={subject.pdfUrl}
                    className="w-full h-full border-none"
                    title={subject.title}
                />
            </div>
        </div>
    );
}
