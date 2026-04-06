import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const TOAST_THEMES = {
  success: {
    title: 'Success',
    icon: FiCheckCircle,
    iconClassName: 'text-emerald-300',
    panelClassName: 'border-emerald-500/30 bg-[#07130d]/95',
    glowClassName: 'from-emerald-400 via-emerald-500 to-transparent',
  },
  error: {
    title: 'Error',
    icon: FiAlertCircle,
    iconClassName: 'text-red-300',
    panelClassName: 'border-red-500/30 bg-[#160809]/95',
    glowClassName: 'from-red-400 via-red-500 to-transparent',
  },
  info: {
    title: 'Notice',
    icon: FiInfo,
    iconClassName: 'text-[tomato]',
    panelClassName: 'border-[tomato]/30 bg-[#140c09]/95',
    glowClassName: 'from-[tomato] via-orange-400 to-transparent',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutMapRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timeoutId = timeoutMapRef.current.get(id);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutMapRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 3500 }) => {
      if (!message) {
        return null;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const nextToast = {
        id,
        type,
        title,
        message,
      };

      setToasts((current) => [...current, nextToast].slice(-4));

      const timeoutId = window.setTimeout(() => {
        removeToast(id);
      }, duration);

      timeoutMapRef.current.set(id, timeoutId);
      return id;
    },
    [removeToast],
  );

  useEffect(() => {
    return () => {
      timeoutMapRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutMapRef.current.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      removeToast,
      success: (message, options = {}) => showToast({ ...options, type: 'success', message }),
      error: (message, options = {}) => showToast({ ...options, type: 'error', message }),
      info: (message, options = {}) => showToast({ ...options, type: 'info', message }),
    }),
    [removeToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[2200] flex w-[min(92vw,24rem)] flex-col gap-3">
        {toasts.map((toast) => {
          const theme = TOAST_THEMES[toast.type] || TOAST_THEMES.info;
          const Icon = theme.icon;

          return (
            <div
              key={toast.id}
              className={`toast-card pointer-events-auto relative overflow-hidden rounded-2xl border p-4 text-white shadow-[0_18px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl ${theme.panelClassName}`}
            >
              <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${theme.glowClassName}`} />

              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full border border-white/10 bg-white/5 p-2 ${theme.iconClassName}`}>
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">
                    {toast.title || theme.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/90">{toast.message}</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-full p-1 text-white/50 transition-colors duration-200 hover:text-white"
                  aria-label="Close notification"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.');
  }

  return context;
};
