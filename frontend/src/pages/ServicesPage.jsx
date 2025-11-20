import { useState, useEffect } from 'react';
import api from "../api/client";
import ServiceCard from '../components/Cards/ServiceCard';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Завантаження послуг...</div>;

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
              <ServiceCard key={service.id} card={service} cardClass="swiper-slide" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ServicesPage