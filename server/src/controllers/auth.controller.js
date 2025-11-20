import { registerUser, loginUser } from "../services/auth.service.js";

export async function register(req, res) {
  console.log('start register');
  
  try {
    const { email, password, name, lastName } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email та пароль є обов'язковими" });
    }

    const result = await registerUser({ email, password, name, lastName });
    res.status(201).json(result);
  } catch (err) {
    console.error("Register error:", err);

    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || "Помилка сервера під час реєстрації",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email та пароль є обов'язковими" });
    }

    const result = await loginUser({ email, password });
    res.json(result);
  } catch (err) {
    console.error("Login error:", err);

    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message || "Помилка сервера під час входу",
    });
  }
}