import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import serviceImage_1 from "@images/service-img-1.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function ServicePage() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [masters, setMasters] = useState([]);
  const [selectedMasterId, setSelectedMasterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBookingData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/services/${id}/booking`, {
          params: { days: 7 },
        });

        if (!isMounted) return;

        setService(res.data.service);
        setMasters(res.data.masters || []);

        if (res.data.masters && res.data.masters.length > 0) {
          setSelectedMasterId(res.data.masters[0].id);
        }
      } catch (err) {
        console.error("Error fetching booking data:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message || "Не вдалося завантажити послугу"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchBookingData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div>Завантаження послуги...</div>;

  if (error)
    return (
      <div className="service-page">
        <div className="cont">
          <div className="service-page__not-found">
            Помилка: {error} <br />
            Service id: <b>{id}</b>
          </div>
        </div>
      </div>
    );

  if (!service)
    return (
      <div className="service-page">
        <div className="cont">
          <div className="service-page__not-found">
            Послугу з id <b>{id}</b> не знайдено.
          </div>
        </div>
      </div>
    );

  const imageSrc = service.imageUrl
    ? `${API_URL}${service.imageUrl}`
    : serviceImage_1;

  const selectedMaster = masters.find((m) => m.id === selectedMasterId);

  console.log(service);
  console.log('Master:');
  console.log(masters);
  
  

  return (
    <div className="service-page">
      <div className="cont">
        <div className="service-page__wrap">
          <div className="service-page__image">
            <img src={imageSrc} alt={service.name} />
          </div>

          <div className="service-page__content">
            <h3 className="service-page__title">{service.name}</h3>

            <div className="service-page__price">
              {service.price != null ? `${service.price} грн` : "—"}
            </div>

            {selectedMaster && (
              <div className="service-page__master">
                <div className="service-page__master-role mb-2">
                  Майстер:
                </div>
                <div className="flex gap-2 items-center">
                  <div className="service-page__master-avatar">
                    <span>
                      {selectedMaster.name.charAt(0)}
                      {selectedMaster.lastName.charAt(0)}
                    </span>
                  </div>

                  <div className="service-page__master-info">
                    <div className="service-page__master-name">
                      {selectedMaster.name} {selectedMaster.lastName}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="service-page__descr">
              <p>
                {service.description ||
                  "Опис послуги буде додано пізніше. Зверніться до адміністратора салону для деталей."}
              </p>
            </div>

            <a href="#schedule" className="service-page__btn btn">
              Обрати час
            </a>
          </div>
        </div>

        {masters.length > 1 && (
          <div className="service-page__masters-switch">
            <div className="heading-20 mb-2">
              Оберіть майстра
            </div>
            <div className="service-page__masters-list">
              {masters.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`service-page__master-chip ${
                    m.id === selectedMasterId ? "is-active" : ""
                  }`}
                  onClick={() => setSelectedMasterId(m.id)}
                >
                  {m.name} {m.lastName}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedMaster && selectedMaster.days.length > 0 && (
          <div className="service-page__bottom">
            <div className="service-page__bottom-title heading-24 mb-4 mt-5">
              Вільний час з {selectedMaster.name}
            </div>

            <div id="schedule" className="service-page__schedule">
              {selectedMaster.days.map((dayBlock, index) => (
                <div className="service-page__schedule-day" key={index}>
                  <div className="service-page__schedule-day-head">
                    <div className="service-page__schedule-day-label">
                      {dayBlock.dayLabel}
                    </div>
                    <div className="service-page__schedule-day-meta">
                      <span>{dayBlock.day}</span>
                      <span>{dayBlock.monthLabel}</span>
                    </div>
                  </div>

                  <div className="service-page__schedule-slots">
                    {dayBlock.slots.length === 0 && (
                      <div className="service-page__no-slots">
                        Немає доступних слотів
                      </div>
                    )}

                    {dayBlock.slots.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`service-page__slot ${
                          slot.isAvailable ? "is-free" : "is-busy"
                        }`}
                        disabled={!slot.isAvailable}
                        // TODO: тут далі можна викликати createAppointment
                        onClick={() => {
                          console.log(
                            "Обрано слот:",
                            slot.startTime,
                            slot.endTime
                          );
                        }}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMaster && selectedMaster.days.length === 0 && (
          <div className="service-page__not-found">
            У цього майстра поки немає розкладу на найближчі дні.
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicePage;