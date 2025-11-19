

function ServiceCard({cardClass, card}) {

  const id = '1';


  return (
    <a href={`/services/${id}`} className={`service-card ${cardClass}`}>
      <div className="service-card__image">
        <img src={card.image} alt={card.title} />
      </div>

      <div className="service-card__body">
        <div className="service-card__content">
          <div className="service-card__title">
            {card.title}
          </div>
          <div className="service-card__descr">
            {card.descr}
          </div>

          <div className="service-card__price">
            {card.price} <span>UAH</span>
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