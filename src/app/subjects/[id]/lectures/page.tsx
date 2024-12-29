'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';
import useLocalStorage from '@/hooks/useLocalStorage';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';

interface Lecture {
  id: string;
  title: string;
  section: string;
  status: string;
  notes?: string;
  completed?: 'not_started' | 'completed' | 'reviewed';
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface StatusSetting {
  label: string;
  color: string;
  description: string;
  bgColor: string;
  textColor: string;
}

export default function SubjectLectures({ params }: { params: { id: string } }) {
  const [subjects] = useLocalStorage<Subject[]>('subjects', []);
  const [lectures, setLectures] = useLocalStorage<Record<string, Lecture[]>>('subject_lectures', {});
  const [sections, setSections] = useLocalStorage<string[]>('lecture_sections', []);
  const [statusSettings, setStatusSettings] = useLocalStorage<Record<string, StatusSetting>>('statusSettings', {
    unknown: {
      label: "Unknown",
      description: "Haven't assessed the difficulty level yet",
      color: "bg-gray-100 text-gray-700",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700"
    },
    easy: {
      label: "Easy",
      description: "Basic concepts, quick to understand",
      color: "bg-green-100 text-green-700",
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    },
    medium: {
      label: "Medium",
      description: "Requires focus, manageable with practice",
      color: "bg-yellow-100 text-yellow-700",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700"
    },
    hard: {
      label: "Hard",
      description: "Complex concepts, needs extra attention",
      color: "bg-orange-100 text-orange-700",
      bgColor: "bg-orange-100",
      textColor: "text-orange-700"
    },
    very_hard: {
      label: "Very Hard",
      description: "Challenging material, requires significant effort",
      color: "bg-red-100 text-red-700",
      bgColor: "bg-red-100",
      textColor: "text-red-700"
    }
  });

  const [completionStatus] = useLocalStorage('completionStatus', {
    not_started: {
      label: 'Not Started',
      color: 'gray',
      description: 'Lecture not yet started'
    },
    completed: {
      label: 'Completed',
      color: 'green',
      description: 'Lecture completed'
    },
    reviewed: {
      label: 'Reviewed',
      color: 'blue',
      description: 'Lecture reviewed and mastered'
    }
  });

  const [showDifficultySettings, setShowDifficultySettings] = useState(false);
  const [showCompletionSettings, setShowCompletionSettings] = useState(false);
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [expandedLectures, setExpandedLectures] = useState<Record<string, boolean>>({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);

  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const [newSectionName, setNewSectionName] = useState('');
  const [editingSectionName, setEditingSectionName] = useState<string | null>(null);
  const [editedSectionName, setEditedSectionName] = useState('');

  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [showDeleteSectionConfirmation, setShowDeleteSectionConfirmation] = useState(false);

  const subject = subjects.find(s => s.id === params.id);
  const subjectLectures = lectures[params.id] || [];

  const getStatusColor = (status: string) => {
    return status ? statusSettings[status]?.color : statusSettings.unknown.color;
  };

  const handleAddLecture = () => {
    if (!newLectureTitle.trim()) return;

    const newLecture: Lecture = {
      id: uuidv4(),
      title: newLectureTitle,
      section: selectedSection,
      status: 'unknown',
      notes: '',
      completed: 'not_started'
    };

    const updatedLectures = [...(lectures[params.id] || []), newLecture];
    setLectures({ ...lectures, [params.id]: updatedLectures });
    setNewLectureTitle('');
    setSelectedSection('');
    setShowAddLecture(false);
  };

  const handleEditLecture = (lecture: Lecture) => {
    setEditingLecture({
      ...lecture,
      status: lecture.status || 'unknown'
    });
    setShowAddLecture(true);
  };

  const handleSaveLecture = (title: string, section: string, difficulty: string, completed: 'not_started' | 'completed' | 'reviewed') => {
    if (editingLecture) {
      const updatedLectures = subjectLectures.map(lecture => 
        lecture.id === editingLecture.id 
          ? { ...lecture, title, section, status: difficulty, completed }
          : lecture
      );
      setLectures({ ...lectures, [params.id]: updatedLectures });
    } else {
      const newLecture: Lecture = {
        id: uuidv4(),
        title,
        section,
        status: 'unknown',
        notes: '',
        completed
      };
      setLectures({ ...lectures, [params.id]: [...subjectLectures, newLecture] });
    }
    setShowAddLecture(false);
    setEditingLecture(null);
  };

  const handleAddSection = () => {
    if (!newSectionName.trim() || sections.includes(newSectionName.trim())) return;
    setSections([...sections, newSectionName.trim()]);
    setNewSectionName('');
  };

  const handleDeleteSectionClick = (section: string) => {
    setSectionToDelete(section);
    setShowDeleteSectionConfirmation(true);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete) {
      // Remove section from sections list
      const updatedSections = sections.filter(s => s !== sectionToDelete);
      setSections(updatedSections);

      // Update lectures to remove deleted section
      const updatedLectures = subjectLectures.map(lecture => ({
        ...lecture,
        section: lecture.section === sectionToDelete ? '' : lecture.section
      }));
      setLectures({ ...lectures, [params.id]: updatedLectures });

      // Close all modals
      setShowDeleteSectionConfirmation(false);
      setSectionToDelete(null);
      setEditingSectionName(null);
    }
  };

  const handleSaveStatusSettings = () => {
    setShowDifficultySettings(false);
  };

  const handleStatusChange = (lectureId: string, newStatus: string) => {
    const updatedLectures = subjectLectures.map(lecture =>
      lecture.id === lectureId
        ? { ...lecture, status: newStatus }
        : lecture
    );
    setLectures({ ...lectures, [params.id]: updatedLectures });
  };

  const toggleLectureCompletion = (lectureId: string) => {
    const statusOrder = ['not_started', 'completed', 'reviewed'];
    const updatedLectures = subjectLectures.map(lecture => {
      if (lecture.id === lectureId) {
        const currentIndex = statusOrder.indexOf(lecture.completed || 'not_started');
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length] as 'not_started' | 'completed' | 'reviewed';
        return { ...lecture, completed: nextStatus };
      }
      return lecture;
    });
    setLectures({ ...lectures, [params.id]: updatedLectures });
  };

  const toggleLectureExpanded = (lectureId: string) => {
    setExpandedLectures(prev => ({
      ...prev,
      [lectureId]: !prev[lectureId]
    }));
  };

  const updateLectureNotes = (lectureId: string, notes: string) => {
    const updatedLectures = {
      ...lectures,
      [params.id]: (lectures[params.id] || []).map(lecture =>
        lecture.id === lectureId
          ? { ...lecture, notes }
          : lecture
      )
    };
    setLectures(updatedLectures);
  };

  const handleDeleteLecture = (lecture: Lecture) => {
    setLectureToDelete(lecture);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteLecture = () => {
    if (lectureToDelete) {
      const updatedLectures = subjectLectures.filter(l => l.id !== lectureToDelete.id);
      setLectures({ ...lectures, [params.id]: updatedLectures });
      setShowDeleteConfirmation(false);
      setLectureToDelete(null);
      setEditingLecture(null); // Close the edit modal
    }
  };

  const handleEditSection = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) {
      setEditingSectionName(null);
      return;
    }

    // Update section name in lectures
    const updatedLectures = subjectLectures.map(lecture => ({
      ...lecture,
      section: lecture.section === oldName ? newName : lecture.section
    }));

    // Update sections list
    const updatedSections = sections.map(section => 
      section === oldName ? newName : section
    );

    setLectures({ ...lectures, [params.id]: updatedLectures });
    setSections(updatedSections);
    setEditingSectionName(null);
  };

  const handleCancelEdit = () => {
    setEditingLecture(null);
    setShowAddLecture(false);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold flex items-center">
              {subject.name} Lectures
              <span className="ml-2 w-3 h-3 rounded-full inline-block" style={{ backgroundColor: subject.color }}></span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDifficultySettings(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Difficulty Settings
            </button>
            <button
              onClick={() => setShowCompletionSettings(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Status Settings
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="space-x-2">
            <button
              onClick={() => setShowSectionSettings(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Section Settings
            </button>
          </div>
          <button
            onClick={() => setShowAddLecture(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add Lecture
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          {sections.length > 0 ? (
            <div className="space-y-4">
              {sections.map((section) => {
                const sectionLectures = subjectLectures.filter(
                  (lecture) => lecture.section === section
                );
                
                if (sectionLectures.length === 0) return null;

                return (
                  <div key={section} className="bg-white rounded-lg shadow">
                    <div className="px-4 py-2 bg-gray-50 rounded-t-lg font-medium text-gray-700 border-b">
                      {section}
                    </div>
                    {sectionLectures.map((lecture) => (
                      <div
                        key={lecture.id}
                        className="border-b last:border-b-0 p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleEditLecture(lecture)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <PencilIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <span className="font-medium">{lecture.title}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => {
                                const currentStatus = lecture.status;
                                const statusKeys = Object.keys(statusSettings);
                                const currentIndex = statusKeys.indexOf(currentStatus);
                                const nextIndex = (currentIndex + 1) % statusKeys.length;
                                const nextStatus = statusKeys[nextIndex];
                                handleStatusChange(lecture.id, nextStatus);
                              }}
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                statusSettings[lecture.status]?.bgColor || 'bg-gray-100'
                              } ${statusSettings[lecture.status]?.textColor || 'text-gray-700'}`}
                            >
                              {statusSettings[lecture.status]?.label || 'Unknown'}
                            </button>
                            <div className="relative group">
                              <button
                                onClick={() => toggleLectureCompletion(lecture.id)}
                                className={`px-2 py-1 rounded text-sm ${
                                  lecture.completed === 'reviewed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : lecture.completed === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {completionStatus[lecture.completed || 'not_started'].label}
                                <div className="absolute hidden group-hover:block w-48 bg-white border shadow-lg rounded-md py-2 top-full right-0 mt-1 z-10">
                                  {Object.entries(completionStatus).map(([key, status]) => (
                                    <button
                                      key={key}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedLectures = subjectLectures.map(l => 
                                          l.id === lecture.id ? { ...l, completed: key as any } : l
                                        );
                                        setLectures({ ...lectures, [params.id]: updatedLectures });
                                      }}
                                      className={`w-full text-left px-4 py-1 text-sm hover:bg-gray-100 ${
                                        lecture.completed === key ? 'bg-gray-50' : ''
                                      }`}
                                    >
                                      {status.label} - {status.description}
                                    </button>
                                  ))}
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Add notes..."
                            value={lecture.notes || ''}
                            onChange={(e) => updateLectureNotes(lecture.id, e.target.value)}
                            className="w-full px-3 py-1 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-blue-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Lectures without sections */}
              {subjectLectures.filter(lecture => !lecture.section).length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-2 bg-gray-50 rounded-t-lg font-medium text-gray-700 border-b">
                    Other Lectures
                  </div>
                  {subjectLectures
                    .filter(lecture => !lecture.section)
                    .map((lecture) => (
                      <div
                        key={lecture.id}
                        className="border-b last:border-b-0 p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleEditLecture(lecture)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <PencilIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <span className="font-medium">{lecture.title}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => {
                                const currentStatus = lecture.status;
                                const statusKeys = Object.keys(statusSettings);
                                const currentIndex = statusKeys.indexOf(currentStatus);
                                const nextIndex = (currentIndex + 1) % statusKeys.length;
                                const nextStatus = statusKeys[nextIndex];
                                handleStatusChange(lecture.id, nextStatus);
                              }}
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                statusSettings[lecture.status]?.bgColor || 'bg-gray-100'
                              } ${statusSettings[lecture.status]?.textColor || 'text-gray-700'}`}
                            >
                              {statusSettings[lecture.status]?.label || 'Unknown'}
                            </button>
                            <div className="relative group">
                              <button
                                onClick={() => toggleLectureCompletion(lecture.id)}
                                className={`px-2 py-1 rounded text-sm ${
                                  lecture.completed === 'reviewed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : lecture.completed === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {completionStatus[lecture.completed || 'not_started'].label}
                                <div className="absolute hidden group-hover:block w-48 bg-white border shadow-lg rounded-md py-2 top-full right-0 mt-1 z-10">
                                  {Object.entries(completionStatus).map(([key, status]) => (
                                    <button
                                      key={key}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedLectures = subjectLectures.map(l => 
                                          l.id === lecture.id ? { ...l, completed: key as any } : l
                                        );
                                        setLectures({ ...lectures, [params.id]: updatedLectures });
                                      }}
                                      className={`w-full text-left px-4 py-1 text-sm hover:bg-gray-100 ${
                                        lecture.completed === key ? 'bg-gray-50' : ''
                                      }`}
                                    >
                                      {status.label} - {status.description}
                                    </button>
                                  ))}
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Add notes..."
                            value={lecture.notes || ''}
                            onChange={(e) => updateLectureNotes(lecture.id, e.target.value)}
                            className="w-full px-3 py-1 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-blue-300"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            // When no sections are defined, show all lectures without sections
            <div className="bg-white rounded-lg shadow">
              {subjectLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="border-b last:border-b-0 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleEditLecture(lecture)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      <span className="font-medium">{lecture.title}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          const currentStatus = lecture.status;
                          const statusKeys = Object.keys(statusSettings);
                          const currentIndex = statusKeys.indexOf(currentStatus);
                          const nextIndex = (currentIndex + 1) % statusKeys.length;
                          const nextStatus = statusKeys[nextIndex];
                          handleStatusChange(lecture.id, nextStatus);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          statusSettings[lecture.status]?.bgColor || 'bg-gray-100'
                        } ${statusSettings[lecture.status]?.textColor || 'text-gray-700'}`}
                      >
                        {statusSettings[lecture.status]?.label || 'Unknown'}
                      </button>
                      <div className="relative group">
                        <button
                          onClick={() => toggleLectureCompletion(lecture.id)}
                          className={`px-2 py-1 rounded text-sm ${
                            lecture.completed === 'reviewed'
                              ? 'bg-blue-100 text-blue-700'
                              : lecture.completed === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {completionStatus[lecture.completed || 'not_started'].label}
                          <div className="absolute hidden group-hover:block w-48 bg-white border shadow-lg rounded-md py-2 top-full right-0 mt-1 z-10">
                            {Object.entries(completionStatus).map(([key, status]) => (
                              <button
                                key={key}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedLectures = subjectLectures.map(l => 
                                    l.id === lecture.id ? { ...l, completed: key as any } : l
                                  );
                                  setLectures({ ...lectures, [params.id]: updatedLectures });
                                }}
                                className={`w-full text-left px-4 py-1 text-sm hover:bg-gray-100 ${
                                  lecture.completed === key ? 'bg-gray-50' : ''
                                }`}
                              >
                                {status.label} - {status.description}
                              </button>
                            ))}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Add notes..."
                      value={lecture.notes || ''}
                      onChange={(e) => updateLectureNotes(lecture.id, e.target.value)}
                      className="w-full px-3 py-1 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-blue-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {subjectLectures.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No lectures added yet
            </div>
          )}
        </div>
      </div>

      {/* Add Lecture Modal */}
      {showAddLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Lecture</h3>
              <button
                onClick={() => setShowAddLecture(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddLecture();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newLectureTitle}
                    onChange={(e) => setNewLectureTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter lecture title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a section</option>
                    {sections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddLecture(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lecture Modal */}
      {editingLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Lecture</h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveLecture(editingLecture.title, editingLecture.section, editingLecture.status, editingLecture.completed);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingLecture.title}
                    onChange={(e) => setEditingLecture({ ...editingLecture, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    value={editingLecture.section}
                    onChange={(e) => setEditingLecture({ ...editingLecture, section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a section</option>
                    {sections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={editingLecture.status}
                    onChange={(e) => setEditingLecture({ ...editingLecture, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {Object.entries(statusSettings).map(([key, status]) => (
                      <option key={key} value={key}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Status
                  </label>
                  <select
                    value={editingLecture.completed || 'not_started'}
                    onChange={(e) => setEditingLecture({ ...editingLecture, completed: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {Object.entries(completionStatus).map(([key, status]) => (
                      <option key={key} value={key}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteLecture(editingLecture)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Lecture</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{lectureToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setLectureToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteLecture}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Section Confirmation Modal */}
      {showDeleteSectionConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Delete Section</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this section? All lectures in this section will be moved to "No Section".
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteSectionConfirmation(false);
                    setSectionToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSection}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Settings Modal */}
      {showSectionSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Section Settings</h2>
              <button
                onClick={() => setShowSectionSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Add new section"
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {sections.map((section) => (
                  <div key={section} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-center w-full">
                      <span>{section}</span>
                      <button
                        onClick={() => {
                          setEditingSectionName(section);
                          setEditedSectionName(section);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {editingSectionName && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Edit Section</h3>
              <button
                onClick={() => setEditingSectionName(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-lg mb-2">
                Section Name
              </label>
              <input
                type="text"
                value={editedSectionName}
                onChange={(e) => setEditedSectionName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-6"
                placeholder="Enter section name"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeleteSectionClick(editingSectionName)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingSectionName(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditSection(editingSectionName, editedSectionName)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
