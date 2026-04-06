import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSiteContent } from './SiteContentProvider';

const About = () => {
  const { siteContent } = useSiteContent();
  const images = siteContent.about.galleryImages.filter(Boolean);
  const descriptionLines = siteContent.about.description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const [hoveredImage, setHoveredImage] = useState(null);
  const marqueeImages = images.concat(images);
  const marqueeRef = useRef(null);
  const marqueeTweenRef = useRef(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;

    if (!marqueeElement || images.length === 0) {
      return undefined;
    }

    gsap.set(marqueeElement, { xPercent: 0 });

    marqueeTweenRef.current = gsap.to(marqueeElement, {
      xPercent: -50,
      duration: 6,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      marqueeTweenRef.current?.kill();
      marqueeTweenRef.current = null;
    };
  }, [images.length]);

  useEffect(() => {
    const marqueeTween = marqueeTweenRef.current;

    if (!marqueeTween) {
      return;
    }

    if (hoveredImage !== null) {
      marqueeTween.pause();
      return;
    }

    marqueeTween.play();
  }, [hoveredImage]);

  return (
    <section id="about" className="min-h-screen w-full bg-black bg-cover py-16 text-white sm:py-20">
      <div className="mb-10 flex justify-center px-4">
        <h2 className="w-full text-center text-[20px] font-extrabold uppercase tracking-[0.24em] text-[tomato] md:text-[30px]">
          {siteContent.about.title}
        </h2>
      </div>

      <h4 className="mb-8 flex items-center justify-center px-2 text-center text-[clamp(1.45rem,4vw,2.2rem)] font-bold leading-tight">
        {siteContent.about.subtitle}
      </h4>

      <div className="mb-12 space-y-3 px-2">
        {descriptionLines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="mx-auto flex max-w-[900px] items-center justify-center text-center text-[15px] leading-7 text-white sm:text-[16px]"
          >
            {line}
          </p>
        ))}
      </div>

      {images.length > 0 ? (
        <div className="scroll-wrapper flex min-h-[190px] w-full items-center overflow-x-hidden overflow-y-visible whitespace-nowrap py-3 sm:min-h-[240px]">
          <div ref={marqueeRef} className="scroll-container">
            {marqueeImages.map((img, index) => (
              <img
                key={`${img}-${index}`}
                src={img}
                alt={`Work ${(index % Math.max(images.length, 1)) + 1}`}
                className={`scroll-image mr-3 rounded-[10px] ${
                  hoveredImage === index ? 'is-hovered' : ''
                }`}
                draggable="false"
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[190px] w-full items-center justify-center rounded-[22px] border border-dashed border-red-900/40 bg-black/20 px-6 py-10 text-center sm:min-h-[240px]">
          <p className="max-w-[520px] text-[13px] uppercase tracking-[0.16em] text-[#9f9f9f] sm:text-[14px]">
            About gallery images will appear here after you add them from the admin panel.
          </p>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center px-4 text-center">
        <p className="max-w-[720px] text-[16px] leading-relaxed text-[#f0f0f0] md:text-[22px]">
          {siteContent.about.quote}
        </p>
        <img
          src={siteContent.about.developerImage}
          alt={siteContent.about.developerName}
          className="mt-5 h-[92px] w-[68px] rounded-[12px] object-cover grayscale sm:h-[100px] sm:w-[70px]"
          draggable="false"
        />
        <p className="mt-4 text-[15px] font-medium tracking-[0.12em] text-[tomato] sm:text-[16px]">
          {siteContent.about.developerName}
        </p>
      </div>
    </section>
  );
};

export default About;
