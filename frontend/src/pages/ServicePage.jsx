import { useParams } from "react-router-dom";
import serviceImage_1 from "@images/service-img-1.png";

const mockServices = {
  "1": {
    name: "Haircut & Styling",
    price: 200,
    currency: "UAH",
    master: {
      name: "Olena Kovalenko",
      role: "Top stylist",
      experience: "6 years",
      rating: 4.9,
    },
    schedule: [
      {
        dayLabel: "Today",
        day: "Wed",
        date: "19 Nov",
        slots: [
          { time: "10:00", isAvailable: true },
          { time: "11:30", isAvailable: false },
          { time: "14:00", isAvailable: true },
          { time: "16:30", isAvailable: true },
        ],
      },
      {
        dayLabel: "Tomorrow",
        day: "Thu",
        date: "20 Nov",
        slots: [
          { time: "09:30", isAvailable: true },
          { time: "12:00", isAvailable: true },
          { time: "15:00", isAvailable: false },
        ],
      },
    ],
  },
  "2": {
    name: "Relax massage",
    price: 450,
    currency: "UAH",
    master: {
      name: "Ihor Melnyk",
      role: "Massage therapist",
      experience: "4 years",
      rating: 4.8,
    },
    schedule: [
      {
        dayLabel: "Today",
        day: "Wed",
        date: "19 Nov",
        slots: [
          { time: "11:00", isAvailable: true },
          { time: "13:00", isAvailable: true },
          { time: "18:00", isAvailable: false },
        ],
      },
    ],
  },
};

function ServicePage() {
  const { id } = useParams();
  const service = mockServices[id] || null;

  return (
    <div className="service-page">
      <div className="cont">
        <div className="service-page__wrap">
          <div className="service-page__image">
            <img src={serviceImage_1} alt="Service image" />
          </div>

          <div className="service-page__content">
            <h3 className="service-page__title">
              {service ? service.name : `Service id: ${id}`}
            </h3>

            {service && (
              <div className="service-page__master">
                <div className="service-page__master-avatar">
                  <span>{service.master.name.charAt(0)}</span>
                </div>

                <div className="service-page__master-info">
                  <div className="service-page__master-name">
                    {service.master.name}
                  </div>
                  <div className="service-page__master-role">
                    {service.master.role}
                  </div>
                  {/* <div className="service-page__master-meta">
                    <span>{service.master.experience}</span>
                    <span>•</span>
                    <span>⭐ {service.master.rating}</span>
                  </div> */}
                </div>
              </div>
            )}

            <div className="service-page__price">
              {service ? `${service.price} ${service.currency}` : "200 UAH"}
            </div>

            <div className="service-page__descr">
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa
                rerum consequuntur similique quae nesciunt quibusdam odio unde
                laudantium? Provident nam laboriosam temporibus pariatur
                quibusdam omnis, voluptate error molestiae nesciunt consectetur
                aperiam praesentium earum facere enim non. Ullam quam iure
                exercitationem sed non rem laudantium nemo voluptate, assumenda
                praesentium consequuntur impedit magnam amet optio.
              </p>
            </div>

            <div className="service-page__btn btn">Замовити</div>
          </div>
        </div>

        {service && (
          <div className="service-page__bottom">
            <div className="service-page__bottom-title heading-20 mb-4">
              Available time with {service.master.name}
            </div>

            <div className="service-page__schedule">
              {service.schedule.map((dayBlock, index) => (
                <div className="service-page__schedule-day" key={index}>
                  <div className="service-page__schedule-day-head">
                    <div className="service-page__schedule-day-label">
                      {dayBlock.dayLabel}
                    </div>
                    <div className="service-page__schedule-day-meta">
                      <span>{dayBlock.day}</span>
                      <span>{dayBlock.date}</span>
                    </div>
                  </div>

                  <div className="service-page__schedule-slots">
                    {dayBlock.slots.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`service-page__slot ${
                          slot.isAvailable ? "is-free" : "is-busy"
                        }`}
                        disabled={!slot.isAvailable}
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

        {!service && (
          <div className="service-page__not-found">
            Service with id <b>{id}</b> not found.
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicePage;