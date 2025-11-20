import { API_URL } from "../../config/api.js";

function ServiceCard({cardClass, card}) {

  console.log(card);
  
  return (
    <a href={`/services/${card.id}`} className={`service-card ${cardClass}`}>
      <div className="service-card__image">
        <img src={card?.imageUrl} alt={card.title} />
      </div>

      <div className="service-card__body">
        <div className="service-card__content">
          <div className="service-card__title">
            {card.name}
          </div>
          <div className="service-card__descr">
            {card.description}
          </div>

          <div className="service-card__price">
            {card.price} <span>UAH</span>
          </div>
          <div className="service-card__price">
            Тривалість: {card.durationMin}хв
          </div>
        </div>

        <div className="service-card__btn btn">
          Замовити
        </div>
      </div>
    </a>
  )
}

export default ServiceCard