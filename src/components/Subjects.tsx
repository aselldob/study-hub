'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import SubjectModal from './SubjectModal';
import { db } from '@/lib/db';
import { useUser } from '@/hooks/useUser';

interface Subject {
  id: string;
  name: string;
  color: string;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    try {
      const data = await db.subjects.getAll(user!.id);
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleAddSubject = async (subject: Omit<Subject, 'id'>) => {
    try {
      const newSubject = await db.subjects.create({
        ...subject,
        user_id: user!.id
      });
      setSubjects(prev => [...prev, newSubject]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleEditSubject = async (id: string, subject: Partial<Subject>) => {
    try {
      const updatedSubject = await db.subjects.update(id, subject);
      setSubjects(prev => prev.map(s => s.id === id ? updatedSubject : s));
      setEditingSubject(null);
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await db.subjects.delete(id);
      setSubjects(prev => prev.filter(s => s.id !== id));
      setEditingSubject(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Subjects</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => setEditingSubject(subject)}
            className="p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            style={{ backgroundColor: subject.color + '20' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <h3 className="font-medium">{subject.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {(showModal || editingSubject) && (
        <SubjectModal
          onClose={() => {
            setShowModal(false);
            setEditingSubject(null);
          }}
          onSubmit={editingSubject ? handleEditSubject : handleAddSubject}
          onDelete={editingSubject ? handleDeleteSubject : undefined}
          initialData={editingSubject}
        />
      )}
    </div>
  );
}
