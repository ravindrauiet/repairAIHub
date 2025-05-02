import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './BannerRow.module.css';

const banners = [
  {
    title: 'Expert AC Service & Repair',
    subtitle: 'Professional AC maintenance and repair',
    cta: 'Book now',
    image: '/images/products/ac-gas.jpeg',
    link: '/services/ac-repair',
  },
  {
    title: 'Professional TV Screen Repair',
    subtitle: 'Expert technicians, genuine parts',
    cta: 'Book now',
    image: '/images/products/tv-screen.jpeg',
    link: '/services/tv-repair',
  },
  {
    title: 'Mobile Screen Replacement',
    subtitle: 'Quick and reliable service',
    cta: 'Book now',
    image: '/images/products/mobile-screen.jpeg',
    link: '/services/mobile-repair',
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
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          centerMode: true,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          centerMode: false,
        }
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