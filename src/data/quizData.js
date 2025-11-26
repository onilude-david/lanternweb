export const quizData = {
    'p4-q1-1': {
        id: 'p4-q1-1',
        title: 'Pattern Recognition',
        questions: [
            {
                id: 1,
                text: 'Which shape comes next in the sequence?',
                imageUrl: 'https://placehold.co/600x200/e2e8f0/64748b?text=Shape+Pattern+Sequence',
                options: [
                    { id: 'A', imageUrl: 'https://placehold.co/150x150/e2e8f0/64748b?text=Circle' },
                    { id: 'B', imageUrl: 'https://placehold.co/150x150/e2e8f0/64748b?text=Square' },
                    { id: 'C', imageUrl: 'https://placehold.co/150x150/e2e8f0/64748b?text=Triangle' },
                    { id: 'D', imageUrl: 'https://placehold.co/150x150/e2e8f0/64748b?text=Star' }
                ],
                correctIndex: 2,
                explanation: 'The pattern alternates between Circle and Square, then introduces a Triangle.'
            },
            {
                id: 2,
                text: 'Select the odd one out.',
                options: [
                    { id: 'A', text: 'Triangle' },
                    { id: 'B', text: 'Square' },
                    { id: 'C', text: 'Circle' },
                    { id: 'D', text: 'Rectangle' }
                ],
                correctIndex: 2,
                explanation: 'Circle is the only shape with no corners.'
            }
        ]
    },
    'p4-q-ex3a': {
        id: 'p4-q-ex3a',
        title: 'Alphanumeric Equations',
        description: 'Use the number line: A=-6, B=-5, ... G=0 ... M=6',
        questions: [
            {
                id: 1,
                text: 'If A=-6, G=0, M=6. Solve: L + D = ?',
                options: [
                    { id: 'A', text: 'I (2)' },
                    { id: 'B', text: 'H (1)' },
                    { id: 'C', text: 'J (3)' },
                    { id: 'D', text: 'K (4)' }
                ],
                correctIndex: 0,
                explanation: 'L is 5, D is -3. 5 + (-3) = 2, which is I.'
            },
            {
                id: 2,
                text: 'Solve: M + D = ?',
                options: [
                    { id: 'A', text: 'G (0)' },
                    { id: 'B', text: 'I (2)' },
                    { id: 'C', text: 'J (3)' },
                    { id: 'D', text: 'H (1)' }
                ],
                correctIndex: 2,
                explanation: 'M is 6, D is -3. 6 + (-3) = 3, which is J.'
            },
            {
                id: 3,
                text: 'Find the missing letter: L + ? = K',
                options: [
                    { id: 'A', text: 'E (-2)' },
                    { id: 'B', text: 'F (-1)' },
                    { id: 'C', text: 'G (0)' },
                    { id: 'D', text: 'D (-3)' }
                ],
                correctIndex: 1,
                explanation: 'L is 5, K is 4. 5 + x = 4, so x = -1, which is F.'
            }
        ]
    },
    // ... other quizzes
};
