import { useEffect, useRef } from 'react';

export default function RoundCarousel({ images, imageWidth = 190, imageHeight = 240, speed = 3, tilt = -5 }) {
  const ringRef = useRef(null);
  const rotation = useRef(0);
  const dragging = useRef({ active: false, x: 0 });
  const count = images.length;
  const angle = 360 / count;
  const radius = imageWidth / (2 * Math.tan(Math.PI / count)) + 45;

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame;
    let last = performance.now();
    const animate = (now) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!reduceMotion && !dragging.current.active) rotation.current += speed * delta;
      if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${rotation.current}deg)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [radius, speed]);

  const down = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = { active: true, x: event.clientX };
  };
  const move = (event) => {
    if (!dragging.current.active) return;
    rotation.current += (event.clientX - dragging.current.x) * 0.32;
    dragging.current.x = event.clientX;
  };
  const up = () => { dragging.current.active = false; };

  return <div className="round-carousel" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Kestrel product moments carousel">
    <div className="round-carousel-tilt" style={{ transform: `rotateX(${tilt}deg)` }}>
      <div className="round-carousel-ring" ref={ringRef} style={{ width: imageWidth, height: imageHeight }}>
        {images.map((image, index) => <article className="carousel-face" key={image.src} style={{ transform: `rotateY(${index * angle}deg) translateZ(${radius}px)` }}>
          <img src={image.src} alt={image.alt} draggable="false" />
          <span>{image.label}</span>
        </article>)}
      </div>
    </div>
  </div>;
}
