const team = [
  { name: 'Aditi Sharma', info: 'Product · Check-in pending', status: 'Pending' },
  { name: 'Rahul Verma', info: 'Engineering · 09:02 am', status: 'Present' },
  { name: 'Sneha Iyer', info: 'Finance · 09:05 am', status: 'Present' },
  { name: 'Karan Patel', info: 'Engineering · No check-in', status: 'Absent' },
  { name: 'Meera Nair', info: 'People · 5–6 Oct approved', status: 'On leave' },
  { name: 'Rohan Desai', info: 'Sales · 09:28 am', status: 'Late' },
];

const requests = [
  { name: 'Aditi Sharma', info: 'Casual leave · 12–13 Oct 2026 · 2 days' },
  { name: 'Rahul Verma', info: 'Casual leave · 9 Oct 2026 · 1 day' },
  { name: 'Sneha Iyer', info: 'Earned leave · 15–16 Oct 2026 · 2 days' },
];

const stats = [
  { label: 'Headcount', value: '128', note: 'Across 6 departments' },
  { label: 'Present today', value: '108', note: 'Includes 4 late check-ins' },
  { label: 'On leave today', value: '8', note: 'Approved for 5 October' },
  { label: 'Pending approvals', value: '6', note: 'Needs your review' },
];

const pillColor = {
  Present: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Pending: 'bg-amber-100 text-amber-700',
  'On leave': 'bg-amber-100 text-amber-700',
  Late: 'bg-amber-100 text-amber-700',
};

const card = 'rounded-xl border border-gray-200 bg-white p-4';
const pill = 'rounded-full px-3 py-1 text-xs font-semibold';