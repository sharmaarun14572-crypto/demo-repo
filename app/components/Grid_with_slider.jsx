import {useEffect, useState} from 'react';
import {Link} from 'react-router';

export default function CategoryGrid() {
  return (
    <section className="category-grid-section">

      <div className="category-flex">

        {/* LEFT COLUMN */}
        <div className="column small-column">
          <GridCard image="/women.jpg" link="/collections/women" />
          <GridCard image="/gift.jpg" link="/collections/gifts" />
        </div>

        {/* MIDDLE COLUMN */}
        <div className="column small-column">
          <GridCard image="/home.jpg" link="/collections/home" />
          <GridCard image="/kids.jpg" link="/collections/kids" />
        </div>

        {/* RIGHT BIG COLUMN (SLIDER) */}
        <div className="column big-column">
          <BigBannerSlider
            link="/collections/tulum"
            slides={[
              "/big-image.jpg",
              "/big-image-1.jpg",
              "/big-image-2.jpg"
            ]}
          />
        </div>

      </div>

    </section>
  );
}

/* ---------------- SMALL GRID CARD ---------------- */

function GridCard({image, link}) {
  return (
    <Link to={link} className="grid-card">
      <img src={image} alt="category" />
    </Link>
  );
}

/* ---------------- BIG BANNER SLIDER ---------------- */

function BigBannerSlider({slides, link}) {

  const [active, setActive] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const threshold = 60;

  /* AUTO PLAY */
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [active]);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  /* TOUCH START */
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  /* TOUCH MOVE (PREVENT SCROLL) */
  const handleTouchMove = (e) => {
    if (isDragging) {
      e.preventDefault();
    }
  };

  /* TOUCH END */
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(endX);
  };

  /* MOUSE START */
  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  /* MOUSE END */
  const handleMouseUp = (e) => {
    const endX = e.clientX;
    handleSwipe(endX);
  };

  /* SWIPE LOGIC */
  const handleSwipe = (endX) => {
    if (!isDragging) return;

    const diff = startX - endX;

    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }

    setIsDragging(false);
  };

  return (
    <div
      className="big-banner slider"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >

      {/* SLIDES */}
      {slides.map((img, index) => (
        <Link
          to={link}
          key={index}
          onClick={(e) => isDragging && e.preventDefault()}
          className={`slide ${active === index ? 'active' : ''}`}
        >
          <img src={img} alt="banner" draggable="false" />
        </Link>
      ))}

      {/* LEFT ARROW */}
      <button
        className="slider-arrow left"
        onClick={prevSlide}
      >
        ‹
      </button>

      {/* RIGHT ARROW */}
      <button
        className="slider-arrow right"
        onClick={nextSlide}
      >
        ›
      </button>

      {/* DOTS */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${active === index ? 'active' : ''}`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>

    </div>
  );
}

