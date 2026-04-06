import React, { useEffect, useRef, useState } from 'react';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useSiteContent } from './SiteContentProvider';
import { adminAuthService } from '../services/adminAuthService';
import { authService } from '../services/authService';

let hasClearedLegacyUserStorage = false;

const navigationItems = [
  { label: 'Home', id: 'home' },
  { label: 'Donor', id: 'donor' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

const Header = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentUser, setCurrentUser] = useState(() => {
    const cachedUser = authService.getCachedSession();
    return typeof cachedUser === 'undefined' ? null : cachedUser;
  });
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const cachedAdmin = adminAuthService.getCachedSession();
    return typeof cachedAdmin === 'undefined' ? null : cachedAdmin;
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { siteContent } = useSiteContent();
  const emailLink = siteContent.footer.socialItems.find((item) => item.type === 'gmail');

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }

    return undefined;
  }, [lastScrollY]);

  useEffect(() => {
    if (!hasClearedLegacyUserStorage && typeof window !== 'undefined') {
      hasClearedLegacyUserStorage = true;
      window.localStorage.removeItem('user');
    }

    const syncUser = async ({ forceRefresh = false } = {}) => {
      const [sessionUser, sessionAdmin] = await Promise.all([
        authService.getSession({ forceRefresh }),
        adminAuthService.getSession({ forceRefresh }),
      ]);

      if (sessionUser) {
        setCurrentUser(sessionUser);
      } else {
        setCurrentUser(null);
      }

      setCurrentAdmin(sessionAdmin);
    };

    syncUser();

    const handleFocus = () => syncUser({ forceRefresh: true });
    const handleUserAuthChanged = () => syncUser();
    const handleAdminAuthChanged = () => syncUser();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('user-auth-changed', handleUserAuthChanged);
    window.addEventListener('admin-auth-changed', handleAdminAuthChanged);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('user-auth-changed', handleUserAuthChanged);
      window.removeEventListener('admin-auth-changed', handleAdminAuthChanged);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setShowProfileMenu(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleAdminLogout = async () => {
    await adminAuthService.logout();
    setCurrentAdmin(null);
    setShowProfileMenu(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <section id="header" className="text-[#333232]">
      <div
        className={`nav-container fixed left-3 right-3 top-3 z-[999] transition-all duration-300 sm:left-4 sm:right-4 sm:top-4 md:left-8 md:right-8 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[120%] opacity-0'
        }`}
      >
        <nav className="nav flex items-center justify-between rounded-2xl border border-red-900/50 bg-[#0b0a0abf] p-2.5 shadow-[0_0_20px_rgba(255,0,0,0.3)] shadow-lg backdrop-blur-md sm:p-3 lg:p-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              className="h-[35px] w-[35px] shrink-0 overflow-hidden rounded-full border-2 border-[tomato] lg:h-[45px] lg:w-[45px]"
            >
              <img
                src={siteContent.brand.logo}
                alt={`${siteContent.brand.siteName} logo`}
                className="h-full w-full object-cover"
              />
            </Link>
            <h2 className="hidden truncate text-[18px] font-bold tracking-tighter text-white sm:block md:text-[24px]">
              {siteContent.brand.siteName}
            </h2>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {navigationItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group relative h-4 overflow-hidden text-[0.8rem] font-medium uppercase leading-none text-white no-underline lg:text-[0.9rem]"
              >
                <div className="transition-all duration-500 ease-in-out group-hover:-translate-y-4">
                  <span className={`block h-4 ${activeSection === item.id ? 'text-[tomato]' : ''}`}>
                    {item.label}
                  </span>
                  <span className="block h-4 text-[tomato]">{item.label}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="signin-container relative" ref={profileMenuRef}>
              {currentUser?.email ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full border-2 border-[tomato] bg-black/40 shadow-lg transition-transform duration-300 hover:scale-105 sm:h-[46px] sm:w-[46px]"
                    aria-label="Open profile menu"
                  >
                    <img
                      src={currentUser.photo || siteContent.brand.logo}
                      alt={currentUser.name || 'Profile'}
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full z-[1001] mt-2 w-[min(88vw,220px)] rounded-[20px] border border-red-900/40 bg-[#0b0a0af2] p-3 shadow-[0_0_25px_rgba(255,0,0,0.18)] backdrop-blur-md">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] text-white no-underline transition-colors duration-300 hover:bg-[tomato] hover:text-black"
                      >
                        <FiUser size={16} />
                        Profile
                      </Link>
                      {currentAdmin?.email && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] text-white no-underline transition-colors duration-300 hover:bg-[tomato] hover:text-black"
                        >
                          <FiSettings size={16} />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[tomato] hover:text-black"
                      >
                        <FiLogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  )}
                </>
              ) : currentAdmin?.email ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="inline-block rounded-full bg-[tomato] px-4 py-2.5 text-[0.75rem] font-medium uppercase leading-none text-white shadow-lg transition-all duration-500 hover:scale-105 hover:bg-black sm:px-6 sm:py-3 sm:text-[0.8rem] lg:text-[0.9rem]"
                  >
                    Admin
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full z-[1001] mt-2 w-[min(88vw,220px)] rounded-[20px] border border-red-900/40 bg-[#0b0a0af2] p-3 shadow-[0_0_25px_rgba(255,0,0,0.18)] backdrop-blur-md">
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] text-white no-underline transition-colors duration-300 hover:bg-[tomato] hover:text-black"
                      >
                        <FiSettings size={16} />
                        Admin Panel
                      </Link>
                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[tomato] hover:text-black"
                      >
                        <FiLogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-block rounded-full bg-[tomato] px-4 py-2.5 text-[0.75rem] font-medium uppercase leading-none text-white no-underline shadow-lg transition-all duration-500 hover:scale-105 hover:bg-black sm:px-6 sm:py-3 sm:text-[0.8rem] lg:text-[0.9rem]"
                >
                  Login
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="cursor-pointer p-1 text-[tomato]"
                aria-label="Open Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-[1000] transform bg-black transition-transform duration-500 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-6 sm:p-8">
          <div className="mb-10 flex items-center justify-between sm:mb-12">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-[tomato] bg-white"
            >
              <img
                src={siteContent.brand.logo}
                alt={`${siteContent.brand.siteName} logo`}
                className="h-full w-full object-cover"
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="cursor-pointer p-2 text-[tomato]"
              aria-label="Close Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:gap-8">
            {navigationItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsMenuOpen(false)}
                className="group relative h-7 overflow-hidden text-[1.9rem] font-medium uppercase tracking-tighter text-white no-underline sm:h-8 sm:text-3xl"
              >
                <div className="transition-all duration-500 ease-in-out group-hover:-translate-y-full">
                  <span className={`block h-7 sm:h-8 ${activeSection === item.id ? 'text-[tomato]' : ''}`}>
                    {item.label}
                  </span>
                  <span className="block h-7 text-[tomato] sm:h-8">{item.label}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-auto pb-6 sm:pb-8">
            <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
              {siteContent.footer.socialTitle}
            </p>
            <a
              href={emailLink?.href || 'mailto:manobota@gmail.com'}
              className="text-xl text-white no-underline transition-colors hover:text-[tomato]"
            >
              {emailLink?.value || 'manobota@gmail.com'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
