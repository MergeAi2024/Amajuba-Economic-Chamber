import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '/about' },
    { title: 'Blog', path: '/blog' },
    { title: 'Chat', path: '/chat' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100 overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Amajuba Economic Chamber Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const sibling = target.nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.classList.remove('hidden');
                  }} 
                />
                <div className="hidden w-full h-full bg-chamber-navy flex-col items-center justify-center text-white">
                  <div className="w-6 h-6 border-t-2 border-r-2 border-chamber-lightgold rotate-45 transform -translate-x-1 translate-y-1"></div>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-chamber-navy text-lg uppercase">
                  AMAJUBA
                </span>
                <span className="font-medium text-[9px] text-slate-500 tracking-widest uppercase mt-1">
                  Economic Chamber of Commerce
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-chamber-navy border-b-2 border-chamber-lightgold -mb-[2px] pb-[22px]'
                      : 'text-slate-600 hover:text-chamber-navy'
                  }`
                }
              >
                {link.title}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-chamber-navy border-b-2 border-chamber-lightgold -mb-[2px] pb-[22px]'
                        : 'text-slate-600 hover:text-chamber-navy'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="ml-4 px-5 py-2 border border-slate-200 text-sm font-semibold rounded-full hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="ml-4 px-5 py-2 bg-chamber-navy text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-chamber-navy/20"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/register"
              className="ml-4 px-5 py-2 bg-chamber-navy text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-lg shadow-chamber-navy/20"
            >
              Member Portal
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-chamber-blue focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-3 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-slate-50 text-chamber-blue'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-chamber-blue'
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-3 rounded-md text-base font-medium ${
                        isActive
                          ? 'bg-slate-50 text-chamber-blue'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-chamber-blue'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      void signOut();
                      setIsOpen(false);
                    }}
                    className="mt-2 w-full text-left px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-chamber-blue"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full text-center px-5 py-3 bg-chamber-blue text-white text-base font-medium rounded-md hover:bg-chamber-navy transition-colors"
                >
                  Sign in
                </Link>
              )}
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full text-center px-5 py-3 bg-chamber-blue text-white text-base font-medium rounded-md hover:bg-chamber-navy transition-colors"
              >
                Member Registration
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
