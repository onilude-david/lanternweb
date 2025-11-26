export const academicData = {
    primary1: {
        id: 'primary1',
        title: 'Primary 1',
        subjects: {
            quantitative: {
                id: 'p1-quant',
                title: 'Steps to Quantitative Reasoning 1',
                cover: 'https://placehold.co/300x400/FFD700/000000?text=Quant+1',
                pdfUrl: '/books/primary1-quantitative.pdf',
                chapters: [
                    { id: 1, title: 'Shape Identification', description: 'Identify basic shapes.', quizzes: [{ id: 'p1-q1-1', title: 'Basic Shapes' }] },
                    { id: 2, title: 'Counting Objects', description: 'Count objects up to 20.', quizzes: [{ id: 'p1-q1-2', title: 'Counting' }] }
                ]
            },
            verbal: {
                id: 'p1-verbal',
                title: 'Steps to Verbal Reasoning 1',
                cover: 'https://placehold.co/300x400/FF6347/FFFFFF?text=Verbal+1',
                pdfUrl: '/books/primary1-verbal.pdf',
                chapters: [
                    { id: 1, title: 'Letter Recognition', description: 'Identify letters A-Z.', quizzes: [{ id: 'p1-v1-1', title: 'Alphabet' }] }
                ]
            }
        }
    },
    primary2: {
        id: 'primary2',
        title: 'Primary 2',
        subjects: {
            quantitative: {
                id: 'p2-quant',
                title: 'Steps to Quantitative Reasoning 2',
                cover: 'https://placehold.co/300x400/FFD700/000000?text=Quant+2',
                pdfUrl: '/books/primary2-quantitative.pdf',
                chapters: [
                    { id: 1, title: 'Addition & Subtraction', description: 'Simple arithmetic problems.', quizzes: [{ id: 'p2-q1-1', title: 'Basic Math' }] },
                    { id: 2, title: 'Number Patterns', description: 'Complete the number sequences.', quizzes: [{ id: 'p2-q1-2', title: 'Sequences' }] }
                ]
            },
            verbal: {
                id: 'p2-verbal',
                title: 'Steps to Verbal Reasoning 2',
                cover: 'https://placehold.co/300x400/FF6347/FFFFFF?text=Verbal+2',
                pdfUrl: '/books/primary2-verbal.pdf',
                chapters: [
                    { id: 1, title: 'Word Families', description: 'Grouping similar words.', quizzes: [{ id: 'p2-v1-1', title: 'Word Groups' }] }
                ]
            }
        }
    },
    primary3: {
        id: 'primary3',
        title: 'Primary 3',
        subjects: {
            quantitative: {
                id: 'p3-quant',
                title: 'Steps to Quantitative Reasoning 3',
                cover: 'https://placehold.co/300x400/FFD700/000000?text=Quant+3',
                pdfUrl: '/books/primary3-quantitative.pdf',
                chapters: [
                    { id: 1, title: 'Multiplication', description: 'Introduction to multiplication tables.', quizzes: [{ id: 'p3-q1-1', title: 'Times Tables' }] },
                    { id: 2, title: 'Fractions', description: 'Understanding halves and quarters.', quizzes: [{ id: 'p3-q1-2', title: 'Basic Fractions' }] }
                ]
            },
            verbal: {
                id: 'p3-verbal',
                title: 'Steps to Verbal Reasoning 3',
                cover: 'https://placehold.co/300x400/FF6347/FFFFFF?text=Verbal+3',
                pdfUrl: '/books/primary3-verbal.pdf',
                chapters: [
                    { id: 1, title: 'Antonyms', description: 'Words with opposite meanings.', quizzes: [{ id: 'p3-v1-1', title: 'Opposites' }] }
                ]
            }
        }
    },
    primary4: {
        id: 'primary4',
        title: 'Primary 4',
        subjects: {
            quantitative: {
                id: 'p4-quant',
                title: 'Steps to Quantitative Reasoning 4',
                cover: 'https://placehold.co/300x400/FFD700/000000?text=Quant+4',
                pdfUrl: '/books/primary4-quantitative.pdf',
                chapters: [
                    {
                        id: 1,
                        title: 'Shape Patterns',
                        description: 'Analyze patterns in shapes and figures.',
                        quizzes: [
                            { id: 'p4-q-ex3a', title: 'Alphanumeric Equations', pdfPage: 15 }
                        ]
                    },
                    {
                        id: 2,
                        title: 'Number Series',
                        description: 'Find the missing number in the series.',
                        quizzes: [
                            { id: 'p4-q1-2', title: 'Series Completion' }
                        ]
                    }
                ]
            },
            verbal: {
                id: 'p4-verbal',
                title: 'Steps to Verbal Reasoning 4',
                cover: 'https://placehold.co/300x400/FF6347/FFFFFF?text=Verbal+4',
                pdfUrl: '/books/primary4-verbal.pdf',
                chapters: [
                    { id: 1, title: 'Synonyms', description: 'Find words with similar meanings.', quizzes: [{ id: 'p4-v1-1', title: 'Synonyms' }] }
                ]
            }
        }
    },
    primary5: {
        id: 'primary5',
        title: 'Primary 5',
        subjects: {
            quantitative: {
                id: 'p5-quant',
                title: 'Steps to Quantitative Reasoning 5',
                cover: 'https://placehold.co/300x400/FFD700/000000?text=Quant+5',
                pdfUrl: '/books/primary5-quantitative.pdf',
                chapters: [
                    { id: 1, title: 'Algebraic Thinking', description: 'Solving for X in simple equations.', quizzes: [{ id: 'p5-q1-1', title: 'Simple Algebra' }] },
                    { id: 2, title: 'Geometry', description: 'Properties of triangles and rectangles.', quizzes: [{ id: 'p5-q1-2', title: 'Shapes & Angles' }] }
                ]
            },
            verbal: {
                id: 'p5-verbal',
                title: 'Steps to Verbal Reasoning 5',
                cover: 'https://placehold.co/300x400/FF6347/FFFFFF?text=Verbal+5',
                pdfUrl: '/books/primary5-verbal.pdf',
                chapters: [
                    { id: 1, title: 'Analogies', description: 'Completing word relationships.', quizzes: [{ id: 'p5-v1-1', title: 'Word Analogies' }] }
                ]
            }
        }
    },
    primary6: {
        id: 'primary6',
        title: 'Primary 6',
        subjects: {
            quantitative: {
                id: 'p6-quant',
                title: 'Steps to Quantitative Reasoning 6',
                cover: 'https://placehold.co/300x400/FFD700/000000?text=Quant+6',
                pdfUrl: '/books/primary6-quantitative.pdf',
                chapters: [
                    { id: 1, title: 'Advanced Logic', description: 'Complex logical sequences.', quizzes: [{ id: 'p6-q1-1', title: 'Logic Puzzles' }] },
                    { id: 2, title: 'Data Interpretation', description: 'Reading graphs and charts.', quizzes: [{ id: 'p6-q1-2', title: 'Graphs' }] }
                ]
            },
            verbal: {
                id: 'p6-verbal',
                title: 'Steps to Verbal Reasoning 6',
                cover: 'https://placehold.co/300x400/FF6347/FFFFFF?text=Verbal+6',
                pdfUrl: '/books/primary6-verbal.pdf',
                chapters: [
                    { id: 1, title: 'Critical Reading', description: 'Analyzing complex texts.', quizzes: [{ id: 'p6-v1-1', title: 'Comprehension' }] }
                ]
            }
        }
    },
    extraData: {
        recentActivity: {
            title: 'Steps to Quantitative Reasoning 4',
            chapter: 'Shape Patterns',
            progress: 60,
            cover: 'https://placehold.co/300x400/FFD700/000000?text=Quant+4',
            link: '/dashboard/chapter/primary4/quantitative/1'
        },
        dailyChallenge: {
            title: 'Math Whiz',
            task: 'Complete 2 Quizzes',
            progress: 1,
            total: 2,
            reward: '50 XP'
        },
        weeklyProgress: [
            { day: 'M', active: true },
            { day: 'T', active: true },
            { day: 'W', active: false },
            { day: 'T', active: true },
            { day: 'F', active: false },
            { day: 'S', active: false },
            { day: 'S', active: false },
        ]
    }
};
