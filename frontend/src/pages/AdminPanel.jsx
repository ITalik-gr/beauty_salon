import { useEffect, useState } from "react";
import api from "../api/client";
import ImageUploadField from "../components/ImageUploadField";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState("services");
  const { user } = useAuth();

  if (user && user.role !== 'ADMIN') {
    return (
      <section className="account-page">
        <div className="cont">
          <div className="account-page__wrap">
            <div className="account-page__content">
              <div className="account-page__content-title heading-20 mb-4">
                Адмін панель
              </div>
              <p className="text-base">
                Доступ до панелі мають лише адміністратори.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="account-page">
        <div className="cont">
          <div className="account-page__wrap">
            <div className="account-page__content">
              <div className="account-page__content-title heading-20 mb-4">
                Адмін панель
              </div>
              <p className="text-base">
                Для перегляду профілю та історії візитів{" "}
                <Link to="/login" className="link">
                  увійдіть
                </Link>{" "}
                або{" "}
                <Link to="/register" className="link">
                  зареєструйтесь
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="cont">
        <div className="admin-page__wrap">
          {/* SIDEBAR */}
          <aside className="admin-page__sidebar">
            <div className="admin-page__sidebar-title heading-24">
              Admin panel
            </div>

            <ul className="admin-page__sidebar-list">
              <li
                className={`admin-page__sidebar-item ${
                  activeTab === "services" ? "active" : ""
                }`}
                onClick={() => setActiveTab("services")}
              >
                <button type="button">Services</button>
              </li>

              <li
                className={`admin-page__sidebar-item ${
                  activeTab === "masters" ? "active" : ""
                }`}
                onClick={() => setActiveTab("masters")}
              >
                <button type="button">Masters</button>
              </li>

              <li
                className={`admin-page__sidebar-item ${
                  activeTab === "schedule" ? "active" : ""
                }`}
                onClick={() => setActiveTab("schedule")}
              >
                <button type="button">Schedule</button>
              </li>

              <li
                className={`admin-page__sidebar-item ${
                  activeTab === "appointments" ? "active" : ""
                }`}
                onClick={() => setActiveTab("appointments")}
              >
                <button type="button">Appointments</button>
              </li>
            </ul>
          </aside>

          {/* CONTENT */}
          <div className="admin-page__content">
            <div className="admin-page__content-nav">
              <div className="admin-page__content-title heading-20">
                {activeTab === "services" && "Services management"}
                {activeTab === "masters" && "Masters management"}
                {activeTab === "schedule" && "Schedule generator"}
                {activeTab === "appointments" && "Appointments"}
              </div>
            </div>

            <div className="admin-page__content-body">
              {activeTab === "services" && <ServicesTab />}
              {activeTab === "masters" && <MastersTab />}
              {activeTab === "schedule" && <ScheduleTab />}
              {activeTab === "appointments" && <AppointmentsTab />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =======================
 * TAB: SERVICES
 * ======================= */

function ServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationMin: "60",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  const [masters, setMasters] = useState([]);
  const [selectedMasterIds, setSelectedMasterIds] = useState([]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services/admin/all");
      setServices(res.data || []);
    } catch (err) {
      console.error("Error fetching services admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasters = async () => {
    try {
      const res = await api.get("/masters/admin/all");
      setMasters(res.data || []);
    } catch (err) {
      console.error("Error fetching masters for services tab:", err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchMasters(); 
  }, []);

  const toggleMaster = (id) => {
    setSelectedMasterIds((prev) =>
      prev.includes(id)
        ? prev.filter((mId) => mId !== id)
        : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (selectedMasterIds.length === 0) {
      alert("Оберіть хоча б одного майстра для послуги");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        durationMin: form.durationMin ? Number(form.durationMin) : 60,
        imageUrl: form.imageUrl || null,
        masterIds: selectedMasterIds,
      };

      await api.post("/services/admin", payload);
      await fetchServices();

      setForm({
        name: "",
        description: "",
        price: "",
        durationMin: "60",
        imageUrl: "",
      });
      setSelectedMasterIds([]); 
    } catch (err) {
      console.error("Error creating service:", err);
      alert(
        err.response?.data?.message ||
          "Не вдалося створити послугу. Перевір дані."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/admin/${id}`);

      await fetchServices();
    } catch (error) {
      console.log(error);
      
    }
  }

  console.log(services);
  

  return (
    <div className="admin-services">
      <div className="admin-services__top">
        <div className="heading-18 mb-2">Create new service</div>
        <form
          className="admin-services__form grid gap-3"
          onSubmit={handleCreate}
        >
          <div className="meta-input col-span-2">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Service name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="meta-input col-span-2">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Short description"
              value={form.description}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="meta-input col-span-1">
            <label>Price (UAH)</label>
            <input
              type="number"
              name="price"
              placeholder="300"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="meta-input col-span-1">
            <label>Duration (min)</label>
            <input
              type="number"
              name="durationMin"
              placeholder="60"
              value={form.durationMin}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label>Service image</label>
            <ImageUploadField
              value={form.imageUrl}
              onChange={(url) =>
                setForm((prev) => ({ ...prev, imageUrl: url }))
              }
            />
          </div>

          <div className="col-span-2">
            <div className="heading-18 mb-4">Masters (required)</div>

            {masters.length === 0 ? (
              <div style={{ fontSize: 13, color: "#888" }}>
                Немає майстрів. Спочатку створіть хоча б одного у вкладці "Masters".
              </div>
            ) : (
              <div className="admin-services__masters-list">
                {masters.map((m) => (
                  <label
                    key={m.id}
                    className="admin-services__master-item"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMasterIds.includes(m.id)}
                      onChange={() => toggleMaster(m.id)}
                    />
                    <span>
                      {m.name} {m.lastName}
                      {m.speciality ? ` — ${m.speciality}` : ""}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2 mt-5">
            <button
              type="submit"
              className="btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Create service"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-services__list">
        <div className="heading-18 mb-2">All services</div>
        {loading ? (
          <div>Loading services...</div>
        ) : services.length === 0 ? (
          <div>No services yet.</div>
        ) : (
          <div className="admin-services__grid">
            {services.map((s) => (
              <div className="admin-services__item" key={s.id}>
                <div className="admin-services__item-image">
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl.startsWith("http")
                        ? s.imageUrl
                        : `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${s.imageUrl}`
                      }
                      alt={s.name}
                    />
                  ) : (
                    <div className="admin-services__item-image-placeholder">
                      No image
                    </div>
                  )}
                </div>
                <div className="admin-services__item-body">
                  <div className="admin-services__item-title">
                    {s.name}
                  </div>
                  <div className="admin-services__item-meta">
                    <span>{s.price} ₴</span>
                    <span>•</span>
                    <span>{s.durationMin} min</span>
                    <span>•</span>
                    <span>Id: {s.id}</span>
                  </div>
                  <div className={`admin-services__item-status ${s.isActive ? "" : "!bg-red-100"}`}>
                    {s.isActive ? "Active" : "Inactive"}
                  </div>
                  <div onClick={() => handleDelete(s.id)} className={`cursor-pointer text-sm mt-3 ${!s.isActive ? '!cursor-not-allowed opacity-80' : ''}`}>
                    Видалити
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =======================
 * TAB: MASTERS
 * ======================= */

function MastersTab() {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    speciality: "",
  });
  const [saving, setSaving] = useState(false);

  const [selectedMasterId, setSelectedMasterId] = useState(null);
  const [servicesInput, setServicesInput] = useState(""); // "1,2,3"
  const [linkSaving, setLinkSaving] = useState(false);

  const fetchMasters = async () => {
    setLoading(true);
    try {
      const res = await api.get("/masters/admin/all");
      setMasters(res.data || []);
      if (!selectedMasterId && res.data && res.data.length > 0) {
        setSelectedMasterId(res.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching masters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMaster = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/masters/admin", {
        name: form.name,
        lastName: form.lastName,
        speciality: form.speciality || null,
      });
      setForm({ name: "", lastName: "", speciality: "" });
      await fetchMasters();
    } catch (err) {
      console.error("Error creating master:", err);
      alert(
        err.response?.data?.message ||
          "Не вдалося створити майстра. Перевір дані."
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedMaster = masters.find((m) => m.id === selectedMasterId);

  const handleSaveMasterServices = async () => {
    if (!selectedMasterId) return;
    setLinkSaving(true);
    try {
      const ids = servicesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));

      await api.patch(`/masters/admin/${selectedMasterId}/services`, {
        serviceIds: ids,
      });

      await fetchMasters();
      alert("Services updated for this master.");
    } catch (err) {
      console.error("Error linking master services:", err);
      alert(
        err.response?.data?.message ||
          "Помилка при оновленні послуг майстра."
      );
    } finally {
      setLinkSaving(false);
    }
  };

  console.log(masters);
  

  return (
    <div className="admin-masters">
      <div className="admin-masters__top">
        <div>
          <div className="heading-18 mb-2">Create new master</div>
          <form
            className="admin-masters__form grid gap-3"
            onSubmit={handleCreateMaster}
          >
            <div className="meta-input">
              <label>First name</label>
              <input
                type="text"
                name="name"
                placeholder="Olena"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="meta-input">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Shevchenko"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="meta-input">
              <label>Speciality</label>
              <input
                type="text"
                name="speciality"
                placeholder="Hair stylist"
                value={form.speciality}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-end justify-end">
              <button
                type="submit"
                className="btn !w-full"
                disabled={saving}
              >
                {saving ? "Saving..." : "Create master"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-5">
          <div className="heading-18 mb-2">
            Masters & linked services
          </div>
          {loading ? (
            <div>Loading masters...</div>
          ) : masters.length === 0 ? (
            <div>No masters yet.</div>
          ) : (
            <div className="admin-masters__layout">
              <div className="admin-masters__list">
                {masters.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`admin-masters__item ${
                      m.id === selectedMasterId ? "is-active" : ""
                    }`}
                    onClick={() => setSelectedMasterId(m.id)}
                  >
                    <div className="admin-masters__item-name">
                      {m.name} {m.lastName}
                    </div>
                    <div className="admin-masters__item-meta">
                      {m.speciality || "No speciality"} •{" "}
                      {m.isActive ? "Active" : "Inactive"}
                    </div>
                    <div className="admin-masters__item-meta">
                      Id: {m.id}
                    </div>
                  </button>
                ))}
              </div>

              {selectedMaster && (
                <div className="admin-masters__details">
                  <div className="heading-16 mb-1">
                    Services for {selectedMaster.name}{" "}
                    {selectedMaster.lastName}
                  </div>

                  <div className="admin-masters__services-current">
                    <div className="small-label mb-1">
                      Current service IDs:
                    </div>
                    <div>
                      {selectedMaster.services &&
                      selectedMaster.services.length > 0
                        ? selectedMaster.services
                            .map((s) => s.serviceId)
                            .join(", ")
                        : "No services linked yet."}
                    </div>
                  </div>

                  <div className="meta-input mt-3">
                    <label>Set service IDs (comma separated)</label>
                    <input
                      type="text"
                      placeholder="1,2,3"
                      value={servicesInput}
                      onChange={(e) =>
                        setServicesInput(e.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="btn mt-2"
                    onClick={handleSaveMasterServices}
                    disabled={linkSaving}
                  >
                    {linkSaving
                      ? "Saving..."
                      : "Update master services"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================
 * TAB: SCHEDULE
 * ======================= */

function ScheduleTab() {
  const [masterId, setMasterId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [saving, setSaving] = useState(false);

  // 0 = Нд, 1 = Пн, ... 6 = Сб (як у JS getDay)
  const [weekPattern, setWeekPattern] = useState([
    { dayIndex: 1, label: "Пн", startTime: "09:00", endTime: "18:00", isDayOff: false },
    { dayIndex: 2, label: "Вт", startTime: "09:00", endTime: "18:00", isDayOff: false },
    { dayIndex: 3, label: "Ср", startTime: "09:00", endTime: "18:00", isDayOff: false },
    { dayIndex: 4, label: "Чт", startTime: "09:00", endTime: "18:00", isDayOff: false },
    { dayIndex: 5, label: "Пт", startTime: "09:00", endTime: "18:00", isDayOff: false },
    { dayIndex: 6, label: "Сб", startTime: "10:00", endTime: "15:00", isDayOff: false },
    { dayIndex: 0, label: "Нд", startTime: "",      endTime: "",      isDayOff: true  },
  ]);

  const handleDayChange = (idx, field, value) => {
    setWeekPattern((prev) =>
      prev.map((d, i) =>
        i === idx ? { ...d, [field]: value } : d
      )
    );
  };

  const handleDayOffToggle = (idx) => {
    setWeekPattern((prev) =>
      prev.map((d, i) =>
        i === idx ? { ...d, isDayOff: !d.isDayOff } : d
      )
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!masterId || !from || !to) {
      alert("Master, from і to обовʼязкові");
      return;
    }

    const pattern = {};
    weekPattern.forEach((d) => {
      if (d.isDayOff) {
        pattern[d.dayIndex] = { isDayOff: true };
      } else if (d.startTime && d.endTime) {
        pattern[d.dayIndex] = {
          startTime: d.startTime,
          endTime: d.endTime,
        };
      }
    });

    setSaving(true);
    try {
      await api.post("/workdays/admin/generate", {
        masterId: Number(masterId),
        from,
        to,
        pattern,
      });

      alert("Розклад згенеровано для цього періоду.");
    } catch (err) {
      console.error("Error generating schedule:", err);
      alert(
        err.response?.data?.message ||
          "Не вдалося згенерувати розклад."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-schedule">
      <div className="heading-18 mb-2">
        Generate schedule for a master
      </div>

      <form className="grid gap-3" onSubmit={handleGenerate}>
        <div className="meta-input">
          <label>Master ID</label>
          <input
            type="number"
            placeholder="1"
            value={masterId}
            onChange={(e) => setMasterId(e.target.value)}
          />
        </div>

        <div className="meta-input">
          <label>From date</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="meta-input">
          <label>To date</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="meta-input" style={{ gridColumn: "1 / -1" }}>
          <label>Weekly pattern</label>

          <div className="admin-schedule__week">
            {weekPattern.map((day, idx) => (
              <div className="admin-schedule__day-row py-3 border-b border-[rgba(0,0,0,0.3)]" key={day.dayIndex}>
                <div className="admin-schedule__day-label">
                  {day.label}
                </div>

                <label className="admin-schedule__day-off flex flex-col gap-2 my-3">
                  <span className="text-base">Day off?</span>
                  <input
                    type="checkbox"
                    checked={day.isDayOff}
                    onChange={() => handleDayOffToggle(idx)}
                    className="!w-fit"
                  />
                </label>

                {!day.isDayOff && (
                  <div className="admin-schedule__time-range py-3">
                    <div className="meta-input">
                      <span>From</span>
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={(e) =>
                          handleDayChange(idx, "startTime", e.target.value)
                        }
                      />
                    </div>
                    <div className="meta-input">
                      <span>To</span>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={(e) =>
                          handleDayChange(idx, "endTime", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn"
            disabled={saving}
          >
            {saving ? "Generating..." : "Generate schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =======================
 * TAB: APPOINTMENTS
 * ======================= */

function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments/admin");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setSavingId(id);
    try {
      await api.patch(`/appointments/admin/${id}/status`, {
        status: newStatus,
      });
      await fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert(
        err.response?.data?.message ||
          "Не вдалося змінити статус бронювання."
      );
    } finally {
      setSavingId(null);
    }
  };

  const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

  return (
    <div className="admin-appointments">
      <div className="heading-18 mb-2">All appointments</div>
      {loading ? (
        <div>Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div>No appointments yet.</div>
      ) : (
        <div className="admin-appointments__list">
          {appointments.map((a) => (
            <div className="admin-appointments__item" key={a.id}>
              <div className="admin-appointments__main">
                <div className="admin-appointments__title">
                  #{a.id} • {a.service?.name || "Service"} •{" "}
                  {a.master
                    ? `${a.master.name} ${a.master.lastName}`
                    : "Master"}
                </div>
                <div className="admin-appointments__meta">
                  <span>{a.user?.email || "User"}</span>
                  <span>•</span>
                  <span>{formatDate(a.startTime)}</span>
                  <span>→</span>
                  <span>{formatDate(a.endTime)}</span>
                </div>
              </div>

              <div className="admin-appointments__controls">
                <select
                  value={a.status}
                  onChange={(e) =>
                    handleStatusChange(a.id, e.target.value)
                  }
                  disabled={savingId === a.id}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;