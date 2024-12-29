'use client';

import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'task' | 'exam';
  color?: string;
}

interface Task {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration?: string;
  subjectId?: string;
}

interface Exam {
  id: string;
  title: string;
  date: string;
  time?: string;
  subjectId: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

export default function Calendar() {
  const [tasks] = useLocalStorage<Task[]>('tasks', []);
  const [exams] = useLocalStorage<Exam[]>('exams', []);
  const [subjects] = useLocalStorage<Subject[]>('subjects', []);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const taskEvents: CalendarEvent[] = tasks.map(task => {
      const subject = subjects.find(s => s.id === task.subjectId);
      const date = new Date(task.date);
      if (task.time) {
        const [hours, minutes] = task.time.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));
      }
      const end = new Date(date);
      if (task.duration) {
        end.setMinutes(end.getMinutes() + parseInt(task.duration));
      } else {
        end.setHours(end.getHours() + 1); // Default 1 hour duration
      }
      return {
        id: task.id,
        title: task.title,
        start: date,
        end: end,
        type: 'task',
        color: subject?.color,
      };
    });

    const examEvents: CalendarEvent[] = exams.map(exam => {
      const subject = subjects.find(s => s.id === exam.subjectId);
      const date = new Date(exam.date);
      if (exam.time) {
        const [hours, minutes] = exam.time.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));
      }
      const end = new Date(date);
      end.setHours(end.getHours() + 2); // Default 2 hour duration for exams
      return {
        id: exam.id,
        title: exam.title,
        start: date,
        end: end,
        type: 'exam',
        color: subject?.color,
      };
    });

    setEvents([...taskEvents, ...examEvents]);
  }, [tasks, exams, subjects, isLoading]);

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3182ce',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
      },
    };
  };

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view}
        onView={setView}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day', 'agenda']}
      />
    </div>
  );
}
