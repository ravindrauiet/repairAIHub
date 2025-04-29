import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './BannerRow.module.css';

const banners = [
  {
    title: 'Deep clean with foam-jet AC service',
    subtitle: 'AC service & repair',
    cta: 'Book now',
    image: '/images/banner-ac.jpg',
    link: '/services/ac-repair',
  },
  {
    title: 'Transform your space with wall panels',
    subtitle: 'Starts at ₹9,999 only',
    cta: 'Book now',
    image: '/images/banner-wallpanel.jpg',
    link: '/services/wall-panels',
  },
  {
    title: 'Camera. Doorbell connect. All in one.',
    cta: 'Buy now',
    image: '/images/banner-doorbell.jpg',
    link: '/products/smart-locks',
  },
];

const BannerRow = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 1 }
      }
    ]
  };
  return (
    <div className={styles.bannerRowWrapper}>
      <div className={styles.bannerRow}>
        <Slider {...settings} className={styles.bannerSlider}>
          {banners.map((b, i) => (
            <div key={i}>
              <div className={styles.bannerCard} style={{ backgroundImage: `url(${b.image})` }}>
                <div className={styles.bannerContent}>
                  <h3>{b.title}</h3>
                  {b.subtitle && <p>{b.subtitle}</p>}
                  <Link to={b.link} className={styles.bannerCta}>{b.cta}</Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerRow; 