import React from 'react';
import { FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminField, {
  adminTextAreaClassName,
  adminTextInputClassName,
} from '../shared/AdminField';
import AdminImagePicker from '../shared/AdminImagePicker';
import AdminSectionCard from '../shared/AdminSectionCard';

const AboutSection = ({
  formData,
  updateField,
  replaceGalleryImage,
  addGalleryImage,
  removeGalleryImage,
  handleImageChange,
  ...sectionCardProps
}) => (
  <AdminSectionCard
    title="About Section"
    description="Update the About heading, description, quote, developer info, and gallery images."
    {...sectionCardProps}
  >
    <div className="grid gap-5 md:grid-cols-2">
      <AdminField label="Section Title">
        <input
          type="text"
          value={formData.about.title}
          onChange={(event) => updateField(['about', 'title'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Section Subtitle">
        <input
          type="text"
          value={formData.about.subtitle}
          onChange={(event) => updateField(['about', 'subtitle'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>
    </div>

    <AdminField label="About Description">
      <textarea
        value={formData.about.description}
        onChange={(event) => updateField(['about', 'description'], event.target.value)}
        className={adminTextAreaClassName}
      />
    </AdminField>

    <AdminField label="Bottom Quote">
      <textarea
        value={formData.about.quote}
        onChange={(event) => updateField(['about', 'quote'], event.target.value)}
        className={`${adminTextAreaClassName} min-h-[100px]`}
      />
    </AdminField>

    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <AdminField label="Developer Name">
        <input
          type="text"
          value={formData.about.developerName}
          onChange={(event) => updateField(['about', 'developerName'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminImagePicker
        label="Developer Image"
        previewSrc={formData.about.developerImage}
        previewAlt="Developer preview"
        actionLabel="Upload Developer Image"
        onChange={(file) => handleImageChange(['about', 'developerImage'], file)}
        previewWrapperClassName="flex h-[110px] w-[80px] items-center justify-center overflow-hidden rounded-[16px] border border-[tomato] bg-black/40"
        imageClassName="h-full w-full object-cover grayscale"
      />
    </div>

    <div className="rounded-[24px] border border-red-900/30 bg-black/30 p-4">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#bbbbbb]">
            About Gallery Images
          </p>
          <p className="mt-2 text-[14px] leading-6 text-[#c6c6c6]">
            Add more images, replace any image, or delete images you no longer need.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[tomato] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-500">
          <FiPlus size={16} />
          Add Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => addGalleryImage(event.target.files?.[0])}
          />
        </label>
      </div>

      {formData.about.galleryImages.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {formData.about.galleryImages.map((image, index) => (
            <div
              key={`gallery-image-${index + 1}`}
              className="rounded-[24px] border border-red-900/30 bg-black/35 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbbbbb]">
                  Image {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="inline-flex items-center gap-1 rounded-full border border-red-900/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ffb7b0] transition-colors duration-200 hover:border-red-500 hover:bg-red-500/10 hover:text-white"
                >
                  <FiTrash2 size={12} />
                  Delete
                </button>
              </div>

              <div className="h-[170px] overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-red-900/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-[tomato] hover:text-[tomato]">
                <FiImage size={16} />
                Replace
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => replaceGalleryImage(index, event.target.files?.[0])}
                />
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-red-900/40 bg-black/35 px-5 py-10 text-center">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[#bdbdbd]">
            No gallery images
          </p>
          <p className="mt-3 text-[14px] leading-6 text-[#9e9e9e]">
            Add a new image to show the About gallery again.
          </p>
        </div>
      )}
    </div>
  </AdminSectionCard>
);

export default AboutSection;
