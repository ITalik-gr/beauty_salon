import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form.email, form.password);
      if(res) {
        navigate('/')
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

              {error && <div className="text-red-600 text-base">{error}</div>}

              <button type="submit" className="auth-page__btn btn">
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