import React from 'react';
import { FiMail, FiMapPin, FiPhoneCall } from 'react-icons/fi';
import { useSiteContent } from './SiteContentProvider';

const iconMap = {
  phone: FiPhoneCall,
  email: FiMail,
  address: FiMapPin,
};

const Contact = () => {
  const { siteContent } = useSiteContent();

  return (
    <section id="contact" className="w-full bg-black py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex justify-center">
          <h2 className="w-full text-center text-[20px] font-extrabold uppercase tracking-[0.24em] text-[tomato] md:text-[30px]">
            {siteContent.contact.title}
          </h2>
        </div>

        <div className="mx-auto mb-12 max-w-3xl px-2 text-center">
          <p className="text-[clamp(1.45rem,4vw,2.2rem)] font-semibold leading-relaxed text-white">
            {siteContent.contact.subtitle}
          </p>
          <p className="mt-4 text-[15px] leading-7 text-[#d6d6d6] md:text-[16px]">
            {siteContent.contact.description}
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {siteContent.contact.items.map((item, index) => {
            const Icon = iconMap[item.type] || FiMapPin;

            return (
              <div
                key={`${item.title}-${index}`}
                className="rounded-[24px] border border-[#2b2b2b] bg-[#111111] px-5 py-6 shadow-[0_16px_40px_rgba(0,0,0,0.26)] transition-transform duration-300 hover:-translate-y-1 sm:px-6 sm:py-7"
              >
                <div className="mb-5 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[rgba(255,99,71,0.14)] text-[tomato]">
                  <Icon size={26} />
                </div>

                <p className="text-[13px] uppercase tracking-[0.28em] text-[#bdbdbd]">
                  {item.title}
                </p>

                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-4 block break-words text-[20px] font-semibold text-white no-underline transition-colors duration-300 hover:text-[tomato] sm:text-[22px]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-4 text-[20px] font-semibold leading-snug text-white sm:text-[22px]">
                    {item.value}
                  </p>
                )}

                <p className="mt-4 text-[15px] leading-7 text-[#cfcfcf]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
