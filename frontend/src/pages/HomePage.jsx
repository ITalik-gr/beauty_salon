import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import 'swiper/css';

import firstImage from '@images/first-image.png';

import serviceImage_1 from '@images/service-img-1.png';
import serviceImage_2 from '@images/service-img-2.png';
import serviceImage_3 from '@images/service-img-3.png';
import ServiceCard from '../components/Cards/ServiceCard';

const services = [
  {
    image: serviceImage_1,
    title: "Lorem ipsum dolor sit.",
    descr: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia, est.",
    price: "450"
  },
  {
    image: serviceImage_2,
    title: "Lorem ipsum dolor sit.",
    descr: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia, est.",
    price: "800"
  },
  {
    image: serviceImage_3,
    title: "Lorem ipsum dolor sit.",
    descr: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia, est.",
    price: "200"
  },
  {
    image: serviceImage_1,
    title: "Lorem ipsum dolor sit.",
    descr: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia, est.",
    price: "200"
  },
]

function HomePage() {
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

            <a href="#" className="btn">
              Сервіси
            </a>
          </div>

          <div className="first-sec__image">
            <img src={firstImage} alt="First image" />
          </div>
        </div>
      </section>

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
              {services?.map((service) => (
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
    </>
  )
}

export default HomePage