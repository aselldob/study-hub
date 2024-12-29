'use client';

import { useState } from 'react';

interface Lecture {
  id: string;
  subjectId: string;
  number: number;
  title: string;
  completed: boolean;
  notes: string;
}

export default function LectureTracker({ subjectId, subjectName }: { subjectId: string; subjectName: string }) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [newLecture, setNewLecture] = useState({
    title: '',
    notes: '',
  });

  const addLecture = (e: React.FormEvent) => {
    e.preventDefault();
    setLectures([
      ...lectures,
      {
        id: Date.now().toString(),
        subjectId,
        number: lectures.length + 1,
        title: newLecture.title,
        notes: newLecture.notes,
        completed: false,
      },
    ]);
    setNewLecture({ title: '', notes: '' });
  };

  const toggleLecture = (id: string) => {
    setLectures(
      lectures.map((lecture) =>
        lecture.id === id ? { ...lecture, completed: !lecture.completed } : lecture
      )
    );
  };

  const progress = lectures.length > 0
    ? (lectures.filter((l) => l.completed).length / lectures.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{subjectName} Lectures</h3>
        <div className="text-sm text-gray-500">
          Progress: {progress.toFixed(0)}%
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <form onSubmit={addLecture} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Lecture Title
          </label>
          <input
            type="text"
            id="title"
            value={newLecture.title}
            onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={newLecture.notes}
            onChange={(e) => setNewLecture({ ...newLecture, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Lecture
        </button>
      </form>

      <div className="space-y-2">
        {lectures.map((lecture) => (
          <div
            key={lecture.id}
            className={`p-4 rounded-lg border ${
              lecture.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={lecture.completed}
                  onChange={() => toggleLecture(lecture.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <h4 className="font-medium">
                    Lecture {lecture.number}: {lecture.title}
                  </h4>
                  {lecture.notes && (
                    <p className="text-sm text-gray-600 mt-1">{lecture.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
