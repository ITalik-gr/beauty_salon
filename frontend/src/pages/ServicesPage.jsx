import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import 'swiper/css';

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

function ServicesPage() {
  return (
    <>
      <section className="services-page">
        <div className="cont">
          <div className="services-page__nav">
            <h2 className="services-page__title">
              Всі послуги наших майстрів:
            </h2>
          </div>

          <div className="services-page__wrap">
            {services?.map((service) => (
              <ServiceCard card={service} cardClass="swiper-slide" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ServicesPage