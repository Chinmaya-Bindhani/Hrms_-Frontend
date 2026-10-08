import React from 'react';
import StatsRow from '../common/StatsRow';
import Sidebar from '../common/Sidebar';

import TeamTable from './hr/TeamTable';
import RequestsCard from './hr/RequestsCard';
import CoverageCard from './hr/CoverageCard';

const HRDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  return (
  <div className="min-h-screen bg-[#f4f6f5] text-gray-900 font-sans">
    <Sidebar user={user} onLogout={handleLogout} />

    <div className="ml-[220px] p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">


        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-medium text-gray-500">
            HR workspace / Dashboard
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
            <span>Monday, 5 October 2026 · IST</span>
            <button
              aria-label="Notifications"
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Good morning, Neha
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              A clear view of your people, today.
            </p>
          </div>

          <button className="self-start sm:self-auto px-5 py-2.5 bg-[#0f5f56] hover:bg-[#0c4e46] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer">
            Review 6 requests
          </button>
        </div>

        <StatsRow />

        {/* Main Content Grid: Team Attendance + Requests/Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Team attendance */}
          <div className="lg:col-span-7 xl:col-span-7 h-full">
            <TeamTable />
          </div>

          {/* Right Column: Recent requests & Attendance coverage */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6">
            <RequestsCard />
            <CoverageCard />
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default HRDashboard;
