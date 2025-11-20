import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // email, password, name, lastName
      
      const res = await register(form);
      if(res) {
        navigate('/profile')
      }
    } catch (err) {
      setError(err.response?.data?.message || "Помилка логіну");
    }
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
                    name="name"
                    placeholder="Your first name"
                    value={form.name}
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

              {error && <div className="text-red-600 text-base">{error}</div>}

              <button type="submit" className="auth-page__btn btn">
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