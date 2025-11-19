import { Link } from "react-router-dom";
import { useState } from "react";

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: виклик API реєстрації
    console.log("Register data:", form);
  };

  return (
    <section className="auth-page">
      <div className="cont">
        <div className="auth-page__wrap">
          <div className="auth-page__card">
            <h1 className="auth-page__title heading-24">Create account</h1>
            <p className="auth-page__subtitle">
              Book visits faster and track your beauty history.
            </p>

            <form className="auth-page__form" onSubmit={handleSubmit}>
              <div className="auth-page__grid">
                <div className="meta-input">
                  <label htmlFor="regFirstName">First name</label>
                  <input
                    id="regFirstName"
                    type="text"
                    name="firstName"
                    placeholder="Your first name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="meta-input">
                  <label htmlFor="regLastName">Last name</label>
                  <input
                    id="regLastName"
                    type="text"
                    name="lastName"
                    placeholder="Your last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="meta-input">
                <label htmlFor="regEmail">Email</label>
                <input
                  id="regEmail"
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="meta-input">
                <label htmlFor="regPassword">Password</label>
                <input
                  id="regPassword"
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="meta-input">
                <label htmlFor="regPasswordConfirm">Repeat password</label>
                <input
                  id="regPasswordConfirm"
                  type="password"
                  name="passwordConfirm"
                  placeholder="Repeat password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className="auth-page__checkbox">
                <input type="checkbox" required />
                <span>
                  I agree with the <button type="button" className="auth-page__link auth-page__link--inline">Terms</button>
                  {" "}and{" "}
                  <button type="button" className="auth-page__link auth-page__link--inline">Privacy Policy</button>
                </span>
              </label>

              <button type="submit" className="auth-page__btn main-btn">
                Sign up
              </button>

              <div className="auth-page__footer">
                <span>Already have an account?</span>
                <Link to="/login" className="auth-page__link">
                  Sign in
                </Link>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;