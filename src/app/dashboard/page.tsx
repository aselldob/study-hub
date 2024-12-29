'use client';

import { TaskList, Calendar, UpcomingExams, Subjects } from '../../components/ClientComponents';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
      }
    };

    checkUser();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Study Hub
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Calendar />
            </div>
          </div>

          {/* Right Sidebar - Takes up 1 column on large screens */}
          <div className="space-y-6">
            {/* Subjects Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Subjects />
            </div>

            {/* Tasks Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <TaskList />
            </div>

            {/* Upcoming Exams Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <UpcomingExams />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
