import { Link } from 'react-router';

const navItems = [
  { label: 'Home', to: '/', icon: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg>
  ) },
  { label: 'Map', to: '/map-view', icon: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 23 22 23 6 12 13 1 6"/></svg>
  ) },
  { label: 'Report', to: '/report', icon: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="12"/><line x1="14" y1="10" x2="14" y2="18"/><line x1="10" y1="14" x2="18" y2="14"/></svg>
  ) },
  { label: 'Leaderboard', to: '/leaderboard', icon: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="17" width="4" height="5"/><rect x="9" y="12" width="4" height="10"/><rect x="16" y="7" width="4" height="15"/></svg>
  ) },
  { label: 'Profile', to: '/user-dashboard', icon: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M2 20c0-4 8-6 10-6s10 2 10 6"/></svg>
  ) },
];

const MobileBottomNav = () => (
  <nav className="mobile-bottom-nav">
    {navItems.map((item) => (
      <Link to={item.to} key={item.label} className="mobile-nav-item">
        <span className="icon">{item.icon}</span>
        <span className="label">{item.label}</span>
      </Link>
    ))}
  </nav>
);

export default MobileBottomNav; 