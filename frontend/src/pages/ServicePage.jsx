import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import serviceImage_1 from "@images/service-img-1.png";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function ServicePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [masters, setMasters] = useState([]);
  const [selectedMasterId, setSelectedMasterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

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
          <div className="service-page__not-found mt-5">
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
          <div className="service-page__not-found mt-5">
            Послугу з id <b>{id}</b> не знайдено.
          </div>
        </div>
      </div>
    );

  const imageSrc = service.imageUrl
    ? `${API_URL}${service.imageUrl}`
    : serviceImage_1;

  const selectedMaster = masters.find((m) => m.id === selectedMasterId);

  // створення запису
  const handleSlotClick = async (dayIndex, slotIndex, slot) => {
    if (!user) {
      setBookingError("Спочатку увійдіть в акаунт, щоб записатися.");
      return;
    }
    if (!selectedMaster || !slot.isAvailable) return;

    setBookingLoading(true);
    setBookingError("");
    setBookingMessage("");

    try {
      await api.post("/appointments", {
        serviceId: service.id,
        masterId: selectedMaster.id,
        startTime: slot.startTime, // ISO-строка з бека
      });

      setBookingMessage(
        "Запис успішно створено. Очікує підтвердження адміністратора."
      );

      // локально відмічення слота як зайнятий
      setMasters((prev) =>
        prev.map((m) => {
          if (m.id !== selectedMaster.id) return m;
          return {
            ...m,
            days: m.days.map((d, di) => {
              if (di !== dayIndex) return d;
              return {
                ...d,
                slots: d.slots.map((s, si) =>
                  si === slotIndex ? { ...s, isAvailable: false } : s
                ),
              };
            }),
          };
        })
      );
    } catch (err) {
      console.error("Error creating appointment:", err);
      setBookingError(
        err.response?.data?.message ||
          "Не вдалося створити запис. Можливо, цей час вже зайнято."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="service-page pb-20">
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

            {user && (
              <a href="#schedule" className="service-page__btn btn">
                Обрати час
              </a>
            )}
            {!user && (
              <div className="text-base">
                Зареєструйтесь або{" "}
                <Link to="/login" className="link">
                  увійдіть
                </Link>{" "}
                в акаунт для запису
              </div>
            )}

            {selectedMaster && selectedMaster.days.length === 0 && (
              <div className="service-page__not-found mt-5">
                У цього майстра поки немає розкладу на найближчі дні.
              </div>
            )}
          </div>
        </div>

        {masters.length > 1 && (
          <div className="service-page__masters-switch">
            <div className="heading-20 mb-2">Оберіть майстра</div>
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

        {/* повідомлення про створення / помилку */}
        {(bookingMessage || bookingError) && (
          <div className="mt-4">
            {bookingMessage && (
              <div className="text-sm text-green-600">
                {bookingMessage}
              </div>
            )}
            {bookingError && (
              <div className="text-sm text-red-500">
                {bookingError}
              </div>
            )}
          </div>
        )}

        {selectedMaster && selectedMaster.days.length > 0 && (
          <div className={`service-page__bottom ${!user ? "disabled" : ""}`}>
            <div className="service-page__bottom-title heading-24 mb-4 mt-5">
              Вільний час з {selectedMaster.name}
            </div>

            <div id="schedule" className="service-page__schedule">
              {selectedMaster.days.map((dayBlock, dayIndex) => (
                <div className="service-page__schedule-day" key={dayIndex}>
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

                    {dayBlock.slots.map((slot, slotIndex) => (
                      <button
                        key={slotIndex}
                        type="button"
                        className={`service-page__slot ${
                          slot.isAvailable ? "is-free" : "is-busy"
                        }`}
                        disabled={
                          !slot.isAvailable || !user || bookingLoading
                        }
                        onClick={() =>
                          handleSlotClick(dayIndex, slotIndex, slot)
                        }
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
          <div className="service-page__not-found mt-5">
            У цього майстра поки немає розкладу на найближчі дні.
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicePage;