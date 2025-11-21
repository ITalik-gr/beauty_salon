import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import serviceImage_1 from "@images/service-img-1.png";
import serviceImage_2 from "@images/service-img-2.png";
import HistoryItem from "../components/Cards/HistoryItem";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// додаємо статус з бд у те що очікує HistoryItem (completed pending canceled)
function mapStatus(status) {
  if (!status) return "pending";
  switch (status) {
    case "COMPLETED":
    case "CONFIRMED":
      return "completed";
    case "CANCELLED":
      return "canceled";
    case "PENDING":
    default:
      return "pending";
  }
}

function AccountPage() {
  const [activeTab, setActiveTab] = useState("contact");

  const { user } = useAuth();

  // CONTACT FORM
  const [contactForm, setContactForm] = useState({
    email: "",
    name: "",
    lastName: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactError, setContactError] = useState("");

  // PASSWORD FORM
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // HISTORY
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    if (user) {
      setContactForm({
        email: user.email || "",
        name: user.name || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchMe = async () => {
      if (!user) return;
      try {
        const res = await api.get("/users/me");
        const u = res.data;
        setContactForm({
          email: u.email || "",
          name: u.name || "",
          lastName: u.lastName || "",
        });
      } catch (err) {
        console.error("Error fetching /users/me:", err);
      }
    };

    fetchMe();
  }, [user]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (activeTab !== "history") return;
      if (!user) return;

      setHistoryLoading(true);
      setHistoryError("");

      try {
        const res = await api.get("/appointments/my");
        const data = Array.isArray(res.data) ? res.data : [];

        const mapped = data.map((a) => {
          const status = mapStatus(a.status);
          const date = formatDate(a.startTime);
          const title = a.service?.name || "Послуга";
          const masterName = a.master
            ? `${a.master.name || ""} ${a.master.lastName || ""}`.trim()
            : "Майстер";

          const price =
            a.service?.price != null ? `${a.service.price} ₴` : "—";

          const img =
            a.service?.imageUrl
              ? `${API_URL}${a.service.imageUrl}`
              :
                (status === "completed" && serviceImage_1) ||
                (status === "canceled" && serviceImage_2) ||
                serviceImage_1;

          return {
            id: a.id,
            date,
            title,
            master: masterName,
            price,
            status,
            image: img,
          };
        });

        setHistoryItems(mapped);
      } catch (err) {
        console.error("Error fetching history:", err);
        setHistoryError(
          err.response?.data?.message ||
            "Не вдалося завантажити історію візитів."
        );
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [activeTab, user]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactMessage("");
    setContactError("");

    try {
      const payload = {
        email: contactForm.email,
        name: contactForm.name,
        lastName: contactForm.lastName,
      };

      await api.patch("/users/me", payload);
      setContactMessage("Дані профілю успішно оновлено.");
    } catch (err) {
      console.error("Error updating profile:", err);
      setContactError(
        err.response?.data?.message ||
          "Не вдалося оновити профіль. Перевірте дані."
      );
    } finally {
      setContactLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage("");
    setPasswordError("");

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError("Заповніть всі поля.");
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      setPasswordError("Новий пароль і повтор не співпадають.");
      setPasswordLoading(false);
      return;
    }

    try {
      await api.patch("/users/me/password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordMessage("Пароль успішно змінено.");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(
        err.response?.data?.message ||
          "Не вдалося змінити пароль. Перевірте старий пароль."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="account-page">
        <div className="cont">
          <div className="account-page__wrap">
            <div className="account-page__content">
              <div className="account-page__content-title heading-20 mb-4">
                Особистий кабінет
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
    <section className="account-page">
      <div className="cont">
        <div className="account-page__wrap">
          {/* SIDEBAR */}
          <aside className="account-page__sidebar">
            <div className="account-page__sidebar-title heading-24">
              Account
            </div>

            <ul className="account-page__sidebar-list">
              <li
                className={`account-page__sidebar-item ${
                  activeTab === "contact" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("contact");
                  setContactMessage("");
                  setContactError("");
                }}
              >
                <button type="button">Contact information</button>
              </li>

              <li
                className={`account-page__sidebar-item ${
                  activeTab === "password" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("password");
                  setPasswordMessage("");
                  setPasswordError("");
                }}
              >
                <button type="button">Change password</button>
              </li>

              <li
                className={`account-page__sidebar-item ${
                  activeTab === "history" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("history");
                  setHistoryError("");
                }}
              >
                <button type="button">History</button>
              </li>
            </ul>
          </aside>

          {/* CONTENT */}
          <div className="account-page__content">
            <div className="account-page__content-nav">
              <div className="account-page__content-title heading-20">
                {activeTab === "contact" && "Contact information"}
                {activeTab === "password" && "Change password"}
                {activeTab === "history" && "History"}
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="account-page__content-body">
              {activeTab === "contact" && (
                <form
                  className="account-page__content-grid grid gap-3"
                  onSubmit={handleContactSubmit}
                >
                  <div className="meta-input col-span-2">
                    <label htmlFor="userEmail">Mail</label>
                    <input
                      type="email"
                      name="email"
                      id="userEmail"
                      placeholder="Your email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                    />
                  </div>

                  <div className="meta-input col-span-1">
                    <label>First name</label>
                    <input
                      type="text"
                      name="name"
                      id="userName"
                      placeholder="Your First name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                    />
                  </div>

                  <div className="meta-input col-span-1">
                    <label>Last name</label>
                    <input
                      type="text"
                      name="lastName"
                      id="userLastName"
                      placeholder="Your Last Name"
                      value={contactForm.lastName}
                      onChange={handleContactChange}
                    />
                  </div>

                  {(contactMessage || contactError) && (
                    <div className="col-span-2 text-sm mt-1">
                      {contactMessage && (
                        <div className="text-green-600">
                          {contactMessage}
                        </div>
                      )}
                      {contactError && (
                        <div className="text-red-500">
                          {contactError}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="col-span-2">
                    <button
                      type="submit"
                      className="btn"
                      disabled={contactLoading}
                    >
                      {contactLoading ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "password" && (
                <form className="grid gap-3" onSubmit={handlePasswordSubmit}>
                  <div className="meta-input">
                    <label>Old password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      placeholder="Old password"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="meta-input">
                    <label>New password</label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="meta-input">
                    <label>Repeat new password</label>
                    <input
                      type="password"
                      name="repeatPassword"
                      placeholder="Repeat new password"
                      value={passwordForm.repeatPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  {(passwordMessage || passwordError) && (
                    <div className="text-sm">
                      {passwordMessage && (
                        <div className="text-green-600">
                          {passwordMessage}
                        </div>
                      )}
                      {passwordError && (
                        <div className="text-red-500">
                          {passwordError}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      className="btn"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? "Saving..." : "Change password"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "history" && (
                <div className="account-history-list">
                  {historyLoading && <div>Завантаження історії...</div>}

                  {!historyLoading && historyError && (
                    <div className="text-red-500 text-sm">
                      {historyError}
                    </div>
                  )}

                  {!historyLoading &&
                    !historyError &&
                    historyItems.length === 0 && (
                      <div className="text-sm text-gray-500">
                        Історія візитів порожня. Ви ще не робили записів.
                      </div>
                    )}

                  {!historyLoading &&
                    !historyError &&
                    historyItems.length > 0 &&
                    historyItems.map((item) => (
                      <HistoryItem
                        key={item.id}
                        date={item.date}
                        title={item.title}
                        master={item.master}
                        price={item.price}
                        status={item.status}
                        image={item.image}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountPage;