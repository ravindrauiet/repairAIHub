import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './MostBookedServices.module.css';

const mostBooked = [
  { title: 'AC Service & Repair', rating: 4.79, reviews: '1.4M', price: '₹599', image: '/images/products/ac-gas.jpeg' },
  { title: 'Mobile Screen Replacement', rating: 4.80, reviews: '3K', price: '₹2,499', image: '/images/products/mobile-screen.jpeg' },
  { title: 'Laptop Keyboard Repair', rating: 4.79, reviews: '104K', price: '₹1,098', image: '/images/products/laptop-keyboard-replacement.jpeg' },
  { title: 'TV Screen Repair', rating: 4.80, reviews: '34K', price: '₹1,498', image: '/images/products/tv-screen.jpeg' },
  { title: 'Washing Machine Motor Repair', rating: 4.83, reviews: '15K', price: '₹3,999', image: '/images/products/washing-motor.jpeg' },
];

const MostBookedServices = () => {
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
    <div className={styles.mostbookedWrapper}>
      <div className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <h2>Most booked services</h2>
        </div>
        <Slider {...settings} className={styles.mostbookedSlider}>
          {mostBooked.map((item, i) => (
            <div key={i}>
              <div className={styles.serviceCard}>
                <img src={item.image} alt={item.title} />
                <div className={styles.serviceInfo}>
                  <div className={styles.serviceTitle}>{item.title}</div>
                  <div className={styles.serviceRating}>★ {item.rating} ({item.reviews})</div>
                  <div className={styles.servicePrice}>{item.price}</div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MostBookedServices; 