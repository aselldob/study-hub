'use client';

import SubjectLectures from '@/components/SubjectLectures';

export default function SubjectPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <SubjectLectures subjectId={params.id} />
      </div>
    </main>
  );
}
