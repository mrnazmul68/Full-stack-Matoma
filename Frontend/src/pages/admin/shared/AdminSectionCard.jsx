import React from 'react';
import { FiSave } from 'react-icons/fi';

const AdminSectionCard = ({ title, description, children, isSaving = false }) => (
  <section className="rounded-[32px] border border-red-900/40 bg-[#0b0a0abf] p-5 shadow-[0_0_28px_rgba(255,0,0,0.12)] backdrop-blur-md sm:p-6 md:p-8">
    <div className="mb-6">
      <h2 className="text-2xl font-black text-white md:text-[30px]">{title}</h2>
      <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[#cbcbcb]">{description}</p>
    </div>

    <div className="space-y-5">{children}</div>

    <div className="mt-6 flex border-t border-red-900/25 pt-5 sm:justify-end">
      <button
        type="submit"
        form="admin-content-form"
        disabled={isSaving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[tomato] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        <FiSave size={16} />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  </section>
);

export default AdminSectionCard;
