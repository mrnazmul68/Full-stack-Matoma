import React, { useEffect, useRef } from 'react';
import { useSiteContent } from './SiteContentProvider';

const Home = () => {
  const canvasRef = useRef(null);
  const { siteContent } = useSiteContent();
  const poemLines = siteContent.home.poem
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);
    const clearColor = 'rgba(0, 0, 0, .1)';
    const max = 30;
    const drops = [];

    function random(min, maxValue) {
      return Math.random() * (maxValue - min) + min;
    }

    function Drop() {}

    Drop.prototype = {
      init() {
        this.x = random(0, w);
        this.y = 0;
        this.color = 'hsl(0, 100%, 50%)';
        this.w = 2;
        this.h = 1;
        this.vy = random(4, 5);
        this.vw = 3;
        this.vh = 1;
        this.size = 2;
        this.hit = random(h * 0.8, h * 0.9);
        this.a = 1;
        this.va = 0.96;
      },
      draw() {
        if (this.y > this.hit) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.h / 2);

          ctx.bezierCurveTo(
            this.x + this.w / 2,
            this.y - this.h / 2,
            this.x + this.w / 2,
            this.y + this.h / 2,
            this.x,
            this.y + this.h / 2,
          );

          ctx.bezierCurveTo(
            this.x - this.w / 2,
            this.y + this.h / 2,
            this.x - this.w / 2,
            this.y - this.h / 2,
            this.x,
            this.y - this.h / 2,
          );

          ctx.strokeStyle = `hsla(0, 100%, 50%, ${this.a})`;
          ctx.stroke();
          ctx.closePath();
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.size, this.size * 5);
        }

        this.update();
      },
      update() {
        if (this.y < this.hit) {
          this.y += this.vy;
        } else if (this.a > 0.03) {
          this.w += this.vw;
          this.h += this.vh;

          if (this.w > 100) {
            this.a *= this.va;
            this.vw *= 0.98;
            this.vh *= 0.98;
          }
        } else {
          this.init();
        }
      },
    };

    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }

    function setup() {
      for (let i = 0; i < max; i += 1) {
        setTimeout(() => {
          const drop = new Drop();
          drop.init();
          drops.push(drop);
        }, i * 200);
      }
    }

    let animationFrameId;

    function animate() {
      ctx.fillStyle = clearColor;
      ctx.fillRect(0, 0, w, h);
      drops.forEach((drop) => drop.draw());
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    setup();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="home"
      className="main-body flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-black px-4 py-28 text-center sm:px-6 sm:py-32"
    >
      <canvas ref={canvasRef} className="h-[16vh] w-full max-w-5xl sm:h-[18vh] md:h-[24vh]" />
      <p className="zoomFade max-w-4xl text-[clamp(1.55rem,5vw,2.8rem)] font-bold leading-tight">
        "{siteContent.home.title}
      </p>
      <p className="zoomFade max-w-4xl text-[clamp(1.55rem,5vw,2.8rem)] font-bold leading-tight">
        {siteContent.home.subtitle}"
      </p>

      <div className="poem mt-8 flex justify-center text-center text-[12px] leading-6 text-aqua sm:mt-10 sm:text-[13px] md:mt-12 md:text-[15px]">
        <div className="max-w-2xl">
          {poemLines.map((line, index) => (
            <React.Fragment key={`${line}-${index}`}>
              {index === 0 ? '"' : ''}
              {line}
              {index === poemLines.length - 1 ? '"' : ''}
              {index !== poemLines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
