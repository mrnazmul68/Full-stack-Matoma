import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { useSiteContent } from './SiteContentProvider';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Donor', href: '#donor' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const iconMap = {
  facebook: FaFacebookF,
  gmail: FiMail,
  whatsapp: FaWhatsapp,
};

const Footer = () => {
  const { siteContent } = useSiteContent();

  return (
    <footer className="w-full border-t border-[#1f1f1f] bg-[#050505] py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 text-center md:grid-cols-2 md:text-left xl:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center justify-center gap-4 md:justify-start">
            <Link
              to="/"
              className="h-[54px] w-[54px] overflow-hidden rounded-full border border-[tomato]"
            >
              <img
                src={siteContent.brand.logo}
                alt={`${siteContent.brand.siteName} logo`}
                className="h-full w-full object-cover"
              />
            </Link>
            <div>
              <p className="text-[13px] uppercase tracking-[0.28em] text-[tomato]">
                {siteContent.footer.badge}
              </p>
              <h3 className="mt-2 text-[28px] font-semibold text-white">
                {siteContent.brand.siteName}
              </h3>
            </div>
          </div>

          <p className="mt-6 max-w-[380px] text-[15px] leading-7 text-[#cfcfcf] md:max-w-none">
            {siteContent.footer.description}
          </p>
        </div>

        <div>
          <p className="text-[13px] uppercase tracking-[0.28em] text-[tomato]">Quick Links</p>
          <div className="mt-6 flex flex-col items-center gap-4 md:items-start">
            {quickLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="w-fit text-[16px] text-[#d8d8d8] no-underline transition-colors duration-300 hover:text-[tomato]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] uppercase tracking-[0.28em] text-[tomato]">
            {siteContent.footer.socialTitle}
          </p>
          <div className="mt-6 flex flex-col gap-5">
            {siteContent.footer.socialItems.map((item, index) => {
              const Icon = iconMap[item.type] || FiMail;
              const isExternalLink =
                typeof item.href === 'string' &&
                (item.href.startsWith('http://') || item.href.startsWith('https://'));

              return (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-start justify-center gap-4 text-left md:justify-start"
                >
                  <div className="mt-1 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[rgba(255,99,71,0.14)] text-[tomato]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] uppercase tracking-[0.18em] text-[#a5a5a5]">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={isExternalLink ? '_blank' : undefined}
                        rel={isExternalLink ? 'noopener noreferrer' : undefined}
                        className="mt-2 block text-[16px] leading-7 text-white no-underline transition-colors duration-300 hover:text-[tomato]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-2 text-[16px] leading-7 text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[#1f1f1f] pt-6 text-center">
        <p className="text-[14px] text-[#bfbfbf]">
          {siteContent.footer.developerPrefix}{' '}
          <a
            href={siteContent.footer.developerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[tomato] no-underline transition-colors duration-300 hover:text-white"
          >
            {siteContent.footer.developerName}
          </a>
          , {siteContent.footer.year}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
