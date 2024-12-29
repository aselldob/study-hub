'use client';

import dynamic from 'next/dynamic';

export const TaskList = dynamic(() => import('./TaskList'), {
  ssr: false,
});

export const Calendar = dynamic(() => import('./Calendar'), {
  ssr: false,
});

export const UpcomingExams = dynamic(() => import('./UpcomingExams'), {
  ssr: false,
});

export const Subjects = dynamic(() => import('./Subjects'), {
  ssr: false,
});

export const Lectures = dynamic(() => import('./Lectures'), {
  ssr: false,
});
