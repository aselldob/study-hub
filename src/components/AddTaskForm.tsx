'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration?: string;
  notes?: string;
  subjectId?: string;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface AddTaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showDurationInput, setShowDurationInput] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    // Load subjects from localStorage
    const storedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    setSubjects(storedSubjects);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      date,
      completed: false
    };

    if (showTimeInput && time) {
      newTask.time = time;
    }

    if (showDurationInput && duration) {
      newTask.duration = duration;
    }

    if (notes.trim()) {
      newTask.notes = notes.trim();
    }

    if (subjectId) {
      newTask.subjectId = subjectId;
    }

    onAddTask(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <select
          id="subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a subject</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showTime"
          checked={showTimeInput}
          onChange={(e) => setShowTimeInput(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="showTime" className="text-sm text-gray-700">
          Add Time
        </label>
      </div>

      {showTimeInput && (
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="showDuration"
          checked={showDurationInput}
          onChange={(e) => setShowDurationInput(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="showDuration" className="text-sm text-gray-700">
          Add Duration
        </label>
      </div>

      {showDurationInput && (
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (in minutes)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
          />
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="Add any additional notes..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Task
      </button>
    </form>
  );
}
