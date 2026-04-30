import { useEffect, useRef } from 'react';

export default function Announcementbar() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    let x = 0;
    const speed = 0.5;
    let animationId;

    const animate = () => {
      x -= speed;

      const firstSetWidth = track.scrollWidth / 2;

      if (Math.abs(x) >= firstSetWidth) {
        x = 0;
      }

      track.style.transform = `translateX(${x}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="announcement-bar">
      <div className="marquee-container">
        <div className="marquee-track" ref={trackRef}>
          
          {/* ORIGINAL */}
          <div className="marquee-group">
            <span>ANNUAL SALE LIVE: UPTO 50% OFF | ENDS ON SUNDAY, 25TH JANUARY</span>
            <span>🔥 Flat 50% OFF on New Arrivals — Free Shipping Available — Shop Now 🔥</span>
            <span>FREE SHIPPING ON ORDERS ABOVE INR 2999</span>
          </div>

          {/* DUPLICATE */}
          <div className="marquee-group">
            <span>ANNUAL SALE LIVE: UPTO 50% OFF | ENDS ON SUNDAY, 25TH JANUARY</span>
            <span>🔥 Flat 50% OFF on New Arrivals — Free Shipping Available — Shop Now 🔥</span>
            <span>FREE SHIPPING ON ORDERS ABOVE INR 2999</span>
          </div>

        </div>
      </div>
    </div>
  );
}
