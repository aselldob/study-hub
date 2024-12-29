'use client';

import { useState, useEffect } from 'react';
import SubjectModal from './SubjectModal';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  color: string;
}

export default function SubjectManager() {
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showEditSubject, setShowEditSubject] = useState<Subject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    return Array.isArray(storedSubjects) && storedSubjects.length > 0 && 'id' in storedSubjects[0] 
      ? storedSubjects 
      : [];
  });

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    window.dispatchEvent(new CustomEvent('subjectsUpdated', { detail: subjects }));
  }, [subjects]);

  const handleAddSubject = (name: string, color: string) => {
    const newSubjectItem: Subject = {
      id: Date.now().toString(),
      name,
      color
    };
    setSubjects([...subjects, newSubjectItem]);
    setShowAddSubject(false);
  };

  const handleEditSubject = (name: string, color: string) => {
    if (showEditSubject) {
      setSubjects(subjects.map(subject => 
        subject.id === showEditSubject.id 
          ? { ...subject, name, color } 
          : subject
      ));
      setShowEditSubject(null);
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(subject => subject.id !== subjectId));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Subjects</h2>
        <button
          type="button"
          onClick={() => setShowAddSubject(true)}
          className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <span>+ New Subject</span>
        </button>
      </div>

      {showAddSubject && (
        <SubjectModal
          onSubmit={handleAddSubject}
          onClose={() => setShowAddSubject(false)}
        />
      )}

      {showEditSubject && (
        <SubjectModal
          isEdit
          subject={showEditSubject}
          onSubmit={handleEditSubject}
          onClose={() => setShowEditSubject(null)}
        />
      )}

      <div className="grid grid-cols-1 gap-3">
        {subjects.map(subject => (
          <div 
            key={subject.id} 
            className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm hover:shadow transition-shadow"
          >
            <Link
              href={`/subjects/${subject.id}`}
              className="flex items-center space-x-2 flex-1 hover:text-blue-600"
            >
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: subject.color }}
              />
              <span className="font-medium">{subject.name}</span>
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEditSubject(subject)}
                className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSubject(subject.id)}
                className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
