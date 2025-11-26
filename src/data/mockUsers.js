// Mock users for testing different roles and grade levels
export const mockUsers = {
    student_p1: {
        uid: 'student-p1',
        email: 'student.p1@school.com',
        role: 'student',
        grade: 'primary1',
        schoolId: 'school-001',
        classId: 'primary1-a',
        teacherId: 'teacher-001',
        displayName: 'Emma Williams',
        schoolName: 'Lantern Academy'
    },
    student_p4: {
        uid: 'student-p4',
        email: 'student.p4@school.com',
        role: 'student',
        grade: 'primary4',
        schoolId: 'school-001',
        classId: 'primary4-a',
        teacherId: 'teacher-002',
        displayName: 'John Smith',
        schoolName: 'Lantern Academy'
    },
    student_p6: {
        uid: 'student-p6',
        email: 'student.p6@school.com',
        role: 'student',
        grade: 'primary6',
        schoolId: 'school-001',
        classId: 'primary6-b',
        teacherId: 'teacher-003',
        displayName: 'Sarah Johnson',
        schoolName: 'Lantern Academy'
    },
    teacher: {
        uid: 'teacher-001',
        email: 'teacher@school.com',
        role: 'teacher',
        schoolId: 'school-001',
        assignedClasses: ['primary4-a', 'primary4-b'],
        assignedGrades: ['primary4'],
        displayName: 'Ms. Johnson',
        schoolName: 'Lantern Academy',
        students: [
            { id: 'student-p4', name: 'John Smith', grade: 'primary4', progress: { quantitative: 2, verbal: 1 } },
            { id: 'student-004', name: 'Alice Brown', grade: 'primary4', progress: { quantitative: 1, verbal: 2 } },
            { id: 'student-005', name: 'Bob Wilson', grade: 'primary4', progress: { quantitative: 3, verbal: 2 } }
        ]
    },
    school_admin: {
        uid: 'admin-001',
        email: 'admin@school.com',
        role: 'school',
        schoolId: 'school-001',
        displayName: 'Dr. Anderson',
        schoolName: 'Lantern Academy'
    }
};

// Helper to get mock user by role and grade
export const getMockUser = (role, grade = null) => {
    if (role === 'student' && grade) {
        const key = `student_${grade.replace('primary', 'p')}`;
        return mockUsers[key] || mockUsers.student_p4;
    }
    return mockUsers[role] || mockUsers.student_p4;
};
