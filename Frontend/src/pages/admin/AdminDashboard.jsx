import React, { useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiMenu,
  FiSettings,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import BrandingSection from './sections/BrandingSection';
import HomeSection from './sections/HomeSection';
import DonorSection from './sections/DonorSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';
import AdminUsersPanel from './AdminUsersPanel';
import { createSiteContentDraft } from '../../content/defaultSiteContent';
import { useSiteContent } from '../../components/SiteContentProvider';
import { useToast } from '../../components/ToastProvider';
import { adminAuthService } from '../../services/adminAuthService';
import { adminUserService } from '../../services/adminUserService';

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });

const settingsSections = [
  {
    id: 'branding',
    component: BrandingSection,
  },
  {
    id: 'home',
    component: HomeSection,
  },
  {
    id: 'donor',
    component: DonorSection,
  },
  {
    id: 'about',
    component: AboutSection,
  },
  {
    id: 'contact',
    component: ContactSection,
  },
  {
    id: 'footer',
    component: FooterSection,
  },
];

const adminNavigationItems = [
  {
    id: 'users',
    label: 'Users',
    icon: FiUsers,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: FiSettings,
  },
];

const createDefaultContactItem = () => ({
  type: 'phone',
  title: 'Phone',
  value: '',
  description: '',
  href: '',
});

const createDefaultFooterSocialItem = () => ({
  type: 'facebook',
  label: 'Facebook',
  value: '',
  href: '',
});

const resolvePathTarget = (root, path) => {
  let cursor = root;

  path.forEach((segment) => {
    cursor = cursor[segment];
  });

  return cursor;
};

const AdminDashboard = () => {
  const { siteContent, saveSiteContent, isLoading, isSaving } = useSiteContent();
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => createSiteContentDraft(siteContent));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [activePanel, setActivePanel] = useState('users');
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeUserAction, setActiveUserAction] = useState(null);

  useEffect(() => {
    setFormData(createSiteContentDraft(siteContent));
  }, [siteContent]);

  useEffect(() => {
    const checkAdminSession = async () => {
      const session = await adminAuthService.getSession();

      if (!session) {
        toast.info('Please log in with the admin email and password on the regular login page.');
        navigate('/login', { replace: true });
        return;
      }

      setIsCheckingAdmin(false);

      setIsUsersLoading(true);

      try {
        const registeredUsers = await adminUserService.getUsers();
        setUsers(registeredUsers);
      } catch (error) {
        toast.error(error.message || 'Unable to load registered users.');
      } finally {
        setIsUsersLoading(false);
      }
    };

    checkAdminSession();
  }, [navigate, toast]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleUsersRefresh = async () => {
    setIsRefreshingUsers(true);

    try {
      const registeredUsers = await adminUserService.getUsers();
      setUsers(registeredUsers);
      toast.success('User list refreshed.');
    } catch (error) {
      toast.error(error.message || 'Unable to refresh registered users.');
    } finally {
      setIsRefreshingUsers(false);
    }
  };

  const handleToggleUserBlock = async (user) => {
    const nextBlockedValue = !user.isBlocked;
    const actionLabel = nextBlockedValue ? 'block' : 'unblock';
    const confirmed = window.confirm(
      `Do you want to ${actionLabel} ${user.name || user.email}?`,
    );

    if (!confirmed) {
      return;
    }

    setActiveUserAction({
      userId: user.id,
      type: 'block',
    });

    try {
      const updatedUser = await adminUserService.updateBlockStatus(user.id, nextBlockedValue);
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id ? updatedUser : currentUser,
        ),
      );
      toast.success(
        nextBlockedValue ? 'User blocked successfully.' : 'User unblocked successfully.',
      );
    } catch (error) {
      toast.error(error.message || 'Unable to update the user status.');
    } finally {
      setActiveUserAction(null);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Do you want to permanently remove ${user.name || user.email}?`,
    );

    if (!confirmed) {
      return;
    }

    setActiveUserAction({
      userId: user.id,
      type: 'delete',
    });

    try {
      await adminUserService.deleteUser(user.id);
      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );
      toast.success('User removed successfully.');
    } catch (error) {
      toast.error(error.message || 'Unable to remove the user.');
    } finally {
      setActiveUserAction(null);
    }
  };

  const updateField = (path, value) => {
    setFormData((current) => {
      const next = createSiteContentDraft(current);
      let cursor = next;

      for (let index = 0; index < path.length - 1; index += 1) {
        cursor = cursor[path[index]];
      }

      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateArrayItem = (path, index, key, value) => {
    setFormData((current) => {
      const next = createSiteContentDraft(current);
      const targetArray = resolvePathTarget(next, path);
      targetArray[index][key] = value;
      return next;
    });
  };

  const appendArrayItem = (path, value) => {
    setFormData((current) => {
      const next = createSiteContentDraft(current);
      const targetArray = resolvePathTarget(next, path);
      targetArray.push(value);
      return next;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData((current) => {
      const next = createSiteContentDraft(current);
      const targetArray = resolvePathTarget(next, path);
      targetArray.splice(index, 1);
      return next;
    });
  };

  const handleImageChange = async (path, file) => {
    if (!file) {
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(file);
      updateField(path, imageDataUrl);
      toast.success('Image selected successfully.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const replaceGalleryImage = async (index, file) => {
    if (!file) {
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(file);
      setFormData((current) => {
        const next = createSiteContentDraft(current);
        next.about.galleryImages[index] = imageDataUrl;
        return next;
      });
      toast.success(`Gallery image ${index + 1} updated.`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addGalleryImage = async (file) => {
    if (!file) {
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(file);
      appendArrayItem(['about', 'galleryImages'], imageDataUrl);
      toast.success('New gallery image added.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeGalleryImage = (index) => {
    removeArrayItem(['about', 'galleryImages'], index);
    toast.info(`Gallery image ${index + 1} removed.`);
  };

  const addContactItem = () => {
    appendArrayItem(['contact', 'items'], createDefaultContactItem());
    toast.success('New contact card added. Save content to publish it.');
  };

  const removeContactItem = (index) => {
    removeArrayItem(['contact', 'items'], index);
    toast.info(`Contact card ${index + 1} removed. Save content to publish it.`);
  };

  const addFooterSocialItem = () => {
    appendArrayItem(['footer', 'socialItems'], createDefaultFooterSocialItem());
    toast.success('New footer link added. Save content to publish it.');
  };

  const removeFooterSocialItem = (index) => {
    removeArrayItem(['footer', 'socialItems'], index);
    toast.info(`Footer link ${index + 1} removed. Save content to publish it.`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await saveSiteContent(formData);
      toast.success('Admin content saved successfully.');
    } catch (error) {
      toast.error(error.message || 'Unable to save admin content.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isSaving;
  const activePanelLabel =
    adminNavigationItems.find((item) => item.id === activePanel)?.label || 'Admin Menu';

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handlePanelSelect = (panelId) => {
    setActivePanel(panelId);
    setIsMobileMenuOpen(false);
  };

  const renderHomeLink = (collapsed = false, onNavigate = undefined) => (
    <Link
      to="/"
      title="Home"
      onClick={onNavigate}
      className={`flex w-full rounded-[24px] border border-white/8 bg-black/20 text-white no-underline transition-all duration-200 hover:border-[tomato]/35 hover:bg-[rgba(255,99,71,0.06)] ${
        collapsed ? 'justify-center px-3 py-4' : 'items-center gap-3 px-4 py-4'
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30">
        <FiHome size={18} />
      </div>
      {!collapsed && (
        <span className="text-sm font-black uppercase tracking-[0.18em]">
          Home
        </span>
      )}
    </Link>
  );

  const renderNavigationItems = (collapsed = false) =>
    adminNavigationItems.map(({ id, label, icon: Icon }) => {
      const isActive = activePanel === id;

      return (
        <button
          key={id}
          type="button"
          onClick={() => handlePanelSelect(id)}
          title={label}
          className={`w-full rounded-[24px] border transition-all duration-200 ${
            isActive
              ? 'border-[tomato]/60 bg-[rgba(255,99,71,0.12)] shadow-[0_0_18px_rgba(255,99,71,0.16)]'
              : 'border-white/8 bg-black/20 hover:border-[tomato]/35 hover:bg-[rgba(255,99,71,0.06)]'
          } ${collapsed ? 'px-3 py-4' : 'px-4 py-4 text-left'}`}
        >
          <div className={`flex ${collapsed ? 'justify-center' : 'items-start gap-3'}`}>
            <div
              className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                isActive
                  ? 'border-[tomato]/40 bg-[rgba(255,99,71,0.18)] text-[tomato]'
                  : 'border-white/10 bg-black/30 text-white'
              }`}
            >
              <Icon size={18} />
            </div>

            {!collapsed && (
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                {label}
              </p>
            )}
          </div>
        </button>
      );
    });

  if (isLoading || isCheckingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <p className="text-center text-[14px] uppercase tracking-[0.28em] text-[#bdbdbd]">
          Loading admin content...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-black px-3 py-4 text-white sm:px-4 sm:py-6 md:px-6 lg:h-screen lg:overflow-hidden lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-4 sm:gap-6">
        <div className="lg:hidden">
          <div className="flex items-center justify-between rounded-[28px] border border-red-900/40 bg-[#0b0a0abf] px-4 py-4 shadow-[0_0_28px_rgba(255,0,0,0.12)] backdrop-blur-md sm:px-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#bbbbbb]">
                Admin Panel
              </p>
              <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                {activePanelLabel}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition-colors duration-200 hover:border-[tomato] hover:text-[tomato]"
              aria-label="Open admin menu"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-[1400] lg:hidden ${
            isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={handleCloseMobileMenu}
            className={`absolute inset-0 bg-black/75 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Close admin menu overlay"
          />

          <aside
            className={`absolute left-0 top-0 h-full w-[min(88vw,360px)] overflow-y-auto border-r border-red-900/40 bg-[#050505f2] p-4 shadow-[0_0_35px_rgba(255,0,0,0.16)] backdrop-blur-md transition-transform duration-300 sm:p-5 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="rounded-[32px] border border-red-900/40 bg-[#0b0a0abf] p-4 shadow-[0_0_28px_rgba(255,0,0,0.12)] backdrop-blur-md sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#bbbbbb]">
                    Admin Panel
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">Admin Menu</h2>
                </div>

                <button
                  type="button"
                  onClick={handleCloseMobileMenu}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition-colors duration-200 hover:border-[tomato] hover:text-[tomato]"
                  aria-label="Close admin menu"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {renderHomeLink(false, handleCloseMobileMenu)}
              </div>

              <div className="mt-6 border-t border-white/4 pt-6">
                <div className="space-y-3">{renderNavigationItems(false)}</div>
              </div>
            </div>
          </aside>
        </div>

        <div
          className={`grid gap-4 sm:gap-6 lg:min-h-0 lg:flex-1 ${
            isSidebarCollapsed
              ? 'lg:grid-cols-[104px_minmax(0,1fr)]'
              : 'lg:grid-cols-[280px_minmax(0,1fr)]'
          }`}
        >
          <aside className="hidden space-y-4 lg:block lg:min-h-0 lg:overflow-y-auto sm:space-y-6">
            <div className="rounded-[32px] border border-red-900/40 bg-[#0b0a0abf] p-4 shadow-[0_0_28px_rgba(255,0,0,0.12)] backdrop-blur-md sm:p-5">
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isSidebarCollapsed && (
                  <h2 className="text-2xl font-black text-white">Admin Menu</h2>
                )}
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
                  className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white transition-colors duration-200 hover:border-[tomato] hover:text-[tomato] lg:inline-flex"
                  aria-label={isSidebarCollapsed ? 'Expand admin menu' : 'Collapse admin menu'}
                >
                  {isSidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
                </button>
              </div>

              <div className={`space-y-3 ${isSidebarCollapsed ? 'mt-4' : 'mt-5 sm:mt-6'}`}>
                {renderHomeLink(isSidebarCollapsed)}
              </div>

              <div className={`border-t border-white/4 ${isSidebarCollapsed ? 'mt-4 pt-4' : 'mt-5 pt-5 sm:mt-6 sm:pt-6'}`}>
                <div className="space-y-3">{renderNavigationItems(isSidebarCollapsed)}</div>
              </div>
            </div>
          </aside>

          <div className="min-w-0 lg:min-h-0 lg:overflow-y-auto">
            {activePanel === 'users' ? (
              <AdminUsersPanel
                users={users}
                isLoading={isUsersLoading}
                isRefreshing={isRefreshingUsers}
                activeAction={activeUserAction}
                onRefresh={handleUsersRefresh}
                onDeleteUser={handleDeleteUser}
                onToggleUserBlock={handleToggleUserBlock}
              />
            ) : (
              <form id="admin-content-form" onSubmit={handleSubmit} className="space-y-6">
                {settingsSections.map(({ id, component: SectionComponent }) => (
                  <SectionComponent
                    key={id}
                    formData={formData}
                    updateField={updateField}
                    updateArrayItem={updateArrayItem}
                    handleImageChange={handleImageChange}
                    replaceGalleryImage={replaceGalleryImage}
                    addGalleryImage={addGalleryImage}
                    removeGalleryImage={removeGalleryImage}
                    addContactItem={addContactItem}
                    removeContactItem={removeContactItem}
                    addFooterSocialItem={addFooterSocialItem}
                    removeFooterSocialItem={removeFooterSocialItem}
                    isSaving={isBusy}
                  />
                ))}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
