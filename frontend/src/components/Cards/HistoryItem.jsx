function HistoryItem({ date, title, master, price, status, image }) {
  const statusMap = {
    completed: { label: "Completed", class: "status-completed" },
    pending: { label: "Pending", class: "status-pending" },
    canceled: { label: "Canceled", class: "status-canceled" },
  };

  return (
    <div className="history-item">
      <div className="history-item__img-wrap">
        <img src={image} alt={title} className="history-item__img" />
      </div>

      <div className="history-item__info">
        <div className="history-item__title">{title}</div>
        <div className="history-item__meta">
          <span>Master: <b>{master}</b></span>
          <span className="history-item__date">{date}</span>
        </div>
      </div>

      <div className="history-item__right">
        <div className="history-item__price">{price}</div>

        <div className={`history-item__status ${statusMap[status].class}`}>
          {statusMap[status].label}
        </div>
      </div>
    </div>
  );
}

export default HistoryItem;