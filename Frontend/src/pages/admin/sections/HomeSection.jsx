import React from 'react';
import AdminField, {
  adminTextAreaClassName,
} from '../shared/AdminField';
import AdminSectionCard from '../shared/AdminSectionCard';

const HomeSection = ({ formData, updateField, ...sectionCardProps }) => (
  <AdminSectionCard
    title="Home Section"
    description="Edit the hero title, subtitle, and poem shown on the landing section."
    {...sectionCardProps}
  >
    <div className="grid gap-5 md:grid-cols-2">
      <AdminField label="Home Title">
        <textarea
          value={formData.home.title}
          onChange={(event) => updateField(['home', 'title'], event.target.value)}
          className={`${adminTextAreaClassName} min-h-[100px]`}
        />
      </AdminField>

      <AdminField label="Home Subtitle">
        <textarea
          value={formData.home.subtitle}
          onChange={(event) => updateField(['home', 'subtitle'], event.target.value)}
          className={`${adminTextAreaClassName} min-h-[100px]`}
        />
      </AdminField>
    </div>

    <AdminField label="Home Poem">
      <textarea
        value={formData.home.poem}
        onChange={(event) => updateField(['home', 'poem'], event.target.value)}
        className={adminTextAreaClassName}
      />
    </AdminField>
  </AdminSectionCard>
);

export default HomeSection;
