// src/components/Layout/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import useStore from '../../store/useStore';
import NotificationsPanel from '../Notifications/NotificationsPanel';

const Navigation = () => {
  const logout = useStore((state) => state.logout);
  const user = useStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'แดชบอร์ด', icon: '📊' },
    { href: '/transactions', label: 'รายการ', icon: '💸' },
    { href: '/reports', label: 'รายงาน', icon: '📈' },
    { href: '/budget', label: 'งบประมาณ', icon: '🎯' },
    { href: '/profile', label: 'โปรไฟล์', icon: '👤' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-pink-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Single Line with Animation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="pig-gradient p-3 rounded-2xl shadow-xl pig-icon group-hover:animate-none">
                <span className="text-2xl text-white">🐷</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  chuaikhep
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Single Line */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  pathname === item.href
                    ? 'text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30'
                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50/80'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Info & Desktop Actions - Single Line */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications Panel */}
            <NotificationsPanel />

            {/* User Profile - Compact */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-rose-50 px-3 py-2 rounded-xl border border-pink-200/60 shadow-sm">
              <div className="w-7 h-7 pig-gradient rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                {user.firstName.charAt(0)}
              </div>
              <span className="text-gray-700 text-sm font-semibold whitespace-nowrap">สวัสดี, {user.firstName}</span>
            </div>

            {/* Logout Button - Compact */}
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg border border-gray-300/50 whitespace-nowrap"
            >
              ออกจากระบบ
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="bg-pink-100 text-pink-600 p-3 rounded-xl hover:bg-pink-200 hover:shadow-lg transition-all duration-300"
              aria-label="เปิดเมนู"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-pink-200/50 shadow-2xl">
            <div className="px-3 py-4 space-y-2">
              {/* Mobile User Info - Single Line */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200/60 mb-3">
                <div className="w-8 h-8 pig-gradient rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user.firstName.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-gray-800 text-sm truncate">{user.firstName} {user.lastName}</span>
                  <span className="text-xs text-gray-600 truncate">@{user.username}</span>
                </div>
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              ))}

              {/* Mobile Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 border border-gray-300/50 mt-3 whitespace-nowrap"
              >
                <span className="text-xl">🚪</span>
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;