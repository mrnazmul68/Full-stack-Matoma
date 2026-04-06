import React from 'react';
import AdminField, { adminTextInputClassName } from '../shared/AdminField';
import AdminSectionCard from '../shared/AdminSectionCard';

const DonorSection = ({ formData, updateField, ...sectionCardProps }) => (
  <AdminSectionCard
    title="Donor Section"
    description="Manage the donor search heading, supporting text, and button label."
    {...sectionCardProps}
  >
    <div className="grid gap-5 md:grid-cols-3">
      <AdminField label="Section Title">
        <input
          type="text"
          value={formData.donor.title}
          onChange={(event) => updateField(['donor', 'title'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Section Subtitle">
        <input
          type="text"
          value={formData.donor.subtitle}
          onChange={(event) => updateField(['donor', 'subtitle'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Button Label">
        <input
          type="text"
          value={formData.donor.buttonLabel}
          onChange={(event) => updateField(['donor', 'buttonLabel'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>
    </div>
  </AdminSectionCard>
);

export default DonorSection;
