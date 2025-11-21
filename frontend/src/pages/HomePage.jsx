import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import 'swiper/css';

import firstImage from '@images/first-image.png';

import ServiceCard from '../components/Cards/ServiceCard';
import { useEffect, useState } from 'react';
import api from '../api/client';



function HomePage() {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className='first-sec'>
        <div className="cont">
          <div className="first-sec__wrap">
            <div className="first-sec__subtitle">
              Перукарня, масажист, салон краси
            </div>
            <h1 className="first-sec__title">
              Знайди сервіс поблизу
            </h1>

            <a href="/services" className="btn">
              Сервіси
            </a>
          </div>

          <div className="first-sec__image">
            <img src={firstImage} alt="First image" />
          </div>
        </div>
      </section>

      { services.length !== 0 ? (
        <section className="services-sec">
          <div className="cont">
            <div className="services-sec__nav">
              <h2 className="services-sec__title">
                Наші послуги
              </h2>
            </div>

            <div className="services-sec__wrap">
              <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                spaceBetween={12}
                breakpoints={{
                  640:  { slidesPerView: 1, spaceBetween: 16 },
                  768:  { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                watchOverflow
              >
                {services?.slice(0, 6).map((service) => (
                  <SwiperSlide>
                    <ServiceCard card={service} cardClass="swiper-slide" />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-buttons">
                <div className="swiper-button swiper-button-prev"></div>
                <div className="swiper-button swiper-button-next"></div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="cont !py-10">
          <div className="heading-20">Список послуг наразі пустий</div>
        </div>
      )}

    </>
  )
}

export default HomePage