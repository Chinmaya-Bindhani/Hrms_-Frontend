import React from 'react';

export const team = [
  { name: 'Aditi Sharma', info: 'Product · Check-in pending', status: 'Pending' },
  { name: 'Rahul Verma', info: 'Engineering · 09:02 am', status: 'Present' },
  { name: 'Sneha Iyer', info: 'Finance · 09:05 am', status: 'Present' },
  { name: 'Karan Patel', info: 'Engineering · No check-in', status: 'Absent' },
  { name: 'Meera Nair', info: 'People · 5–6 Oct approved', status: 'On leave' },
  { name: 'Rohan Desai', info: 'Sales · 09:28 am', status: 'Late' },
];

export const requests = [
  { name: 'Aditi Sharma', info: 'Casual leave · 12–13 Oct 2026 · 2 days' },
  { name: 'Rahul Verma', info: 'Casual leave · 9 Oct 2026 · 1 day' },
  { name: 'Sneha Iyer', info: 'Earned leave · 15–16 Oct 2026 · 2 days' },
];

export const stats = [
  {
    label: 'Headcount',
    value: '128',
    note: 'Across 6 departments',
    icon: (
      <svg className="w-5 h-5 text-[#0d766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: 'Present today',
    value: '108',
    note: 'Includes 4 late check-ins',
    icon: (
      <svg className="w-5 h-5 text-[#0d766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'On leave today',
    value: '8',
    note: 'Approved for 5 October',
    icon: (
      <svg className="w-5 h-5 text-[#0d766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.253M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
  },
  {
    label: 'Pending approvals',
    value: '6',
    note: 'Needs your review',
    icon: (
      <svg className="w-5 h-5 text-[#0d766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.375v4.875A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25v-4.875M2.25 13.5l1.65-7.424A2.25 2.25 0 016.1 4.5h11.8a2.25 2.25 0 012.2 1.576l1.65 7.424" />
      </svg>
    ),
  },
];