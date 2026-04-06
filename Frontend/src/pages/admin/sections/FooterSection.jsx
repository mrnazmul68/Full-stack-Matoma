import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminField, {
  adminTextAreaClassName,
  adminTextInputClassName,
} from '../shared/AdminField';
import AdminSectionCard from '../shared/AdminSectionCard';

const FooterSection = ({
  formData,
  updateField,
  updateArrayItem,
  addFooterSocialItem,
  removeFooterSocialItem,
  ...sectionCardProps
}) => (
  <AdminSectionCard
    title="Footer Section"
    description="Control the footer badge, text, contact links, and developer credit."
    {...sectionCardProps}
  >
    <div className="grid gap-5 md:grid-cols-2">
      <AdminField label="Footer Badge">
        <input
          type="text"
          value={formData.footer.badge}
          onChange={(event) => updateField(['footer', 'badge'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Social Title">
        <input
          type="text"
          value={formData.footer.socialTitle}
          onChange={(event) => updateField(['footer', 'socialTitle'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>
    </div>

    <AdminField label="Footer Description">
      <textarea
        value={formData.footer.description}
        onChange={(event) => updateField(['footer', 'description'], event.target.value)}
        className={adminTextAreaClassName}
      />
    </AdminField>

    <div className="flex flex-col gap-4 rounded-[24px] border border-red-900/30 bg-black/30 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#bbbbbb]">
            Footer Links
          </p>
          <p className="mt-2 text-[14px] leading-6 text-[#c6c6c6]">
            Create, update, and delete footer social links from here.
          </p>
        </div>

        <button
          type="button"
          onClick={addFooterSocialItem}
          className="inline-flex items-center gap-2 rounded-full bg-[tomato] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-500"
        >
          <FiPlus size={16} />
          Add Footer Link
        </button>
      </div>

      {formData.footer.socialItems.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {formData.footer.socialItems.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              className="rounded-[24px] border border-red-900/30 bg-black/35 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[tomato]">
                  Footer Link {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeFooterSocialItem(index)}
                  className="inline-flex items-center gap-1 rounded-full border border-red-900/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ffb7b0] transition-colors duration-200 hover:border-red-500 hover:bg-red-500/10 hover:text-white"
                >
                  <FiTrash2 size={12} />
                  Delete
                </button>
              </div>

              <div className="space-y-4">
                <AdminField label="Type">
                  <select
                    value={item.type}
                    onChange={(event) =>
                      updateArrayItem(['footer', 'socialItems'], index, 'type', event.target.value)
                    }
                    className={adminTextInputClassName}
                  >
                    <option value="facebook">Facebook</option>
                    <option value="gmail">Gmail</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </AdminField>

                <AdminField label="Label">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(event) =>
                      updateArrayItem(['footer', 'socialItems'], index, 'label', event.target.value)
                    }
                    className={adminTextInputClassName}
                  />
                </AdminField>

                <AdminField label="Value">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(event) =>
                      updateArrayItem(['footer', 'socialItems'], index, 'value', event.target.value)
                    }
                    className={adminTextInputClassName}
                  />
                </AdminField>

                <AdminField label="Link">
                  <input
                    type="text"
                    value={item.href}
                    onChange={(event) =>
                      updateArrayItem(['footer', 'socialItems'], index, 'href', event.target.value)
                    }
                    className={adminTextInputClassName}
                  />
                </AdminField>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-red-900/40 bg-black/35 px-5 py-10 text-center">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[#bdbdbd]">
            No footer links
          </p>
          <p className="mt-3 text-[14px] leading-6 text-[#9e9e9e]">
            Add a footer link to show social or contact actions.
          </p>
        </div>
      )}
    </div>

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <AdminField label="Developer Prefix">
        <input
          type="text"
          value={formData.footer.developerPrefix}
          onChange={(event) => updateField(['footer', 'developerPrefix'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Developer Name">
        <input
          type="text"
          value={formData.footer.developerName}
          onChange={(event) => updateField(['footer', 'developerName'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Developer Link">
        <input
          type="text"
          value={formData.footer.developerLink}
          onChange={(event) => updateField(['footer', 'developerLink'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Year">
        <input
          type="text"
          value={formData.footer.year}
          onChange={(event) => updateField(['footer', 'year'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>
    </div>
  </AdminSectionCard>
);

export default FooterSection;
