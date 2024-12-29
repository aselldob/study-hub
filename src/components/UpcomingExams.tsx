'use client';

import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { XMarkIcon, TrashIcon, ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface Exam {
  id: string;
  title: string;
  date: string;
  time?: string;
  subjectId: string;
  notes?: string;
  completed?: boolean;
}

export default function UpcomingExams() {
  const [exams, setExams] = useLocalStorage<Exam[]>('exams', []);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [notes, setNotes] = useState('');
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    // Wait for window to be defined
    if (typeof window === 'undefined') return;
    setIsLoading(false);
  }, []);

  // Clean up exams when a subject is deleted
  useEffect(() => {
    const updatedExams = exams.filter(exam => 
      subjects.some(subject => subject.id === exam.subjectId)
    );
    
    if (updatedExams.length !== exams.length) {
      setExams(updatedExams);
    }
  }, [subjects, exams]);

  const filteredExams = selectedSubject
    ? exams.filter(exam => exam.subjectId === selectedSubject)
    : exams;

  const upcomingExams = exams.filter(exam => !exam.completed);
  const completedExams = exams.filter(exam => exam.completed);

  const handleAddExam = (examData: Exam) => {
    const newExam: Exam = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: examData.title,
      date: examData.date,
      subjectId: examData.subjectId,
      time: examData.time,
      notes: examData.notes,
      completed: false
    };

    setExams([...exams, newExam]);
    setShowAddModal(false);
    setTitle('');
    setDate('');
    setTime('');
    setSubjectId('');
    setNotes('');
    setShowTime(false);
  };

  const handleDeleteExam = () => {
    if (!examToDelete) return;
    
    const updatedExams = exams.filter(exam => exam.id !== examToDelete);
    setExams(updatedExams);
    setExamToDelete('');
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    const updatedExams = exams.filter(exam => exam.id !== examToDelete);
    setExams(updatedExams);
    setShowDeleteConfirmation(false);
  };

  const handleToggleComplete = (id: string) => {
    const updatedExams = exams.map(exam => {
      if (exam.id === id) {
        return { ...exam, completed: !exam.completed };
      }
      return exam;
    });
    setExams(updatedExams);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setShowAddModal(true);
  };

  const toggleEditDropdown = (examId: string | null) => {
    setShowEditDropdown(showEditDropdown === examId ? null : examId);
  };

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#e5e7eb'; // default gray if no subject found
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown Subject';
  };

  const handleEditExam = (id: string, examData: Exam) => {
    const updatedExams = exams.map(exam => {
      if (exam.id === id) {
        return { ...exam, ...examData };
      }
      return exam;
    });
    setExams(updatedExams);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Exams</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-1"
        >
          <span>+</span>
          <span>New Exam</span>
        </button>
      </div>

      <div className="mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full p-3 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upcoming Exams */}
      {upcomingExams.length === 0 && !showCompleted && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-lg">No upcoming exams</p>
        </div>
      )}

      {upcomingExams.length > 0 && (
        <div className="space-y-4">
          {upcomingExams.map(exam => (
            <div
              key={exam.id}
              className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow-sm border-l-4`}
              style={{ borderLeftColor: getSubjectColor(exam.subjectId) }}
            >
              <div className="flex items-center space-x-4 flex-1">
                <input
                  type="checkbox"
                  checked={exam.completed}
                  onChange={() => handleToggleComplete(exam.id)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h3 className="text-lg font-medium">{exam.title}</h3>
                  <div className="text-sm text-gray-600">
                    <div>{getSubjectName(exam.subjectId)}</div>
                    <div>{exam.date}</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleEditDropdown(exam.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {showEditDropdown === exam.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          handleEdit(exam);
                          toggleEditDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setExamToDelete(exam.id);
                          setShowDeleteConfirmation(true);
                          toggleEditDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Exams */}
      {completedExams.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronRightIcon 
              className={`h-5 w-5 transform transition-transform ${
                showCompleted ? 'rotate-90' : ''
              }`}
            />
            <span className="ml-2">Completed Exams ({completedExams.length})</span>
          </button>

          {showCompleted && (
            <div className="mt-4 space-y-4">
              {completedExams.map(exam => (
                <div
                  key={exam.id}
                  className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow-sm border-l-4`}
                  style={{ borderLeftColor: getSubjectColor(exam.subjectId) }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={exam.completed}
                      onChange={() => handleToggleComplete(exam.id)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-500 line-through">
                        {exam.title}
                      </h3>
                      <div className="text-sm text-gray-400">
                        <div>{getSubjectName(exam.subjectId)}</div>
                        <div>{exam.date}</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleEditDropdown(exam.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                    {showEditDropdown === exam.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                        <div className="py-1" role="menu">
                          <button
                            onClick={() => {
                              handleEdit(exam);
                              toggleEditDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setExamToDelete(exam.id);
                              setShowDeleteConfirmation(true);
                              toggleEditDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Delete Exam</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this exam? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setExamToDelete('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExam}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingExam ? 'Edit Exam' : 'Add New Exam'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingExam(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <AddExamForm
              onSubmit={(examData) => {
                if (editingExam) {
                  handleEditExam(editingExam.id, examData);
                } else {
                  handleAddExam(examData);
                }
                setShowAddModal(false);
                setEditingExam(null);
              }}
              subjects={subjects}
              initialData={editingExam || undefined}
              onCancel={() => {
                setShowAddModal(false);
                setEditingExam(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface AddExamFormProps {
  onSubmit: (examData: Exam) => void;
  subjects: Subject[];
  initialData?: Exam;
  onCancel: () => void;
}

function AddExamForm({ onSubmit, subjects, initialData, onCancel }: AddExamFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showTime, setShowTime] = useState(!!initialData?.time);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const examData: Exam = {
      id: initialData?.id,
      title,
      date,
      subjectId,
      time: showTime ? time : undefined,
      notes: notes.trim() || undefined,
      completed: initialData?.completed || false
    };
    onSubmit(examData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-lg mb-2">
          Exam Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showTime}
            onChange={(e) => setShowTime(e.target.checked)}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-lg">Add Time</span>
        </label>
        {showTime && (
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )}
      </div>

      <div>
        <label className="block text-lg mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={3}
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {initialData ? 'Save Changes' : 'Add Exam'}
        </button>
      </div>
    </form>
  );
}
