'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import useLocalStorage from '../hooks/useLocalStorage';

interface Task {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration?: string;
  notes?: string;
  completed: boolean;
  subjectId?: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface AddTaskFormProps {
  onSubmit: (taskData: Task) => void;
  subjects: Subject[];
  initialData?: Task;
  onCancel: () => void;
}

function AddTaskForm({ onSubmit, subjects, initialData, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showTime, setShowTime] = useState(!!initialData?.time);
  const [showDuration, setShowDuration] = useState(!!initialData?.duration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Task = {
      id: initialData?.id,
      title,
      date,
      subjectId,
      time: showTime ? time : undefined,
      duration: showDuration ? duration : undefined,
      notes: notes.trim() || undefined,
      completed: initialData?.completed || false
    };
    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-lg mb-2">
          Task Title
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

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showDuration}
            onChange={(e) => setShowDuration(e.target.checked)}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-lg">Add Duration</span>
        </label>
        {showDuration && (
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Duration in minutes"
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
          {initialData ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

export default function TaskList() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);

  useEffect(() => {
    const updatedTasks = tasks.filter(task => {
      if (!task.subjectId) return true;
      return subjects.some(subject => subject.id === task.subjectId);
    });
    
    if (updatedTasks.length !== tasks.length) {
      setTasks(updatedTasks);
    }
  }, [subjects, tasks]);

  const filteredTasks = selectedSubject
    ? tasks.filter(task => task.subjectId === selectedSubject)
    : tasks;

  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#e5e7eb'; // default gray if no subject found
  };

  const getSubjectName = (subjectId: string | undefined) => {
    if (!subjectId) return '';
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || '';
  };

  const handleAddTask = (taskData: Task) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      date: taskData.date,
      time: taskData.time,
      duration: taskData.duration,
      notes: taskData.notes,
      completed: false,
      subjectId: taskData.subjectId
    };

    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });

    setShowAddModal(false);
    setShowTime(false);
    setShowDuration(false);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    setTaskToDelete(null);
  };

  const handleEditTask = (taskId: string, taskData: Task) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...taskData } : task
    ));
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const toggleEditDropdown = (taskId: string | null) => {
    setShowEditDropdown(showEditDropdown === taskId ? null : taskId);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-1"
        >
          <span>+</span>
          <span>New Task</span>
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

      {/* Active Tasks */}
      {activeTasks.length === 0 && !showCompleted && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-lg">No upcoming tasks</p>
        </div>
      )}

      {activeTasks.length > 0 && (
        <div className="space-y-4">
          {activeTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow-sm border-l-4`}
              style={{ borderLeftColor: getSubjectColor(task.subjectId) }}
            >
              <div className="flex items-center space-x-4 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <h3 className="text-lg font-medium">{task.title}</h3>
                  <div className="text-sm text-gray-600">
                    <div>{getSubjectName(task.subjectId)}</div>
                    <div>{task.date}</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleEditDropdown(task.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {showEditDropdown === task.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          handleEdit(task);
                          toggleEditDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setTaskToDelete(task);
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

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
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
            <span className="ml-2">Completed Tasks ({completedTasks.length})</span>
          </button>

          {showCompleted && (
            <div className="mt-4 space-y-4">
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow-sm border-l-4`}
                  style={{ borderLeftColor: getSubjectColor(task.subjectId) }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-500 line-through">
                        {task.title}
                      </h3>
                      <div className="text-sm text-gray-400">
                        <div>{getSubjectName(task.subjectId)}</div>
                        <div>{task.date}</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleEditDropdown(task.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                    {showEditDropdown === task.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                        <div className="py-1" role="menu">
                          <button
                            onClick={() => {
                              handleEdit(task);
                              toggleEditDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setTaskToDelete(task);
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

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <AddTaskForm
              onSubmit={(taskData) => {
                if (editingTask) {
                  handleEditTask(editingTask.id, taskData);
                } else {
                  handleAddTask(taskData);
                }
                setShowAddModal(false);
                setEditingTask(null);
              }}
              subjects={subjects}
              initialData={editingTask || undefined}
              onCancel={() => {
                setShowAddModal(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Delete Task</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{taskToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(taskToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
