import React from 'react';

const StatusPill = ({ status }) => {
  const getPillStyles = () => {
    switch (status) {
      case 'Present':
        return 'bg-[#dcfce7] text-[#15803d]';
      case 'Absent':
        return 'bg-[#fee2e2] text-[#dc2626]';
      case 'Pending':
      case 'On leave':
      case 'Late':
      default:
        return 'bg-[#ffedd5] text-[#c2410c]';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide ${getPillStyles()}`}
    >
      {status}
    </span>
  );
};

export default StatusPill;
