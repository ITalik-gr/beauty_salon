import { Link } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: виклик API авторизації
    console.log("Login data:", form);
  };

  return (
    <section className="auth-page">
      <div className="cont">
        <div className="auth-page__wrap">
          <div className="auth-page__card">
            <h1 className="auth-page__title heading-24">Sign in</h1>
            <p className="auth-page__subtitle">
              Login to manage your bookings and profile.
            </p>

            <form className="auth-page__form" onSubmit={handleSubmit}>
              <div className="meta-input">
                <label htmlFor="loginEmail">Email</label>
                <input
                  id="loginEmail"
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="meta-input">
                <label htmlFor="loginPassword">Password</label>
                <input
                  id="loginPassword"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-page__row">
                <label className="auth-page__checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="auth-page__link auth-page__link--small"
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="auth-page__btn main-btn">
                Sign in
              </button>

              <div className="auth-page__footer">
                <span>Don’t have an account?</span>
                <Link to="/register" className="auth-page__link">
                  Create account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;