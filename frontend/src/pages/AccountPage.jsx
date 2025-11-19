import { useState } from "react";

import serviceImage_1 from '@images/service-img-1.png';
import serviceImage_2 from '@images/service-img-2.png';
import HistoryItem from "../components/Cards/HistoryItem";

function AccountPage() {
  const [activeTab, setActiveTab] = useState("contact"); // default tab



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
                className={`account-page__sidebar-item ${activeTab === "contact" ? "active" : ""}`}
                onClick={() => setActiveTab("contact")}
              >
                <button type="button">Contact information</button>
              </li>

              <li
                className={`account-page__sidebar-item ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                <button type="button">Change password</button>
              </li>

              <li
                className={`account-page__sidebar-item ${activeTab === "history" ? "active" : ""}`}
                onClick={() => setActiveTab("history")}
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
                <div className="account-page__content-grid grid gap-3">
                  <div className="meta-input col-span-2">
                    <label htmlFor="userEmail">Mail</label>
                    <input type="email" name="email" id="userEmail" placeholder="Your email" />
                  </div>

                  <div className="meta-input col-span-1">
                    <label>First name</label>
                    <input type="text" name="first-name" id="userName" placeholder="Your First name" />
                  </div>

                  <div className="meta-input col-span-1">
                    <label>Last name</label>
                    <input type="text" name="last-name" id="userLastName" placeholder="Your Last Name" />
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className="grid gap-3">
                  <div className="meta-input">
                    <label>Old password</label>
                    <input type="password" placeholder="Old password" />
                  </div>
                  <div className="meta-input">
                    <label>New password</label>
                    <input type="password" placeholder="New password" />
                  </div>
                  <div className="meta-input">
                    <label>Repeat new password</label>
                    <input type="password" placeholder="Repeat new password" />
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="account-history-list">
                  <HistoryItem
                    date="2025-01-12"
                    title="Haircut & Styling"
                    master="Olena"
                    price="540 ₴"
                    status="completed"
                    image={serviceImage_1}
                  />

                  <HistoryItem
                    date="2025-02-03"
                    title="Classic Massage"
                    master="Ihor"
                    price="720 ₴"
                    status="canceled"
                    image={serviceImage_2}
                  />

                  <HistoryItem
                    date="2025-02-18"
                    title="Manicure"
                    master="Anna"
                    price="390 ₴"
                    status="pending"
                    image={serviceImage_1}
                  />
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