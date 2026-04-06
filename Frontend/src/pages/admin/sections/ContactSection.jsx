import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminField, {
  adminTextAreaClassName,
  adminTextInputClassName,
} from '../shared/AdminField';
import AdminSectionCard from '../shared/AdminSectionCard';

const ContactSection = ({
  formData,
  updateField,
  updateArrayItem,
  addContactItem,
  removeContactItem,
  ...sectionCardProps
}) => (
  <AdminSectionCard
    title="Contact Section"
    description="Edit the Contact section title, intro text, and all three contact cards."
    {...sectionCardProps}
  >
    <div className="grid gap-5 md:grid-cols-2">
      <AdminField label="Section Title">
        <input
          type="text"
          value={formData.contact.title}
          onChange={(event) => updateField(['contact', 'title'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>

      <AdminField label="Section Subtitle">
        <input
          type="text"
          value={formData.contact.subtitle}
          onChange={(event) => updateField(['contact', 'subtitle'], event.target.value)}
          className={adminTextInputClassName}
        />
      </AdminField>
    </div>

    <AdminField label="Section Description">
      <textarea
        value={formData.contact.description}
        onChange={(event) => updateField(['contact', 'description'], event.target.value)}
        className={`${adminTextAreaClassName} min-h-[100px]`}
      />
    </AdminField>

    <div className="flex flex-col gap-4 rounded-[24px] border border-red-900/30 bg-black/30 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#bbbbbb]">
            Contact Cards
          </p>
          <p className="mt-2 text-[14px] leading-6 text-[#c6c6c6]">
            Create, update, and delete contact cards from here.
          </p>
        </div>

        <button
          type="button"
          onClick={addContactItem}
          className="inline-flex items-center gap-2 rounded-full bg-[tomato] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-500"
        >
          <FiPlus size={16} />
          Add Contact Card
        </button>
      </div>

      {formData.contact.items.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {formData.contact.items.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              className="rounded-[24px] border border-red-900/30 bg-black/35 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[tomato]">
                  Contact Card {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeContactItem(index)}
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
                      updateArrayItem(['contact', 'items'], index, 'type', event.target.value)
                    }
                    className={adminTextInputClassName}
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="address">Address</option>
                  </select>
                </AdminField>

                <AdminField label="Title">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateArrayItem(['contact', 'items'], index, 'title', event.target.value)
                    }
                    className={adminTextInputClassName}
                  />
                </AdminField>

                <AdminField label="Value">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(event) =>
                      updateArrayItem(['contact', 'items'], index, 'value', event.target.value)
                    }
                    className={adminTextInputClassName}
                  />
                </AdminField>

                <AdminField label="Link">
                  <input
                    type="text"
                    value={item.href}
                    onChange={(event) =>
                      updateArrayItem(['contact', 'items'], index, 'href', event.target.value)
                    }
                    className={adminTextInputClassName}
                  />
                </AdminField>

                <AdminField label="Description">
                  <textarea
                    value={item.description}
                    onChange={(event) =>
                      updateArrayItem(['contact', 'items'], index, 'description', event.target.value)
                    }
                    className={`${adminTextAreaClassName} min-h-[100px]`}
                  />
                </AdminField>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-red-900/40 bg-black/35 px-5 py-10 text-center">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[#bdbdbd]">
            No contact cards
          </p>
          <p className="mt-3 text-[14px] leading-6 text-[#9e9e9e]">
            Add a contact card to show phone, email, or address information.
          </p>
        </div>
      )}
    </div>
  </AdminSectionCard>
);

export default ContactSection;
