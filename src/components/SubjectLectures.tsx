'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Section {
  id: string;
  name: string;
}

interface Status {
  name: string;
  color: string;
}

interface Lecture {
  id: string;
  name: string;
  status: string;
  subjectId: string;
  notes: string;
  sectionId: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  sections: Section[];
  statuses: Status[];
}

export default function SubjectLectures({ subjectId }: { subjectId: string }) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [newLectureName, setNewLectureName] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#3B82F6'); // Default blue color
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    loadData();
  }, [subjectId]);

  const loadData = () => {
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const currentSubject = subjects.find((s: Subject) => s.id === subjectId);
    
    // Initialize sections and statuses if they don't exist
    if (currentSubject && !currentSubject.sections) {
      currentSubject.sections = [];
    }
    if (currentSubject && !currentSubject.statuses) {
      currentSubject.statuses = [
        { name: 'not_started', color: '#F59E0B' },
        { name: 'completed', color: '#34C759' },
        { name: 'review', color: '#8B9467' }
      ];
    }
    
    setSubject(currentSubject || null);

    const storedLectures = JSON.parse(localStorage.getItem('lectures') || '[]');
    setLectures(storedLectures.filter((lecture: Lecture) => lecture.subjectId === subjectId));
  };

  useEffect(() => {
    lectures.forEach(lecture => {
      const textarea = textareaRefs.current[lecture.id];
      if (textarea) {
        adjustTextareaHeight(textarea);
      }
    });
  }, [lectures]);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    if (textarea.value.trim() === '') {
      textarea.style.height = '32px';
    }
  };

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLectureName.trim()) {
      const newLecture: Lecture = {
        id: Date.now().toString(),
        name: newLectureName.trim(),
        status: subject?.statuses[0].name || 'not_started',
        subjectId,
        notes: '',
        sectionId: selectedSection
      };

      const updatedLectures = [...lectures, newLecture];
      setLectures(updatedLectures);
      saveLectures(updatedLectures);

      setNewLectureName('');
      setSelectedSection('');
      setShowAddLecture(false);
      setEditingLecture(null);
    }
  };

  const handleEditLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLecture && newLectureName.trim()) {
      const updatedLectures = lectures.map(lecture =>
        lecture.id === editingLecture.id
          ? { ...lecture, name: newLectureName.trim(), sectionId: selectedSection }
          : lecture
      );
      setLectures(updatedLectures);
      saveLectures(updatedLectures);

      setNewLectureName('');
      setSelectedSection('');
      setShowAddLecture(false);
      setEditingLecture(null);
    }
  };

  const handleDeleteLecture = (lectureId: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      const updatedLectures = lectures.filter(lecture => lecture.id !== lectureId);
      setLectures(updatedLectures);
      saveLectures(updatedLectures);
    }
  };

  const updateLectureStatus = (lectureId: string, status: string) => {
    const updatedLectures = lectures.map(lecture =>
      lecture.id === lectureId ? { ...lecture, status } : lecture
    );
    setLectures(updatedLectures);
    saveLectures(updatedLectures);
  };

  const updateLectureNotes = (lectureId: string, notes: string) => {
    const updatedLectures = lectures.map(lecture =>
      lecture.id === lectureId ? { ...lecture, notes } : lecture
    );
    setLectures(updatedLectures);
    saveLectures(updatedLectures);
    
    const textarea = textareaRefs.current[lectureId];
    if (textarea) {
      adjustTextareaHeight(textarea);
    }
  };

  const addSection = () => {
    if (!subject || !newSectionName.trim()) return;

    const newSection: Section = {
      id: Date.now().toString(),
      name: newSectionName.trim()
    };

    const updatedSubject = {
      ...subject,
      sections: [...subject.sections, newSection]
    };

    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const updatedSubjects = subjects.map((s: Subject) =>
      s.id === subjectId ? updatedSubject : s
    );

    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    setSubject(updatedSubject);
    setNewSectionName('');
    setShowSectionModal(false);
  };

  const addStatus = () => {
    if (newStatusName.trim()) {
      const newStatus: Status = {
        name: newStatusName.trim(),
        color: newStatusColor
      };
      const updatedSubject = {
        ...subject,
        statuses: [...subject.statuses, newStatus]
      };
      const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
      const updatedSubjects = subjects.map((s: Subject) =>
        s.id === subjectId ? updatedSubject : s
      );
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      setSubject(updatedSubject);
      setNewStatusName('');
      setNewStatusColor('#3B82F6');
      setShowStatusModal(false);
    }
  };

  const saveLectures = (updatedLectures: Lecture[]) => {
    localStorage.setItem('lectures', JSON.stringify([
      ...JSON.parse(localStorage.getItem('lectures') || '[]').filter(
        (l: Lecture) => l.subjectId !== subjectId
      ),
      ...updatedLectures
    ]));
  };

  const startEditLecture = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setNewLectureName(lecture.name);
    setSelectedSection(lecture.sectionId);
    setShowAddLecture(true);
  };

  if (!subject) {
    return <div>Subject not found</div>;
  }

  const LectureModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">
          {editingLecture ? 'Edit Lecture' : 'Add New Lecture'}
        </h3>
        <form onSubmit={editingLecture ? handleEditLecture : handleAddLecture} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lecture Name
            </label>
            <input
              type="text"
              value={newLectureName}
              onChange={(e) => setNewLectureName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter lecture name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">No Section</option>
              {subject.sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setNewLectureName('');
                setSelectedSection('');
                setShowAddLecture(false);
                setEditingLecture(null);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingLecture ? 'Save Changes' : 'Add Lecture'}
            </button>
            {editingLecture && (
              <button
                type="button"
                onClick={() => handleDeleteLecture(editingLecture.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Lecture
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Link 
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{subject.name} Lectures</h1>
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: subject.color }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Status Settings
          </button>
          <button
            onClick={() => setShowSectionModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Section Settings
          </button>
          <button
            onClick={() => setShowAddLecture(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            + Add Lecture
          </button>
        </div>
      </div>

      {showAddLecture && <LectureModal />}

      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Manage Sections</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Add New Section
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter section name"
                />
              </div>
              {subject.sections.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Sections
                  </label>
                  <div className="space-y-2">
                    {subject.sections.map(section => (
                      <div key={section.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{section.name}</span>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this section? Lectures in this section will be moved to "No Section"')) {
                              const updatedSubject = {
                                ...subject,
                                sections: subject.sections.filter(s => s.id !== section.id)
                              };
                              const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
                              const updatedSubjects = subjects.map((s: Subject) =>
                                s.id === subjectId ? updatedSubject : s
                              );
                              localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
                              setSubject(updatedSubject);

                              // Move lectures to "No Section"
                              const updatedLectures = lectures.map(lecture =>
                                lecture.sectionId === section.id
                                  ? { ...lecture, sectionId: '' }
                                  : lecture
                              );
                              setLectures(updatedLectures);
                              saveLectures(updatedLectures);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setNewSectionName('');
                    setShowSectionModal(false);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                {newSectionName.trim() && (
                  <button
                    onClick={addSection}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Section
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Status Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Add New Status
                </label>
                <input
                  type="text"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter status name"
                />
                <div className="flex items-center space-x-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Color:
                  </label>
                  <input
                    type="color"
                    value={newStatusColor}
                    onChange={(e) => setNewStatusColor(e.target.value)}
                    className="h-8 w-16 p-0 rounded"
                  />
                </div>
              </div>
              {subject.statuses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Statuses
                  </label>
                  <div className="space-y-2">
                    {subject.statuses.map(status => (
                      <div key={status.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <span>{status.name}</span>
                          <input
                            type="color"
                            value={status.color}
                            onChange={(e) => {
                              const updatedSubject = {
                                ...subject,
                                statuses: subject.statuses.map(s =>
                                  s.name === status.name ? { ...s, color: e.target.value } : s
                                )
                              };
                              const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
                              const updatedSubjects = subjects.map((s: Subject) =>
                                s.id === subjectId ? updatedSubject : s
                              );
                              localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
                              setSubject(updatedSubject);
                            }}
                            className="h-6 w-12 p-0 rounded"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this status? Lectures with this status will be set to the first available status.')) {
                              const updatedSubject = {
                                ...subject,
                                statuses: subject.statuses.filter(s => s.name !== status.name)
                              };
                              const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
                              const updatedSubjects = subjects.map((s: Subject) =>
                                s.id === subjectId ? updatedSubject : s
                              );
                              localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
                              setSubject(updatedSubject);

                              // Update lectures with this status
                              const defaultStatus = updatedSubject.statuses[0]?.name;
                              const updatedLectures = lectures.map(lecture =>
                                lecture.status === status.name
                                  ? { ...lecture, status: defaultStatus }
                                  : lecture
                              );
                              setLectures(updatedLectures);
                              saveLectures(updatedLectures);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setNewStatusName('');
                    setNewStatusColor('#3B82F6');
                    setShowStatusModal(false);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                {newStatusName.trim() && (
                  <button
                    onClick={addStatus}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Status
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {subject.sections.length > 0 && subject.sections.map(section => (
          <div key={section.id}>
            <h2 className="text-lg font-semibold mb-2">{section.name}</h2>
            <div className="grid gap-2">
              {lectures
                .filter(lecture => lecture.sectionId === section.id)
                .map(lecture => (
                  <LectureItem key={lecture.id} lecture={lecture} />
                ))}
            </div>
          </div>
        ))}

        {/* Lectures without sections */}
        <div className="grid gap-2">
          {lectures
            .filter(lecture => !lecture.sectionId)
            .map(lecture => (
              <LectureItem key={lecture.id} lecture={lecture} />
            ))}
        </div>
      </div>
    </div>
  );

  function LectureItem({ lecture }: { lecture: Lecture }) {
    const currentStatus = subject.statuses.find(s => s.name === lecture.status);
    
    return (
      <div className="bg-white rounded-lg shadow p-3">
        <div className="grid grid-cols-4 gap-2 items-start">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{lecture.name}</span>
            <button
              onClick={() => startEditLecture(lecture)}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-1 justify-center col-span-2">
            {subject.statuses.map(status => (
              <button
                key={status.name}
                onClick={() => updateLectureStatus(lecture.id, status.name)}
                className={`px-2 py-0.5 rounded text-sm`}
                style={{
                  backgroundColor: lecture.status === status.name ? status.color : '#f3f4f6',
                  color: lecture.status === status.name ? '#ffffff' : '#4b5563',
                  borderWidth: '1px',
                  borderColor: status.color,
                }}
              >
                {status.name}
              </button>
            ))}
          </div>
          <textarea
            ref={el => textareaRefs.current[lecture.id] = el}
            value={lecture.notes}
            onChange={(e) => updateLectureNotes(lecture.id, e.target.value)}
            className="min-h-[32px] p-1 text-sm border rounded resize-none overflow-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Add notes..."
          />
        </div>
      </div>
    );
  }
}
