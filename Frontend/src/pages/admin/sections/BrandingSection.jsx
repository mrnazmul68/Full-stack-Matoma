import React from 'react';
import AdminField, { adminTextInputClassName } from '../shared/AdminField';
import AdminImagePicker from '../shared/AdminImagePicker';
import AdminSectionCard from '../shared/AdminSectionCard';

const BrandingSection = ({ formData, updateField, handleImageChange, ...sectionCardProps }) => (
  <AdminSectionCard
    title="Branding"
    description="Control the site name and the shared logo used in the header, footer, and profile fallback."
    {...sectionCardProps}
  >
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <AdminField label="Site Name">
        <input
          type="text"
          value={formData.brand.siteName}
          onChange={(event) => updateField(['brand', 'siteName'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminImagePicker
        label="Logo Image"
        previewSrc={formData.brand.logo}
        previewAlt="Brand logo preview"
        actionLabel="Upload Logo"
        onChange={(file) => handleImageChange(['brand', 'logo'], file)}
      />
    </div>
  </AdminSectionCard>
);

export default BrandingSection;
