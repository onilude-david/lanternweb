import { useApp } from '../context/AppContext';

export default function Quiz({ quizId, onClose, onComplete }) {
    const { awardPoints } = useApp();
    const quiz = quizData[quizId];
    // ... existing state ...

    // ... existing handlers ...

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
            const finalScore = score + (selectedOption === currentQuestion.correctIndex ? 1 : 0);

            // Award points: 10 points per correct answer
            awardPoints(finalScore * 10);

            if (onComplete) onComplete(finalScore);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        const percentage = Math.round((score / totalQuestions) * 100);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-lantern-dark text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                        {percentage}%
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-500 mb-8">You scored {score} out of {totalQuestions}</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-lantern-dark text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={resetQuiz}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> Retry Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
                        <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.text}</h3>

                    {/* Question Image */}
                    {currentQuestion.imageUrl && (
                        <div className="mb-6 rounded-xl overflow-hidden border border-gray-200">
                            <img src={currentQuestion.imageUrl} alt="Question" className="w-full h-auto object-contain max-h-64 bg-gray-50" />
                        </div>
                    )}

                    <div className={cn(
                        "grid gap-4",
                        currentQuestion.options[0].imageUrl ? "grid-cols-2" : "grid-cols-1"
                    )}>
                        {currentQuestion.options.map((option, index) => {
                            let optionStyle = "border-gray-200 hover:border-lantern-dark hover:bg-gray-50";
                            let icon = null;

                            if (isAnswered) {
                                if (index === currentQuestion.correctIndex) {
                                    optionStyle = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                                    icon = <Check className="w-5 h-5 text-green-600 absolute top-3 right-3" />;
                                } else if (index === selectedOption) {
                                    optionStyle = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                                    icon = <AlertCircle className="w-5 h-5 text-red-600 absolute top-3 right-3" />;
                                } else {
                                    optionStyle = "border-gray-100 opacity-50";
                                }
                            } else if (selectedOption === index) {
                                optionStyle = "border-lantern-dark bg-gray-50 ring-2 ring-lantern-dark";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={isAnswered}
                                    className={cn(
                                        "relative p-4 text-left border-2 rounded-xl transition-all flex flex-col items-center justify-center",
                                        optionStyle
                                    )}
                                >
                                    {option.imageUrl ? (
                                        <div className="w-full aspect-square mb-2 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-100">
                                            <img src={option.imageUrl} alt={`Option ${option.id}`} className="w-full h-full object-contain" />
                                        </div>
                                    ) : null}

                                    <span className="font-medium text-center w-full">
                                        {option.text || option.id}
                                    </span>
                                    {icon}
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm animate-in slide-in-from-top-2">
                            <span className="font-bold">Explanation:</span> {currentQuestion.explanation}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    {!isAnswered ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className="px-6 py-2 bg-lantern-dark text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-lantern-dark text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center"
                        >
                            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
