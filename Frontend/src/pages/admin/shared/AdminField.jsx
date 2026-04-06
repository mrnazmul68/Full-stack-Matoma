import React from 'react';

export const adminTextInputClassName =
  'w-full rounded-2xl border border-red-900/35 bg-black/50 px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-gray-600 focus:border-[tomato]';

export const adminTextAreaClassName = `${adminTextInputClassName} min-h-[120px] resize-y`;

const AdminField = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.22em] text-[#bbbbbb]">
      {label}
    </span>
    {children}
  </label>
);

export default AdminField;
