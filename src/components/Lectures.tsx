'use client';

import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import useLocalStorage from '../hooks/useLocalStorage';

interface Lecture {
  id: string;
  title: string;
  subjectId: string;
  dayOfWeek: string;
  startTime: string;
  duration: string;
  room?: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

export default function Lectures() {
  const [lectures, setLectures] = useLocalStorage<Lecture[]>('lectures', []);
  const [subjects] = useLocalStorage<Subject[]>('subjects', []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [newLecture, setNewLecture] = useState<Omit<Lecture, 'id'>>({
    title: '',
    subjectId: '',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    duration: '60',
    room: '',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    const lecture: Lecture = {
      id: Math.random().toString(36).substr(2, 9),
      ...newLecture,
    };
    const updatedLectures = [...lectures, lecture];
    setLectures(updatedLectures);
    setShowAddModal(false);
    setNewLecture({
      title: '',
      subjectId: '',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      duration: '60',
      room: '',
    });
  };

  const handleEditLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture) return;

    const updatedLectures = lectures.map(lecture =>
      lecture.id === editingLecture.id ? editingLecture : lecture
    );
    setLectures(updatedLectures);
    setShowEditModal(false);
    setEditingLecture(null);
  };

  const handleDeleteLecture = () => {
    if (!editingLecture) return;
    const updatedLectures = lectures.filter(lecture => lecture.id !== editingLecture.id);
    setLectures(updatedLectures);
    setShowEditModal(false);
    setEditingLecture(null);
  };

  const LectureForm = ({ isEditing = false }) => {
    const currentLecture = isEditing ? editingLecture : newLecture;
    const setCurrentLecture = isEditing ? setEditingLecture : setNewLecture;

    return (
      <form onSubmit={isEditing ? handleEditLecture : handleAddLecture} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={currentLecture?.title}
            onChange={(e) => setCurrentLecture({ ...currentLecture!, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            id="subject"
            value={currentLecture?.subjectId}
            onChange={(e) => setCurrentLecture({ ...currentLecture!, subjectId: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
            Day of Week
          </label>
          <select
            id="dayOfWeek"
            value={currentLecture?.dayOfWeek}
            onChange={(e) => setCurrentLecture({ ...currentLecture!, dayOfWeek: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={currentLecture?.startTime}
            onChange={(e) => setCurrentLecture({ ...currentLecture!, startTime: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            value={currentLecture?.duration}
            onChange={(e) => setCurrentLecture({ ...currentLecture!, duration: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="15"
            step="15"
            required
          />
        </div>

        <div>
          <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
            Room (optional)
          </label>
          <input
            type="text"
            id="room"
            value={currentLecture?.room}
            onChange={(e) => setCurrentLecture({ ...currentLecture!, room: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-between">
          {isEditing && (
            <button
              type="button"
              onClick={handleDeleteLecture}
              className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center"
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              Delete
            </button>
          )}
          <div className="flex space-x-3 ml-auto">
            <button
              type="button"
              onClick={() => isEditing ? setShowEditModal(false) : setShowAddModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isEditing ? 'Save Changes' : 'Add Lecture'}
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lectures</h2>
          <p className="text-gray-600">Manage your weekly lectures</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Lecture
        </button>
      </div>

      <div className="space-y-3">
        {lectures.map((lecture) => {
          const subject = subjects.find(s => s.id === lecture.subjectId);
          return (
            <div
              key={lecture.id}
              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
              style={{ borderLeftWidth: '4px', borderLeftColor: subject?.color || '#3B82F6' }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{lecture.title}</span>
                  <button
                    onClick={() => {
                      setEditingLecture(lecture);
                      setShowEditModal(true);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <PencilIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {lecture.dayOfWeek} at {lecture.startTime} ({lecture.duration} mins)
                  {lecture.room && ` • Room ${lecture.room}`}
                </div>
              </div>
            </div>
          );
        })}

        {lectures.length === 0 && (
          <p className="text-center text-gray-500 py-4">No lectures added yet</p>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Lecture</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <LectureForm isEditing={false} />
          </div>
        </div>
      )}

      {showEditModal && editingLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Lecture</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <LectureForm isEditing={true} />
          </div>
        </div>
      )}
    </div>
  );
}
