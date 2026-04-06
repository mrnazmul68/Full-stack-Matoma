import React from 'react';
import { FiImage } from 'react-icons/fi';

const AdminImagePicker = ({
  label,
  previewSrc,
  previewAlt,
  actionLabel,
  onChange,
  imageClassName = 'h-full w-full object-cover',
  previewWrapperClassName = 'flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full border border-[tomato] bg-black/40',
  accept = 'image/*',
}) => (
  <div className="rounded-[24px] border border-red-900/30 bg-black/30 p-4">
    <span className="mb-3 block text-[11px] font-black uppercase tracking-[0.22em] text-[#bbbbbb]">
      {label}
    </span>
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className={previewWrapperClassName}>
        <img src={previewSrc} alt={previewAlt} className={imageClassName} />
      </div>
      <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-red-900/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-[tomato] hover:text-[tomato] sm:w-auto">
        <FiImage size={16} />
        {actionLabel}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => onChange(event.target.files?.[0])}
        />
      </label>
    </div>
  </div>
);

export default AdminImagePicker;
