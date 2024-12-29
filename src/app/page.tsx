'use client';

import { TaskList, Calendar, UpcomingExams, Subjects } from '../components/ClientComponents';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <div className="text-white text-6xl font-black tracking-tight hover:scale-105 transition-transform duration-200 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white animate-gradient">Study Hub</div>
          <div className="space-x-4">
            <Link 
              href="/auth/signin" 
              className="text-white hover:text-indigo-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-16">
          <div className="lg:w-1/2 text-white space-y-8 mb-12 lg:mb-0">
            <h1 className="text-5xl font-bold leading-tight">
              Your Ultimate Study Management Platform
            </h1>
            <p className="text-xl text-white/80">
              Study Hub helps you organize your subjects, track tasks, and manage exams all in one place.
              Take control of your academic journey today.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/auth/signup"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-medium hover:bg-indigo-100 transition-all transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                href="#features"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md">
              <div className="space-y-6">
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">Smart Planning</h3>
                  <p className="text-white/80">Intelligent scheduling that adapts to your learning style</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">Progress Tracking</h3>
                  <p className="text-white/80">Monitor your achievements and stay motivated</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">Study Analytics</h3>
                  <p className="text-white/80">Gain insights into your study patterns and improve</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
