import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

import ClassroomDashboard from './components/ClassroomDashboard';
import LibraryDashboard from './components/LibraryDashboard';
import ChapterView from './components/ChapterView';
import BookReader from './components/BookReader';
import TextbookReader from './components/TextbookReader';
import WorkbookView from './components/WorkbookView';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

function ProtectedRoute({ children }) {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lantern-red"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const { mode } = useApp();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={mode === 'academic' ? <ClassroomDashboard /> : <LibraryDashboard />} />
        <Route path="chapter/:gradeId/:subjectId/:chapterId" element={<ChapterView />} />
        <Route path="book/:bookId" element={<BookReader />} />
        <Route path="textbook/:gradeId/:subjectId" element={<TextbookReader />} />
        <Route path="workbook/:gradeId/:subjectId/:chapterId" element={<WorkbookView />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
