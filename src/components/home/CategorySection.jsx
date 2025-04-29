import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './CategorySection.module.css';

const CategorySection = ({ title, items, cardType = 'category', seeAllLink }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 }
      }
    ]
  };
  return (
    <div className={styles.categoryWrapper}>
      <div className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <h2>{title}</h2>
          {seeAllLink && <div><Link to={seeAllLink}>See all</Link></div>}
        </div>
        <Slider {...settings} className={styles.categorySlider}>
          {items.map((item, i) => (
            <div key={i}>
              <div className={cardType === 'service' ? styles.serviceCard : styles.categoryCard}>
                <img src={item.image} alt={item.title} />
                {cardType === 'service' ? (
                  <div className={styles.serviceInfo}>
                    <div className={styles.serviceTitle}>{item.title}</div>
                    <div className={styles.serviceRating}>★ {item.rating} ({item.reviews})</div>
                    <div className={styles.servicePrice}>{item.price}</div>
                  </div>
                ) : (
                  <div className={styles.categoryTitle}>{item.title}</div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CategorySection; 