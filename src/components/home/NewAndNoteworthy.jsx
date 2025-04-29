import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './NewAndNoteworthy.module.css';

const noteworthy = [
  { title: 'AC Service & Repair', image: '/images/products/ac-gas.jpeg', tag: 'NEW' },
  { title: 'Laptop Repair', image: '/images/products/laptop-keyboard-replacement.jpeg' },
  { title: 'Mobile Screen Repair', image: '/images/products/mobile-screen.jpeg' },
  { title: 'TV Repair', image: '/images/products/tv-screen.jpeg' },
  { title: 'Washing Machine Repair', image: '/images/products/washing-motor.jpeg' },
];

const NewAndNoteworthy = () => {
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
    <div className={styles.noteworthyWrapper}>
      <div className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <h2>New and noteworthy</h2>
        </div>
        <Slider {...settings} className={styles.noteworthySlider}>
          {noteworthy.map((item, i) => (
            <div key={i}>
              <div className={styles.noteworthyCard}>
                {item.tag && <span className={styles.noteworthyTag}>{item.tag}</span>}
                <img src={item.image} alt={item.title} />
                <div className={styles.noteworthyTitle}>{item.title}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewAndNoteworthy; 